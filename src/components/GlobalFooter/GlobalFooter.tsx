/**
 * Global Footer Component
 * Migrated to inline styles for Tailwind compatibility
 * Based on Figma Community design system
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../design-system/components';

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
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    { label: 'Community', path: '/community' },
    { label: 'Review System Docs', path: '/docs/review-system' },
    { label: 'Onboarding Docs', path: '/docs/onboarding' },
    { label: 'Profile Docs', path: '/docs/profile' },
    { label: 'Design System', path: '/design-system' },
    { label: 'Atomic Design Audit', path: '/documentation/atomic-design-audit' },
    { label: 'Top Ten Management', path: '/top-ten-management' },
  ];

  const magazineLinks = [
    'Automobile Magazine',
    'Truck Trend',
    'Four Wheeler',
    'Hot Rod',
    'Super Street',
    'Lowrider',
  ];

  // Styles
  const footerStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-neutrals-1, #141416)',
    padding: isMobile ? '32px 16px' : '48px 24px',
    width: '100%'
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 24px)'
  };

  const mainStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--spacing-3, 24px)',
    justifyContent: 'space-between',
    flexDirection: isMobile ? 'column' : 'row'
  };

  const leftStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 24px)',
    alignItems: 'flex-start'
  };

  const logoStyle: React.CSSProperties = {
    height: '32px',
    width: 'auto',
    objectFit: 'contain',
    margin: 0,
    alignSelf: 'flex-start'
  };

  const linksStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '1.714em',
    color: 'var(--color-neutrals-5, #B1B5C3)',
    margin: 0
  };

  const getLinkStyle = (linkId: string): React.CSSProperties => ({
    color: hoveredLink === linkId ? 'var(--color-neutrals-8, #FCFCFD)' : 'var(--color-neutrals-5, #B1B5C3)',
    textDecoration: 'none',
    transition: 'color 0.15s ease-in-out'
  });

  const docsLinksStyle: React.CSSProperties = {
    ...linksStyle,
    marginTop: 'var(--spacing-2, 16px)'
  };

  const docsLabelStyle: React.CSSProperties = {
    fontWeight: 600,
    color: 'var(--color-neutrals-6, #E6E8EC)'
  };

  const newsletterStyle: React.CSSProperties = {
    width: isMobile ? '100%' : '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 24px)'
  };

  const newsletterTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '1.333em',
    color: 'var(--color-neutrals-8, #FCFCFD)',
    margin: 0
  };

  const newsletterDescStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '1.286em',
    color: 'var(--color-neutrals-5, #B1B5C3)',
    margin: 0
  };

  const dividerStyle: React.CSSProperties = {
    height: '1px',
    backgroundColor: 'var(--color-neutrals-3, #353945)',
    width: '100%'
  };

  const bottomStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3, 24px)',
    padding: '11px 0',
    flexDirection: isMobile ? 'column' : 'row'
  };

  const bottomLeftStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 24px)'
  };

  const smallTextStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '1.333em',
    color: 'var(--color-neutrals-5, #B1B5C3)',
    margin: 0
  };

  return (
    <footer style={footerStyle}>
      <div style={contentStyle}>
        {/* Main Footer Content */}
        <div style={mainStyle}>
          {/* Left Section - Logo and Links */}
          <div style={leftStyle}>
            <img 
              src={motorTrendLogo} 
              alt="MotorTrend" 
              style={logoStyle}
            />
            <p style={linksStyle}>
              {footerLinks.map((link) => (
                <React.Fragment key={link}>
                  <a 
                    href="#" 
                    style={getLinkStyle(`footer-${link}`)}
                    onMouseEnter={() => setHoveredLink(`footer-${link}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {link}
                  </a>
                  {'   |   '}
                </React.Fragment>
              ))}
              <Link 
                to={sitemapLink.path} 
                style={getLinkStyle('sitemap')}
                onMouseEnter={() => setHoveredLink('sitemap')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {sitemapLink.label}
              </Link>
            </p>
            <p style={docsLinksStyle}>
              <span style={docsLabelStyle}>Documentation: </span>
              {documentationLinks.map((docLink, index) => (
                <React.Fragment key={docLink.path}>
                  <Link 
                    to={docLink.path} 
                    style={{ ...getLinkStyle(`doc-${docLink.path}`), fontWeight: 500 }}
                    onMouseEnter={() => setHoveredLink(`doc-${docLink.path}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {docLink.label}
                  </Link>
                  {index < documentationLinks.length - 1 && '   |   '}
                </React.Fragment>
              ))}
            </p>
          </div>

          {/* Right Section - Newsletter */}
          <div style={newsletterStyle}>
            <h3 style={newsletterTitleStyle}>Join Newsletter</h3>
            <p style={newsletterDescStyle}>
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
        <div style={dividerStyle} />

        {/* Bottom Bar */}
        <div style={bottomStyle}>
          <div style={bottomLeftStyle}>
            <p style={smallTextStyle}>
              © 2025 MotorTrend | MOTOR TREND GROUP, LLC. ALL RIGHTS RESERVED.
            </p>
            <p style={smallTextStyle}>
              {magazineLinks.map((link, index) => (
                <React.Fragment key={link}>
                  <a 
                    href="#" 
                    style={getLinkStyle(`mag-${link}`)}
                    onMouseEnter={() => setHoveredLink(`mag-${link}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {link}
                  </a>
                  {index < magazineLinks.length - 1 && '  |  '}
                </React.Fragment>
              ))}
            </p>
            <p style={smallTextStyle}>
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
