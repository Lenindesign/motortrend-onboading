/**
 * Global Footer Component
 * Based on Figma Community design system
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../design-system/components';
import './GlobalFooter.css';

// Using MotorTrend main logo from URL
const motorTrendLogo = 'https://d2kde5ohu8qb21.cloudfront.net/files/68f3fc9ccfecd100026f4650/mtlogo.png';

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
    'Reprints/Permissions',
    'Warner Bros. Discovery Inc.',
  ];
  
  const sitemapLink = { label: 'Site Map', path: '/sitemap' };

  const documentationLinks = [
    { label: 'Review System Docs', path: '/docs/review-system' },
    { label: 'Onboarding Docs', path: '/docs/onboarding' },
    { label: 'Profile Docs', path: '/docs/profile' },
    { label: 'Design System', path: '/design-system' },
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
              {footerLinks.map((link) => (
                <React.Fragment key={link}>
                  <a href="#" className="global-footer__link">{link}</a>
                  {'   |   '}
                </React.Fragment>
              ))}
              <Link to={sitemapLink.path} className="global-footer__link">
                {sitemapLink.label}
              </Link>
            </p>
            <p className="global-footer__links global-footer__links--documentation">
              <span className="global-footer__docs-label">Documentation: </span>
              {documentationLinks.map((docLink, index) => (
                <React.Fragment key={docLink.path}>
                  <Link to={docLink.path} className="global-footer__link global-footer__link--docs">
                    {docLink.label}
                  </Link>
                  {index < documentationLinks.length - 1 && '   |   '}
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

