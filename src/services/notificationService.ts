import { supabase } from '@/lib/supabase';

export interface Notification {
  id?: string;
  recipient_id: string; // The user who receives the notification
  user_id: string; // The user who created the notification
  organization_id: string;
  type: 'leave_approval' | 'leave_rejection' | 'payroll_processed' | 'document_uploaded' | 'attendance_reminder' | 'general';
  title: string;
  message: string;
  data?: any; // Additional data related to the notification
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: ('in_app' | 'email' | 'sms')[];
  created_at: string;
  read_at?: string;
  email_sent?: boolean;
  sms_sent?: boolean;
  email_sent_at?: string;
  sms_sent_at?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content: string;
  variables: string[];
}

export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

class NotificationService {
  private readonly NOTIFICATIONS_TABLE = 'notifications';
  private readonly EMAIL_TEMPLATES_TABLE = 'email_templates';
  private readonly SMS_TEMPLATES_TABLE = 'sms_templates';

  async createNotification(notificationData: Omit<Notification, 'id' | 'created_at' | 'read'>): Promise<string> {
    try {
      const notification: Omit<Notification, 'id'> = {
        ...notificationData,
        read: false,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(this.NOTIFICATIONS_TABLE)
        .insert(notification)
        .select('id')
        .single();

      if (error) throw error;

      // Send notifications through various channels
      if (notification.channels.includes('email')) {
        await this.sendEmailNotification(data.id, notification as Notification);
      }

      if (notification.channels.includes('sms')) {
        await this.sendSMSNotification(data.id, notification as Notification);
      }

      return data.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    try {
      let query = supabase
        .from(this.NOTIFICATIONS_TABLE)
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('read', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.NOTIFICATIONS_TABLE)
        .update({ 
          read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.NOTIFICATIONS_TABLE)
        .update({ 
          read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('recipient_id', userId)
        .eq('read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void): () => void {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: this.NOTIFICATIONS_TABLE,
          filter: `recipient_id=eq.${userId}`
        },
        async () => {
          // Fetch updated notifications when changes occur
          const notifications = await this.getUserNotifications(userId);
          callback(notifications);
        }
      )
      .subscribe();

    // Initial fetch
    this.getUserNotifications(userId).then(callback);

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  }

  private async sendEmailNotification(notificationId: string, notification: Notification): Promise<void> {
    try {
      // This would integrate with your email service (SendGrid, AWS SES, etc.)
      console.log('Sending email notification:', notification.title);
      
      // Update notification to mark email as sent
      await supabase
        .from(this.NOTIFICATIONS_TABLE)
        .update({
          email_sent: true,
          email_sent_at: new Date().toISOString()
        })
        .eq('id', notificationId);

    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  private async sendSMSNotification(notificationId: string, notification: Notification): Promise<void> {
    try {
      // This would integrate with your SMS service (Twilio, AWS SNS, etc.)
      console.log('Sending SMS notification:', notification.title);
      
      // Update notification to mark SMS as sent
      await supabase
        .from(this.NOTIFICATIONS_TABLE)
        .update({
          sms_sent: true,
          sms_sent_at: new Date().toISOString()
        })
        .eq('id', notificationId);

    } catch (error) {
      console.error('Error sending SMS notification:', error);
    }
  }

  async notifyLeaveApproval(
    employeeId: string, 
    organizationId: string, 
    leaveApplication: any
  ): Promise<string> {
    return this.createNotification({
      recipient_id: employeeId,
      user_id: 'system',
      organization_id: organizationId,
      type: 'leave_approval',
      title: 'Leave Application Approved',
      message: `Your leave application from ${leaveApplication.startDate} to ${leaveApplication.endDate} has been approved.`,
      data: leaveApplication,
      priority: 'medium',
      channels: ['in_app', 'email']
    });
  }

  async notifyLeaveRejection(
    employeeId: string, 
    organizationId: string, 
    leaveApplication: any,
    reason?: string
  ): Promise<string> {
    return this.createNotification({
      recipient_id: employeeId,
      user_id: 'system',
      organization_id: organizationId,
      type: 'leave_rejection',
      title: 'Leave Application Rejected',
      message: `Your leave application has been rejected. ${reason ? `Reason: ${reason}` : ''}`,
      data: { ...leaveApplication, rejectionReason: reason },
      priority: 'high',
      channels: ['in_app', 'email']
    });
  }

  async notifyPayrollProcessed(
    employeeId: string, 
    organizationId: string, 
    payroll: any
  ): Promise<string> {
    return this.createNotification({
      recipient_id: employeeId,
      user_id: 'system',
      organization_id: organizationId,
      type: 'payroll_processed',
      title: 'Payroll Processed',
      message: `Your payroll for ${payroll.period} has been processed.`,
      data: payroll,
      priority: 'medium',
      channels: ['in_app', 'email']
    });
  }

  async notifyDocumentUploaded(
    employeeId: string,
    organizationId: string,
    document: any
  ): Promise<string> {
    return this.createNotification({
      recipient_id: employeeId,
      user_id: 'system',
      organization_id: organizationId,
      type: 'document_uploaded',
      title: 'New Document Available',
      message: `A new document "${document.name}" has been uploaded for you.`,
      data: document,
      priority: 'low',
      channels: ['in_app']
    });
  }

  async notifyAttendanceReminder(
    employeeId: string,
    organizationId: string
  ): Promise<string> {
    return this.createNotification({
      recipient_id: employeeId,
      user_id: 'system',
      organization_id: organizationId,
      type: 'attendance_reminder',
      title: 'Attendance Reminder',
      message: 'Please remember to mark your attendance for today.',
      priority: 'medium',
      channels: ['in_app', 'sms']
    });
  }

  async sendBulkNotifications(notifications: Omit<Notification, 'id' | 'created_at' | 'read'>[]): Promise<string[]> {
    const results: string[] = [];
    
    for (const notification of notifications) {
      try {
        const id = await this.createNotification(notification);
        results.push(id);
      } catch (error) {
        console.error('Error sending bulk notification:', error);
      }
    }
    
    return results;
  }

  async getNotificationStats(organizationId: string): Promise<{
    totalSent: number;
    totalRead: number;
    totalUnread: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from(this.NOTIFICATIONS_TABLE)
        .select('type, priority, read')
        .eq('organization_id', organizationId);

      if (error) throw error;

      const stats = {
        totalSent: data.length,
        totalRead: data.filter(n => n.read).length,
        totalUnread: data.filter(n => !n.read).length,
        byType: {} as Record<string, number>,
        byPriority: {} as Record<string, number>
      };

      // Count by type
      data.forEach(notification => {
        stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
        stats.byPriority[notification.priority] = (stats.byPriority[notification.priority] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
