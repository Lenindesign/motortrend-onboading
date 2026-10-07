import React, { useState } from 'react';
import './MobileAdhesionAd.css';

export const MobileAdhesionAd: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside className="mobile-adhesion-ad" aria-label="Advertisement">
      <a className="mobile-adhesion-ad__link" href="https://www.dgdg.com/" target="_blank" rel="noreferrer">
        <img src="/images/dgdg-adhesion-ad.png" alt="DGDG dealership advertisement" />
      </a>
      <button className="mobile-adhesion-ad__close" type="button" aria-label="Close advertisement" onClick={() => setIsVisible(false)}>
        <span aria-hidden="true">×</span>
      </button>
    </aside>
  );
};
