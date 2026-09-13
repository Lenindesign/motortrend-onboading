import { NovuProvider, useNotifications, useNovu } from '@novu/react';
import type { Notification } from '@novu/js';
import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const applicationIdentifier = import.meta.env.VITE_NOVU_APPLICATION_IDENTIFIER;
const configuredSubscriberId = import.meta.env.VITE_NOVU_SUBSCRIBER_ID;

function getSubscriberId(user: ReturnType<typeof useAuth>['user']): string {
  if (user && !user.isAnonymous) return user.id;
  return configuredSubscriberId || '6aa4b90867ef7f19e018b5c6';
}

function getNotificationDestination(notification: Notification): string {
  const data = notification.data ?? {};
  const candidate = [
    data.url,
    data.route,
    data.path,
    data.href,
    notification.redirect?.url,
    notification.primaryAction?.redirect?.url,
    notification.secondaryAction?.redirect?.url,
  ].find((value): value is string => typeof value === 'string' && value.startsWith('/') && !value.startsWith('//'));

  return candidate ? candidate.replaceAll('&amp;', '&') : '/latest-news';
}

function formatNotificationDate(createdAt: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(createdAt));
}

function HeadlessNotificationInbox() {
  const novu = useNovu();
  const { notifications, isLoading, error, readAll } = useNotifications({ limit: 50 });
  const [open, setOpen] = useState(false);

  const uniqueNotifications = useMemo(() => {
    const seen = new Set<string>();
    return (notifications ?? []).filter((notification) => {
      const key = `${notification.subject ?? ''}|${notification.body}|${notification.redirect?.url ?? ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [notifications]);

  const unreadCount = (notifications ?? []).filter((notification) => !notification.isRead).length;

  const openNotification = async (notification: Notification) => {
    if (!notification.isRead) await novu.notifications.read({ notificationId: notification.id });
    window.location.assign(getNotificationDestination(notification));
  };

  if (!applicationIdentifier) return null;

  return (
    <div className="mt-headless-notifications">
      <button
        type="button"
        className="mt-notification-trigger"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">notifications</span>
        {unreadCount > 0 && <b>{unreadCount > 99 ? '99+' : unreadCount}</b>}
      </button>

      {open && (
        <section className="mt-notification-panel" aria-label="Notification inbox">
          <header>
            <h2>Inbox</h2>
            <div>
              {unreadCount > 0 && (
                <button type="button" className="mt-notification-action" onClick={() => void readAll()}>
                  Mark all read
                </button>
              )}
              <button type="button" className="mt-notification-close" aria-label="Close notifications" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
          </header>

          {isLoading && <p className="mt-notification-state">Loading notifications…</p>}
          {error && <p className="mt-notification-state">Notifications are temporarily unavailable.</p>}
          {!isLoading && !error && uniqueNotifications.length === 0 && (
            <p className="mt-notification-state">You’re all caught up.</p>
          )}
          {!isLoading && !error && uniqueNotifications.length > 0 && (
            <div className="mt-notification-list">
              {uniqueNotifications.map((notification) => (
                <button
                  type="button"
                  className={`mt-notification-item${notification.isRead ? '' : ' is-unread'}`}
                  key={notification.id}
                  onClick={() => void openNotification(notification)}
                >
                  <span className="mt-notification-avatar" aria-hidden="true">MT</span>
                  <span className="mt-notification-copy">
                    <strong>{notification.subject || 'MotorTrend'}</strong>
                    <span>{notification.body}</span>
                    <small>{formatNotificationDate(notification.createdAt)}</small>
                  </span>
                  {!notification.isRead && <i aria-label="Unread" />}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <style>{`
        .mt-headless-notifications { position: relative; color: #fff; }
        .mt-notification-trigger { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: 0; border-radius: 50%; background: transparent; color: #fff; cursor: pointer; }
        .mt-notification-trigger span { font-family: 'Material Symbols Outlined'; font-size: 25px; }
        .mt-notification-trigger b { position: absolute; top: 0; right: -2px; min-width: 18px; height: 18px; padding: 0 4px; border-radius: 99px; background: #e90c17; color: #fff; font: 700 10px/18px Arial, sans-serif; }
        .mt-notification-panel { position: absolute; z-index: 100; top: 48px; right: 0; width: min(390px, calc(100vw - 32px)); max-height: min(620px, calc(100vh - 90px)); overflow: hidden; border: 1px solid #2d2d31; border-radius: 16px; background: #141416; box-shadow: 0 18px 50px rgba(0,0,0,.35); }
        .mt-notification-panel header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid #2d2d31; }
        .mt-notification-panel h2 { margin: 0; font-size: 18px; }
        .mt-notification-panel header div { display: flex; align-items: center; gap: 12px; }
        .mt-notification-action, .mt-notification-close { border: 0; background: transparent; color: #b8b8bd; cursor: pointer; }
        .mt-notification-action { font-size: 12px; }
        .mt-notification-close { font-size: 24px; line-height: 1; }
        .mt-notification-list { max-height: 540px; overflow-y: auto; }
        .mt-notification-item { display: flex; align-items: flex-start; gap: 12px; width: 100%; padding: 16px 20px; border: 0; border-bottom: 1px solid #242428; background: transparent; color: #fff; text-align: left; cursor: pointer; }
        .mt-notification-item:hover, .mt-notification-item.is-unread { background: #1d1d21; }
        .mt-notification-avatar { display: grid; flex: 0 0 34px; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: #e90c17; color: #fff; font: 800 13px Arial, sans-serif; }
        .mt-notification-copy { display: grid; gap: 5px; min-width: 0; flex: 1; }
        .mt-notification-copy strong { font-size: 14px; }
        .mt-notification-copy span { color: #b8b8bd; font-size: 13px; line-height: 1.35; }
        .mt-notification-copy small { color: #77777f; font-size: 11px; }
        .mt-notification-item i { flex: 0 0 7px; width: 7px; height: 7px; margin-top: 6px; border-radius: 50%; background: #e90c17; }
        .mt-notification-state { margin: 0; padding: 56px 20px; color: #99999f; text-align: center; font-size: 14px; }
      `}</style>
    </div>
  );
}

export function NotificationInbox() {
  const { user } = useAuth();
  const subscriberId = getSubscriberId(user);

  if (!applicationIdentifier) return null;

  return (
    <NovuProvider applicationIdentifier={applicationIdentifier} subscriber={subscriberId}>
      <HeadlessNotificationInbox />
    </NovuProvider>
  );
}
