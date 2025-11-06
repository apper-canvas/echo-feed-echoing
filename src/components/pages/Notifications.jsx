import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { notificationService } from '@/services/api/notificationService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.Id === id ? { ...n, isRead: true } : n)
      );
      toast.success('Notification marked as read');
    } catch (err) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      await handleMarkAsRead(notification.Id);
    }

    // Navigate based on notification type
    if (notification.type === 'follow') {
      navigate(`/profile/${notification.fromUsername}`);
    } else if (notification.relatedPostId) {
      // For likes and comments, navigate to the user's profile
      // In a real app, you might navigate to the specific post
      navigate(`/profile/${notification.fromUsername}`);
    }
  };

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || (filter === 'unread' && !n.isRead)
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return 'Heart';
      case 'comment': return 'MessageCircle';
      case 'follow': return 'UserPlus';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'like': return 'text-red-500';
      case 'comment': return 'text-blue-500';
      case 'follow': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadNotifications}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ApperIcon name="ArrowLeft" size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ApperIcon name="CheckCheck" size={16} />
                Mark all read
              </Button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications list */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <Empty 
              icon="Bell"
              title={filter === 'unread' ? "No unread notifications" : "No notifications"}
              description={filter === 'unread' 
                ? "You're all caught up! Check back later for new notifications."
                : "When people like your posts, comment, or follow you, you'll see notifications here."
              }
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {filteredNotifications.map((notification, index) => (
              <div
                key={notification.Id}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                  !notification.isRead ? 'bg-blue-50/50' : ''
                } ${index === filteredNotifications.length - 1 ? 'border-b-0' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  {/* Notification icon */}
                  <div className={`p-2 rounded-full bg-gray-100 ${getNotificationColor(notification.type)}`}>
                    <ApperIcon 
                      name={getNotificationIcon(notification.type)} 
                      size={16} 
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium">
                      {notification.message}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}