import { Inbox } from '@novu/react';
import type { Notification } from '@novu/js/ui';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Icon from './Icon';

const applicationIdentifier = import.meta.env.VITE_NOVU_APPLICATION_IDENTIFIER;
const configuredSubscriberId = import.meta.env.VITE_NOVU_SUBSCRIBER_ID;

function getSubscriberId(user: ReturnType<typeof useAuth>['user']): string {
  if (user && !user.isAnonymous) {
    return user.id;
  }

  // Demo users previously shared the configured Novu subscriber, which caused
  // notifications from one demo session to appear in every other session.
  if (user?.email) {
    const demoKey = user.email.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    return `motortrend-demo-${demoKey}`;
  }

  return configuredSubscriberId || '6aa4b90867ef7f19e018b5c6';
}

const demoNotifications = [
  {
    title: '2027 Audi A2 e-tron: Live Story',
    message: 'Read the full MotorTrend story and see the latest details.',
  },
  {
    title: 'Latest from MotorTrend',
    message: 'New reviews, rankings, and automotive news are ready to explore.',
  },
  {
    title: 'Your MotorTrend profile is ready',
    message: 'Save vehicles and choose the updates you want to receive.',
  },
];

function DemoNotificationInbox() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        style={{ border: 0, background: 'transparent', color: '#fff', cursor: 'pointer', padding: '8px', display: 'inline-flex' }}
      >
        <Icon name="notifications" size={24} />
      </button>
      {isOpen && (
        <div
          role="dialog"
          aria-label="Notifications inbox"
          style={{ position: 'absolute', top: '48px', right: 0, width: '360px', maxWidth: 'calc(100vw - 32px)', background: '#141416', color: '#fff', borderRadius: '16px', boxShadow: '0 18px 50px rgba(0,0,0,.35)', overflow: 'hidden', zIndex: 1000 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #2c2d33', fontWeight: 700 }}>
            <span>Notifications</span>
            <button type="button" aria-label="Close notifications" onClick={() => setIsOpen(false)} style={{ border: 0, background: 'transparent', color: '#b1b5c3', cursor: 'pointer' }}>
              <Icon name="close" size={20} />
            </button>
          </div>
          {demoNotifications.map((notification) => (
            <div key={notification.title} style={{ padding: '18px 20px', borderBottom: '1px solid #24252b' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e90c17', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src="/images/mt-brand-icon.svg" alt="" style={{ width: '20px', filter: 'brightness(0) invert(1)' }} />
                </span>
                <div>
                  <div style={{ fontWeight: 700, lineHeight: 1.3 }}>{notification.title}</div>
                  <div style={{ color: '#b1b5c3', fontSize: '13px', lineHeight: 1.45, marginTop: '4px' }}>{notification.message}</div>
                  <div style={{ color: '#858995', fontSize: '12px', marginTop: '8px' }}>Just now</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function NotificationInbox() {
  const { user } = useAuth();
  const subscriberId = getSubscriberId(user);

  if (user?.isAnonymous) {
    return <DemoNotificationInbox />;
  }

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
