import { Inbox } from '@novu/react';
import type { Notification } from '@novu/js/ui';
import { useAuth } from '../contexts/AuthContext';

const applicationIdentifier = import.meta.env.VITE_NOVU_APPLICATION_IDENTIFIER;
const configuredSubscriberId = import.meta.env.VITE_NOVU_SUBSCRIBER_ID;

function getSubscriberId(user: ReturnType<typeof useAuth>['user']): string {
  if (user && !user.isAnonymous) {
    return user.id;
  }

  // The anonymous preview account maps to the seeded Novu subscriber so the
  // demo inbox can show real workflow notifications. Registered users remain
  // isolated by their own Auth user ID above.
  return configuredSubscriberId || '6aa4b90867ef7f19e018b5c6';
}

export function NotificationInbox() {
  const { user } = useAuth();
  const subscriberId = getSubscriberId(user);

  const getNotificationDestination = (notification: Notification): string => {
    const data = notification.data ?? {};
    const candidate = [
      data.url,
      data.route,
      data.path,
      data.href,
      notification.redirect?.url,
      notification.primaryAction?.redirect?.url,
      notification.secondaryAction?.redirect?.url,
    ].find(
      (value): value is string => typeof value === 'string' && value.startsWith('/') && !value.startsWith('//'),
    );

    // Workflows can provide a destination in data. Older workflows fall back to the live feed.
    return candidate ? candidate.replaceAll('&amp;', '&') : '/latest-news';
  };

  const openNotification = (notification: Notification) => {
    window.location.assign(getNotificationDestination(notification));
  };

  if (!applicationIdentifier) {
    return null;
  }

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', color: '#FFFFFF' }}
      aria-label="Notifications"
      onClickCapture={(event) => {
        const anchor = (event.target as HTMLElement).closest('a');
        const href = anchor?.getAttribute('href');
        if (!anchor || !href || !href.includes('&amp;')) return;
        event.preventDefault();
        window.location.assign(href.replaceAll('&amp;', '&'));
      }}
    >
      <style>{`
        .nv-inbox__popoverContent .nv-inboxContent > div:nth-of-type(3) {
          display: none !important;
        }
      `}</style>
      <Inbox
        applicationIdentifier={applicationIdentifier}
        subscriberId={subscriberId}
        routerPush={(path: string) => {
          window.location.assign(path);
        }}
        onNotificationClick={openNotification}
        renderAvatar={() => (
          <span
            aria-label="MotorTrend"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#E90C17',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src="/images/mt-brand-icon.svg"
              alt=""
              style={{ width: '20px', height: 'auto', filter: 'brightness(0) invert(1)' }}
            />
          </span>
        )}
        appearance={{
          variables: {
            colorPrimary: '#E90C17',
            colorPrimaryForeground: '#FFFFFF',
            colorBackground: '#141416',
            colorForeground: '#FFFFFF',
            colorNeutral: '#353945',
            colorSecondary: '#23262F',
            colorSecondaryForeground: '#FFFFFF',
            colorCounter: '#E90C17',
            colorCounterForeground: '#FFFFFF',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </div>
  );
}
