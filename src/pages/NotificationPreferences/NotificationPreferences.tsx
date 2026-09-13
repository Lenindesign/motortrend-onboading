import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { getPriceAlertVehicles } from '../../utils/priceAlerts';
import {
  defaultNotificationPreferences,
  getNotificationPreferences,
  saveNotificationPreferences,
  type NotificationPreferences as NotificationPreferencesState,
} from '../../utils/notificationPreferences';

const preferenceOptions: Array<{ key: keyof Pick<NotificationPreferencesState, 'breakingNews' | 'savedVehicleUpdates' | 'communityActivity' | 'weeklyDigest'>; title: string; description: string }> = [
  { key: 'breakingNews', title: 'Breaking MotorTrend news', description: 'Get the stories and launches that matter as they happen.' },
  { key: 'savedVehicleUpdates', title: 'Saved vehicle updates', description: 'Hear about price changes, inventory, recalls, and important updates for saved vehicles.' },
  { key: 'communityActivity', title: 'Community activity', description: 'Know when someone replies to you or mentions you in the community.' },
  { key: 'weeklyDigest', title: 'Weekly personalized digest', description: 'A quick weekly roundup based on the vehicles and topics you follow.' },
];

const styles = {
  page: { minHeight: 'calc(100vh - 180px)', background: '#f7f8fb', padding: '48px 24px 80px' },
  shell: { maxWidth: '900px', margin: '0 auto' },
  back: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#5c6470', textDecoration: 'none', fontSize: '14px', marginBottom: '24px' },
  title: { margin: 0, color: '#141416', fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.1, fontWeight: 700 },
  intro: { margin: '12px 0 28px', color: '#5c6470', maxWidth: '650px', lineHeight: 1.6 },
  card: { background: '#fff', border: '1px solid #e1e4ea', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(20,20,22,.04)' },
  cardTitle: { margin: 0, color: '#141416', fontSize: '20px' },
  cardDescription: { margin: '8px 0 20px', color: '#6e7481', fontSize: '14px', lineHeight: 1.5 },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', padding: '16px 0', borderTop: '1px solid #eef0f3' },
  rowTitle: { display: 'block', color: '#23262f', fontWeight: 600, marginBottom: '4px' },
  rowDescription: { display: 'block', color: '#6e7481', fontSize: '14px', lineHeight: 1.45 },
  checkbox: { width: '20px', height: '20px', accentColor: '#e90c17', flexShrink: 0 },
  timeRow: { display: 'flex', flexWrap: 'wrap' as const, gap: '16px', marginTop: '16px' },
  label: { display: 'flex', flexDirection: 'column' as const, gap: '6px', color: '#23262f', fontSize: '14px', fontWeight: 600 },
  input: { border: '1px solid #cdd2da', borderRadius: '8px', padding: '10px 12px', color: '#23262f', background: '#fff', font: 'inherit' },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' as const, marginTop: '24px' },
  save: { border: 0, borderRadius: '8px', background: '#e90c17', color: '#fff', padding: '12px 20px', fontWeight: 700, cursor: 'pointer' },
  saved: { color: '#24753d', fontSize: '14px', minHeight: '20px' },
  note: { color: '#6e7481', fontSize: '13px', lineHeight: 1.5 },
  alertLink: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#e90c17', fontWeight: 600, textDecoration: 'none' },
} as const;

export const NotificationPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreferencesState>(defaultNotificationPreferences);
  const [saved, setSaved] = useState(false);
  const [priceAlertCount, setPriceAlertCount] = useState(0);

  useEffect(() => {
    setPreferences(getNotificationPreferences());
    setPriceAlertCount(getPriceAlertVehicles().length);
  }, []);

  const update = <K extends keyof NotificationPreferencesState>(key: K, value: NotificationPreferencesState[K]) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    saveNotificationPreferences(preferences);
    setSaved(true);
  };

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <Link to="/my-account/profile" style={styles.back}>
          <Icon name="arrow_back" size={18} />
          Back to profile
        </Link>
        <h1 style={styles.title}>Notification preferences</h1>
        <p style={styles.intro}>
          Choose the updates that help you discover the right stories, vehicles, and conversations without adding noise.
        </p>

        <section style={styles.card} aria-labelledby="notification-types-heading">
          <h2 id="notification-types-heading" style={styles.cardTitle}>What you want to hear about</h2>
          <p style={styles.cardDescription}>These preferences are saved on this device. They will also guide future MotorTrend notification workflows.</p>
          {preferenceOptions.map((option) => (
            <label key={option.key} style={styles.row}>
              <span>
                <span style={styles.rowTitle}>{option.title}</span>
                <span style={styles.rowDescription}>{option.description}</span>
              </span>
              <input
                type="checkbox"
                checked={preferences[option.key]}
                onChange={(event) => update(option.key, event.target.checked)}
                style={styles.checkbox}
              />
            </label>
          ))}
        </section>

        <section style={styles.card} aria-labelledby="quiet-hours-heading">
          <h2 id="quiet-hours-heading" style={styles.cardTitle}>Quiet hours</h2>
          <p style={styles.cardDescription}>Pause non-urgent notifications during the hours you choose.</p>
          <label style={{ ...styles.row, borderTop: 0, paddingTop: 0 }}>
            <span>
              <span style={styles.rowTitle}>Enable quiet hours</span>
              <span style={styles.rowDescription}>Breaking news can still reach you when it is important.</span>
            </span>
            <input type="checkbox" checked={preferences.quietHours} onChange={(event) => update('quietHours', event.target.checked)} style={styles.checkbox} />
          </label>
          <div style={{ ...styles.timeRow, opacity: preferences.quietHours ? 1 : 0.5 }}>
            <label style={styles.label}>
              Starts
              <input type="time" value={preferences.quietHoursStart} disabled={!preferences.quietHours} onChange={(event) => update('quietHoursStart', event.target.value)} style={styles.input} />
            </label>
            <label style={styles.label}>
              Ends
              <input type="time" value={preferences.quietHoursEnd} disabled={!preferences.quietHours} onChange={(event) => update('quietHoursEnd', event.target.value)} style={styles.input} />
            </label>
          </div>
        </section>

        <section style={styles.card} aria-labelledby="price-alerts-heading">
          <h2 id="price-alerts-heading" style={styles.cardTitle}>Saved vehicle alerts</h2>
          <p style={styles.cardDescription}>
            {priceAlertCount > 0 ? `You have ${priceAlertCount} active price alert${priceAlertCount === 1 ? '' : 's'}.` : 'You have no active price alerts yet.'}
          </p>
          <Link to="/my-account/saved-items" style={styles.alertLink}>Manage saved vehicles <Icon name="arrow_forward" size={16} /></Link>
        </section>

        <div style={styles.footer}>
          <span role="status" style={styles.saved}>{saved ? 'Preferences saved.' : ''}</span>
          <button type="button" onClick={save} style={styles.save}>Save preferences</button>
        </div>
        <p style={styles.note}>You can change these choices anytime. Email and push delivery will become available when those channels are enabled for your account.</p>
      </div>
    </div>
  );
};

export default NotificationPreferences;
