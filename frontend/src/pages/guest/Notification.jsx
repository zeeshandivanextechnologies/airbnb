import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FiBell, FiCalendar, FiShield, FiTag, FiCheckCircle, 
  FiTrash2, FiExternalLink, FiCheck 
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import styles from '../../components/styles/Notification.module.css';

function Notification() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth || {});

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread' | 'booking' | 'promotion'

  // Retrieve current user identifier from Redux or localStorage
  const currentUser = (() => {
    if (user) return user;
    try {
      const raw = localStorage.getItem('user') || localStorage.getItem('airbnb_user_auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed?.user || parsed;
      }
    } catch (e) {}
    return null;
  })();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const params = new URLSearchParams();
      if (currentUser?.id) params.append('userId', currentUser.id);
      if (currentUser?.email) params.append('email', currentUser.email);

      const res = await fetch(`${baseUrl}/auth/notifications?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.warn('Failed to load notifications from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser?.id, currentUser?.email]);

  // Mark single notification as read
  const handleMarkAsRead = async (notif) => {
    if (notif.is_read) return;
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await fetch(`${baseUrl}/auth/notifications/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notif.id })
      });
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.warn('Could not mark notification as read:', err);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await fetch(`${baseUrl}/auth/notifications/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          markAll: true,
          userId: currentUser?.id,
          email: currentUser?.email
        })
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to update notifications');
    }
  };

  // Delete notification
  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await fetch(`${baseUrl}/auth/notifications/${id}`, {
        method: 'DELETE'
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification removed');
    } catch (err) {
      toast.error('Could not delete notification');
    }
  };

  // Helper for notification type icons & colors
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return <FiCalendar size={20} color="#059669" />;
      case 'security':
        return <FiShield size={20} color="#2563eb" />;
      case 'promotion':
        return <FiTag size={20} color="#d97706" />;
      default:
        return <FiBell size={20} color="#ff385c" />;
    }
  };

  // Format relative time (e.g. 5m ago, Today, or Date)
  const formatTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.is_read;
    if (activeFilter === 'booking') return n.type === 'booking';
    if (activeFilter === 'promotion') return n.type === 'promotion';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className={styles['notif-page-wrapper']}>
      <div className="container">
        
        {/* Title and Top Header Actions */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className={styles['notif-header-row']}>
              <div>
                <h1 className={styles['notif-title']}>
                  Notifications
                  {unreadCount > 0 && (
                    <span style={{ fontSize: '15px', color: '#ff385c', fontWeight: 600, marginLeft: '12px' }}>
                      ({unreadCount} unread)
                    </span>
                  )}
                </h1>
              </div>

              {notifications.length > 0 && (
                <div className={styles['notif-actions']}>
                  <button 
                    type="button"
                    className={styles['notif-mark-btn']} 
                    onClick={handleMarkAllAsRead}
                  >
                    <FiCheck size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Mark all as read
                  </button>
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            {notifications.length > 0 && (
              <div className={styles['notif-tabs']}>
                <button 
                  type="button"
                  className={`${styles['notif-tab']} ${activeFilter === 'all' ? styles['notif-tab-active'] : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All ({notifications.length})
                </button>
                <button 
                  type="button"
                  className={`${styles['notif-tab']} ${activeFilter === 'unread' ? styles['notif-tab-active'] : ''}`}
                  onClick={() => setActiveFilter('unread')}
                >
                  Unread ({unreadCount})
                </button>
                <button 
                  type="button"
                  className={`${styles['notif-tab']} ${activeFilter === 'booking' ? styles['notif-tab-active'] : ''}`}
                  onClick={() => setActiveFilter('booking')}
                >
                  Bookings
                </button>
                <button 
                  type="button"
                  className={`${styles['notif-tab']} ${activeFilter === 'promotion' ? styles['notif-tab-active'] : ''}`}
                  onClick={() => setActiveFilter('promotion')}
                >
                  Offers
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Loading State */}
        {loading ? (
          <div className="row justify-content-center py-5">
            <div className="col-md-8 text-center text-muted">
              <div className="spinner-border text-danger mb-3" role="status"></div>
              <p>Loading your updates...</p>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          /* Empty State */
          <div className="row justify-content-center py-5">
            <div className="col-md-8 col-lg-6 text-center">
              <div className={styles['notif-empty-state']}>
                <h2 className={styles['notif-empty-title']}>
                  {activeFilter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </h2>
                <p className={styles['notif-empty-subtitle']}>
                  {activeFilter === 'unread' 
                    ? "You're all caught up! Check back later for updates."
                    : "You've got a blank slate (for now). We'll let you know when updates arrive."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Notification Cards List */
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className={styles['notif-list']}>
                {filteredNotifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`${styles['notif-card']} ${!notif.is_read ? styles['notif-card-unread'] : ''}`}
                    onClick={() => {
                      handleMarkAsRead(notif);
                      if (notif.link) navigate(notif.link);
                    }}
                    style={{ cursor: notif.link ? 'pointer' : 'default' }}
                  >
                    <div className={styles['notif-icon-wrap']}>
                      {getNotificationIcon(notif.type)}
                    </div>

                    <div className={styles['notif-card-body']}>
                      <div className={styles['notif-card-top']}>
                        <h3 className={styles['notif-card-title']}>
                          {!notif.is_read && <span className={styles['notif-unread-dot']} />}
                          {notif.title}
                        </h3>
                        <span className={styles['notif-card-time']}>
                          {formatTime(notif.created_at)}
                        </span>
                      </div>

                      <p className={styles['notif-card-text']}>
                        {notif.message}
                      </p>

                      <div className={styles['notif-card-footer']}>
                        {notif.link && (
                          <span className={styles['notif-action-link']}>
                            View details <FiExternalLink size={12} />
                          </span>
                        )}

                        <button 
                          type="button"
                          className={styles['notif-delete-btn']}
                          onClick={(e) => handleDeleteNotification(notif.id, e)}
                          title="Delete notification"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Notification;