/**
 * Vehicle Leads Stripe Component
 * Displays a horizontal scrolling stripe of vehicle listings (leads)
 * Based on vehicles the user owns or wants from onboarding data
 * Uses Marketcheck API for real listings
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocalListings } from '../../utils/localListings';
import { parseVehicleName } from '../../utils/vehicleImages';
import type { OnboardingData } from '../../types/user';
import type { LocalListing } from '../LocalListingsSidebar/LocalListingsSidebar';
import Icon from '../Icon';
import './VehicleLeadsStripe.css';

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
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Items per slide based on screen size
  const itemsPerSlide = 4; // Show 4 items per slide on desktop

  useEffect(() => {
    const loadLeads = async () => {
      try {
        // Get onboarding data
        const onboardingDataStr = localStorage.getItem('onboardingData');
        if (!onboardingDataStr) {
          setIsLoading(false);
          return;
        }

        const onboardingData: OnboardingData = JSON.parse(onboardingDataStr);
        const vehicles = onboardingData.vehicles || [];

        if (vehicles.length === 0) {
          setIsLoading(false);
          return;
        }

        // Filter to only owned or wanted vehicles
        const relevantVehicles = vehicles.filter(v => 
          v.ownership === 'own' || v.ownership === 'want' || v.ownership === 'previously_owned'
        );

        if (relevantVehicles.length === 0) {
          setIsLoading(false);
          return;
        }

        // Get user's ZIP code from onboarding data
        const zipCode = onboardingData.zipCode || '90001'; // Default to LA

        // Fetch listings for each vehicle
        const leadsPromises = relevantVehicles.map(async (vehicle) => {
          try {
            const { year, make, model } = parseVehicleName(vehicle.name);
            
            // Get vehicle image for fallback
            const { vehicleImageFor } = await import('../../utils/vehicleImages');
            const vehicleImage = vehicleImageFor(vehicle.name);
            
            // Get listings from Marketcheck API (with fallback to mock)
            const listings = await getLocalListings(
              year,
              make,
              model,
              vehicleImage,
              zipCode
            );

            return {
              vehicleName: vehicle.name,
              ownership: vehicle.ownership,
              listings: listings.slice(0, 3), // Limit to 3 listings per vehicle
              isLoading: false
            };
          } catch (error) {
            console.error(`Error fetching listings for ${vehicle.name}:`, error);
            return {
              vehicleName: vehicle.name,
              ownership: vehicle.ownership,
              listings: [],
              isLoading: false
            };
          }
        });

        const leadsData = await Promise.all(leadsPromises);
        
        // Filter out vehicles with no listings
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
    // Navigate to vehicle details or listing page
    try {
      const { year, make, model } = parseVehicleName(vehicleName);
      navigate(`/vehicles/${year}/${make}/${model}`);
    } catch (error) {
      console.error('Error navigating to vehicle:', error);
    }
  };

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`;
  };

  const formatMileage = (mileage: number): string => {
    if (mileage === 0) return 'New';
    return `${mileage.toLocaleString()} mi`;
  };

  if (isLoading) {
    return (
      <div className={`vehicle-leads-stripe ${className || ''}`}>
        <div className="vehicle-leads-stripe__header">
          <h2 className="vehicle-leads-stripe__title">Available Listings</h2>
        </div>
        <div className="vehicle-leads-stripe__loading">
          <p>Loading listings...</p>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return null; // Don't show if no leads
  }

  // Flatten all listings into a single array with vehicle context
  const allListings = leads.flatMap(lead => 
    lead.listings.map(listing => ({
      listing,
      vehicleName: lead.vehicleName,
      ownership: lead.ownership
    }))
  );

  if (allListings.length === 0) {
    return null;
  }

  // Calculate total slides
  const totalSlides = Math.ceil(allListings.length / itemsPerSlide);
  
  // Get current slide items
  const startIndex = currentSlide * itemsPerSlide;
  const endIndex = startIndex + itemsPerSlide;
  const currentSlideItems = allListings.slice(startIndex, endIndex);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`vehicle-leads-stripe ${className || ''}`}>
      <div className="vehicle-leads-stripe__header">
        <h2 className="vehicle-leads-stripe__title">Available Listings</h2>
        <p className="vehicle-leads-stripe__subtitle">
          Based on vehicles you own or want
        </p>
      </div>
      <div 
        className="vehicle-leads-stripe__container"
        ref={carouselRef}
      >
        {/* Navigation Arrows */}
        {totalSlides > 1 && (
          <>
            <button
              className="vehicle-leads-stripe__nav vehicle-leads-stripe__nav--prev"
              onClick={handlePrev}
              aria-label="Previous slide"
            >
              <Icon name="chevron_left" size={32} />
            </button>
            <button
              className="vehicle-leads-stripe__nav vehicle-leads-stripe__nav--next"
              onClick={handleNext}
              aria-label="Next slide"
            >
              <Icon name="chevron_right" size={32} />
            </button>
          </>
        )}

        <div className="vehicle-leads-stripe__scroll">
          {currentSlideItems.map((item, index) => {
            const { listing, vehicleName } = item;
            // Extract make and model from vehicle name
            const parts = vehicleName.split(' ');
            const make = parts[1] || '';
            const model = parts.slice(2).join(' ') || '';
            
            return (
              <div 
                key={`${listing.id}-${index}`} 
                className="vehicle-leads-stripe__item"
                onClick={() => handleListingClick(listing, vehicleName)}
              >
                <div className="vehicle-leads-stripe__image-container">
                  <img 
                    src={listing.imageUrl} 
                    alt={`${listing.year} ${make} ${model}`}
                    className="vehicle-leads-stripe__image"
                  />
                  {listing.condition === 'Certified Pre-Owned' && (
                    <span className="vehicle-leads-stripe__badge">CPO</span>
                  )}
                  {listing.condition === 'New' && (
                    <span className="vehicle-leads-stripe__badge vehicle-leads-stripe__badge--new">NEW</span>
                  )}
                </div>
                <div className="vehicle-leads-stripe__content">
                  <h3 className="vehicle-leads-stripe__vehicle-name">
                    {listing.year} {make} {model}
                    {listing.trim && <span className="vehicle-leads-stripe__trim"> {listing.trim}</span>}
                  </h3>
                  <div className="vehicle-leads-stripe__price">
                    {formatPrice(listing.price)}
                  </div>
                  <div className="vehicle-leads-stripe__details">
                    <div className="vehicle-leads-stripe__detail">
                      <Icon name="speed" size={16} />
                      <span>{formatMileage(listing.mileage)}</span>
                    </div>
                    <div className="vehicle-leads-stripe__detail">
                      <Icon name="location_on" size={16} />
                      <span>{listing.location} • {listing.distance} mi</span>
                    </div>
                  </div>
                  <div className="vehicle-leads-stripe__dealer">
                    <Icon name="store" size={16} />
                    <span>{listing.dealerName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots Indicator */}
        {totalSlides > 1 && (
          <div className="vehicle-leads-stripe__dots">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`vehicle-leads-stripe__dot ${
                  index === currentSlide ? 'vehicle-leads-stripe__dot--active' : ''
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleLeadsStripe;

