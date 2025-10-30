/**
 * Vehicle Details Page
 * Year-Make-Model detail page based on Figma design
 */

import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { UserReviews } from '../../components/UserReviews';
import WriteReviewModal from '../../components/WriteReviewModal';
import { vehicleImageFor } from '../../utils/vehicleImages';
import RatingModal from '../../components/RatingModal';
import { useRating } from '../../contexts/RatingContext';
import { type ReviewData } from '../../components/UserReviews';
import { RatingDistributionTooltip, type RatingDistributionData } from '../../components/RatingDistributionTooltip';
import './VehicleDetails.css';

export const VehicleDetails: React.FC = () => {
  const { year, make, model } = useParams<{ year: string; make: string; model: string }>();
  const decodedYear = decodeURIComponent(year || '2025');
  const decodedMake = decodeURIComponent(make || 'BMW');
  const decodedModel = decodeURIComponent(model || '3-Series');
  const [selectedYear, setSelectedYear] = useState<string>(decodedYear);
  const [isSaved, setIsSaved] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const communityRatingRef = useRef<HTMLDivElement>(null);
  const hideTooltipTimeout = useRef<number | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([
    {
      id: '1',
      reviewerName: 'John Smith',
      rating: 5,
      title: 'Edgy design makes this the most head-turning Elantra yet',
      content: 'Edgy design makes this the most head-turning Elantra yet. But it\'s more than just stylish—the Elantra is comfortable and offers many features. Value is high, and the hardcore Elantra N is a riot.',
      vehicleType: 'sedan',
      vehicleModel: 'base',
      date: 'May 20, 2025',
      mediaPreviews: [],
      thumbsUpCount: 9
    },
    {
      id: '2',
      reviewerName: 'Sarah Johnson',
      rating: 8,
      title: 'Great value and features',
      content: 'Edgy design makes this the most head-turning Elantra yet. But it\'s more than just stylish—the Elantra is comfortable and offers many features. Value is high, and the hardcore Elantra N is a riot.',
      vehicleType: 'sedan',
      vehicleModel: 'sport',
      date: 'May 18, 2025',
      mediaPreviews: [],
      thumbsUpCount: 3
    }
  ]);
  const { getUserRating, setUserRating } = useRating();
  
  // Parse vehicle name from URL params
  const vehicleName = `${decodedYear} ${decodedMake} ${decodedModel}`;
  const userRating = getUserRating(vehicleName);

  // Mock data - in production this would come from an API
  const vehicleData = {
    name: vehicleName,
    year: decodedYear,
    make: decodedMake,
    model: decodedModel,
    staffRating: 9.1,
    communityRating: 8.5,
    communityRatingCount: 252,
    priceRange: '$27,950 - $36,065',
    award: 'Best Compact Plug-in Hybrid',
    image: vehicleImageFor(vehicleName),
    pros: [
      'Striking exterior design',
      'Quick and nimble',
      'World-class efficiency'
    ],
    cons: [
      'Only one engine option',
      'Kid-sized third row',
      'Average fuel economy'
    ],
    trims: [
      { name: 'LE Hatchback', price: '$27,650' },
      { name: 'LE AWD Hatchback', price: '$29,050' },
      { name: 'XLE Hatchback', price: '$31,095' },
      { name: 'XLE AWD Hatchback', price: '$32,495' },
      { name: 'Limited Hatchback', price: '$34,665' },
      { name: 'Limited AWD Hatchback', price: '$36,065' }
    ],
    scores: {
      performance: 6,
      efficiency: 7.8,
      tech: 9.8,
      value: 8.8
    },
    ratingDistribution: {
      1: 2,
      2: 1,
      3: 3,
      4: 4,
      5: 8,
      6: 12,
      7: 18,
      8: 25,
      9: 20,
      10: 7
    } as RatingDistributionData
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleOpenRatingModal = () => {
    setIsRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setIsRatingModalOpen(false);
  };

  const handleSubmitRating = (rating: number) => {
    setUserRating(vehicleName, rating);
    // In a real app, this would send the rating to the server
    console.log(`User rated ${vehicleName}: ${rating}/10`);
  };

  const handleRateAndReview = (rating: number) => {
    // Save the rating first
    setUserRating(vehicleName, rating);
    // Close rating modal and open write review modal
    setIsWriteReviewModalOpen(true);
  };

  const handleSubmitReview = (newReview: ReviewData) => {
    // Convert File objects to preview URLs for display
    const reviewWithPreviews: ReviewData = {
      ...newReview,
      mediaPreviews: newReview.mediaFiles?.map((file: File) => URL.createObjectURL(file)) || []
    };
    
    setReviews(prev => [reviewWithPreviews, ...prev]);
    setIsWriteReviewModalOpen(false);
  };

  const handleScrollToCommunityRatings = () => {
    const communityRatingsSection = document.getElementById('community-ratings');
    if (communityRatingsSection) {
      communityRatingsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleScrollToStaffRating = () => {
    const staffRatingSection = document.getElementById('staff-rating');
    if (staffRatingSection) {
      staffRatingSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleTooltipMouseEnter = () => {
    if (hideTooltipTimeout.current !== null) {
      window.clearTimeout(hideTooltipTimeout.current);
      hideTooltipTimeout.current = null;
    }
    setIsTooltipVisible(true);
  };

  const handleTooltipMouseLeave = () => {
    if (hideTooltipTimeout.current !== null) {
      window.clearTimeout(hideTooltipTimeout.current);
    }
    hideTooltipTimeout.current = window.setTimeout(() => {
      setIsTooltipVisible(false);
      hideTooltipTimeout.current = null;
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hideTooltipTimeout.current !== null) {
        window.clearTimeout(hideTooltipTimeout.current);
      }
    };
  }, []);

  // Hide tooltip on scroll
  useEffect(() => {
    if (!isTooltipVisible) return;
    const handleScroll = () => {
      setIsTooltipVisible(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isTooltipVisible]);

  const availableYears = ['2025', '2024', '2023', '2022', '2021'];

  return (
    <div className="vehicle-details">
      {/* Breadcrumbs and Social Share */}
      <div className="vehicle-details__top-section">
        <div className="vehicle-details__breadcrumbs">
          <Link to="/">Home</Link>
          <span> / </span>
          <Link to="/cars">Cars</Link>
          <span> / </span>
          <span>{vehicleData.make}</span>
          <span> / </span>
          <span>{vehicleData.model}</span>
          <span> / </span>
          <span>{vehicleData.year}</span>
        </div>
        <div className="vehicle-details__social-share">
          <button className="vehicle-details__social-btn">
            <img 
              src="https://d2kde5ohu8qb21.cloudfront.net/files/6902024b646d130002b7881d/facebook.svg" 
              alt="Facebook" 
              width={30} 
              height={30}
            />
          </button>
          <button className="vehicle-details__social-btn">
            <img 
              src="https://d2kde5ohu8qb21.cloudfront.net/files/6902024891bc910002b23381/x.svg" 
              alt="X" 
              width={30} 
              height={30}
            />
          </button>
        </div>
      </div>

      {/* Content Layout */}
      <div className="vehicle-details__content-layout">
        {/* Left Content */}
        <div className="vehicle-details__left-content">
          {/* Vehicle Title and Year Selection */}
          <div className="vehicle-details__title-section">
            <h1 className="vehicle-details__title">
              {vehicleName}
              <Icon name="keyboard_arrow_down" size={20} />
            </h1>
            <div className="vehicle-details__year-award-row">
              <div className="vehicle-details__year-selector">
                {availableYears.map((y) => (
                  <button
                    key={y}
                    className={`vehicle-details__year-badge ${selectedYear === y ? 'active' : ''}`}
                    onClick={() => setSelectedYear(y)}
                  >
                    {y}
                  </button>
                ))}
                <button className="vehicle-details__more-years">
                  More
                  <Icon name="keyboard_arrow_down" size={16} />
                </button>
              </div>
              <div className="vehicle-details__award">
                <img 
                  src="https://d2kde5ohu8qb21.cloudfront.net/files/690203caffe978000201e639/trophie-11.svg" 
                  alt="Trophy" 
                  width={20} 
                  height={20}
                />
                <span>{vehicleData.award}</span>
              </div>
            </div>
          </div>

          {/* Ratings Section */}
          <div className="vehicle-details__ratings">
            <div 
              className="vehicle-details__rating-item vehicle-details__rating-item--clickable" 
              onClick={handleScrollToStaffRating}
            >
              <span className="vehicle-details__rating-label">Staff Rating</span>
              <img 
                src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c075d4ae300022a2b0c/staryellowsolid.svg" 
                alt="Staff Rating Star" 
                className="vehicle-details__rating-icon staff" 
              />
              <span className="vehicle-details__rating-value">{vehicleData.staffRating}</span>
            </div>
            <div 
              ref={communityRatingRef}
              className="vehicle-details__rating-item vehicle-details__rating-item--clickable vehicle-details__rating-item--with-tooltip" 
              onClick={handleScrollToCommunityRatings}
              onMouseEnter={handleTooltipMouseEnter}
              onMouseLeave={handleTooltipMouseLeave}
            >
              <span className="vehicle-details__rating-label">Community Rating ({vehicleData.communityRatingCount})</span>
              <img 
                src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                alt="Community Rating Star" 
                className="vehicle-details__rating-icon community" 
              />
              <span className="vehicle-details__rating-value">{vehicleData.communityRating}</span>
              <RatingDistributionTooltip
                distribution={vehicleData.ratingDistribution}
                totalReviews={vehicleData.communityRatingCount}
                isVisible={isTooltipVisible}
                triggerRef={communityRatingRef}
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
                onRequestClose={() => setIsTooltipVisible(false)}
              />
            </div>
            <button className="vehicle-details__rate-btn" onClick={handleOpenRatingModal}>
              <span className="vehicle-details__rating-label">
                {userRating > 0 ? `Your Rating: ${userRating}` : 'Add Your Rate'}
              </span>
              <img 
                src={userRating > 0 
                  ? "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                  : "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg"
                } 
                alt="Add Rating Star" 
                className="vehicle-details__rating-icon add-rate" 
              />
            </button>
          </div>
          {/* Hero Image */}
          <div className="vehicle-details__hero">
            <div className="vehicle-details__hero-image">
              <img src={vehicleData.image} alt={vehicleName} />
              <button className={`vehicle-details__save-btn ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
                <Icon name="bookmark" variant={isSaved ? 'filled' : 'outlined'} size={20} />
                <span>{isSaved ? 'Saved!' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="vehicle-details__price-section">
            <div className="vehicle-details__price">
              <span className="vehicle-details__price-range">{vehicleData.priceRange}</span>
              <Icon name="keyboard_arrow_down" size={20} />
            </div>
            <div className="vehicle-details__actions">
              <button className="vehicle-details__action-btn">
                <Icon name="photo_library" size={20} />
                <span>28 Photos</span>
              </button>
              <button className="vehicle-details__action-btn">
                <Icon name="list" size={20} />
                <span>Specs</span>
              </button>
              <button className="vehicle-details__cta-primary">
                <Icon name="search" size={20} />
                <span>See Local Listings</span>
              </button>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="vehicle-details__pros-cons">
            <div className="vehicle-details__pros">
              <div className="vehicle-details__pros-header">
                <Icon name="check_circle" size={24} />
                <h3>Pros</h3>
              </div>
              <ul>
                {vehicleData.pros.map((pro, index) => (
                  <li key={index}>{pro}</li>
                ))}
              </ul>
            </div>
            <div className="vehicle-details__divider"></div>
            <div className="vehicle-details__cons">
              <div className="vehicle-details__cons-header">
                <Icon name="close" size={24} />
                <h3>Cons</h3>
              </div>
              <ul>
                {vehicleData.cons.map((con, index) => (
                  <li key={index}>{con}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Local Listings */}
          <div className="vehicle-details__listings">
            <h2>Local Listings</h2>
            <div className="vehicle-details__listings-grid">
              {[1, 2, 3].map((item) => (
                <div key={item} className="vehicle-details__listing-card">
                  <div className="vehicle-details__listing-image">
                    <img src={vehicleData.image} alt="Listing" />
                  </div>
                  <div className="vehicle-details__listing-info">
                    <div className="vehicle-details__listing-price">$00,000</div>
                    <div className="vehicle-details__listing-name">2019 Kia Telluride SX 4 dr SUV</div>
                    <div className="vehicle-details__listing-details">
                      <span>
                        <Icon name="speed" size={16} />
                        81,281 miles
                      </span>
                      <span>
                        <Icon name="location_on" size={16} />
                        Garden Grove Toyota
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expert Review */}
          <div className="vehicle-details__review">
            <h2>Year Make Model Expert Review</h2>
            <p className="vehicle-details__review-author">Reviewed by Billy Rehbock</p>
            <div className="vehicle-details__review-content">
              <p>
                Defying the gasoline versus electric binary, the 2024 Toyota Prius takes the middle path with its hybrid
                drivetrain that returns segment-leading fuel economy. Now in its fifth generation, the well-rounded and
                surprisingly fun Prius won our 2024 Car of the Year award. Rivals include other compact hybrids such as
                the Kia Niro and Hyundai Elantra Hybrid.
              </p>
              <p>
                Toyota just introduced a new Prius for 2023, so the model is a complete carryover for the 2024 model year.
                Not only does the new hybrid hatchback look fantastic, its upgraded powertrains produce higher output than
                ever while still returning the excellent fuel economy consumers expect from a Prius. Toyota outfits the
                current Prius with large displays, modern phone connectivity technology, and its latest suite of active
                driver assistance features. In short, the Prius is more appealing than ever.
              </p>
            </div>

            <h3>What We Think</h3>
            <div className="vehicle-details__review-content">
              <p>
                Toyota put forward its best effort when it developed the current Prius hybrid. The compact hatchback boasts
                incredible efficiency wrapped up in one of the automaker's best designs in the last two decades. The cabin
                is decidedly forward-looking with large displays and the latest infotainment technology. What's more, the
                Prius is actually fun to drive; direct steering and excellent chassis tuning lend themselves to a compact
                car that's engaging on a winding road.
              </p>
            </div>
          </div>

          {/* MotorTrend Score */}
          <div id="staff-rating" className="vehicle-details__motortrend-score">
            <h2>MotorTrend Score</h2>
            <div className="vehicle-details__score-card">
              <div className="vehicle-details__score-header">
                <h3>{vehicleName}</h3>
                <div className="vehicle-details__score-award">
                  <img 
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/690203caffe978000201e639/trophie-11.svg" 
                    alt="Trophy" 
                    width={16} 
                    height={16}
                  />
                  <span>{vehicleData.award}</span>
                  <Icon name="keyboard_arrow_down" size={16} />
                </div>
              </div>
              <div className="vehicle-details__score-content">
                <div className="vehicle-details__overall-score">
                  <div className="vehicle-details__score-circle">
                    <img 
                      src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c075d4ae300022a2b0c/staryellowsolid.svg" 
                      alt="Star" 
                      width={48} 
                      height={48}
                    />
                    <span className="vehicle-details__score-number">{vehicleData.staffRating}</span>
                    <span className="vehicle-details__score-label">Staff</span>
                  </div>
                </div>
                <div className="vehicle-details__score-breakdown">
                <div className="vehicle-details__score-item">
                  <span>Performance</span>
                  <div className="vehicle-details__score-bar">
                    <div className="vehicle-details__score-bar-fill" style={{ width: `${(vehicleData.scores.performance / 10) * 100}%` }}></div>
                  </div>
                  <span>{vehicleData.scores.performance}</span>
                </div>
                <div className="vehicle-details__score-item">
                  <span>Efficiency/Range</span>
                  <div className="vehicle-details__score-bar">
                    <div className="vehicle-details__score-bar-fill" style={{ width: `${(vehicleData.scores.efficiency / 10) * 100}%` }}></div>
                  </div>
                  <span>{vehicleData.scores.efficiency}</span>
                </div>
                <div className="vehicle-details__score-item">
                  <span>Tech/Innovation</span>
                  <div className="vehicle-details__score-bar">
                    <div className="vehicle-details__score-bar-fill" style={{ width: `${(vehicleData.scores.tech / 10) * 100}%` }}></div>
                  </div>
                  <span>{vehicleData.scores.tech}</span>
                </div>
                <div className="vehicle-details__score-item">
                  <span>Value</span>
                  <div className="vehicle-details__score-bar">
                    <div className="vehicle-details__score-bar-fill" style={{ width: `${(vehicleData.scores.value / 10) * 100}%` }}></div>
                  </div>
                  <span>{vehicleData.scores.value}</span>
                </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Reviews */}
          <div id="community-ratings">
            <UserReviews
              vehicleName={vehicleName}
              communityRating={vehicleData.communityRating}
              totalReviews={vehicleData.communityRatingCount}
              ratingDistribution={[2, 1, 3, 5, 8, 12, 18, 25, 35, 142]}
              vehicleImage={vehicleData.image}
              reviews={reviews}
              onWriteReview={() => setIsWriteReviewModalOpen(true)}
            />
          </div>

          {/* Trims and Pricing */}
          <div className="vehicle-details__trims">
            <h2>{vehicleName} Trims and Pricing</h2>
            <div className="vehicle-details__trims-table">
              <div className="vehicle-details__trims-header">
                <span>Trims</span>
                <span>Price</span>
              </div>
              {vehicleData.trims.map((trim, index) => (
                <div key={index} className="vehicle-details__trim-row">
                  <span>{trim.name}</span>
                  <span>{trim.price}</span>
                </div>
              ))}
              <button className="vehicle-details__show-more">Show More</button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="vehicle-details__sidebar">
          {/* Ad Space 1 */}
          <div className="vehicle-details__ad">
            <div className="vehicle-details__ad-placeholder">
              <span>Advertisement</span>
            </div>
          </div>

          {/* Related Articles */}
          <div className="vehicle-details__sidebar-section">
            <h3>Related Articles</h3>
            <div className="vehicle-details__sidebar-articles">
              <div className="vehicle-details__sidebar-article">
                <div className="vehicle-details__sidebar-article-image">
                  <img src={vehicleImageFor('BMW 3 Series')} alt="Article" />
                </div>
                <div className="vehicle-details__sidebar-article-content">
                  <h4>2024 BMW 3 Series Review</h4>
                  <p>Everything you need to know about the latest 3 Series</p>
                </div>
              </div>
              <div className="vehicle-details__sidebar-article">
                <div className="vehicle-details__sidebar-article-image">
                  <img src={vehicleImageFor('BMW 5 Series')} alt="Article" />
                </div>
                <div className="vehicle-details__sidebar-article-content">
                  <h4>BMW 5 Series vs 3 Series</h4>
                  <p>Which BMW sedan is right for you?</p>
                </div>
              </div>
              <div className="vehicle-details__sidebar-article">
                <div className="vehicle-details__sidebar-article-image">
                  <img src={vehicleImageFor('BMW X3')} alt="Article" />
                </div>
                <div className="vehicle-details__sidebar-article-content">
                  <h4>Best Luxury SUVs 2024</h4>
                  <p>Top picks for luxury SUV buyers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ad Space 2 */}
          <div className="vehicle-details__ad">
            <div className="vehicle-details__ad-placeholder">
              <span>Advertisement</span>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="vehicle-details__sidebar-section">
            <h3>Stay Updated</h3>
            <div className="vehicle-details__newsletter">
              <p>Get the latest automotive news and reviews delivered to your inbox.</p>
              <div className="vehicle-details__newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button>Subscribe</button>
              </div>
            </div>
          </div>

          {/* Ad Space 3 */}
          <div className="vehicle-details__ad">
            <div className="vehicle-details__ad-placeholder">
              <span>Advertisement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={handleCloseRatingModal}
        onRate={handleSubmitRating}
        vehicleName={vehicleName}
        currentRating={userRating}
        onRateAndReview={handleRateAndReview}
      />

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteReviewModalOpen}
        onClose={() => setIsWriteReviewModalOpen(false)}
        vehicleName={vehicleName}
        vehicleImage={vehicleData.image}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default VehicleDetails;
