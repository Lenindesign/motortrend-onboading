/**
 * EmailPreview Component
 * 
 * Renders a preview of personalized re-engagement emails based on CDP data.
 * This component shows what emails would look like when sent to users who
 * registered via Google One Tap or normal signup.
 * 
 * The email includes:
 * - Personalized greeting with user's name
 * - Membership card with user details
 * - Welcome article
 * - Recommended content based on viewed vehicles
 * - CTA to explore profile
 */

import React, { useMemo } from 'react';
import { getUserCDPProfile, type CDPUserProfile } from '../../utils/cdpTracking';
import { vehicleImageFor } from '../../utils/vehicleImages';
import { getViewedVehicles } from '../PersonalizedVehicles';

interface EmailPreviewProps {
  /** Override user profile for preview purposes */
  previewProfile?: Partial<CDPUserProfile>;
}

// ViewedVehicle can come from different sources with different shapes
interface ViewedVehicleFromPersonalized {
  name: string;
  timestamp?: number;
}

interface ViewedVehicleFromCDP {
  year?: number;
  make?: string;
  model?: string;
  viewedAt?: string;
}

type ViewedVehicle = ViewedVehicleFromPersonalized | ViewedVehicleFromCDP;

export const EmailPreview: React.FC<EmailPreviewProps> = ({ 
  previewProfile,
}) => {
  // Get user data from CDP or use preview data
  const cdpProfile = getUserCDPProfile();
  
  // Merge CDP profile with preview overrides
  const userProfile = useMemo(() => {
    const defaultProfile: CDPUserProfile = {
      id: 'preview_user',
      email: 'user@example.com',
      name: 'Greg',
      registrationSource: 'google_one_tap',
      registrationTimestamp: new Date().toISOString(),
      interestedVehicles: [],
      highIntentPageViews: [],
      emailPreferences: { subscribed: true },
      lastActivity: new Date().toISOString(),
    };
    
    return {
      ...defaultProfile,
      ...cdpProfile,
      ...previewProfile,
    };
  }, [cdpProfile, previewProfile]);

  // Get viewed vehicles from PersonalizedVehicles (user-specific storage)
  const viewedVehicles = useMemo(() => {
    // Use the proper getViewedVehicles function which handles user-specific storage
    const viewed = getViewedVehicles();
    if (viewed.length > 0) {
      return viewed.slice(0, 3); // Get last 3 viewed
    }
    
    // Fallback to CDP profile
    if (userProfile.interestedVehicles?.length > 0) {
      return userProfile.interestedVehicles.slice(0, 3);
    }
    
    // Default vehicles for preview
    return [
      { year: 2026, make: 'Honda', model: 'Pilot', viewedAt: new Date().toISOString() },
      { year: 2025, make: 'Toyota', model: 'Camry', viewedAt: new Date().toISOString() },
      { year: 2024, make: 'BMW', model: '3-Series', viewedAt: new Date().toISOString() },
    ];
  }, [userProfile.interestedVehicles]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get user's first name
  const firstName = userProfile.name?.split(' ')[0] || 'there';

  // Helper to get vehicle name from different formats
  const getVehicleName = (vehicle: ViewedVehicle): string => {
    if ('name' in vehicle && vehicle.name) {
      return vehicle.name;
    }
    if ('year' in vehicle && 'make' in vehicle && 'model' in vehicle) {
      return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    }
    return 'Vehicle';
  };

  // Helper to generate MMP URL from vehicle name (e.g., "2026 Honda Pilot" -> "/vehicles/2026/Honda/Pilot")
  const getVehicleUrl = (vehicleName: string): string => {
    const parts = vehicleName.split(' ');
    if (parts.length >= 3) {
      const year = parts[0];
      const make = parts[1];
      const model = parts.slice(2).join('-'); // Handle multi-word models like "3-Series"
      return `/vehicles/${year}/${encodeURIComponent(make)}/${encodeURIComponent(model)}`;
    }
    return '/vehicles';
  };

  // Get user's car (first interested vehicle or default)
  const userCar = viewedVehicles[0] 
    ? getVehicleName(viewedVehicles[0])
    : '2021 Subaru WRX';

  // Styles
  const containerStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: "'Geist', 'Poppins', sans-serif",
    backgroundColor: '#232630',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const logoBarStyle: React.CSSProperties = {
    backgroundColor: '#E90C17',
    padding: '16px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const contentStyle: React.CSSProperties = {
    padding: '32px 24px',
  };

  const greetingStyle: React.CSSProperties = {
    color: '#F4F5F6',
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '16px',
    fontFamily: "'Geist', sans-serif",
  };

  const paragraphStyle: React.CSSProperties = {
    color: '#F4F5F6',
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: '24px',
    fontFamily: "'Geist', sans-serif",
    fontWeight: 500,
  };

  const membershipCardStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #4a4a4a 0%, #000000 100%)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: '0 3px 16px rgba(20, 20, 22, 0.06)',
  };

  const cardHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    marginBottom: '20px',
  };

  const logoCircleStyle: React.CSSProperties = {
    width: '89px',
    height: '89px',
    borderRadius: '50%',
    backgroundColor: '#E90C17',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const cardTitleStyle: React.CSSProperties = {
    color: '#FFFFFF',
    fontSize: '25px',
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
    marginBottom: '4px',
  };

  const cardSubtitleStyle: React.CSSProperties = {
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 400,
    fontFamily: "'Geist', sans-serif",
  };

  const cardDetailsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '25px',
    marginTop: '20px',
  };

  const detailLabelStyle: React.CSSProperties = {
    color: '#B1B5C3',
    fontSize: '11px',
    fontWeight: 400,
    fontFamily: "'Geist', sans-serif",
    marginBottom: '4px',
  };

  const detailValueStyle: React.CSSProperties = {
    color: '#FCFCFD',
    fontSize: '15px',
    fontWeight: 500,
    fontFamily: "'Geist', sans-serif",
  };

  const sectionTitleStyle: React.CSSProperties = {
    color: '#EEF2FF',
    fontSize: '27px',
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
    marginBottom: '16px',
  };

  const articleCardStyle: React.CSSProperties = {
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '24px',
  };

  const articleImageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px 8px 0 0',
  };

  const articleContentStyle: React.CSSProperties = {
    backgroundColor: '#FCFCFD',
    padding: '16px',
    borderRadius: '0 0 8px 8px',
  };

  const articleTitleStyle: React.CSSProperties = {
    color: '#000000',
    fontSize: '27px',
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
    marginBottom: '6px',
  };

  const articleCategoryStyle: React.CSSProperties = {
    color: '#000000',
    fontSize: '21px',
    fontWeight: 400,
    fontFamily: "'Geist', sans-serif",
    marginBottom: '16px',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#232630',
    color: '#FCFCFD',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
    cursor: 'pointer',
    display: 'inline-block',
    textDecoration: 'none',
  };

  const recommendedCardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    display: 'flex',
    overflow: 'hidden',
    marginBottom: '16px',
  };

  const recommendedImageContainerStyle: React.CSSProperties = {
    width: '200px',
    height: '150px',
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: '8px 0 0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  };

  const recommendedImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Fill the container, cropping if needed
    objectPosition: 'center',
  };

  const recommendedContentStyle: React.CSSProperties = {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  };

  const recommendedTitleStyle: React.CSSProperties = {
    color: '#141416',
    fontSize: '23px',
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
    marginBottom: '4px',
  };

  const recommendedSubtitleStyle: React.CSSProperties = {
    color: '#232630',
    fontSize: '16px',
    fontWeight: 400,
    fontFamily: "'Geist', sans-serif",
    marginBottom: '16px',
  };

  const ctaButtonStyle: React.CSSProperties = {
    backgroundColor: '#E90C17',
    color: '#FCFCFD',
    padding: '17px 34px',
    borderRadius: '98px',
    border: 'none',
    fontSize: '23px',
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
    cursor: 'pointer',
    display: 'inline-block',
    textDecoration: 'none',
    textAlign: 'center',
    margin: '24px auto',
  };

  const footerStyle: React.CSSProperties = {
    padding: '24px',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      {/* Red Logo Bar */}
      <div style={logoBarStyle}>
        <svg width="200" height="32" viewBox="0 0 200 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="24" fill="#FCFCFD" fontSize="24" fontWeight="700" fontFamily="Poppins, sans-serif">
            MOTORTREND
          </text>
        </svg>
      </div>

      {/* Main Content */}
      <div style={contentStyle}>
        {/* Greeting */}
        <div style={greetingStyle}>Hi {firstName},</div>
        
        <p style={paragraphStyle}>
          You're officially part of the MotorTrend family! From now on, you'll get insider access 
          to the latest car reviews, exclusive member stories, and the best of automotive 
          culture—delivered straight to your inbox.
        </p>

        <p style={paragraphStyle}>
          <strong>Your MotorTrend Membership Card unlocks:</strong>
        </p>

        <ul style={{ ...paragraphStyle, paddingLeft: '24px' }}>
          <li>A custom personalized experience just for you</li>
          <li>Exclusive newsletters, content, and more</li>
          <li>Member-only features such as Rate and Review your cars</li>
        </ul>

        {/* Membership Card */}
        <div style={membershipCardStyle}>
          <div style={cardHeaderStyle}>
            <div style={logoCircleStyle}>
              <svg width="56" height="43" viewBox="0 0 56 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="8" y="30" fill="#FCFCFD" fontSize="20" fontWeight="700" fontFamily="Poppins, sans-serif">
                  MT
                </text>
              </svg>
            </div>
            <div>
              <div style={cardTitleStyle}>Membership Card</div>
              <div style={cardSubtitleStyle}>MotorTrend Member</div>
            </div>
          </div>

          <div style={cardDetailsStyle}>
            <div>
              <div style={detailLabelStyle}>Member Since</div>
              <div style={detailValueStyle}>{formatDate(userProfile.registrationTimestamp)}</div>
            </div>
            <div>
              <div style={detailLabelStyle}>Name</div>
              <div style={detailValueStyle}>{userProfile.name || 'Member'}</div>
            </div>
            <div>
              <div style={detailLabelStyle}>My Car</div>
              <div style={detailValueStyle}>{userCar}</div>
            </div>
            <div>
              <div style={detailLabelStyle}>Newsletter</div>
              <div style={detailValueStyle}>MotorTrend</div>
            </div>
          </div>
        </div>

        {/* Welcome Article */}
        <div style={sectionTitleStyle}>Welcome to MotorTrend</div>
        
        <div style={articleCardStyle}>
          <img 
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop"
            alt="Welcome Article"
            style={articleImageStyle}
          />
          <div style={articleContentStyle}>
            <div style={articleTitleStyle}>Welcome MotorTrend Article</div>
            <div style={articleCategoryStyle}>Enthusiast Story</div>
            <button style={buttonStyle}>Read More</button>
          </div>
        </div>

        {/* Recommended For You */}
        <div style={sectionTitleStyle}>Recommended For You</div>

        {viewedVehicles.map((vehicle: ViewedVehicle, index: number) => {
          const vehicleName = getVehicleName(vehicle);
          const imageUrl = vehicleImageFor(vehicleName);
          const vehicleUrl = getVehicleUrl(vehicleName);
          
          return (
            <div key={index} style={recommendedCardStyle}>
              <div style={recommendedImageContainerStyle}>
                <img 
                  src={imageUrl || `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop`}
                  alt={vehicleName}
                  style={recommendedImageStyle}
                />
              </div>
              <div style={recommendedContentStyle}>
                <div style={recommendedTitleStyle}>{vehicleName}</div>
                <div style={recommendedSubtitleStyle}>
                  Based on your recent interest
                </div>
                <a 
                  href={vehicleUrl}
                  style={{ 
                    ...buttonStyle, 
                    width: 'fit-content', 
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  Read More
                </a>
              </div>
            </div>
          );
        })}

        {/* CTA Button */}
        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <button style={ctaButtonStyle}>
            EXPLORE YOUR PROFILE
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        <img 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=200&fit=crop"
          alt="MotorTrend Footer"
          style={{ width: '100%', borderRadius: '8px', opacity: 0.8 }}
        />
      </div>
    </div>
  );
};

export default EmailPreview;
