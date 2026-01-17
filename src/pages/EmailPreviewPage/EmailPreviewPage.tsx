/**
 * Email Preview Page
 * 
 * A page to preview personalized re-engagement emails based on CDP data.
 * This page demonstrates what emails would look like when sent to users
 * who registered via Google One Tap or normal signup.
 */

import React, { useState } from 'react';
import { EmailPreview } from '../../components/EmailPreview';
import { getUserCDPProfile, getCDPEvents, exportCDPData, clearCDPEvents } from '../../utils/cdpTracking';
import './EmailPreviewPage.css';

export const EmailPreviewPage: React.FC = () => {
  const [showCDPData, setShowCDPData] = useState(false);
  const [previewName, setPreviewName] = useState('');
  
  const cdpProfile = getUserCDPProfile();
  const cdpEvents = getCDPEvents();
  const cdpExport = exportCDPData();

  // Get viewed vehicles from localStorage
  const getViewedVehicles = () => {
    try {
      const stored = localStorage.getItem('motortrend_viewed_vehicles');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const viewedVehicles = getViewedVehicles();

  const handleClearCDP = () => {
    clearCDPEvents();
    localStorage.removeItem('cdp_user_profile');
    window.location.reload();
  };

  return (
    <div className="email-preview-page">
      <div className="email-preview-page__header">
        <h1>📧 Personalized Email Preview</h1>
        <p>
          This page shows what personalized re-engagement emails would look like 
          based on the user's CDP (Customer Data Platform) data.
        </p>
      </div>

      <div className="email-preview-page__controls">
        <div className="email-preview-page__control-group">
          <label>Preview Name:</label>
          <input 
            type="text" 
            value={previewName}
            onChange={(e) => setPreviewName(e.target.value)}
            placeholder={cdpProfile?.name || 'Greg'}
          />
        </div>

        <button 
          className="email-preview-page__btn"
          onClick={() => setShowCDPData(!showCDPData)}
        >
          {showCDPData ? 'Hide' : 'Show'} CDP Data
        </button>

        <button 
          className="email-preview-page__btn email-preview-page__btn--danger"
          onClick={handleClearCDP}
        >
          Clear CDP Data
        </button>
      </div>

      {showCDPData && (
        <div className="email-preview-page__cdp-data">
          <h3>CDP Profile</h3>
          <pre>{JSON.stringify(cdpProfile, null, 2)}</pre>
          
          <h3>Viewed Vehicles ({viewedVehicles.length})</h3>
          <pre>{JSON.stringify(viewedVehicles, null, 2)}</pre>
          
          <h3>CDP Events ({cdpEvents.length})</h3>
          <pre>{JSON.stringify(cdpEvents.slice(-10), null, 2)}</pre>
          
          <h3>Registration Stats</h3>
          <pre>{JSON.stringify(cdpExport.registrationStats, null, 2)}</pre>
        </div>
      )}

      <div className="email-preview-page__stats">
        <div className="email-preview-page__stat">
          <span className="email-preview-page__stat-value">{viewedVehicles.length}</span>
          <span className="email-preview-page__stat-label">Vehicles Viewed</span>
        </div>
        <div className="email-preview-page__stat">
          <span className="email-preview-page__stat-value">{cdpEvents.length}</span>
          <span className="email-preview-page__stat-label">CDP Events</span>
        </div>
        <div className="email-preview-page__stat">
          <span className="email-preview-page__stat-value">
            {cdpProfile?.registrationSource === 'google_one_tap' ? 'G1T' : 'Normal'}
          </span>
          <span className="email-preview-page__stat-label">Registration</span>
        </div>
      </div>

      <div className="email-preview-page__email-container">
        <h2>Email Preview</h2>
        <p className="email-preview-page__subtitle">
          This email would be sent to users who registered and viewed vehicle pages.
          The "Recommended For You" section is personalized based on their browsing history.
        </p>
        
        <div className="email-preview-page__email-wrapper">
          <EmailPreview 
            previewProfile={previewName ? { name: previewName } : undefined}
          />
        </div>
      </div>

      <div className="email-preview-page__instructions">
        <h3>How to Test</h3>
        <ol>
          <li>Visit some vehicle detail pages (e.g., <a href="/vehicles/2026/Honda/Pilot">/vehicles/2026/Honda/Pilot</a>)</li>
          <li>The CDP will track your page views</li>
          <li>Return to this page to see the personalized email</li>
          <li>The "Recommended For You" section will show vehicles you viewed</li>
        </ol>

        <h3>CDP Integration Points</h3>
        <ul>
          <li><strong>Google One Tap:</strong> Tracks registration source for G1T users</li>
          <li><strong>High-Intent Pages:</strong> MMP and Rankings pages trigger CDP events</li>
          <li><strong>Vehicle Views:</strong> Each vehicle page view is tracked</li>
          <li><strong>Email Personalization:</strong> Uses CDP data to customize content</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailPreviewPage;
