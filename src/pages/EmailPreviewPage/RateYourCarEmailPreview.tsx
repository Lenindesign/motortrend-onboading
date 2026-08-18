/**
 * Rate Your Car Email Preview
 *
 * Loads public/emails/rate-your-car.html, replaces merge tags with live CDP
 * values, and renders it inside an iframe with desktop/mobile toggles so you
 * can QA the template before sending.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getUserCDPProfile } from '../../utils/cdpTracking';
import { getViewedVehicles } from '../../components/PersonalizedVehicles';
import { vehicleImageFor } from '../../utils/vehicleImages';
import './EmailPreviewPage.css';

const EMAIL_VARIANTS = {
  personalized: {
    path: '/emails/rate-your-car.html',
    label: 'Personalized (vehicle known)',
    description: 'Sent when we know the car the user drives (from onboarding, garage, or CDP).',
  },
  generic: {
    path: '/emails/rate-your-car-generic.html',
    label: 'Generic (vehicle unknown)',
    description: 'Sent when we have no vehicle data — copy drives them to the search step.',
  },
  reviewRequest: {
    path: '/emails/rate-your-car-review-request.html',
    label: 'Review request (already rated)',
    description: 'Sent after a user has rated a known vehicle — copy asks for the story behind the rating.',
  },
} as const;

type Variant = keyof typeof EMAIL_VARIANTS;

const DEFAULT_STARS_GIF = 'https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg';

/** Same hero photo as `RateYourCar` landing page (`pageStyle.backgroundImage`). */
const DEFAULT_HERO_BACKGROUND_URL =
  'https://www.motortrend.com/files/686ecc3b8b30d500028d902a/2026-hyundai-ioniq-6-n-side-motion.jpg';

/** Truck: red Tacoma motion. Sedan: white Honda Civic sedan (Autoweek). SUV: 2025 Ford Bronco Sport (Hearst). */
const DEFAULT_GENERIC_TRUCK_IMAGE_URL =
  'https://www.motortrend.com/files/678a9e907a24a00008619c2e/002-2024-toyota-tacoma-limited-front-three-quarter-motion.jpg';
const DEFAULT_GENERIC_SEDAN_IMAGE_URL =
  'https://hips.hearstapps.com/autoweek/assets/s3fs-public/16_Civic_Sedan_160.jpg?resize=980:*';
const DEFAULT_GENERIC_SUV_IMAGE_URL =
  'https://hips.hearstapps.com/hmg-prod/images/2025-ford-bronco-sport-111-67f4102268e99.jpg?crop=1xw:1xh;center,top';

type DeviceMode = 'desktop' | 'mobile';

interface MergeTags {
  firstName: string;
  vehicleName: string;
  vehicleImageUrl: string;
  ratingUrl: string;
  starsGifUrl: string;
  rateYourCarLogoUrl: string;
  heroBackgroundUrl: string;
  genericTruckImageUrl: string;
  genericSedanImageUrl: string;
  genericSuvImageUrl: string;
  unsubscribeUrl: string;
}

const applyMergeTags = (html: string, tags: MergeTags): string =>
  html
    .replaceAll('{{firstName}}', tags.firstName)
    .replaceAll('{{vehicleName}}', tags.vehicleName)
    .replaceAll('{{vehicleImageUrl}}', tags.vehicleImageUrl)
    .replaceAll('{{ratingUrl}}', tags.ratingUrl)
    .replaceAll('{{starsGifUrl}}', tags.starsGifUrl)
    .replaceAll('{{rateYourCarLogoUrl}}', tags.rateYourCarLogoUrl)
    .replaceAll('{{heroBackgroundUrl}}', tags.heroBackgroundUrl)
    .replaceAll('{{genericTruckImageUrl}}', tags.genericTruckImageUrl)
    .replaceAll('{{genericSedanImageUrl}}', tags.genericSedanImageUrl)
    .replaceAll('{{genericSuvImageUrl}}', tags.genericSuvImageUrl)
    .replaceAll('{{unsubscribeUrl}}', tags.unsubscribeUrl);

const getVehicleName = (v: unknown): string => {
  if (!v || typeof v !== 'object') return '';
  const rec = v as Record<string, unknown>;
  if (typeof rec.name === 'string' && rec.name) return rec.name;
  if (rec.year && rec.make && rec.model) return `${rec.year} ${rec.make} ${rec.model}`;
  return '';
};

export const RateYourCarEmailPreview: React.FC = () => {
  const [variant, setVariant] = useState<Variant>('personalized');
  const [rawHtml, setRawHtml] = useState<string>('');
  const [loadError, setLoadError] = useState<string>('');
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Live-editable merge tag inputs
  const cdpProfile = getUserCDPProfile();
  const viewedVehicles = getViewedVehicles();
  const defaultVehicle = getVehicleName(viewedVehicles[0]) || '2026 Honda Accord';
  const defaultFirstName = cdpProfile?.name?.split(' ')[0] || 'Lenin';

  const [firstName, setFirstName] = useState(defaultFirstName);
  const [vehicleName, setVehicleName] = useState(defaultVehicle);
  const [starsGifUrl, setStarsGifUrl] = useState(DEFAULT_STARS_GIF);

  // Fetch the static HTML whenever the variant changes
  useEffect(() => {
    let cancelled = false;
    setLoadError('');
    setRawHtml('');
    fetch(EMAIL_VARIANTS[variant].path)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!cancelled) setRawHtml(text);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [variant]);

  const tags: MergeTags = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const encodedVehicle = encodeURIComponent(vehicleName).replace(/%20/g, '+');
    // Vehicle-specific variants deep-link to the pre-selected vehicle; generic
    // lands on the "What do you drive?" search step.
    const ratingUrl =
      variant !== 'generic'
        ? `${origin}/rate-your-car?vehicle=${encodedVehicle}`
        : `${origin}/rate-your-car`;
    return {
      firstName,
      vehicleName,
      vehicleImageUrl: vehicleImageFor(vehicleName) || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop',
      ratingUrl,
      starsGifUrl,
      rateYourCarLogoUrl: `${origin}/emails/rate-your-car-logo.svg`,
      heroBackgroundUrl: DEFAULT_HERO_BACKGROUND_URL,
      genericTruckImageUrl: DEFAULT_GENERIC_TRUCK_IMAGE_URL,
      genericSedanImageUrl: DEFAULT_GENERIC_SEDAN_IMAGE_URL,
      genericSuvImageUrl: DEFAULT_GENERIC_SUV_IMAGE_URL,
      unsubscribeUrl: `${origin}/my-account/subscriptions`,
    };
  }, [variant, firstName, vehicleName, starsGifUrl]);

  const renderedHtml = useMemo(() => (rawHtml ? applyMergeTags(rawHtml, tags) : ''), [rawHtml, tags]);

  // Update iframe contents whenever rendered HTML changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !renderedHtml) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(renderedHtml);
    doc.close();
  }, [renderedHtml]);

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(renderedHtml);
    } catch {
      // Best-effort
    }
  };

  return (
    <div className="email-preview-page">
      <div className="email-preview-page__header">
        <h1>Rate Your Car — Email Preview</h1>
        <p>
          Live render of <code>{EMAIL_VARIANTS[variant].path}</code> with merge tags replaced. Edit values
          on the left; the iframe updates instantly.
        </p>
        <p style={{ marginTop: 4, fontStyle: 'italic', opacity: 0.8 }}>
          {EMAIL_VARIANTS[variant].description}
        </p>
      </div>

      <div className="email-preview-page__controls">
        <div className="email-preview-page__control-group">
          <label>Variant</label>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as Variant)}
            style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #E6E8EC' }}
          >
            {(Object.keys(EMAIL_VARIANTS) as Variant[]).map((v) => (
              <option key={v} value={v}>
                {EMAIL_VARIANTS[v].label}
              </option>
            ))}
          </select>
        </div>
        {variant !== 'generic' && (
          <div className="email-preview-page__control-group">
            <label>First name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
        )}
        {variant !== 'generic' && (
          <div className="email-preview-page__control-group">
            <label>Vehicle</label>
            <input type="text" value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} />
          </div>
        )}
        <div className="email-preview-page__control-group">
          <label>Stars image / GIF URL</label>
          <input type="text" value={starsGifUrl} onChange={(e) => setStarsGifUrl(e.target.value)} />
        </div>

        <button
          className="email-preview-page__btn"
          onClick={() => setDevice(device === 'desktop' ? 'mobile' : 'desktop')}
        >
          {device === 'desktop' ? 'Switch to Mobile (375px)' : 'Switch to Desktop (640px)'}
        </button>

        <button className="email-preview-page__btn" onClick={copyHtml}>
          Copy HTML
        </button>

        <a
          className="email-preview-page__btn"
          href={tags.ratingUrl}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
        >
          Open CTA link →
        </a>
      </div>

      <div
        className="email-preview-page__email-container"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        {loadError && (
          <div style={{ color: '#E90C17', padding: 24 }}>
            Failed to load email HTML: {loadError}
          </div>
        )}

        {!loadError && (
          <iframe
            ref={iframeRef}
            title="Rate Your Car email preview"
            style={{
              width: device === 'desktop' ? 640 : 375,
              maxWidth: '100%',
              height: 1400,
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 12,
              background: '#141416',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              transition: 'width 0.25s ease',
            }}
          />
        )}
      </div>

      <div className="email-preview-page__instructions">
        <h3>Deep-link reference</h3>
        <ul>
          <li>
            <code>?vehicle=Name&amp;rating=80</code> → opens rate page, pre-fills 4 stars, auto-submits after 900ms.
          </li>
          <li>
            <code>?vehicle=Name&amp;rating=80&amp;submit=0</code> → pre-fills but doesn't auto-submit (useful for testing).
          </li>
          <li>
            Valid <code>rating</code> values: 10, 20, 30 … 100 (where 100 = 5 stars).
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RateYourCarEmailPreview;
