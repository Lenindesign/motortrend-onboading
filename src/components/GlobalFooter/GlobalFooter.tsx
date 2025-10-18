/**
 * Global Footer Component
 * Based on Figma Community design system
 */

import React from 'react';
import { Button } from '../../design-system/components';
import './GlobalFooter.css';
import motorTrendLogo from '../../assets/images/motortrend-logo.svg';

export interface GlobalFooterProps {
  onNewsletterClick?: () => void;
  onReportIssueClick?: () => void;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({
  onNewsletterClick,
  onReportIssueClick,
}) => {
  const footerLinks = [
    'MotorTrend Group',
    'Our Team',
    'Careers',
    'Help',
    'About Us',
    'Supported Devices',
    'About Ads',
    'Contact Us',
    'Newsletters',
    'Advertise With Us',
    'Magazine Subscriptions',
    'Discovery, Inc.',
    'Terms of Use',
    'Privacy Policy',
    'Cookie Policy',
    'Ad Choices',
    'California Privacy Notice',
    'Do Not Sell or Share My Personal Information',
    'Site Map',
    'Reprints/Permissions',
    'Warner Bros. Discovery Inc.',
  ];

  const magazineLinks = [
    'Automobile Magazine',
    'Truck Trend',
    'Four Wheeler',
    'Hot Rod',
    'Super Street',
    'Lowrider',
  ];

  return (
    <footer className="global-footer">
      <div className="global-footer__content">
        {/* Main Footer Content */}
        <div className="global-footer__main">
          {/* Left Section - Logo and Links */}
          <div className="global-footer__left">
            <img 
              src={motorTrendLogo} 
              alt="MotorTrend" 
              className="global-footer__logo"
            />
            <p className="global-footer__links">
              {footerLinks.map((link, index) => (
                <React.Fragment key={link}>
                  <a href="#" className="global-footer__link">{link}</a>
                  {index < footerLinks.length - 1 && '   |   '}
                </React.Fragment>
              ))}
            </p>
          </div>

          {/* Right Section - Newsletter */}
          <div className="global-footer__newsletter">
            <h3 className="global-footer__newsletter-title">Join Newsletter</h3>
            <p className="global-footer__newsletter-description">
              Subscribe to our newsletters to get the latest in car news and have editor curated stories sent directly to your inbox.
            </p>
            <Button 
              color="red" 
              size="default" 
              variant="solid"
              onClick={onNewsletterClick}
            >
              Explore Offerings
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="global-footer__divider" />

        {/* Bottom Bar */}
        <div className="global-footer__bottom">
          <div className="global-footer__bottom-left">
            <p className="global-footer__copyright">
              © 2025 MotorTrend | MOTOR TREND GROUP, LLC. ALL RIGHTS RESERVED.
            </p>
            <p className="global-footer__magazine-links">
              {magazineLinks.map((link, index) => (
                <React.Fragment key={link}>
                  <a href="#" className="global-footer__magazine-link">{link}</a>
                  {index < magazineLinks.length - 1 && '  |  '}
                </React.Fragment>
              ))}
            </p>
            <p className="global-footer__disclaimer">
              Hearst Autos, Inc. recently acquired the motortrend.com website and MotorTrend mobile application from Warner Bros. Discovery. During a transition period, your use of the website and mobile application will continue to be governed by the practices described in the Warner Bros. Discovery Privacy Policy and the Terms of Use.
            </p>
          </div>

          {/* Report Issue Button */}
          <Button 
            color="neutrals3" 
            size="default" 
            variant="solid"
            onClick={onReportIssueClick}
          >
            Report Issue
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;

