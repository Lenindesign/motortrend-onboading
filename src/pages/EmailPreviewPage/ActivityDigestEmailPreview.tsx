import React, { useEffect, useMemo, useRef, useState } from 'react';
import './EmailPreviewPage.css';

type DeviceMode = 'desktop' | 'mobile';

interface ActivityDigestTags {
  firstName: string;
  homeUrl: string;
  commentsUrl: string;
  reviewsUrl: string;
  qaUrl: string;
  preferencesUrl: string;
  unsubscribeUrl: string;
}

const ACTIVITY_DIGEST_PATH = '/emails/activity-digest.html';

const applyMergeTags = (html: string, tags: ActivityDigestTags): string =>
  Object.entries(tags).reduce(
    (content, [key, value]) => content.replaceAll(`{{${key}}}`, value),
    html,
  );

export const ActivityDigestEmailPreview: React.FC = () => {
  const [rawHtml, setRawHtml] = useState('');
  const [loadError, setLoadError] = useState('');
  const [firstName, setFirstName] = useState('Jordan');
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadError('');

    fetch(ACTIVITY_DIGEST_PATH)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((html) => {
        if (!cancelled) setRawHtml(html);
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : String(error));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const tags = useMemo<ActivityDigestTags>(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    return {
      firstName: firstName.trim() || 'there',
      homeUrl: `${origin}/`,
      commentsUrl: `${origin}/community`,
      reviewsUrl: `${origin}/vehicles/2024/Toyota/RAV4`,
      qaUrl: `${origin}/vehicles/2024/Toyota/RAV4#vehicle-qa`,
      preferencesUrl: `${origin}/my-account/notifications`,
      unsubscribeUrl: `${origin}/my-account/notifications`,
    };
  }, [firstName]);

  const renderedHtml = useMemo(
    () => (rawHtml ? applyMergeTags(rawHtml, tags) : ''),
    [rawHtml, tags],
  );

  useEffect(() => {
    const document = iframeRef.current?.contentDocument;
    if (!document || !renderedHtml) return;
    document.open();
    document.write(renderedHtml);
    document.close();
  }, [renderedHtml]);

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(renderedHtml);
    } catch {
      // Clipboard access is best-effort in the local preview.
    }
  };

  return (
    <div className="email-preview-page">
      <div className="email-preview-page__header">
        <h1>Activity Digest — Email Preview</h1>
        <p>
          Live render of <code>{ACTIVITY_DIGEST_PATH}</code>. Edit the recipient name or switch
          viewport size; the email updates instantly.
        </p>
        <p style={{ marginTop: 4, fontStyle: 'italic', opacity: 0.8 }}>
          A personalized recap of recent comments, reviews, and community answers.
        </p>
      </div>

      <div className="email-preview-page__controls">
        <div className="email-preview-page__control-group">
          <label htmlFor="activity-digest-first-name">First name</label>
          <input
            id="activity-digest-first-name"
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>

        <button
          className="email-preview-page__btn"
          onClick={() => setDevice(device === 'desktop' ? 'mobile' : 'desktop')}
          type="button"
        >
          {device === 'desktop' ? 'Switch to Mobile (375px)' : 'Switch to Desktop (640px)'}
        </button>

        <button className="email-preview-page__btn" onClick={copyHtml} type="button">
          Copy HTML
        </button>
      </div>

      <div className="email-preview-page__email-container email-preview-page__email-container--centered">
        {loadError ? (
          <div className="email-preview-page__load-error" role="alert">
            Failed to load email HTML: {loadError}
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="MotorTrend activity digest email preview"
            className="email-preview-page__preview-frame"
            style={{
              width: device === 'desktop' ? 640 : 375,
              maxWidth: '100%',
              height: device === 'desktop' ? 1240 : 1540,
              transition: 'width 0.25s ease',
            }}
          />
        )}
      </div>

      <div className="email-preview-page__instructions">
        <h3>Preview contents</h3>
        <ul>
          <li>Three recent comment updates, including replies and likes.</li>
          <li>Two review updates and one editor answer in vehicle Q&amp;A.</li>
          <li>Personalized greeting plus email preference and unsubscribe links.</li>
        </ul>
      </div>
    </div>
  );
};

export default ActivityDigestEmailPreview;
