import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  RiHeartLine,
  RiChat3Line,
  RiCheckDoubleLine,
  RiNotification3Line,
  RiTimeLine,
  RiUserLine,
} from 'react-icons/ri';
import TimeAgo from 'react-timeago';
import { getNotifications, markAsRead, markAllAsRead } from '../../features/notifications/notificationSlice';

export default function NotificationDropdown({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount, isLoading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleClick = (notif) => {
    if (!notif.read) {
      dispatch(markAsRead(notif._id));
    }
    if (notif.post) {
      const postId = typeof notif.post === 'string' ? notif.post : notif.post._id;
      navigate(`/post/${postId}`);
    }
    onClose();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <RiHeartLine className="w-4 h-4 text-red-400" />;
      case 'comment':
        return <RiChat3Line className="w-4 h-4 text-cyan" />;
      default:
        return <RiNotification3Line className="w-4 h-4 text-accent" />;
    }
  };

  const getMessage = (notif) => {
    const sender = notif.sender?.anonymousName || notif.senderName || 'Someone';
    switch (notif.type) {
      case 'like':
        return <><span className="text-white font-medium">{sender}</span> liked your post</>;
      case 'comment':
        return <><span className="text-white font-medium">{sender}</span> commented on your post</>;
      default:
        return <><span className="text-white font-medium">{sender}</span> interacted with your post</>;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-strong rounded-2xl overflow-hidden animate-scale-in origin-top-right z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white">Notifications</h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-xs text-accent hover:text-accent-light transition-colors"
          >
            <RiCheckDoubleLine className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-full mb-1" />
                  <div className="h-3 bg-white/5 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : Array.isArray(notifications) && notifications.length > 0 ? (
          <div>
            {notifications.map((notif) => (
              <button
                key={notif._id}
                onClick={() => handleClick(notif)}
                className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-all duration-300 text-left ${
                  !notif.read ? 'border-l-2 border-accent bg-accent/5' : 'border-l-2 border-transparent'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 leading-snug">{getMessage(notif)}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                    <RiTimeLine className="w-3 h-3" />
                    {notif.createdAt ? <TimeAgo date={notif.createdAt} /> : 'Just now'}
                  </div>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <RiNotification3Line className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
