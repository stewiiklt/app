import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Heart, MessageCircle, Bookmark, PenLine } from 'lucide-react';
import { NotificationItem } from '../types';
import { api } from '../services/api';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    const data = await api.getNotifications();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'Like':
        return <Heart className="w-4 h-4 fill-coral-500 text-coral-500" />;
      case 'Comment':
        return <MessageCircle className="w-4 h-4 text-teal-600" />;
      case 'WantToTry':
        return <Bookmark className="w-4 h-4 fill-amber-500 text-amber-500" />;
      case 'NewReview':
        return <PenLine className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-coral-500" />
            <span>Activity & Notifications</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Stay updated with friends and dinner invites</p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-cream-100 border border-gray-200 text-xs font-bold text-gray-700 transition-colors shadow-xs"
        >
          <CheckCheck className="w-4 h-4 text-teal-600" />
          <span>Mark all as read</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-16 animate-pulse shadow-soft" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-soft">
          <p className="text-sm font-bold text-charcoal-800">All caught up!</p>
          <p className="text-xs text-gray-400 mt-1">No new notifications right now.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden shadow-soft border border-gray-100 divide-y divide-gray-100">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 flex items-center justify-between gap-3 transition-colors ${
                notif.isRead ? 'bg-white hover:bg-cream-50' : 'bg-coral-50/40 hover:bg-coral-50/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={notif.actor.profilePhotoUrl}
                    alt={notif.actor.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-xs flex items-center justify-center">
                    {getIcon(notif.type)}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-charcoal-900 leading-snug">
                    <Link
                      to={`/user/${notif.actor.username}`}
                      className="font-bold hover:text-coral-600 transition-colors"
                    >
                      {notif.actor.displayName}
                    </Link>{' '}
                    {notif.text}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(notif.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {!notif.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-coral-500 shrink-0" title="Unread" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
