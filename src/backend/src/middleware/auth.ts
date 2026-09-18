import { Request, Response, NextFunction } from 'express';
import { UserProfile, UserRole } from '../types/index.js';
import { userRepository } from '../repositories/index.js';

export interface AuthenticatedRequest extends Request {
  user?: UserProfile;
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // In mock/development mode, accept header 'x-user-id' or 'x-demo-role'
    // This provides a seamless demo experience while maintaining standard middleware architecture.
    const userIdHeader = req.headers['x-user-id'] as string;
    const roleHeader = (req.headers['x-demo-role'] as string)?.toUpperCase() as UserRole;

    if (userIdHeader) {
      const found = await userRepository.findById(userIdHeader);
      if (found) {
        req.user = found;
        return next();
      }
    }

    if (roleHeader) {
      const allUsers = await userRepository.findAll();
      const match = allUsers.find((u) => u.role === roleHeader);
      if (match) {
        req.user = match;
        return next();
      }
    }

    // Default fallback demo user: Aarav Sharma (Citizen)
    const defaultUser = await userRepository.findById('usr-cit-01');
    if (defaultUser) {
      req.user = defaultUser;
    }
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Requires one of: ${allowedRoles.join(', ')}`
        }
      });
    }

    next();
  };
}
