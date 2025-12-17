/**
 * Vehicle Leads Stripe Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocalListings } from '../../utils/localListings';
import { parseVehicleName } from '../../utils/vehicleImages';
import type { OnboardingData } from '../../types/user';
import type { LocalListing } from '../LocalListingsSidebar/LocalListingsSidebar';
import Icon from '../Icon';
import { ListingCard } from '../ListingCard';

export interface VehicleLeadsStripeProps {
  className?: string;
}

import type { VehicleOwnership } from '../../types/vehicle';

interface VehicleLead {
  vehicleName: string;
  ownership: VehicleOwnership;
  listings: LocalListing[];
  isLoading: boolean;
}

export const VehicleLeadsStripe: React.FC<VehicleLeadsStripeProps> = ({ className }) => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<VehicleLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isContainerHovered, setIsContainerHovered] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<'prev' | 'next' | null>(null);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isWideDesktop, setIsWideDesktop] = useState(window.innerWidth >= 1280);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  const itemsPerSlide = isMobile ? 1 : 4;

  useEffect(() => {
    const checkBreakpoints = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsWideDesktop(window.innerWidth >= 1280);
    };
    checkBreakpoints();
    window.addEventListener('resize', checkBreakpoints);
    return () => window.removeEventListener('resize', checkBreakpoints);
  }, []);

  useEffect(() => {
    const loadLeads = async () => {
      // Save scroll position before loading
      scrollPositionRef.current = window.scrollY;
      
      try {
        const onboardingDataStr = localStorage.getItem('onboardingData');
        if (!onboardingDataStr) { setIsLoading(false); return; }
        const onboardingData: OnboardingData = JSON.parse(onboardingDataStr);
        const vehicles = onboardingData.vehicles || [];
        if (vehicles.length === 0) { setIsLoading(false); setLeads([]); return; }
        // Filter and sort vehicles: prioritize 'want' first, then 'own', then 'previously_owned'
        const ownershipPriority: Record<string, number> = { 'want': 0, 'own': 1, 'previously_owned': 2 };
        const relevantVehicles = vehicles
          .filter(v => v.ownership === 'own' || v.ownership === 'want' || v.ownership === 'previously_owned')
          .sort((a, b) => (ownershipPriority[a.ownership] ?? 99) - (ownershipPriority[b.ownership] ?? 99));
        if (relevantVehicles.length === 0) { setIsLoading(false); setLeads([]); return; }
        const zipCode = onboardingData.zipCode || '90001';
        const minListings = 9; // Minimum number of listings to show
        const listingsPerVehicle = Math.max(5, Math.ceil(minListings / relevantVehicles.length));
        
        const leadsPromises = relevantVehicles.map(async (vehicle) => {
          try {
            const { year, make, model } = parseVehicleName(vehicle.name);
            const { vehicleImageFor } = await import('../../utils/vehicleImages');
            const vehicleImage = vehicleImageFor(vehicle.name);
            const listings = await getLocalListings(year, make, model, vehicleImage, zipCode);
            return { vehicleName: vehicle.name, ownership: vehicle.ownership, listings: listings.slice(0, listingsPerVehicle), isLoading: false };
          } catch (error) {
            console.error(`Error fetching listings for ${vehicle.name}:`, error);
            return { vehicleName: vehicle.name, ownership: vehicle.ownership, listings: [], isLoading: false };
          }
        });
        const leadsData = await Promise.all(leadsPromises);
        const validLeads = leadsData.filter(lead => lead.listings.length > 0);
        setLeads(validLeads);
      } catch (error) {
        console.error('Error loading vehicle leads:', error);
      } finally {
        setIsLoading(false);
        // Restore scroll position after state update to prevent auto-scroll
        requestAnimationFrame(() => {
          if (scrollPositionRef.current === 0) {
            window.scrollTo(0, 0);
          }
        });
      }
    };
    
    loadLeads();
    
    // Listen for profile/onboarding data updates
    const handleDataUpdate = () => {
      setIsLoading(true);
      loadLeads();
    };
    
    window.addEventListener('onboardingDataUpdated', handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);
    
    return () => {
      window.removeEventListener('onboardingDataUpdated', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, []);

  const handleListingClick = (_listing: LocalListing, vehicleName: string) => {
    try {
      const { year, make, model } = parseVehicleName(vehicleName);
      navigate(`/vehicles/${year}/${make}/${model}`);
    } catch (error) {
      console.error('Error navigating to vehicle:', error);
    }
  };

  // Styles - overflow-anchor: none prevents browser scroll anchoring when content loads
  // Add 16px horizontal padding on desktop screens < 1280px
  const stripeStyle: React.CSSProperties = { width: '100%', marginBottom: 'var(--spacing-6, 48px)', padding: !isMobile && !isWideDesktop ? '0 16px' : 0, overflowAnchor: 'none' };
  const headerStyle: React.CSSProperties = { marginBottom: isMobile ? 'var(--spacing-2, 16px)' : 'var(--spacing-4, 24px)', padding: isMobile ? '0 16px' : 0 };
  const titleStyle: React.CSSProperties = { fontFamily: "'Poppins', sans-serif", fontSize: isMobile ? '20px' : '28px', fontWeight: 600, lineHeight: 1.2, color: 'var(--color-neutrals-1, #141416)', margin: '0 0 4px 0' };
  const subtitleRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' };
  const subtitleStyle: React.CSSProperties = { fontFamily: "'Geist', sans-serif", fontSize: isMobile ? '13px' : '14px', color: 'var(--color-neutrals-4, #6E7481)', margin: 0 };
  const headerDotsStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', margin: 0, padding: 0 };
  const loadingStyle: React.CSSProperties = { padding: '40px var(--spacing-4, 24px)', textAlign: 'center', color: 'var(--color-neutrals-4, #6E7481)', fontFamily: "'Geist', sans-serif", fontSize: '14px', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const containerStyle: React.CSSProperties = { position: 'relative', width: '100%', overflow: isMobile ? 'visible' : 'hidden' };
  const scrollStyle: React.CSSProperties = isMobile 
    ? { display: 'flex', gap: '12px', padding: '0 16px', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }
    : { display: 'flex', gap: 'var(--spacing-3, 16px)', padding: 0, transition: 'transform 0.5s ease-in-out', willChange: 'transform' };

  const getNavStyle = (isPrev: boolean): React.CSSProperties => {
    const isHovered = hoveredNav === (isPrev ? 'prev' : 'next');
    return { position: 'absolute', top: '50%', transform: isHovered ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)', width: isMobile ? '40px' : '48px', height: isMobile ? '40px' : '48px', borderRadius: 'var(--border-radius-circle, 50%)', backgroundColor: isHovered ? 'rgba(30, 30, 32, 0.5)' : 'rgba(20, 20, 22, 0.3)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--color-white, #FFFFFF)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, transition: 'all 0.3s ease', boxShadow: isHovered ? '0 12px 40px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.4)', opacity: isContainerHovered ? 1 : 0, pointerEvents: isContainerHovered ? 'auto' : 'none', left: isPrev ? (isMobile ? '8px' : '16px') : 'auto', right: isPrev ? 'auto' : (isMobile ? '8px' : '16px') };
  };

  // Removed dotsStyle - dots now appear in header row
  const getDotStyle = (index: number, isActive: boolean): React.CSSProperties => {
    const isHovered = hoveredDot === index;
    return { width: isActive ? '24px' : '8px', height: '8px', borderRadius: isActive ? '4px' : '50%', border: 'none', backgroundColor: isActive ? 'var(--color-primary-1, #E90C17)' : (isHovered ? 'var(--color-neutrals-4, #6E7481)' : 'var(--color-neutrals-5, #B1B5C3)'), cursor: 'pointer', transition: 'all 0.3s ease', padding: 0, transform: isHovered && !isActive ? 'scale(1.2)' : 'none' };
  };

  if (isLoading) {
    return (
      <div className={className} style={stripeStyle}>
        <div style={headerStyle}><h2 style={titleStyle}>Vehicles for You</h2></div>
        <div style={loadingStyle}><p>Loading listings...</p></div>
      </div>
    );
  }

  if (leads.length === 0) return null;

  const allListings = leads.flatMap(lead => lead.listings.map(listing => ({ listing, vehicleName: lead.vehicleName, ownership: lead.ownership })));
  if (allListings.length === 0) return null;

  const totalSlides = Math.ceil(allListings.length / itemsPerSlide);
  const startIndex = currentSlide * itemsPerSlide;
  const endIndex = startIndex + itemsPerSlide;
  // On mobile, show all items for horizontal scroll; on desktop, paginate
  const currentSlideItems = isMobile ? allListings : allListings.slice(startIndex, endIndex);

  const handlePrev = () => setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  const handleNext = () => setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));

  return (
    <div className={className} style={stripeStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Vehicles for You</h2>
        <div style={subtitleRowStyle}>
          <p style={subtitleStyle}>Based on vehicles you own or want</p>
          {!isMobile && totalSlides > 1 && (
            <div style={headerDotsStyle}>
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button key={index} style={getDotStyle(index, index === currentSlide)} onClick={() => setCurrentSlide(index)} onMouseEnter={() => setHoveredDot(index)} onMouseLeave={() => setHoveredDot(null)} aria-label={`Go to slide ${index + 1}`} tabIndex={-1} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={containerStyle} ref={carouselRef} onMouseEnter={() => setIsContainerHovered(true)} onMouseLeave={() => setIsContainerHovered(false)}>
        {!isMobile && totalSlides > 1 && (
          <>
            <button style={getNavStyle(true)} onClick={handlePrev} onMouseEnter={() => setHoveredNav('prev')} onMouseLeave={() => setHoveredNav(null)} aria-label="Previous slide" tabIndex={-1}><Icon name="chevron_left" size={32} /></button>
            <button style={getNavStyle(false)} onClick={handleNext} onMouseEnter={() => setHoveredNav('next')} onMouseLeave={() => setHoveredNav(null)} aria-label="Next slide" tabIndex={-1}><Icon name="chevron_right" size={32} /></button>
          </>
        )}
        <div style={scrollStyle}>
          {currentSlideItems.map((item, index) => {
            const { listing, vehicleName } = item;
            const parts = vehicleName.split(' ');
            const make = parts[1] || '';
            const model = parts.slice(2).join(' ') || '';
            return (
              <div 
                key={`${listing.id}-${index}`} 
                style={{
                  flexShrink: 0,
                  width: isMobile ? 'calc(100vw - 48px)' : 'calc((100% - 48px) / 4)',
                  maxWidth: isMobile ? '320px' : 'none',
                  minWidth: isMobile ? '260px' : '280px',
                  scrollSnapAlign: isMobile ? 'start' : 'none',
                }}
              >
                <ListingCard
                  listing={listing}
                  vehicleName={`${make} ${model}`}
                  vehicleYear={listing.year}
                  variant="compact"
                  onClick={() => handleListingClick(listing, vehicleName)}
                  onViewDetails={() => handleListingClick(listing, vehicleName)}
                />
              </div>
            );
          })}
        </div>
        {isMobile && allListings.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', marginTop: '12px', padding: '0 16px', color: 'var(--color-neutrals-4, #6E7481)', fontFamily: "'Geist', sans-serif", fontSize: '12px' }}>
            <Icon name="swipe" size={16} />
            <span>Swipe for more</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleLeadsStripe;
