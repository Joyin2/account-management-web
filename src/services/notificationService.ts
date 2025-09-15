import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Notification {
  id?: string;
  recipientId: string; // The user who receives the notification
  userId: string; // The user who created the notification
  organizationId: string;
  type: 'leave_approval' | 'leave_rejection' | 'payroll_processed' | 'document_uploaded' | 'attendance_reminder' | 'general';
  title: string;
  message: string;
  data?: any; // Additional data related to the notification
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: ('in_app' | 'email' | 'sms')[];
  createdAt: Timestamp;
  readAt?: Timestamp;
  emailSent?: boolean;
  smsSent?: boolean;
  emailSentAt?: Timestamp;
  smsSentAt?: Timestamp;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

class NotificationService {
  private readonly NOTIFICATIONS_COLLECTION = 'notifications';
  private readonly EMAIL_TEMPLATES_COLLECTION = 'emailTemplates';
  private readonly SMS_TEMPLATES_COLLECTION = 'smsTemplates';

  // Create a new notification
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<string> {
    try {
      const notification: Omit<Notification, 'id'> = {
        ...notificationData,
        read: false,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.NOTIFICATIONS_COLLECTION), notification);
      
      // Send external notifications if specified
      if (notification.channels.includes('email')) {
        await this.sendEmailNotification(docRef.id, notification);
      }
      
      if (notification.channels.includes('sms')) {
        await this.sendSMSNotification(docRef.id, notification);
      }

      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  // Get notifications for a user
  async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    try {
      let q = query(
        collection(db, this.NOTIFICATIONS_COLLECTION),
        where('recipientId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      if (unreadOnly) {
        q = query(
          collection(db, this.NOTIFICATIONS_COLLECTION),
          where('recipientId', '==', userId),
          where('read', '==', false),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const docRef = doc(db, this.NOTIFICATIONS_COLLECTION, notificationId);
      await updateDoc(docRef, {
        read: true,
        readAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, this.NOTIFICATIONS_COLLECTION),
        where('recipientId', '==', userId),
        where('read', '==', false)
      );

      const querySnapshot = await getDocs(q);
      const updatePromises = querySnapshot.docs.map(doc => 
        updateDoc(doc.ref, {
          read: true,
          readAt: Timestamp.now()
        })
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  // Subscribe to real-time notifications
  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void): () => void {
    // Try the optimized query first, fallback to simple query if index not ready
    const q = query(
      collection(db, this.NOTIFICATIONS_COLLECTION),
      where('recipientId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification));
      callback(notifications);
    }, (error) => {
      console.error('Error in notifications subscription:', error);

      // Fallback to simple query without orderBy if index not ready
      if (error.code === 'failed-precondition' && error.message.includes('index')) {
        console.log('Index not ready, using fallback query...');
        const fallbackQuery = query(
          collection(db, this.NOTIFICATIONS_COLLECTION),
          where('recipientId', '==', userId),
          limit(20)
        );

        return onSnapshot(fallbackQuery, (querySnapshot) => {
          const notifications = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Notification));

          // Sort manually since we can't use orderBy
          notifications.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
          callback(notifications);
        }, (fallbackError) => {
          console.error('Error in fallback notifications subscription:', fallbackError);
        });
      }
    });
  }

  // Send email notification using EmailJS or similar service
  private async sendEmailNotification(notificationId: string, notification: Notification): Promise<void> {
    try {
      // Using EmailJS for client-side email sending
      // In production, use server-side email service like SendGrid, AWS SES, etc.

      const emailData = {
        to_email: notification.data?.email || 'user@example.com',
        subject: notification.title,
        message: notification.message,
        priority: notification.priority,
        organization: notification.organizationId
      };

      // For demo purposes, we'll simulate email sending
      console.log('Sending email notification:', emailData);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mark as sent
      const docRef = doc(db, this.NOTIFICATIONS_COLLECTION, notificationId);
      await updateDoc(docRef, {
        emailSent: true,
        emailSentAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  // Send SMS notification using Twilio or similar service
  private async sendSMSNotification(notificationId: string, notification: Notification): Promise<void> {
    try {
      // Using Twilio or similar SMS service
      // In production, integrate with actual SMS provider

      const smsData = {
        to: notification.data?.phone || '+1234567890',
        body: `${notification.title}: ${notification.message}`,
        priority: notification.priority
      };

      // For demo purposes, we'll simulate SMS sending
      console.log('Sending SMS notification:', smsData);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mark as sent
      const docRef = doc(db, this.NOTIFICATIONS_COLLECTION, notificationId);
      await updateDoc(docRef, {
        smsSent: true,
        smsSentAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error sending SMS notification:', error);
    }
  }

  // Helper methods for common notification types
  async notifyLeaveApproval(
    employeeId: string, 
    organizationId: string, 
    leaveApplication: any
  ): Promise<string> {
    return this.createNotification({
      recipientId: employeeId,
      userId: employeeId, // For now, same as recipient
      organizationId,
      type: 'leave_approval',
      title: 'Leave Application Approved',
      message: `Your leave application from ${leaveApplication.startDate} to ${leaveApplication.endDate} has been approved.`,
      data: { leaveApplicationId: leaveApplication.id },
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
      recipientId: employeeId,
      userId: employeeId, // For now, same as recipient
      organizationId,
      type: 'leave_rejection',
      title: 'Leave Application Rejected',
      message: `Your leave application from ${leaveApplication.startDate} to ${leaveApplication.endDate} has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
      data: { leaveApplicationId: leaveApplication.id, reason },
      priority: 'medium',
      channels: ['in_app', 'email']
    });
  }

  async notifyPayrollProcessed(
    employeeId: string, 
    organizationId: string, 
    payroll: any
  ): Promise<string> {
    return this.createNotification({
      recipientId: employeeId,
      userId: employeeId, // For now, same as recipient
      organizationId,
      type: 'payroll_processed',
      title: 'Payroll Processed',
      message: `Your salary for ${payroll.month}/${payroll.year} has been processed. Net pay: ₹${payroll.netPay.toLocaleString()}`,
      data: { payrollId: payroll.id },
      priority: 'high',
      channels: ['in_app', 'email']
    });
  }

  async notifyDocumentUploaded(
    employeeId: string,
    organizationId: string,
    document: any
  ): Promise<string> {
    return this.createNotification({
      recipientId: employeeId,
      userId: employeeId, // For now, same as recipient
      organizationId,
      type: 'document_uploaded',
      title: 'Document Uploaded',
      message: `A new document "${document.originalName}" has been uploaded to your profile.`,
      data: { documentId: document.id },
      priority: 'low',
      channels: ['in_app']
    });
  }

  async notifyAttendanceReminder(
    employeeId: string,
    organizationId: string
  ): Promise<string> {
    return this.createNotification({
      recipientId: employeeId,
      userId: employeeId, // For now, same as recipient
      organizationId,
      type: 'attendance_reminder',
      title: 'Attendance Reminder',
      message: 'Don\'t forget to mark your attendance for today.',
      priority: 'medium',
      channels: ['in_app', 'sms']
    });
  }

  // Bulk notifications
  async sendBulkNotifications(notifications: Omit<Notification, 'id' | 'createdAt' | 'read'>[]): Promise<string[]> {
    const promises = notifications.map(notification => this.createNotification(notification));
    return Promise.all(promises);
  }

  // Get notification statistics
  async getNotificationStats(organizationId: string): Promise<{
    totalSent: number;
    totalRead: number;
    totalUnread: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    try {
      const q = query(
        collection(db, this.NOTIFICATIONS_COLLECTION),
        where('organizationId', '==', organizationId)
      );

      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map(doc => doc.data() as Notification);

      const stats = {
        totalSent: notifications.length,
        totalRead: notifications.filter(n => n.read).length,
        totalUnread: notifications.filter(n => !n.read).length,
        byType: {} as Record<string, number>,
        byPriority: {} as Record<string, number>
      };

      notifications.forEach(notification => {
        stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
        stats.byPriority[notification.priority] = (stats.byPriority[notification.priority] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw new Error('Failed to fetch notification stats');
    }
  }
}

export const notificationService = new NotificationService();
