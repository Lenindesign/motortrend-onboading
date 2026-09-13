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

function renderNotificationBody(body: string) {
  return body.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part,
  );
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

  const runAction = async (notification: Notification, destination?: string) => {
    if (!notification.isRead) await novu.notifications.read({ notificationId: notification.id });
    if (destination?.startsWith('/')) window.location.assign(destination.replaceAll('&amp;', '&'));
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
          <div className="mt-notification-panel-header">
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
          </div>

          {isLoading && <p className="mt-notification-state">Loading notifications…</p>}
          {error && <p className="mt-notification-state">Notifications are temporarily unavailable.</p>}
          {!isLoading && !error && uniqueNotifications.length === 0 && (
            <p className="mt-notification-state">You’re all caught up.</p>
          )}
          {!isLoading && !error && uniqueNotifications.length > 0 && (
            <div className="mt-notification-list">
              {uniqueNotifications.map((notification) => (
                <article className={`mt-notification-item${notification.isRead ? '' : ' is-unread'}`} key={notification.id}>
                  <span className="mt-notification-avatar" aria-hidden="true">MT</span>
                  <button type="button" className="mt-notification-content" onClick={() => void openNotification(notification)}>
                    <strong className="mt-notification-subject">{notification.subject || 'MotorTrend'}</strong>
                    <span className="mt-notification-body">{renderNotificationBody(notification.body)}</span>
                    <small>{formatNotificationDate(notification.createdAt)}</small>
                  </button>
                  {!notification.isRead && <i aria-label="Unread" />}
                  {(notification.primaryAction || notification.secondaryAction) && (
                    <div className="mt-notification-buttons">
                      {notification.primaryAction && (
                        <button
                          type="button"
                          className="mt-notification-primary"
                          onClick={() => void runAction(notification, notification.primaryAction?.redirect?.url)}
                        >
                          {notification.primaryAction.label}
                        </button>
                      )}
                      {notification.secondaryAction && (
                        <button
                          type="button"
                          className="mt-notification-secondary"
                          onClick={() => void runAction(notification, notification.secondaryAction?.redirect?.url)}
                        >
                          {notification.secondaryAction.label}
                        </button>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <style>{`
        .mt-headless-notifications { position: relative; color: #fff; }
        .mt-notification-trigger { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: 0; border-radius: 50%; background: transparent; color: #fff; cursor: pointer; }
        .mt-notification-trigger:hover { background: rgba(255,255,255,.1); }
        .mt-notification-trigger span { font-family: 'Material Symbols Outlined'; font-size: 25px; }
        .mt-notification-trigger b { position: absolute; top: 0; right: -2px; min-width: 18px; height: 18px; padding: 0 4px; border-radius: 99px; background: #e90c17; color: #fff; font: 700 10px/18px Arial, sans-serif; }
        .mt-notification-panel { position: absolute; z-index: 100; top: 48px; right: 0; width: min(420px, calc(100vw - 32px)); max-height: min(620px, calc(100vh - 90px)); overflow: hidden; border: 1px solid #36363b; border-radius: 16px; background: #141416; box-shadow: 0 18px 50px rgba(0,0,0,.45); }
        .mt-notification-panel-header { display: flex; align-items: center; justify-content: space-between; min-height: 0; padding: 18px 20px; border-bottom: 1px solid #303035; }
        .mt-notification-panel-header h2 { margin: 0; color: #fff !important; font-size: 18px; font-weight: 700; line-height: 1.2; }
        .mt-notification-panel-header > div { display: flex; align-items: center; gap: 12px; }
        .mt-notification-action, .mt-notification-close { border: 0; background: transparent; color: #c4c4ca; cursor: pointer; }
        .mt-notification-action { padding: 6px 8px; border-radius: 5px; font-size: 12px; }
        .mt-notification-action:hover { background: #29292f; color: #fff; }
        .mt-notification-close { width: 30px; height: 30px; border-radius: 50%; font-size: 24px; line-height: 1; }
        .mt-notification-close:hover { background: #29292f; color: #fff; }
        .mt-notification-list { max-height: 540px; overflow-y: auto; }
        .mt-notification-item { display: grid; grid-template-columns: 34px minmax(0, 1fr) 7px; align-items: start; gap: 12px; width: 100%; padding: 16px 20px; border-bottom: 1px solid #2a2a2f; background: transparent; color: #fff; text-align: left; }
        .mt-notification-item:hover, .mt-notification-item.is-unread { background: #1d1d21; }
        .mt-notification-item:has(.mt-notification-buttons) { grid-template-rows: auto auto; }
        .mt-notification-item:has(.mt-notification-buttons) .mt-notification-buttons { grid-column: 2 / 4; }
        .mt-notification-avatar { display: grid; grid-column: 1; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: #e90c17; color: #fff; font: 800 13px Arial, sans-serif; }
        .mt-notification-content { display: grid; gap: 5px; min-width: 0; padding: 0; border: 0; background: transparent; color: inherit; text-align: left; cursor: pointer; }
        .mt-notification-content:hover .mt-notification-subject { text-decoration: underline; text-underline-offset: 2px; }
        .mt-notification-subject { font-size: 14px; line-height: 1.3; }
        .mt-notification-body { color: #c4c4ca; font-size: 13px; line-height: 1.4; }
        .mt-notification-body strong { color: #fff; font-weight: 700; }
        .mt-notification-content small { color: #85858d; font-size: 11px; }
        .mt-notification-item i { grid-column: 3; width: 7px; height: 7px; margin-top: 6px; border-radius: 50%; background: #e90c17; }
        .mt-notification-buttons { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 4px; }
        .mt-notification-primary, .mt-notification-secondary { min-height: 30px; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: 700; cursor: pointer; }
        .mt-notification-primary { border: 1px solid #e90c17; background: #e90c17; color: #fff; }
        .mt-notification-primary:hover { background: #ff2630; }
        .mt-notification-secondary { border: 1px solid #77777f; background: transparent; color: #fff; }
        .mt-notification-secondary:hover { border-color: #fff; background: #29292f; }
        .mt-notification-state { margin: 0; padding: 56px 20px; color: #a6a6ad; text-align: center; font-size: 14px; }
        .mt-notification-trigger:focus-visible, .mt-notification-action:focus-visible, .mt-notification-close:focus-visible, .mt-notification-content:focus-visible, .mt-notification-primary:focus-visible, .mt-notification-secondary:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
        @media (max-width: 560px) {
          .mt-notification-panel { position: fixed; top: 70px; right: 16px; left: 16px; width: auto; max-height: calc(100vh - 86px); }
          .mt-notification-list { max-height: calc(100vh - 160px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mt-notification-trigger, .mt-notification-item, .mt-notification-action, .mt-notification-close, .mt-notification-primary, .mt-notification-secondary { transition: none; }
        }
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
