import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  RiHeartLine,
  RiChat3Line,
  RiCheckDoubleLine,
  RiNotification3Line,
  RiTimeLine,
} from 'react-icons/ri';
import TimeAgo from 'react-timeago';
import { getNotifications, markAsRead, markAllAsRead } from '../features/notifications/notificationSlice';

function Notifications() {
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
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <RiHeartLine className="w-5 h-5 text-red-400" />;
      case 'comment':
        return <RiChat3Line className="w-5 h-5 text-cyan" />;
      default:
        return <RiNotification3Line className="w-5 h-5 text-accent" />;
    }
  };

  const getMessage = (notif) => {
    const sender = notif.sender?.anonymousName || notif.senderName || 'Someone';
    switch (notif.type) {
      case 'like':
        return <><span className="text-white font-semibold">{sender}</span> liked your post</>;
      case 'comment':
        return <><span className="text-white font-semibold">{sender}</span> commented on your post</>;
      default:
        return <><span className="text-white font-semibold">{sender}</span> interacted with your post</>;
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-light transition-colors font-medium"
          >
            <RiCheckDoubleLine className="w-5 h-5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="glass rounded-3xl overflow-hidden divide-y divide-white/5">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/4" />
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
                className="w-full flex items-start gap-4 px-6 py-4 hover:bg-white/5 transition-all duration-300 text-left relative"
              >
                {!notif.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
                )}
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-gray-300 leading-snug">{getMessage(notif)}</p>
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                    <RiTimeLine className="w-3.5 h-3.5" />
                    {notif.createdAt ? <TimeAgo date={notif.createdAt} /> : 'Just now'}
                  </div>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-accent shrink-0 mt-2 self-start" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <RiNotification3Line className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">No notifications yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              When people like, comment, or interact with your posts, you'll see those updates here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
