import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { userRepository } from '../repositories/index.js';

export async function getMe(req: AuthenticatedRequest, res: Response) {
  return res.json({
    success: true,
    data: req.user
  });
}

export async function getAllDemoUsers(req: AuthenticatedRequest, res: Response) {
  const users = await userRepository.findAll();
  return res.json({
    success: true,
    data: users
  });
}

export async function switchDemoUser(req: AuthenticatedRequest, res: Response) {
  const { userId, role } = req.body;
  let targetUser = null;

  if (userId) {
    targetUser = await userRepository.findById(userId);
  } else if (role) {
    const all = await userRepository.findAll();
    targetUser = all.find((u) => u.role === role);
  }

  if (!targetUser) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: 'Specified demo user could not be found'
      }
    });
  }

  return res.json({
    success: true,
    data: targetUser
  });
}
