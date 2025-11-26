/**
 * Top Ten Management Page
 * Displays all Top Ten categories and their vehicle rankings for management
 */

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getVehicles } from '../../api/vehiclesApi';
import { getVehicleBodyStyle } from '../../utils/vehicleBodyStyles';
import type { VehicleType, Subcategory } from '../../components/TopTenCarousel/TopTenCarousel';
import './TopTenManagement.css';

// Helper function to get subcategories for a vehicle type (same as in TopTenCarousel)
const getSubcategoriesForType = (type: VehicleType): Subcategory[] => {
  // Performance is a standalone category with no subcategories
  if (type === 'Performance') {
    return ['All'];
  }
  
  const commonSubcategories: Subcategory[] = ['All', 'Subcompact', 'Compact', 'Midsize', 'Full-Size', 'Luxury', 'Electric'];
  
  switch (type) {
    case 'SUV':
      return commonSubcategories;
    case 'Sedan':
      return ['All', 'Compact', 'Midsize', 'Full-Size', 'Electric'];
    case 'Truck':
      return ['All', 'Midsize', 'Full-Size', 'Electric'];
    case 'Coupe':
      return ['All', 'Compact', 'Midsize', 'Electric'];
    default:
      return ['All'];
  }
};

// Helper function to categorize vehicles (same as in TopTenCarousel)
const getVehicleSubcategory = (vehicleName: string, vehicleType: VehicleType): Subcategory => {
  const name = vehicleName.toLowerCase();
  
  // Electric vehicles (highest priority)
  const electricModels = ['electric', 'ev', 'e-tron', 'taycan', 'model 3', 'model s', 'model x', 'model y', 'i4', 'i8', 'eq', 'ioniq', 'leaf', 'bolt', 'id.4', 'mach-e', 'lightning', 'rivian', 'lucid', 'polestar', 'ariya', 'bz4x'];
  if (electricModels.some(model => name.includes(model))) return 'Electric';

  // SUV subcategories
  if (vehicleType === 'SUV') {
    const subcompactSUVs = ['venue', 'trailblazer', 'kicks', 'soul', 'encore', 'encore gx', 'trax', 'seltos', 'crosstrek', 'kona', 'hr-v'];
    const compactSUVs = ['cr-v', 'rav4', 'rogue', 'equinox', 'escape', 'tucson', 'sportage', 'cx-5', 'forester', 'cherokee', 'compass', 'q3', 'x1', 'x3', 'glb', 'qx50'];
    const midsizeSUVs = ['pilot', 'highlander', 'pathfinder', 'traverse', 'explorer', 'santa fe', 'sorento', 'cx-9', 'ascent', 'grand cherokee', 'passport', 'q5', 'x5', 'gle', 'qx60', 'cx-90'];
    const fullSizeSUVs = ['expedition', 'tahoe', 'suburban', 'yukon', 'armada', 'sequoia', 'durango', 'telluride', 'palisade', 'atlas', 'qx80', 'escalade', 'navigator'];
    const luxurySUVs = ['q7', 'q8', 'x7', 'gls', 'gx', 'lx', 'escalade', 'navigator', 'range rover', 'defender', 'discovery', 'velar', 'evoque', 'cayenne', 'macan', 'model x', 'model y'];
    
    if (subcompactSUVs.some(model => name.includes(model))) return 'Subcompact';
    if (compactSUVs.some(model => name.includes(model))) return 'Compact';
    if (midsizeSUVs.some(model => name.includes(model))) return 'Midsize';
    if (fullSizeSUVs.some(model => name.includes(model))) return 'Full-Size';
    if (luxurySUVs.some(model => name.includes(model))) return 'Luxury';
  }

  // Sedan subcategories
  if (vehicleType === 'Sedan') {
    const compactSedans = ['civic', 'corolla', 'sentra', 'elantra', 'forte', 'mazda3', 'impreza', 'jetta', 'a3', '2 series'];
    const midsizeSedans = ['accord', 'camry', 'altima', 'sonata', 'optima', 'mazda6', 'legacy', 'passat', 'a4', '3 series', 'c-class', 'is', 'tlx', 'q50', 'g70', 's60', 'ct4', 'xe'];
    const fullSizeSedans = ['avalon', 'maxima', 'charger', '300', 'impala', 'a6', '5 series', 'e-class', 'ct5', 'ct6', 'continental', 's90', 'gs', 'ls', 'q70', 'panamera', 'taycan', 'model s', 'a8', '7 series', 's-class', 'g80', 'xf'];
    
    if (compactSedans.some(model => name.includes(model))) return 'Compact';
    if (midsizeSedans.some(model => name.includes(model))) return 'Midsize';
    if (fullSizeSedans.some(model => name.includes(model))) return 'Full-Size';
  }

  // Truck subcategories
  if (vehicleType === 'Truck') {
    const midsizeTrucks = ['ranger', 'colorado', 'canyon', 'frontier', 'tacoma', 'gladiator', 'maverick'];
    const fullSizeTrucks = ['f-150', 'silverado', 'ram', 'sierra', 'tundra', 'titan', 'ridgeline'];
    const luxuryTrucks = ['f-150 raptor', 'trx', 'ram 1500', 'silverado high country'];
    
    if (midsizeTrucks.some(model => name.includes(model))) return 'Midsize';
    if (fullSizeTrucks.some(model => name.includes(model))) return 'Full-Size';
    if (luxuryTrucks.some(model => name.includes(model))) return 'Luxury';
  }

  // Coupe subcategories
  if (vehicleType === 'Coupe') {
    const compactCoupes = ['brz', '86', 'miata', 'z'];
    const midsizeCoupes = ['mustang', 'camaro', 'challenger', 'supra'];
    
    if (compactCoupes.some(model => name.includes(model))) return 'Compact';
    if (midsizeCoupes.some(model => name.includes(model))) return 'Midsize';
  }

  return 'All';
};

interface VehicleRanking {
  name: string;
  year: string;
  make: string;
  model: string;
  image: string;
  staffRating: number;
  communityRating: number;
  priceMin: number;
  priceMax: number;
  rank: number;
}

export const TopTenManagement: React.FC = () => {
  const vehicleTypes: VehicleType[] = ['SUV', 'Sedan', 'Truck', 'Coupe', 'Performance'];
  const [ratingType, setRatingType] = React.useState<'MotorTrend' | 'User Reviews'>('MotorTrend');
  const [activeTab, setActiveTab] = React.useState<'rankings' | 'all-vehicles' | 'bento'>('rankings');
  
  // Filter state for All Vehicles tab
  const [filters, setFilters] = React.useState({
    year: '',
    make: '',
    model: '',
    bodyStyle: '',
    staffRatingMin: '',
    staffRatingMax: '',
    communityRatingMin: '',
    communityRatingMax: '',
    priceMin: '',
    priceMax: ''
  });

  // Get all vehicles and calculate rankings for each category
  const categoryRankings = useMemo(() => {
    const apiVehicles = getVehicles();
    
    // Map vehicles to include all necessary data
    const allVehicleItems = apiVehicles.map(v => ({
      name: `${v.year} ${v.make} ${v.model}`,
      image: v.image,
      galleryImages: v.galleryImages,
      bodyStyle: v.bodyStyle,
      staffRating: v.staffRating ?? 0,
      communityRating: v.communityRating ?? 0,
      year: v.year,
      make: v.make,
      model: v.model,
      priceMin: v.priceMin ?? 0,
      priceMax: v.priceMax ?? 0
    }));

    const rankings: Record<string, VehicleRanking[]> = {};

    vehicleTypes.forEach(vehicleType => {
      const subcategories = getSubcategoriesForType(vehicleType);
      
      subcategories.forEach(subcategory => {
        const key = `${vehicleType}-${subcategory}`;
        
        let filteredVehicles = allVehicleItems;
        
        // Performance is a standalone category - filter by price only (all body styles)
        if (vehicleType === 'Performance') {
          filteredVehicles = allVehicleItems.filter(vehicle => {
            return vehicle.priceMin > 150000;
          });
        } else {
          // Filter by vehicle type for regular categories
          filteredVehicles = allVehicleItems.filter(vehicle => {
            if (vehicle.bodyStyle) {
              return vehicle.bodyStyle === vehicleType;
            }
            const bodyStyles = getVehicleBodyStyle(vehicle.name);
            return bodyStyles.includes(vehicleType);
          });

          // Exclude vehicles with priceMin > 150000 from regular categories (including "All")
          filteredVehicles = filteredVehicles.filter(vehicle => {
            return vehicle.priceMin <= 150000;
          });
          
          // Filter by subcategory if not 'All'
          if (subcategory !== 'All') {
            filteredVehicles = filteredVehicles.filter(vehicle => {
              return getVehicleSubcategory(vehicle.name, vehicleType) === subcategory;
            });
          }
        }

        // Map vehicles with ratings and price data
        const vehiclesWithRatings = filteredVehicles.map(vehicle => {
          const currentYear = new Date().getFullYear();
          const vehicleYear = parseInt(vehicle.year) || currentYear;
          
          return {
            name: vehicle.name,
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            image: vehicle.image,
            staffRating: vehicle.staffRating,
            communityRating: vehicle.communityRating,
            priceMin: vehicle.priceMin,
            priceMax: vehicle.priceMax,
            vehicleYear
          };
        });

        // Remove duplicates by make/model (keep latest year, preserve image)
        const uniqueVehicles = new Map<string, typeof vehiclesWithRatings[0]>();
        vehiclesWithRatings.forEach(vehicle => {
          const key = `${vehicle.make}-${vehicle.model}`.toLowerCase();
          const existing = uniqueVehicles.get(key);
          if (!existing) {
            uniqueVehicles.set(key, vehicle);
          } else if (vehicle.vehicleYear > existing.vehicleYear) {
            // Newer year - replace entirely
            uniqueVehicles.set(key, vehicle);
          } else if (vehicle.vehicleYear === existing.vehicleYear && vehicle.image && !existing.image) {
            // Same year, but new one has image and existing doesn't - update image
            existing.image = vehicle.image;
          }
        });

        // Sort by selected rating type (descending), then by year (descending) when ratings are equal
        const sortedVehicles = Array.from(uniqueVehicles.values()).sort((a, b) => {
          // Primary sort: Use selected rating type (MotorTrend staffRating or User Reviews communityRating)
          const aRating = ratingType === 'MotorTrend' ? a.staffRating : a.communityRating;
          const bRating = ratingType === 'MotorTrend' ? b.staffRating : b.communityRating;
          
          if (Math.abs(aRating - bRating) > 0.01) {
            return bRating - aRating;
          }
          // Secondary sort: Year (newer first) when ratings are equal
          return b.vehicleYear - a.vehicleYear;
        });

        // Take top 10 and assign ranks
        const topTen = sortedVehicles.slice(0, 10).map((vehicle, index) => ({
          ...vehicle,
          rank: index + 1
        }));

        rankings[key] = topTen;
      });
    });

    return rankings;
  }, [ratingType]);

  // Get all vehicles from database (unfiltered)
  const allVehiclesUnfiltered = useMemo(() => {
    const apiVehicles = getVehicles();
    return apiVehicles.map(v => ({
      name: `${v.year} ${v.make} ${v.model}`,
      image: v.image,
      year: v.year,
      make: v.make,
      model: v.model,
      bodyStyle: v.bodyStyle || 'Unknown',
      staffRating: v.staffRating ?? 0,
      communityRating: v.communityRating ?? 0,
      priceMin: v.priceMin ?? 0,
      priceMax: v.priceMax ?? 0,
      slug: v.slug || `${v.year}/${v.make}/${v.model.replace(/\s+/g, '-')}`
    }));
  }, []);

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const years = Array.from(new Set(allVehiclesUnfiltered.map(v => v.year))).sort((a, b) => parseInt(b) - parseInt(a));
    const makes = Array.from(new Set(allVehiclesUnfiltered.map(v => v.make))).sort();
    const bodyStyles = Array.from(new Set(allVehiclesUnfiltered.map(v => v.bodyStyle))).sort();
    return { years, makes, bodyStyles };
  }, [allVehiclesUnfiltered]);

  // Filter and sort vehicles
  const allVehicles = useMemo(() => {
    let filtered = allVehiclesUnfiltered.filter(vehicle => {
      if (filters.year && vehicle.year !== filters.year) return false;
      if (filters.make && vehicle.make !== filters.make) return false;
      if (filters.model && !vehicle.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
      if (filters.bodyStyle && vehicle.bodyStyle !== filters.bodyStyle) return false;
      
      if (filters.staffRatingMin && vehicle.staffRating < parseFloat(filters.staffRatingMin)) return false;
      if (filters.staffRatingMax && vehicle.staffRating > parseFloat(filters.staffRatingMax)) return false;
      
      if (filters.communityRatingMin && vehicle.communityRating < parseFloat(filters.communityRatingMin)) return false;
      if (filters.communityRatingMax && vehicle.communityRating > parseFloat(filters.communityRatingMax)) return false;
      
      if (filters.priceMin && vehicle.priceMin < parseFloat(filters.priceMin)) return false;
      if (filters.priceMax && vehicle.priceMax > parseFloat(filters.priceMax)) return false;
      
      return true;
    });

    return filtered.sort((a, b) => {
      // Sort by year (newest first), then make, then model
      const yearDiff = parseInt(b.year) - parseInt(a.year);
      if (yearDiff !== 0) return yearDiff;
      const makeDiff = a.make.localeCompare(b.make);
      if (makeDiff !== 0) return makeDiff;
      return a.model.localeCompare(b.model);
    });
  }, [allVehiclesUnfiltered, filters]);

  // Get vehicles grouped by subcategory for bento view
  const bentoVehicles = useMemo(() => {
    const apiVehicles = getVehicles();
    const allVehicleItems = apiVehicles.map(v => ({
      name: `${v.year} ${v.make} ${v.model}`,
      image: v.image,
      galleryImages: v.galleryImages,
      bodyStyle: v.bodyStyle,
      staffRating: v.staffRating ?? 0,
      communityRating: v.communityRating ?? 0,
      year: v.year,
      make: v.make,
      model: v.model,
      priceMin: v.priceMin ?? 0,
      priceMax: v.priceMax ?? 0,
      slug: v.slug || `${v.year}/${v.make}/${v.model.replace(/\s+/g, '-')}`
    }));

    const grouped: Record<string, typeof allVehicleItems> = {};

    vehicleTypes.forEach(vehicleType => {
      const subcategories = getSubcategoriesForType(vehicleType);
      
      subcategories.forEach(subcategory => {
        const key = `${vehicleType}-${subcategory}`;
        
        let filteredVehicles = allVehicleItems;
        
        // Performance is a standalone category - filter by price only
        if (vehicleType === 'Performance') {
          filteredVehicles = allVehicleItems.filter(vehicle => {
            return vehicle.priceMin > 150000;
          });
        } else {
          // Filter by vehicle type
          filteredVehicles = allVehicleItems.filter(vehicle => {
            if (vehicle.bodyStyle) {
              return vehicle.bodyStyle === vehicleType;
            }
            const bodyStyles = getVehicleBodyStyle(vehicle.name);
            return bodyStyles.includes(vehicleType);
          });

          // Exclude vehicles with priceMin > 150000 from regular categories
          filteredVehicles = filteredVehicles.filter(vehicle => {
            return vehicle.priceMin <= 150000;
          });
          
          // Filter by subcategory if not 'All'
          if (subcategory !== 'All') {
            filteredVehicles = filteredVehicles.filter(vehicle => {
              return getVehicleSubcategory(vehicle.name, vehicleType) === subcategory;
            });
          }
        }

        // Map vehicles with ratings
        const vehiclesWithRatings = filteredVehicles.map(vehicle => {
          const currentYear = new Date().getFullYear();
          const vehicleYear = parseInt(vehicle.year) || currentYear;
          
          return {
            ...vehicle,
            vehicleYear
          };
        });

        // Remove duplicates by make/model (keep latest year)
        const uniqueVehicles = new Map<string, typeof vehiclesWithRatings[0]>();
        vehiclesWithRatings.forEach(vehicle => {
          const uniqueKey = `${vehicle.make}-${vehicle.model}`.toLowerCase();
          const existing = uniqueVehicles.get(uniqueKey);
          if (!existing || vehicle.vehicleYear > existing.vehicleYear) {
            uniqueVehicles.set(uniqueKey, vehicle);
          }
        });

        // Sort by selected rating type, then by year
        const sortedVehicles = Array.from(uniqueVehicles.values()).sort((a, b) => {
          const aRating = ratingType === 'MotorTrend' ? a.staffRating : a.communityRating;
          const bRating = ratingType === 'MotorTrend' ? b.staffRating : b.communityRating;
          
          if (Math.abs(aRating - bRating) > 0.01) {
            return bRating - aRating;
          }
          return b.vehicleYear - a.vehicleYear;
        });

        // Take top 10
        const topVehicles = sortedVehicles.slice(0, 10);
        
        if (topVehicles.length > 0) {
          grouped[key] = topVehicles;
        }
      });
    });

    return grouped;
  }, [ratingType]);

  return (
    <div className="top-ten-management">
      <div className="top-ten-management__container">
        <header className="top-ten-management__header">
          <h1 className="top-ten-management__title">Top Ten Carousel Management</h1>
          <p className="top-ten-management__description">
            Complete audit of all Top Ten categories and their vehicle rankings. 
            Rankings are calculated based on the selected rating type, 
            with newer vehicles prioritized when ratings are equal.
          </p>
          {(activeTab === 'rankings' || activeTab === 'bento') && (
            <div className="top-ten-management__rating-type-selector">
              <label htmlFor="rating-type-select" className="top-ten-management__rating-type-label">
                Ranking by:
              </label>
              <select 
                id="rating-type-select"
                className="top-ten-management__rating-type-select"
                value={ratingType}
                onChange={(e) => setRatingType(e.target.value as 'MotorTrend' | 'User Reviews')}
              >
                <option value="MotorTrend">MotorTrend Staff Rating</option>
                <option value="User Reviews">User Reviews Rating</option>
              </select>
            </div>
          )}
        </header>

        {/* Tab Navigation */}
        <div className="top-ten-management__tabs">
          <button
            className={`top-ten-management__tab ${activeTab === 'rankings' ? 'top-ten-management__tab--active' : ''}`}
            onClick={() => setActiveTab('rankings')}
          >
            Top Ten Rankings
          </button>
          <button
            className={`top-ten-management__tab ${activeTab === 'all-vehicles' ? 'top-ten-management__tab--active' : ''}`}
            onClick={() => setActiveTab('all-vehicles')}
          >
            All Vehicles ({allVehicles.length}{allVehicles.length !== allVehiclesUnfiltered.length ? ` / ${allVehiclesUnfiltered.length}` : ''})
          </button>
          <button
            className={`top-ten-management__tab ${activeTab === 'bento' ? 'top-ten-management__tab--active' : ''}`}
            onClick={() => setActiveTab('bento')}
          >
            Bento View
          </button>
        </div>

        <div className="top-ten-management__content">
          {activeTab === 'all-vehicles' ? (
            /* All Vehicles Tab */
            <section className="top-ten-management__section">
              <h2 className="top-ten-management__section-title">
                All Vehicles in Database
                <span className="top-ten-management__vehicle-count">
                  ({allVehicles.length} vehicles)
                </span>
              </h2>
              
              {/* Filters */}
              <div className="top-ten-management__filters">
                <div className="top-ten-management__filter-row">
                  <div className="top-ten-management__filter-group">
                    <label className="top-ten-management__filter-label">Year</label>
                    <select
                      className="top-ten-management__filter-select"
                      value={filters.year}
                      onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                    >
                      <option value="">All Years</option>
                      {filterOptions.years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="top-ten-management__filter-group">
                    <label className="top-ten-management__filter-label">Make</label>
                    <select
                      className="top-ten-management__filter-select"
                      value={filters.make}
                      onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                    >
                      <option value="">All Makes</option>
                      {filterOptions.makes.map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="top-ten-management__filter-group">
                    <label className="top-ten-management__filter-label">Model</label>
                    <input
                      type="text"
                      className="top-ten-management__filter-input"
                      placeholder="Search model..."
                      value={filters.model}
                      onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                    />
                  </div>
                  
                  <div className="top-ten-management__filter-group">
                    <label className="top-ten-management__filter-label">Body Style</label>
                    <select
                      className="top-ten-management__filter-select"
                      value={filters.bodyStyle}
                      onChange={(e) => setFilters({ ...filters, bodyStyle: e.target.value })}
                    >
                      <option value="">All Body Styles</option>
                      {filterOptions.bodyStyles.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="top-ten-management__filter-row">
                  <div className="top-ten-management__filter-group">
                    <label className="top-ten-management__filter-label">Staff Rating</label>
                    <div className="top-ten-management__filter-range">
                      <input
                        type="number"
                        className="top-ten-management__filter-input"
                        placeholder="Min"
                        min="0"
                        max="10"
                        step="0.1"
                        value={filters.staffRatingMin}
                        onChange={(e) => setFilters({ ...filters, staffRatingMin: e.target.value })}
                      />
                      <span className="top-ten-management__filter-separator">-</span>
                      <input
                        type="number"
                        className="top-ten-management__filter-input"
                        placeholder="Max"
                        min="0"
                        max="10"
                        step="0.1"
                        value={filters.staffRatingMax}
                        onChange={(e) => setFilters({ ...filters, staffRatingMax: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="top-ten-management__filter-group">
                    <label className="top-ten-management__filter-label">Community Rating</label>
                    <div className="top-ten-management__filter-range">
                      <input
                        type="number"
                        className="top-ten-management__filter-input"
                        placeholder="Min"
                        min="0"
                        max="10"
                        step="0.1"
                        value={filters.communityRatingMin}
                        onChange={(e) => setFilters({ ...filters, communityRatingMin: e.target.value })}
                      />
                      <span className="top-ten-management__filter-separator">-</span>
                      <input
                        type="number"
                        className="top-ten-management__filter-input"
                        placeholder="Max"
                        min="0"
                        max="10"
                        step="0.1"
                        value={filters.communityRatingMax}
                        onChange={(e) => setFilters({ ...filters, communityRatingMax: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="top-ten-management__filter-group">
                    <label className="top-ten-management__filter-label">Price</label>
                    <div className="top-ten-management__filter-range">
                      <input
                        type="number"
                        className="top-ten-management__filter-input"
                        placeholder="Min $"
                        min="0"
                        step="1000"
                        value={filters.priceMin}
                        onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                      />
                      <span className="top-ten-management__filter-separator">-</span>
                      <input
                        type="number"
                        className="top-ten-management__filter-input"
                        placeholder="Max $"
                        min="0"
                        step="1000"
                        value={filters.priceMax}
                        onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="top-ten-management__filter-group">
                    <button
                      className="top-ten-management__filter-clear"
                      onClick={() => setFilters({
                        year: '',
                        make: '',
                        model: '',
                        bodyStyle: '',
                        staffRatingMin: '',
                        staffRatingMax: '',
                        communityRatingMin: '',
                        communityRatingMax: '',
                        priceMin: '',
                        priceMax: ''
                      })}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="top-ten-management__table-container">
                <table className="top-ten-management__table">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Year</th>
                      <th>Make</th>
                      <th>Model</th>
                      <th>Body Style</th>
                      <th>Staff Rating</th>
                      <th>Community Rating</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allVehicles.map((vehicle) => (
                      <tr key={`${vehicle.year}-${vehicle.make}-${vehicle.model}`}>
                        <td className="top-ten-management__vehicle-name">
                          <Link 
                            to={`/vehicles/${vehicle.slug}`}
                            className="top-ten-management__vehicle-link"
                          >
                            <div className="top-ten-management__vehicle-name-content">
                              {vehicle.image && (
                                <img 
                                  src={vehicle.image} 
                                  alt={vehicle.name}
                                  className="top-ten-management__vehicle-thumbnail"
                                />
                              )}
                              <span>{vehicle.name}</span>
                            </div>
                          </Link>
                        </td>
                        <td>{vehicle.year}</td>
                        <td>{vehicle.make}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.bodyStyle}</td>
                        <td className="top-ten-management__rating">
                          {vehicle.staffRating > 0 ? `${vehicle.staffRating.toFixed(1)}/10` : 'N/A'}
                        </td>
                        <td className="top-ten-management__rating">
                          {vehicle.communityRating > 0 ? `${vehicle.communityRating.toFixed(1)}/10` : 'N/A'}
                        </td>
                        <td className="top-ten-management__price">
                          {vehicle.priceMin > 0 
                            ? (vehicle.priceMin === vehicle.priceMax 
                                ? `$${vehicle.priceMin.toLocaleString()}`
                                : `$${vehicle.priceMin.toLocaleString()} - $${vehicle.priceMax.toLocaleString()}`)
                            : 'N/A'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : activeTab === 'bento' ? (
            /* Bento View Tab */
            <>
              {vehicleTypes.map(vehicleType => {
                const subcategories = getSubcategoriesForType(vehicleType);
                
                return (
                  <section key={vehicleType} className="top-ten-management__section">
                    <h2 className="top-ten-management__section-title">
                      Top Ten {vehicleType === 'Performance' ? 'Performance' : `${vehicleType}s`}
                    </h2>
                    
                    <div className="top-ten-management__bento-categories">
                      {subcategories.map(subcategory => {
                        const key = `${vehicleType}-${subcategory}`;
                        const vehicles = bentoVehicles[key] || [];
                        const categoryName = subcategory === 'All' 
                          ? `All Categories` 
                          : subcategory;
                        
                        if (vehicles.length === 0) return null;
                        
                        return (
                          <div key={key} className="top-ten-management__bento-category">
                            <h3 className="top-ten-management__bento-category-title">
                              {categoryName}
                            </h3>
                            <div className="top-ten-management__bento-grid">
                              {/* Category Name Card */}
                              <div 
                                className="top-ten-management__bento-category-card"
                                style={{
                                  gridColumn: 'span 2',
                                  gridRow: 'span 1'
                                }}
                              >
                                <h4 className="top-ten-management__bento-category-card-title">
                                  {categoryName}
                                </h4>
                              </div>
                              
                              {vehicles.map((vehicle, index) => {
                                const rating = ratingType === 'MotorTrend' ? vehicle.staffRating : vehicle.communityRating;
                                const vehicleImage = vehicle.image && 
                                  typeof vehicle.image === 'string' && 
                                  vehicle.image.trim() !== '' &&
                                  vehicle.image.startsWith('http')
                                  ? vehicle.image 
                                  : null;
                                
                                // Create varied bento-style layout sizes
                                // Adjust indices since we added category card as first item
                                let gridColumn = 'span 1';
                                let gridRow = 'span 1';
                                
                                // First vehicle card is large (2x2)
                                if (index === 0) {
                                  gridColumn = 'span 2';
                                  gridRow = 'span 2';
                                } 
                                // Second card is wide (2x1)
                                else if (index === 1) {
                                  gridColumn = 'span 2';
                                  gridRow = 'span 1';
                                }
                                // Third card is tall (1x2)
                                else if (index === 2) {
                                  gridColumn = 'span 1';
                                  gridRow = 'span 2';
                                }
                                // Fourth card is medium (2x1)
                                else if (index === 3) {
                                  gridColumn = 'span 2';
                                  gridRow = 'span 1';
                                }
                                // Fifth card is small (1x1)
                                else if (index === 4) {
                                  gridColumn = 'span 1';
                                  gridRow = 'span 1';
                                }
                                // Sixth card is tall (1x2)
                                else if (index === 5) {
                                  gridColumn = 'span 1';
                                  gridRow = 'span 2';
                                }
                                // Seventh card is wide (2x1)
                                else if (index === 6) {
                                  gridColumn = 'span 2';
                                  gridRow = 'span 1';
                                }
                                // Eighth card is small (1x1)
                                else if (index === 7) {
                                  gridColumn = 'span 1';
                                  gridRow = 'span 1';
                                }
                                // Ninth card is small (1x1)
                                else if (index === 8) {
                                  gridColumn = 'span 1';
                                  gridRow = 'span 1';
                                }
                                // Tenth card is wide (2x1)
                                else if (index === 9) {
                                  gridColumn = 'span 2';
                                  gridRow = 'span 1';
                                }
                                
                                return (
                                  <Link
                                    key={`${vehicle.year}-${vehicle.make}-${vehicle.model}-${index}`}
                                    to={`/vehicles/${vehicle.slug}`}
                                    className="top-ten-management__bento-card"
                                    style={{
                                      gridColumn,
                                      gridRow
                                    }}
                                  >
                                    {vehicleImage ? (
                                      <div className="top-ten-management__bento-image-container">
                                        <img 
                                          src={vehicleImage} 
                                          alt={vehicle.name}
                                          className="top-ten-management__bento-image"
                                        />
                                        <div className="top-ten-management__bento-overlay">
                                          <div className="top-ten-management__bento-rank">#{index + 1}</div>
                                          <div className="top-ten-management__bento-rating">
                                            {rating.toFixed(1)}/10
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="top-ten-management__bento-placeholder">
                                        <div className="top-ten-management__bento-rank">#{index + 1}</div>
                                        <div className="top-ten-management__bento-name">{vehicle.name}</div>
                                        <div className="top-ten-management__bento-rating">
                                          {rating.toFixed(1)}/10
                                        </div>
                                      </div>
                                    )}
                                    <div className="top-ten-management__bento-info">
                                      <div className="top-ten-management__bento-name">{vehicle.name}</div>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </>
          ) : (
            /* Top Ten Rankings Tab */
            <>
          {vehicleTypes.map(vehicleType => {
            const subcategories = getSubcategoriesForType(vehicleType);
            
            return (
              <section key={vehicleType} className="top-ten-management__section">
                <h2 className="top-ten-management__section-title">
                  Top Ten {vehicleType === 'Performance' ? 'Performance' : `${vehicleType}s`}
                </h2>
                
                <div className="top-ten-management__categories">
                  {subcategories.map(subcategory => {
                    const key = `${vehicleType}-${subcategory}`;
                    const vehicles = categoryRankings[key] || [];
                    const categoryName = subcategory === 'All' 
                      ? `All Categories` 
                      : subcategory;
                    
                    return (
                      <div key={key} className="top-ten-management__category">
                        <h3 className="top-ten-management__category-title">
                          {categoryName}
                          <span className="top-ten-management__vehicle-count">
                            ({vehicles.length} vehicles)
                          </span>
                        </h3>
                        
                        {vehicles.length === 0 ? (
                          <div className="top-ten-management__empty">
                            <p>No vehicles found in this category.</p>
                            <p className="top-ten-management__empty-note">
                              Add vehicles to the database that match this category to populate the list.
                            </p>
                          </div>
                        ) : (
                          <div className="top-ten-management__table-container">
                            <table className="top-ten-management__table">
                              <thead>
                                <tr>
                                  <th>Rank</th>
                                  <th>Vehicle</th>
                                  <th>Year</th>
                                  <th>Make</th>
                                  <th>Model</th>
                                  <th>Staff Rating</th>
                                  <th>Community Rating</th>
                                  <th>Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {vehicles.map((vehicle) => (
                                  <tr key={`${vehicle.year}-${vehicle.make}-${vehicle.model}`}>
                                    <td className="top-ten-management__rank">
                                      <span className="top-ten-management__rank-badge">
                                        #{vehicle.rank}
                                      </span>
                                    </td>
                                    <td className="top-ten-management__vehicle-name">
                                      <Link 
                                        to={`/vehicles/${vehicle.year}/${vehicle.make}/${vehicle.model.replace(/\s+/g, '-')}`}
                                        className="top-ten-management__vehicle-link"
                                      >
                                        <div className="top-ten-management__vehicle-name-content">
                                          {vehicle.image && (
                                            <img 
                                              src={vehicle.image} 
                                              alt={vehicle.name}
                                              className="top-ten-management__vehicle-thumbnail"
                                            />
                                          )}
                                          <span>{vehicle.name}</span>
                                        </div>
                                      </Link>
                                    </td>
                                    <td>{vehicle.year}</td>
                                    <td>{vehicle.make}</td>
                                    <td>{vehicle.model}</td>
                                    <td className="top-ten-management__rating">
                                      {vehicle.staffRating.toFixed(1)}/10
                                    </td>
                                    <td className="top-ten-management__rating">
                                      {vehicle.communityRating.toFixed(1)}/10
                                    </td>
                                    <td className="top-ten-management__price">
                                      {vehicle.priceMin === vehicle.priceMax 
                                        ? `$${vehicle.priceMin.toLocaleString()}`
                                        : `$${vehicle.priceMin.toLocaleString()} - $${vehicle.priceMax.toLocaleString()}`
                                      }
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
            </>
          )}
        </div>

        <footer className="top-ten-management__footer">
          <p className="top-ten-management__footer-note">
            <strong>Note:</strong> Rankings are dynamically calculated from the vehicle database using the selected rating type ({ratingType === 'MotorTrend' ? 'MotorTrend Staff Rating' : 'User Reviews Rating'}). 
            To update rankings, modify vehicle ratings in the database. 
            Newer vehicles are prioritized when ratings are equal. 
            The Top Ten Carousel displays vehicles in reverse order (rank 10 to rank 1).
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TopTenManagement;

