/**
 * What Is My Car Worth Widget
 * Shows trade-in/market value estimate for user's owned vehicle
 * Pre-populates with user's car if they've shared it, or incentivizes sharing
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import { parseVehicleName, vehicleImageFor } from '../../utils/vehicleImages';
import { VehicleSearch } from '../VehicleSearch';

export interface WhatIsMyCarWorthProps {
  className?: string;
}

interface OwnedVehicle {
  name: string;
  ownership: 'own' | 'want' | 'previously_owned';
  year?: string;
  make?: string;
  model?: string;
}

interface OnboardingData {
  vehicles?: OwnedVehicle[];
  zipCode?: string;
  name?: string;
}

type Condition = 'Excellent' | 'Good' | 'Fair' | 'Poor';
type Mileage = 'Under 30K' | '30K - 60K' | '60K - 100K' | '100K - 150K' | 'Over 150K';

// Base prices by make (approximate market values for trade-in)
const makeBasePrices: Record<string, number> = {
  'Toyota': 26000,
  'Honda': 25000,
  'Ford': 27000,
  'Chevrolet': 26000,
  'BMW': 42000,
  'Mercedes': 48000,
  'Mercedes-Benz': 48000,
  'Audi': 40000,
  'Lexus': 38000,
  'Subaru': 27000,
  'Nissan': 22000,
  'Hyundai': 23000,
  'Kia': 22000,
  'Mazda': 24000,
  'Volkswagen': 25000,
  'Jeep': 30000,
  'Dodge': 28000,
  'Ram': 32000,
  'GMC': 34000,
  'Tesla': 52000,
  'Porsche': 85000,
  'Land Rover': 55000,
  'Volvo': 35000,
  'Acura': 32000,
  'Infiniti': 30000,
  'Genesis': 38000,
  'Rivian': 70000,
  'Lucid': 75000,
};

// Model multipliers (some models retain value better)
const modelMultipliers: Record<string, number> = {
  'Tacoma': 1.3,
  '4Runner': 1.25,
  'Wrangler': 1.35,
  'Bronco': 1.3,
  'F-150': 1.1,
  'Corvette': 1.4,
  'Mustang': 1.15,
  'Camaro': 1.1,
  'Civic': 1.1,
  'Accord': 1.05,
  'CR-V': 1.1,
  'RAV4': 1.15,
  'Highlander': 1.1,
  'Model 3': 0.95,
  'Model Y': 1.0,
  'Model S': 0.85,
  '911': 1.2,
  'Cayenne': 1.0,
};

/**
 * Calculate estimated trade-in value based on vehicle details
 */
function calculateTradeInValue(
  year: string,
  make: string,
  model: string,
  condition: Condition,
  mileage: Mileage
): { low: number; mid: number; high: number } {
  const currentYear = new Date().getFullYear();
  const vehicleYear = parseInt(year) || currentYear;
  const age = currentYear - vehicleYear;

  // Get base price
  const basePrice = makeBasePrices[make] || 25000;
  
  // Get model multiplier
  const modelMultiplier = modelMultipliers[model] || 1.0;
  const adjustedBase = basePrice * modelMultiplier;

  // Depreciation: ~15% first year, ~12% years 2-3, ~10% years 4-5, ~8% after
  let depreciation = 1.0;
  if (age === 1) {
    depreciation = 0.85;
  } else if (age === 2) {
    depreciation = 0.85 * 0.88;
  } else if (age === 3) {
    depreciation = 0.85 * 0.88 * 0.88;
  } else if (age <= 5) {
    depreciation = 0.85 * 0.88 * 0.88 * Math.pow(0.90, age - 3);
  } else {
    depreciation = 0.85 * 0.88 * 0.88 * 0.90 * 0.90 * Math.pow(0.92, age - 5);
  }

  // Condition adjustment
  const conditionMultipliers: Record<Condition, number> = {
    'Excellent': 1.1,
    'Good': 1.0,
    'Fair': 0.85,
    'Poor': 0.65,
  };

  // Mileage adjustment
  const mileageMultipliers: Record<Mileage, number> = {
    'Under 30K': 1.1,
    '30K - 60K': 1.0,
    '60K - 100K': 0.9,
    '100K - 150K': 0.75,
    'Over 150K': 0.6,
  };

  const conditionFactor = conditionMultipliers[condition];
  const mileageFactor = mileageMultipliers[mileage];

  const baseValue = adjustedBase * depreciation * conditionFactor * mileageFactor;

  // Calculate range (±10% for mid, ±20% for low/high)
  const mid = Math.round(baseValue / 100) * 100;
  const low = Math.round(mid * 0.85 / 100) * 100;
  const high = Math.round(mid * 1.15 / 100) * 100;

  return { low, mid, high };
}

export const WhatIsMyCarWorth: React.FC<WhatIsMyCarWorthProps> = ({ className }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [_isNarrowScreen, setIsNarrowScreen] = useState(false);
  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const [isAddCarHovered, setIsAddCarHovered] = useState(false);
  const [isInfoHovered, setIsInfoHovered] = useState(false);
  
  // Vehicle state
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [condition, setCondition] = useState<Condition>('Good');
  const [mileage, setMileage] = useState<Mileage>('30K - 60K');
  
  // User data
  const [hasOwnedVehicle, setHasOwnedVehicle] = useState(false);

  // Check for mobile and narrow screens
  useEffect(() => {
    const checkBreakpoints = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsNarrowScreen(window.innerWidth < 1280);
    };
    checkBreakpoints();
    window.addEventListener('resize', checkBreakpoints);
    return () => window.removeEventListener('resize', checkBreakpoints);
  }, []);

  // Load user's owned vehicles from localStorage
  useEffect(() => {
    const loadUserVehicles = () => {
      try {
        const onboardingDataStr = localStorage.getItem('onboardingData');
        if (onboardingDataStr) {
          const onboardingData: OnboardingData = JSON.parse(onboardingDataStr);
          const vehicles = onboardingData.vehicles || [];
          const owned = vehicles.filter(v => v.ownership === 'own' || v.ownership === 'previously_owned');
          
          setHasOwnedVehicle(owned.length > 0);
          
          // Pre-select the first owned vehicle (always update if we have owned vehicles)
          if (owned.length > 0) {
            setSelectedVehicle(owned[0].name);
          }
        }
      } catch (error) {
        console.error('Error loading user vehicles:', error);
      }
    };

    loadUserVehicles();

    // Listen for updates
    window.addEventListener('storage', loadUserVehicles);
    window.addEventListener('onboardingDataUpdated', loadUserVehicles);
    
    return () => {
      window.removeEventListener('storage', loadUserVehicles);
      window.removeEventListener('onboardingDataUpdated', loadUserVehicles);
    };
  }, []); // Remove selectedVehicle dependency to avoid stale closure

  // Calculate value based on selected vehicle
  const valueEstimate = useMemo(() => {
    if (!selectedVehicle) return null;
    
    const parsed = parseVehicleName(selectedVehicle);
    const { year, make, model } = parsed;
    
    return calculateTradeInValue(
      decodeURIComponent(year),
      decodeURIComponent(make),
      decodeURIComponent(model),
      condition,
      mileage
    );
  }, [selectedVehicle, condition, mileage]);

  // Get the vehicle image for the selected vehicle
  const vehicleImage = useMemo(() => {
    if (!selectedVehicle) return null;
    return vehicleImageFor(selectedVehicle);
  }, [selectedVehicle]);

  // Placeholder car image for empty state
  const placeholderCarImage = 'https://d2kde5ohu8qb21.cloudfront.net/files/693b872bcd9da90002c570aa/honda-civic-eg-hatch-png-1.png';

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(value);
  };

  const handleGetOffers = () => {
    if (selectedVehicle) {
      const parsed = parseVehicleName(selectedVehicle);
      navigate(`/vehicles/${parsed.year}/${parsed.make}/${parsed.model}?tab=trade-in`);
    }
  };

  const handleAddCar = () => {
    navigate('/profile?section=vehicles&action=add&ownership=own');
  };

  // Styles - container is the outermost element now
  // Full-width sections break out of container, margin handles centering and edge spacing
  const containerStyle: React.CSSProperties = { 
    width: '100%',
    maxWidth: 'var(--max-width-container, 1280px)',
    margin: '0 auto',
    paddingLeft: 0,
    paddingRight: 0,
    background: 'var(--color-white, #FFFFFF)', 
    border: isMobile ? 'none' : '1px solid var(--color-neutrals-6, #E6E8EC)', 
    borderRadius: isMobile ? 'var(--border-radius-md, 8px)' : 'var(--border-radius-lg, 16px)', 
    boxShadow: isMobile ? 'none' : '0px 4px 8px 0px rgba(20, 20, 22, 0.1)', 
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const innerStyle: React.CSSProperties = { 
    display: 'flex', 
    flexDirection: isMobile ? 'column' : 'row',
    minHeight: isMobile ? 'auto' : '480px',
    gap: 0,
    padding: 0,
  };

  const leftStyle: React.CSSProperties = { 
    flex: 1, 
    padding: isMobile ? '20px 16px' : '32px', 
    display: isMobile ? 'none' : 'flex',
    flexDirection: 'column', 
    gap: isMobile ? '16px' : '24px', 
    background: 'linear-gradient(135deg, var(--color-neutrals-7, #F4F5F6) 0%, var(--color-white, #FFFFFF) 100%)'
  };

  const badgeStyle: React.CSSProperties = { 
    display: 'inline-flex', 
    alignItems: 'center', 
    padding: '6px 12px', 
    background: 'var(--color-primary-1, #E90C17)', 
    borderRadius: 'var(--border-radius-full, 100px)', 
    width: 'fit-content' 
  };

  const badgeTextStyle: React.CSSProperties = { 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '11px', 
    fontWeight: 600, 
    color: 'var(--color-white, #FFFFFF)', 
    textTransform: 'uppercase', 
    letterSpacing: '0.5px' 
  };

  const headerStyle: React.CSSProperties = { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: isMobile ? '8px' : '12px' 
  };

  const titleStyle: React.CSSProperties = { 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: isMobile ? '20px' : '28px', 
    fontWeight: 600, 
    color: 'var(--color-neutrals-1, #141416)', 
    margin: 0, 
    lineHeight: 1.2
  };

  const descStyle: React.CSSProperties = { 
    fontFamily: 'Geist, sans-serif', 
    fontSize: isMobile ? '14px' : '16px', 
    fontWeight: 400, 
    color: 'var(--color-neutrals-4, #6E7481)', 
    lineHeight: 1.5, 
    margin: 0 
  };

  const rightStyle: React.CSSProperties = { 
    flex: 1, 
    padding: isMobile ? '20px 16px' : '32px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: isMobile ? '16px' : '24px', 
    background: 'var(--color-white, #FFFFFF)'
  };

  const valueDisplayStyle: React.CSSProperties = { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: isMobile ? '4px' : '8px', 
    paddingBottom: isMobile ? '16px' : '24px', 
    borderBottom: '1px solid var(--color-neutrals-6, #E6E8EC)',
    alignItems: isMobile ? 'center' : 'flex-start',
    textAlign: isMobile ? 'center' : 'left'
  };

  const valueAmountStyle: React.CSSProperties = { 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: isMobile ? '36px' : '52px', 
    fontWeight: 600, 
    color: 'var(--color-neutrals-2, #23262F)', 
    lineHeight: 1,
    marginBottom: 0 
  };

  const valueLabelStyle: React.CSSProperties = { 
    fontFamily: 'Geist, sans-serif', 
    fontSize: '14px', 
    fontWeight: 500, 
    color: 'var(--color-neutrals-4, #6E7481)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const valueRangeStyle: React.CSSProperties = { 
    fontFamily: 'Geist, sans-serif', 
    fontSize: '13px', 
    fontWeight: 400, 
    color: 'var(--color-neutrals-4, #6E7481)' 
  };

  const inputsStyle: React.CSSProperties = { 
    display: 'grid', 
    gridTemplateColumns: isMobile ? '1fr' : '1fr', 
    gap: isMobile ? '16px' : '20px' 
  };

  const fieldStyle: React.CSSProperties = { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '8px' 
  };

  const labelStyle: React.CSSProperties = { 
    fontFamily: 'Geist, sans-serif', 
    fontSize: '14px', 
    fontWeight: 600, 
    color: 'var(--color-neutrals-1, #141416)' 
  };

  const selectStyle: React.CSSProperties = { 
    width: '100%', 
    padding: isMobile ? '14px 40px 14px 16px' : '12px 40px 12px 16px', 
    border: '1px solid var(--color-neutrals-6, #E6E8EC)', 
    borderRadius: 'var(--border-radius-md, 8px)', 
    background: 'var(--color-white, #FFFFFF)', 
    fontFamily: 'Geist, sans-serif', 
    fontSize: '16px', 
    fontWeight: 400, 
    color: 'var(--color-neutrals-1, #141416)', 
    cursor: 'pointer', 
    outline: 'none', 
    appearance: 'none', 
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%231A1B21' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", 
    backgroundRepeat: 'no-repeat', 
    backgroundPosition: 'right 16px center' 
  };

  const twoColGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  };

  const ctaStyle: React.CSSProperties = { 
    width: '100%', 
    padding: isMobile ? '14px 20px' : '16px 24px', 
    border: 'none', 
    borderRadius: 'var(--border-radius-md, 8px)', 
    background: isCtaHovered ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-1, #141416)', 
    color: 'var(--color-white, #FFFFFF)', 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '16px', 
    fontWeight: 600, 
    cursor: 'pointer', 
    marginTop: isMobile ? '8px' : 'auto', 
    transform: isCtaHovered ? 'translateY(-1px)' : 'none', 
    boxShadow: isCtaHovered ? '0 4px 12px rgba(233, 12, 23, 0.3)' : 'none', 
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const mobileTitleStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
    lineHeight: 1.3,
    display: isMobile ? 'block' : 'none'
  };

  const mobileDescStyle: React.CSSProperties = {
    fontFamily: 'Geist, sans-serif',
    fontSize: '14px',
    color: 'var(--color-neutrals-4, #6E7481)',
    margin: 0,
    marginBottom: '16px',
    display: isMobile ? 'block' : 'none'
  };

  const infoBtnStyle: React.CSSProperties = { 
    width: '18px', 
    height: '18px', 
    borderRadius: 'var(--border-radius-circle, 50%)', 
    border: 'none', 
    background: 'transparent', 
    color: isInfoHovered ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-4, #6E7481)', 
    cursor: 'pointer', 
    display: 'inline-flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 0, 
    transition: 'color 0.2s ease' 
  };

  // Empty state styles (when user has no owned vehicle)
  const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: isMobile ? '32px 16px' : '48px 32px',
    gap: '20px'
  };

  const emptyIconStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'var(--color-neutrals-7, #F4F5F6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-neutrals-4, #6E7481)'
  };

  const emptyTitleStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 600,
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0
  };

  const emptyDescStyle: React.CSSProperties = {
    fontFamily: 'Geist, sans-serif',
    fontSize: '15px',
    color: 'var(--color-neutrals-4, #6E7481)',
    margin: 0,
    maxWidth: '320px',
    lineHeight: 1.5
  };

  const addCarBtnStyle: React.CSSProperties = {
    padding: '14px 28px',
    border: 'none',
    borderRadius: 'var(--border-radius-md, 8px)',
    background: isAddCarHovered ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-1, #141416)',
    color: 'var(--color-white, #FFFFFF)',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    transform: isAddCarHovered ? 'translateY(-1px)' : 'none',
    boxShadow: isAddCarHovered ? '0 4px 12px rgba(233, 12, 23, 0.3)' : 'none',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  // If user has no owned vehicle, show incentive state
  if (!hasOwnedVehicle) {
    return (
      <div className={className} style={containerStyle}>
        <div style={{ ...innerStyle, minHeight: isMobile ? 'auto' : '400px' }}>
          {/* Left side with gradient - desktop only */}
          <div style={{ ...leftStyle, display: isMobile ? 'none' : 'flex', position: 'relative', overflow: 'visible' }}>
            <div style={badgeStyle}>
              <span style={badgeTextStyle}>Trade-In Tool</span>
            </div>
            <div style={headerStyle}>
              <h2 style={titleStyle}>What's Your Car Worth?</h2>
              <p style={descStyle}>
                Get an instant estimate of your vehicle's trade-in value and see what you could get for your current car.
              </p>
            </div>
            {/* Placeholder car image - positioned above gradient */}
            {placeholderCarImage && (
              <img 
                src={placeholderCarImage} 
                alt="Example vehicle"
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '95%',
                  maxWidth: '420px',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 16px 32px rgba(0, 0, 0, 0.2))',
                  borderRadius: 'var(--border-radius-lg, 16px)',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>

          {/* Right side with empty state */}
          <div style={{ ...rightStyle, flex: 1 }}>
            <div style={emptyStateStyle}>
              <div style={emptyIconStyle}>
                <Icon name="directions_car" size={40} />
              </div>
              <h3 style={emptyTitleStyle}>Add Your Vehicle</h3>
              <p style={emptyDescStyle}>
                Tell us what car you own to get an instant trade-in estimate and personalized offers from local dealers.
              </p>
              <button 
                style={addCarBtnStyle}
                onClick={handleAddCar}
                onMouseEnter={() => setIsAddCarHovered(true)}
                onMouseLeave={() => setIsAddCarHovered(false)}
                aria-label="Add your car"
              >
                <Icon name="add" size={20} />
                Add My Car
              </button>
              <p style={{ ...emptyDescStyle, fontSize: '13px', marginTop: '8px' }}>
                Takes less than 30 seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main state with owned vehicle
  return (
    <div className={className} style={containerStyle}>
      <div style={innerStyle}>
        {/* Left side with gradient and illustration - desktop only */}
        <div style={{ ...leftStyle, position: 'relative', overflow: 'visible' }}>
          <div style={badgeStyle}>
            <span style={badgeTextStyle}>Trade-In Tool</span>
          </div>
          <div style={headerStyle}>
            <h2 style={titleStyle}>What's Your Car Worth?</h2>
            <p style={descStyle}>
              Get an instant estimate based on current market data. Adjust condition and mileage for accuracy.
            </p>
          </div>
          {/* Vehicle image - positioned above gradient */}
          {vehicleImage ? (
            <div style={{ 
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '8px',
              zIndex: 10,
              pointerEvents: 'none',
              width: '95%',
              maxWidth: '420px',
            }}>
              <img 
                src={vehicleImage} 
                alt={selectedVehicle}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 16px 32px rgba(0, 0, 0, 0.2))',
                  borderRadius: 'var(--border-radius-lg, 16px)',
                }}
              />
              <span style={{
                fontFamily: 'var(--font-body, Geist, sans-serif)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-neutrals-2, #23262F)',
                textAlign: 'center',
                letterSpacing: '0.3px',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '5px 14px',
                borderRadius: 'var(--border-radius-full, 100px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}>
                {selectedVehicle}
              </span>
            </div>
          ) : (
            <img 
              src={placeholderCarImage} 
              alt="Example vehicle"
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '95%',
                maxWidth: '420px',
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 16px 32px rgba(0, 0, 0, 0.2))',
                borderRadius: 'var(--border-radius-lg, 16px)',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* Right side with calculator */}
        <div style={rightStyle}>
          {/* Mobile header */}
          <h2 style={mobileTitleStyle}>What's Your Car Worth?</h2>
          <p style={mobileDescStyle}>Get an instant trade-in estimate</p>

          {/* Value Display */}
          <div style={valueDisplayStyle}>
            <div style={valueAmountStyle}>
              {valueEstimate ? formatCurrency(valueEstimate.mid) : '--'}
            </div>
            <div style={valueLabelStyle}>
              Estimated Trade-In Value
              <button 
                style={infoBtnStyle}
                onMouseEnter={() => setIsInfoHovered(true)} 
                onMouseLeave={() => setIsInfoHovered(false)} 
                aria-label="Learn more about estimate"
              >
                <Icon name="info" size={16} />
              </button>
            </div>
            {valueEstimate && (
              <div style={valueRangeStyle}>
                Range: {formatCurrency(valueEstimate.low)} – {formatCurrency(valueEstimate.high)}
              </div>
            )}
          </div>

          {/* Inputs */}
          <div style={inputsStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Your Vehicle</label>
              <VehicleSearch
                onVehicleSelect={(vehicle) => {
                  setSelectedVehicle(vehicle.name);
                  // Update localStorage with the new vehicle
                  try {
                    const onboardingDataStr = localStorage.getItem('onboardingData');
                    const data = onboardingDataStr ? JSON.parse(onboardingDataStr) : { vehicles: [] };
                    if (!data.vehicles) data.vehicles = [];
                    // Check if vehicle already exists
                    const existingIndex = data.vehicles.findIndex((v: { name: string }) => v.name === vehicle.name);
                    if (existingIndex === -1) {
                      // Add new vehicle as owned
                      const parsed = parseVehicleName(vehicle.name);
                      data.vehicles.push({
                        name: vehicle.name,
                        year: decodeURIComponent(parsed.year),
                        make: decodeURIComponent(parsed.make),
                        model: decodeURIComponent(parsed.model),
                        ownership: 'own'
                      });
                      localStorage.setItem('onboardingData', JSON.stringify(data));
                      window.dispatchEvent(new CustomEvent('onboardingDataUpdated'));
                    }
                  } catch (error) {
                    console.error('Error updating vehicle:', error);
                  }
                }}
                placeholder={selectedVehicle || "Search for your vehicle..."}
                defaultOwnership="own"
              />
            </div>

            <div style={twoColGridStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Condition</label>
                <select 
                  style={selectStyle} 
                  value={condition} 
                  onChange={(e) => setCondition(e.target.value as Condition)}
                  aria-label="Select vehicle condition"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Mileage</label>
                <select 
                  style={selectStyle} 
                  value={mileage} 
                  onChange={(e) => setMileage(e.target.value as Mileage)}
                  aria-label="Select vehicle mileage"
                >
                  <option value="Under 30K">Under 30,000</option>
                  <option value="30K - 60K">30,000 - 60,000</option>
                  <option value="60K - 100K">60,000 - 100,000</option>
                  <option value="100K - 150K">100,000 - 150,000</option>
                  <option value="Over 150K">Over 150,000</option>
                </select>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button 
            style={ctaStyle} 
            onClick={handleGetOffers}
            onMouseEnter={() => setIsCtaHovered(true)} 
            onMouseLeave={() => setIsCtaHovered(false)}
            aria-label="Get trade-in offers"
          >
            <Icon name="local_offer" size={20} />
            Get Instant Trade-In Offers
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatIsMyCarWorth;

