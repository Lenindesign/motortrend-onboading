import { Inbox } from '@novu/react';
import { useAuth } from '../contexts/AuthContext';

const applicationIdentifier = import.meta.env.VITE_NOVU_APPLICATION_IDENTIFIER;
const configuredSubscriberId = import.meta.env.VITE_NOVU_SUBSCRIBER_ID;

export function NotificationInbox() {
  const { user } = useAuth();
  const subscriberId = configuredSubscriberId || user?.id || '6aa4b90867ef7f19e018b5c6';
  const openLatestNews = () => window.location.assign('/latest-news');

  if (!applicationIdentifier) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', color: '#FFFFFF' }} aria-label="Notifications">
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
        onNotificationClick={openLatestNews}
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
