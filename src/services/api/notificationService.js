import notificationsData from '@/services/mockData/notifications.json';

// In-memory storage for notifications
let notifications = [...notificationsData];

// Helper function to simulate async delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to save notifications (simulates persistence)
function saveNotifications() {
  // In a real app, this would persist to a database
  console.log('Notifications saved:', notifications.length);
}

export const notificationService = {
  async getAll() {
    await delay(300);
    return [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getUnreadCount() {
    await delay(100);
    return notifications.filter(n => !n.isRead).length;
  },

  async markAsRead(id) {
    await delay(200);
    const index = notifications.findIndex(n => n.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Notification not found');
    }

    notifications[index] = {
      ...notifications[index],
      isRead: true
    };

    saveNotifications();
    return { ...notifications[index] };
  },

  async markAllAsRead() {
    await delay(300);
    notifications = notifications.map(n => ({
      ...n,
      isRead: true
    }));

    saveNotifications();
    return true;
  },

  async create(notificationData) {
    await delay(200);
    
    const newId = Math.max(...notifications.map(n => n.Id), 0) + 1;
    const newNotification = {
      Id: newId,
      type: notificationData.type,
      message: notificationData.message,
      fromUsername: notificationData.fromUsername,
      relatedPostId: notificationData.relatedPostId || null,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    notifications.unshift(newNotification);
    saveNotifications();
    return { ...newNotification };
  }
};