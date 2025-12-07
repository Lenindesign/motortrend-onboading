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
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [hoveredNav, setHoveredNav] = useState<'prev' | 'next' | null>(null);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [hoveredSaveBtn, setHoveredSaveBtn] = useState<number | null>(null);
  const [savedListings, setSavedListings] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Load saved listings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedListings');
    if (saved) {
      setSavedListings(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save listing toggle handler
  const handleSaveListing = (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation(); // Prevent card click
    setSavedListings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(listingId)) {
        newSet.delete(listingId);
      } else {
        newSet.add(listingId);
      }
      localStorage.setItem('savedListings', JSON.stringify([...newSet]));
      return newSet;
    });
  };
  
  const itemsPerSlide = 4;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const onboardingDataStr = localStorage.getItem('onboardingData');
        if (!onboardingDataStr) { setIsLoading(false); return; }
        const onboardingData: OnboardingData = JSON.parse(onboardingDataStr);
        const vehicles = onboardingData.vehicles || [];
        if (vehicles.length === 0) { setIsLoading(false); return; }
        const relevantVehicles = vehicles.filter(v => v.ownership === 'own' || v.ownership === 'want' || v.ownership === 'previously_owned');
        if (relevantVehicles.length === 0) { setIsLoading(false); return; }
        const zipCode = onboardingData.zipCode || '90001';
        const leadsPromises = relevantVehicles.map(async (vehicle) => {
          try {
            const { year, make, model } = parseVehicleName(vehicle.name);
            const { vehicleImageFor } = await import('../../utils/vehicleImages');
            const vehicleImage = vehicleImageFor(vehicle.name);
            const listings = await getLocalListings(year, make, model, vehicleImage, zipCode);
            return { vehicleName: vehicle.name, ownership: vehicle.ownership, listings: listings.slice(0, 3), isLoading: false };
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
      }
    };
    loadLeads();
  }, []);

  const handleListingClick = (_listing: LocalListing, vehicleName: string) => {
    try {
      const { year, make, model } = parseVehicleName(vehicleName);
      navigate(`/vehicles/${year}/${make}/${model}`);
    } catch (error) {
      console.error('Error navigating to vehicle:', error);
    }
  };

  const formatPrice = (price: number): string => `$${price.toLocaleString()}`;
  const formatMileage = (mileage: number): string => mileage === 0 ? 'New' : `${mileage.toLocaleString()} mi`;

  // Styles
  const stripeStyle: React.CSSProperties = { width: '100%', marginBottom: 'var(--spacing-6, 48px)', padding: isMobile ? '0 16px 16px 16px' : '0 0 16px 0' };
  const headerStyle: React.CSSProperties = { marginBottom: isMobile ? 'var(--spacing-3, 16px)' : 'var(--spacing-4, 24px)', padding: 0 };
  const titleStyle: React.CSSProperties = { fontFamily: "'Poppins', sans-serif", fontSize: isMobile ? '24px' : '28px', fontWeight: 700, lineHeight: 1.2, color: 'var(--color-neutrals-1, #141416)', margin: '0 0 8px 0' };
  const subtitleStyle: React.CSSProperties = { fontFamily: "'Geist', sans-serif", fontSize: '14px', color: 'var(--color-neutrals-4, #6E7481)', margin: 0 };
  const loadingStyle: React.CSSProperties = { padding: '40px var(--spacing-4, 24px)', textAlign: 'center', color: 'var(--color-neutrals-4, #6E7481)', fontFamily: "'Geist', sans-serif", fontSize: '14px' };
  const containerStyle: React.CSSProperties = { position: 'relative', width: '100%', overflow: 'hidden' };
  const scrollStyle: React.CSSProperties = { display: 'flex', gap: isMobile ? 'var(--spacing-2, 12px)' : 'var(--spacing-3, 16px)', padding: 0, transition: 'transform 0.5s ease-in-out', willChange: 'transform' };

  const getItemStyle = (index: number): React.CSSProperties => {
    const isHovered = hoveredItem === index;
    return { flexShrink: 0, width: isMobile ? '280px' : 'calc((100% - 48px) / 4)', minWidth: '280px', background: 'var(--color-white, #FFFFFF)', border: `1px solid ${isHovered ? 'var(--color-neutrals-5, #B1B5C3)' : 'var(--color-neutrals-6, #E6E8EC)'}`, borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', transform: isHovered ? 'translateY(-2px)' : 'none', boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none' };
  };

  const imageContainerStyle: React.CSSProperties = { position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--color-neutrals-1, #141416)' };
  const getImageStyle = (index: number): React.CSSProperties => ({ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease', transform: hoveredItem === index ? 'scale(1.05)' : 'none' });
  const getBadgeStyle = (isNew: boolean): React.CSSProperties => ({ position: 'absolute', top: '12px', right: '12px', background: isNew ? 'var(--color-blue, #186CEA)' : 'var(--color-primary-1, #E90C17)', color: 'var(--color-white, #FFFFFF)', padding: '4px 8px', borderRadius: '4px', fontFamily: "'Geist', sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', zIndex: 2 });
  const getSaveBtnStyle = (index: number, isSaved: boolean): React.CSSProperties => {
    const isHovered = hoveredSaveBtn === index;
    return {
      position: 'absolute',
      top: 'var(--spacing-component-md, 12px)',
      left: 'var(--spacing-component-md, 12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      padding: '6px',
      background: isHovered 
        ? (isSaved ? 'var(--color-overlay-dark, rgba(0,0,0,0.7))' : 'var(--color-overlay-medium, rgba(0,0,0,0.6))')
        : (isSaved ? 'var(--color-overlay-medium, rgba(0,0,0,0.5))' : 'var(--color-overlay-light, rgba(0,0,0,0.4))'),
      border: 'none',
      borderRadius: 'var(--border-radius-sm, 4px)',
      color: 'var(--color-white, #FFFFFF)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast, 150ms ease-in-out)',
      backdropFilter: 'blur(4px)',
      zIndex: 10,
      transform: isHovered ? 'scale(1.05)' : 'scale(1)'
    };
  };
  const contentStyle: React.CSSProperties = { padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 };
  const vehicleNameStyle: React.CSSProperties = { fontFamily: "'Poppins', sans-serif", fontSize: '16px', fontWeight: 600, color: 'var(--color-neutrals-1, #141416)', margin: 0, lineHeight: 1.3 };
  const trimStyle: React.CSSProperties = { fontFamily: "'Geist', sans-serif", color: 'var(--color-neutrals-4, #6E7481)', fontWeight: 400 };
  const priceStyle: React.CSSProperties = { fontFamily: "'Geist', sans-serif", fontSize: '20px', fontWeight: 700, color: 'var(--color-neutrals-1, #141416)' };
  const detailsStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };
  const detailStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Geist', sans-serif", fontSize: '13px', color: 'var(--color-neutrals-4, #6E7481)' };
  const dealerStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Geist', sans-serif", fontSize: '12px', color: 'var(--color-neutrals-4, #6E7481)', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #E5E5E5' };

  const getNavStyle = (isPrev: boolean): React.CSSProperties => {
    const isHovered = hoveredNav === (isPrev ? 'prev' : 'next');
    return { position: 'absolute', top: '50%', transform: isHovered ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)', width: isMobile ? '40px' : '48px', height: isMobile ? '40px' : '48px', borderRadius: '50%', backgroundColor: isHovered ? 'rgba(30, 30, 32, 0.5)' : 'rgba(20, 20, 22, 0.3)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--color-white, #FFFFFF)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, transition: 'all 0.3s ease', boxShadow: isHovered ? '0 12px 40px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.4)', opacity: isContainerHovered ? 1 : 0, pointerEvents: isContainerHovered ? 'auto' : 'none', left: isPrev ? (isMobile ? '8px' : '16px') : 'auto', right: isPrev ? 'auto' : (isMobile ? '8px' : '16px') };
  };

  const dotsStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px', padding: 0 };
  const getDotStyle = (index: number, isActive: boolean): React.CSSProperties => {
    const isHovered = hoveredDot === index;
    return { width: isActive ? '24px' : '8px', height: '8px', borderRadius: isActive ? '4px' : '50%', border: 'none', backgroundColor: isActive ? 'var(--color-primary-1, #E90C17)' : (isHovered ? 'var(--color-neutrals-4, #6E7481)' : 'var(--color-neutrals-5, #B1B5C3)'), cursor: 'pointer', transition: 'all 0.3s ease', padding: 0, transform: isHovered && !isActive ? 'scale(1.2)' : 'none' };
  };

  if (isLoading) {
    return (
      <div className={className} style={stripeStyle}>
        <div style={headerStyle}><h2 style={titleStyle}>Available Listings</h2></div>
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
  const currentSlideItems = allListings.slice(startIndex, endIndex);

  const handlePrev = () => setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  const handleNext = () => setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));

  return (
    <div className={className} style={stripeStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Available Listings</h2>
        <p style={subtitleStyle}>Based on vehicles you own or want</p>
      </div>
      <div style={containerStyle} ref={carouselRef} onMouseEnter={() => setIsContainerHovered(true)} onMouseLeave={() => setIsContainerHovered(false)}>
        {totalSlides > 1 && (
          <>
            <button style={getNavStyle(true)} onClick={handlePrev} onMouseEnter={() => setHoveredNav('prev')} onMouseLeave={() => setHoveredNav(null)} aria-label="Previous slide"><Icon name="chevron_left" size={32} /></button>
            <button style={getNavStyle(false)} onClick={handleNext} onMouseEnter={() => setHoveredNav('next')} onMouseLeave={() => setHoveredNav(null)} aria-label="Next slide"><Icon name="chevron_right" size={32} /></button>
          </>
        )}
        <div style={scrollStyle}>
          {currentSlideItems.map((item, index) => {
            const { listing, vehicleName } = item;
            const parts = vehicleName.split(' ');
            const make = parts[1] || '';
            const model = parts.slice(2).join(' ') || '';
            return (
              <div key={`${listing.id}-${index}`} style={getItemStyle(index)} onClick={() => handleListingClick(listing, vehicleName)} onMouseEnter={() => setHoveredItem(index)} onMouseLeave={() => setHoveredItem(null)}>
                <div style={imageContainerStyle}>
                  <img src={listing.imageUrl} alt={`${listing.year} ${make} ${model}`} style={getImageStyle(index)} />
                  <button
                    style={getSaveBtnStyle(index, savedListings.has(listing.id))}
                    onClick={(e) => handleSaveListing(e, listing.id)}
                    onMouseEnter={() => setHoveredSaveBtn(index)}
                    onMouseLeave={() => setHoveredSaveBtn(null)}
                    aria-label={savedListings.has(listing.id) ? 'Remove from saved' : 'Save listing'}
                  >
                    <Icon 
                      name={savedListings.has(listing.id) ? 'bookmark' : 'bookmark_border'} 
                      variant={savedListings.has(listing.id) ? 'filled' : 'outlined'}
                      size={20} 
                      style={{ color: 'var(--color-white, #FFFFFF)' }} 
                    />
                  </button>
                  {listing.condition === 'Certified Pre-Owned' && <span style={getBadgeStyle(false)}>CPO</span>}
                  {listing.condition === 'New' && <span style={getBadgeStyle(true)}>NEW</span>}
                </div>
                <div style={contentStyle}>
                  <h3 style={vehicleNameStyle}>{listing.year} {make} {model}{listing.trim && <span style={trimStyle}> {listing.trim}</span>}</h3>
                  <div style={priceStyle}>{formatPrice(listing.price)}</div>
                  <div style={detailsStyle}>
                    <div style={detailStyle}><Icon name="speed" size={16} /><span>{formatMileage(listing.mileage)}</span></div>
                    <div style={detailStyle}><Icon name="location_on" size={16} /><span>{listing.location} • {listing.distance} mi</span></div>
                  </div>
                  <div style={dealerStyle}><Icon name="store" size={16} /><span>{listing.dealerName}</span></div>
                </div>
              </div>
            );
          })}
        </div>
        {totalSlides > 1 && (
          <div style={dotsStyle}>
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button key={index} style={getDotStyle(index, index === currentSlide)} onClick={() => setCurrentSlide(index)} onMouseEnter={() => setHoveredDot(index)} onMouseLeave={() => setHoveredDot(null)} aria-label={`Go to slide ${index + 1}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleLeadsStripe;
