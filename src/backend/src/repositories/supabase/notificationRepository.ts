import { supabase } from '../../lib/supabase.js';
import { INotificationRepository } from '../interfaces/index.js';
import { NotificationItem } from '../../types/index.js';

export class SupabaseNotificationRepository
  implements INotificationRepository
{
  async findByUserId(
    userId: string
  ): Promise<NotificationItem[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(
        `Failed to find notifications: ${error.message}`
      );
    }

    return (data ?? []) as NotificationItem[];
  }

  async create(
    notification: Omit<
      NotificationItem,
      'id' | 'created_at'
    >
  ): Promise<NotificationItem> {
    const id = `notif-${Date.now()}`;

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notification,
        id
      })
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to create notification: ${error.message}`
      );
    }

    return data as NotificationItem;
  }

  async markAsRead(
    id: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to mark notification as read: ${error.message}`
      );
    }

    return data !== null;
  }

  async markAllAsRead(
    userId: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      throw new Error(
        `Failed to mark notifications as read: ${error.message}`
      );
    }

    return true;
  }
}