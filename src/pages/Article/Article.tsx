/**
 * Article Page Component
 * Full article detail page based on MotorTrend article structure
 */

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { AdContainer } from '../../components/AdContainer';
import { UserReviews } from '../../components/UserReviews';
import WriteReviewModal from '../../components/WriteReviewModal';
import RatingModal from '../../components/RatingModal';
import ReviewSubmittedToast from '../../components/ReviewSubmittedToast';
import SavedModal from '../../components/SavedModal';
import { StaffRatingTooltip } from '../../components/StaffRatingTooltip';
import { RatingDistributionTooltip } from '../../components/RatingDistributionTooltip';
import { generateUserReviews } from '../../utils/vehicleUserReviews';
import { generateCommunityRating, generateStaffRating } from '../../utils/vehicleRatings';
import { useRating } from '../../contexts/RatingContext';
import { type ReviewData } from '../../components/UserReviews';
import { getArticleBySlug, getDefaultArticle, articles } from '../../utils/articles';
import { parseVehicleName } from '../../utils/vehicleImages';
import { fetchVehicleListings, type VehicleListing } from '../../utils/vehicleListings';
import { vehicleImageFor } from '../../utils/vehicleImages';
import './Article.css';

export const Article: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Premium articles (no sidebar, no ads)
  const premiumArticles = [
    'how-motortrend-tests-cars',
    'top-10-daily-commute',
    'top-10-family-practical',
    'top-10-adventure-off-road',
    'top-10-urban-style',
    'top-10-performance-enthusiast',
    'top-10-eco-future-ready',
    'top-10-luxury-comfort',
    'top-10-utility-work',
    '2026-motortrend-car-of-the-year'
  ];
  const isPremiumArticle = slug ? premiumArticles.includes(slug) : false;
  
  // Load bookmark state from localStorage on mount
  const [isSaved, setIsSaved] = useState(() => {
    if (!slug) return false;
    try {
      const savedArticlesJson = localStorage.getItem('savedArticles');
      if (savedArticlesJson) {
        const savedArticles: string[] = JSON.parse(savedArticlesJson);
        return savedArticles.includes(slug);
      }
    } catch (error) {
      console.error('Error loading bookmark state:', error);
    }
    return false;
  });
  const [isReviewAccordionOpen, setIsReviewAccordionOpen] = useState(false);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [reviewModalRating, setReviewModalRating] = useState<number | undefined>(undefined);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [communityRatingCount, setCommunityRatingCount] = useState(252);
  const [reviewsTabActive, setReviewsTabActive] = useState<boolean | undefined>(undefined);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isStaffTooltipVisible, setIsStaffTooltipVisible] = useState(false);
  const [isScoreInfoTooltipVisible, setIsScoreInfoTooltipVisible] = useState(false);
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);
  const [listings, setListings] = useState<VehicleListing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const communityRatingRef = useRef<HTMLDivElement>(null);
  const staffRatingRef = useRef<HTMLDivElement>(null);
  const ratingsBarRef = useRef<HTMLDivElement>(null);
  const scoreInfoRef = useRef<HTMLDivElement>(null);
  const justSavedReviewRef = useRef<boolean>(false);
  const loadMoreArticlesRef = useRef<HTMLDivElement>(null);
  const { getUserRating, setUserRating, clearRating } = useRating();
  
  // Photo gallery state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Lazy load articles state
  const [articlesToShow, setArticlesToShow] = useState(5);
  
  // Load article data based on slug
  const articleData = useMemo(() => {
    const loadedArticle = slug ? getArticleBySlug(slug) : getDefaultArticle();
    if (!loadedArticle) {
      // Fallback to default if article not found
      return getDefaultArticle();
    }
    return loadedArticle;
  }, [slug]);
  
  // Get all article images for gallery
  const articleImages = useMemo(() => {
    return articleData.images || [];
  }, [articleData]);
  
  // Gallery handlers
  const handleImageClick = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);
  
  const handleCloseGallery = useCallback(() => {
    setGalleryOpen(false);
    document.body.style.overflow = '';
  }, []);
  
  const handleGalleryNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % articleImages.length);
  }, [articleImages.length]);
  
  const handleGalleryPrev = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + articleImages.length) % articleImages.length);
  }, [articleImages.length]);
  
  const handleGalleryGoTo = useCallback((index: number) => {
    if (index >= 0 && index < articleImages.length) {
      setCurrentImageIndex(index);
    }
  }, [articleImages.length]);
  
  // Keyboard navigation for gallery
  useEffect(() => {
    if (!galleryOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseGallery();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleGalleryPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleGalleryNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryOpen, handleCloseGallery, handleGalleryPrev, handleGalleryNext]);

  // Fade-in reveal effect for premium article images - DISABLED
  // Images now display immediately without fade-in animation
  // useEffect(() => {
  //   if (!isPremiumArticle) return;
  //   ... fade-in effect code removed ...
  // }, [isPremiumArticle, articleData.content]);

  // Vehicle name for reviews (extracted from motortrendScore or article title)
  // Normalize to ensure consistent format (spaces, not dashes) to match VehicleDetails page
  const vehicleName = useMemo(() => {
    let name = '';
    if (articleData.motortrendScore?.vehicleName) {
      name = articleData.motortrendScore.vehicleName;
    } else {
      // Try to extract vehicle name from title (e.g., "2026 Hyundai Ioniq 6 N First Drive" -> "2026 Hyundai Ioniq 6 N")
      const titleMatch = articleData.title.match(/^(\d{4}\s+[\w\s]+?)(?:\s+(?:First Drive|Review|Yearlong|Verdict))/i);
      if (titleMatch) {
        name = titleMatch[1].trim();
      } else {
        // Fallback: use first part of title before colon
        const colonIndex = articleData.title.indexOf(':');
        if (colonIndex > 0) {
          name = articleData.title.substring(0, colonIndex).trim();
        } else {
          name = articleData.title;
        }
      }
    }
    // Normalize: replace dashes with spaces in the model part to match VehicleDetails format
    // This ensures "2026 Hyundai Ioniq-6-N" becomes "2026 Hyundai Ioniq 6 N"
    const parts = name.split(/\s+/);
    const yearIndex = parts.findIndex(part => /^\d{4}$/.test(part));
    if (yearIndex !== -1 && parts.length > yearIndex + 1) {
      const year = parts[yearIndex];
      const make = parts[yearIndex + 1];
      const modelParts = parts.slice(yearIndex + 2);
      // Replace dashes with spaces in model parts
      const normalizedModel = modelParts.join(' ').replace(/-/g, ' ');
      return `${year} ${make} ${normalizedModel}`.trim();
    }
    // If no year found, just replace dashes with spaces
    return name.replace(/-/g, ' ').trim();
  }, [articleData]);
  
  // Parse vehicle name to get year, make, and model for navigation
  const vehiclePath = useMemo(() => {
    if (!vehicleName) return null;
    const { year, make, model } = parseVehicleName(vehicleName);
    return `/vehicles/${year}/${make}/${model}`;
  }, [vehicleName]);
  
  const userRating = getUserRating(vehicleName);

  // Check if user has an existing review and get it
  const existingUserReview = useMemo(() => {
    return reviews.find(review => review.reviewerName === 'You') || null;
  }, [reviews]);
  
  const hasExistingReview = existingUserReview !== null;

  // Article data - using loaded article
  const article = articleData;

  const handleBookmark = () => {
    if (!slug) return;
    
    const newBookmarkState = !isSaved;
    setIsSaved(newBookmarkState);
    
    try {
      // Get current saved articles
      const savedArticlesJson = localStorage.getItem('savedArticles');
      const savedArticles: string[] = savedArticlesJson ? JSON.parse(savedArticlesJson) : [];
      
      // Get current saved articles metadata
      const savedArticlesMetadataJson = localStorage.getItem('savedArticlesMetadata');
      const savedArticlesMetadata: Record<string, { title: string; author: string; date: string; imageUrl: string; slug: string }> = 
        savedArticlesMetadataJson ? JSON.parse(savedArticlesMetadataJson) : {};
      
      if (newBookmarkState) {
        // Add article to saved list
        if (!savedArticles.includes(slug)) {
          savedArticles.push(slug);
        }
        
        // Save article metadata
        savedArticlesMetadata[slug] = {
          title: article.title,
          author: article.author,
          date: article.date,
          imageUrl: article.heroImage,
          slug: slug
        };
        
        // Show saved modal
        setIsSavedModalOpen(true);
      } else {
        // Remove article from saved list
        const index = savedArticles.indexOf(slug);
        if (index > -1) {
          savedArticles.splice(index, 1);
        }
        
        // Remove article metadata
        delete savedArticlesMetadata[slug];
      }
      
      // Save to localStorage
      localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
      localStorage.setItem('savedArticlesMetadata', JSON.stringify(savedArticlesMetadata));
    } catch (error) {
      console.error('Error saving bookmark:', error);
    }
  };

  const handleShare = () => {
    // In production, this would open share dialog
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    }
  };

  // MotorTrend Score data - from article data or fallback
  const motortrendScore = useMemo(() => {
    if (article.motortrendScore) {
      return article.motortrendScore;
    }
    // Fallback for articles without motortrendScore
    return {
      overallRating: 9.2,
      scores: {
        performance: 6.8,
        efficiency: 7.8,
        tech: 9.8,
        value: 8.8,
      },
      award: "Best Compact Plug-in Hybrid",
      vehicleName: vehicleName,
      reviewer: {
        name: article.author,
        avatar: "https://d2kde5ohu8qb21.cloudfront.net/files/690637eaf09ade000224c6b1/group1318348122.png",
        date: article.date,
        title: article.title,
        excerpt: article.excerpt,
        detailedSections: []
      }
    };
  }, [article, vehicleName]);

  // Load user reviews for the vehicle
  useEffect(() => {
    // Skip reloading if we just saved a review (to prevent overwriting the state we just set)
    if (justSavedReviewRef.current) {
      console.log('Article: Skipping review reload - just saved a review');
      justSavedReviewRef.current = false;
      return;
    }
    
    try {
      // Use the same key format as VehicleDetails page for consistency
      const savedReviewsKey = `vehicleReviews_${vehicleName}`;
      const savedReviewsJson = localStorage.getItem(savedReviewsKey);
      if (savedReviewsJson) {
        const savedReviews: ReviewData[] = JSON.parse(savedReviewsJson);
        if (savedReviews && savedReviews.length > 0) {
          const generatedReviews = generateUserReviews(vehicleName);
          const generatedIds = new Set(generatedReviews.map(r => r.id));
          const uniqueSavedReviews = savedReviews.filter(r => !generatedIds.has(r.id));
          setReviews([...uniqueSavedReviews, ...generatedReviews]);
        } else {
          setReviews(generateUserReviews(vehicleName));
        }
      } else {
        setReviews(generateUserReviews(vehicleName));
      }
    } catch (error) {
      console.error('Error loading saved reviews from localStorage:', error);
      setReviews(generateUserReviews(vehicleName));
    }
  }, [vehicleName]);

  // Generate community rating and staff rating
  const communityRating = useMemo(() => generateCommunityRating(vehicleName), [vehicleName]);
  // Use motortrendScore.overallRating if available, otherwise generate from vehicle name
  const staffRating = useMemo(() => {
    if (motortrendScore.overallRating && article.motortrendScore) {
      return motortrendScore.overallRating;
    }
    return generateStaffRating(vehicleName);
  }, [motortrendScore, article.motortrendScore, vehicleName]);
  
  // Generate scores for staff rating tooltip
  const scores = useMemo(() => ({
    performance: motortrendScore.scores.performance,
    efficiency: motortrendScore.scores.efficiency,
    tech: motortrendScore.scores.tech,
    value: motortrendScore.scores.value,
  }), [motortrendScore.scores]);
  
  // Rating distribution for community rating tooltip
  const ratingDistribution = useMemo(() => ({
    1: 5,
    2: 3,
    3: 8,
    4: 10,
    5: 20,
    6: 30,
    7: 45,
    8: 63,
    9: 50,
    10: 18,
  }), []);
  
  // Handlers for rating modal
  const handleOpenRatingModal = () => {
    setIsRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setIsRatingModalOpen(false);
  };

  const handleSubmitRating = (rating: number) => {
    setUserRating(vehicleName, rating);
    setIsRatingModalOpen(false);
  };

  const handleClearRating = () => {
    // Clear the rating
    clearRating(vehicleName);
    
    // Remove the user's review from localStorage
    try {
      const savedReviewsKey = `vehicleReviews_${vehicleName}`;
      const savedReviewsJson = localStorage.getItem(savedReviewsKey);
      if (savedReviewsJson) {
        const savedReviews: ReviewData[] = JSON.parse(savedReviewsJson);
        // Filter out reviews where reviewerName is 'You'
        const filteredReviews = savedReviews.filter(review => review.reviewerName !== 'You');
        
        // Update localStorage
        if (filteredReviews.length > 0) {
          localStorage.setItem(savedReviewsKey, JSON.stringify(filteredReviews));
        } else {
          // If no reviews left, remove the key entirely
          localStorage.removeItem(savedReviewsKey);
        }
        
        // Update local state
        const generatedReviews = generateUserReviews(vehicleName);
        const generatedIds = new Set(generatedReviews.map(r => r.id));
        const uniqueSavedReviews = filteredReviews.filter(r => !generatedIds.has(r.id));
        setReviews([...uniqueSavedReviews, ...generatedReviews]);
      }
    } catch (error) {
      console.error('Error removing review:', error);
    }
    
    setIsRatingModalOpen(false);
  };

  const handleRateAndReview = (rating: number) => {
    // Save the rating first
    setUserRating(vehicleName, rating);
    // Store the rating to pass directly to write review modal
    setReviewModalRating(rating);
    // Close rating modal and open write review modal
    setIsRatingModalOpen(false);
    // Use a small delay to ensure state is updated
    setTimeout(() => {
      setIsWriteReviewModalOpen(true);
    }, 50);
  };

  // Handlers for tooltips
  const tooltipHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const staffTooltipHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoreInfoTooltipHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (tooltipHideTimeoutRef.current) {
        clearTimeout(tooltipHideTimeoutRef.current);
      }
      if (staffTooltipHideTimeoutRef.current) {
        clearTimeout(staffTooltipHideTimeoutRef.current);
      }
      if (scoreInfoTooltipHideTimeoutRef.current) {
        clearTimeout(scoreInfoTooltipHideTimeoutRef.current);
      }
    };
  }, []);

  const handleTooltipMouseEnter = () => {
    // Clear any pending hide timeout
    if (tooltipHideTimeoutRef.current) {
      clearTimeout(tooltipHideTimeoutRef.current);
      tooltipHideTimeoutRef.current = null;
    }
    setIsTooltipVisible(true);
  };

  const handleTooltipMouseLeave = () => {
    // Add a small delay before hiding to allow moving mouse to tooltip
    tooltipHideTimeoutRef.current = setTimeout(() => {
      setIsTooltipVisible(false);
      tooltipHideTimeoutRef.current = null;
    }, 150);
  };

  const handleStaffTooltipMouseEnter = () => {
    // Clear any pending hide timeout
    if (staffTooltipHideTimeoutRef.current) {
      clearTimeout(staffTooltipHideTimeoutRef.current);
      staffTooltipHideTimeoutRef.current = null;
    }
    setIsStaffTooltipVisible(true);
  };

  const handleStaffTooltipMouseLeave = () => {
    // Add a small delay before hiding to allow moving mouse to tooltip
    staffTooltipHideTimeoutRef.current = setTimeout(() => {
      setIsStaffTooltipVisible(false);
      staffTooltipHideTimeoutRef.current = null;
    }, 150);
  };

  const handleScoreInfoTooltipMouseEnter = () => {
    if (scoreInfoTooltipHideTimeoutRef.current) {
      clearTimeout(scoreInfoTooltipHideTimeoutRef.current);
      scoreInfoTooltipHideTimeoutRef.current = null;
    }
    setIsScoreInfoTooltipVisible(true);
  };

  const handleScoreInfoTooltipMouseLeave = () => {
    scoreInfoTooltipHideTimeoutRef.current = setTimeout(() => {
      setIsScoreInfoTooltipVisible(false);
      scoreInfoTooltipHideTimeoutRef.current = null;
    }, 150);
  };

  // Scroll handlers
  const handleScrollToStaffRating = () => {
    const staffRatingSection = document.getElementById('motortrend-score');
    if (staffRatingSection) {
      staffRatingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToCommunityRatings = () => {
    const communityRatingsSection = document.getElementById('community-ratings');
    if (communityRatingsSection) {
      communityRatingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Toast handlers
  const handleCloseToast = () => {
    setIsToastVisible(false);
  };

  const handleViewReview = () => {
    // Set reviews tab to be active
    setReviewsTabActive(true);
    
    // Scroll to reviews section
    const reviewsSection = document.getElementById('community-ratings');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsToastVisible(false);
    
    // Reset after a delay to allow normal tab switching
    setTimeout(() => {
      setReviewsTabActive(undefined);
    }, 1000);
  };

  // Handle review update
  const handleUpdateReview = (reviewId: string, updatedReview: ReviewData) => {
    try {
      // Use the same key format as VehicleDetails page for consistency
      const savedReviewsKey = `vehicleReviews_${vehicleName}`;
      const savedReviewsJson = localStorage.getItem(savedReviewsKey);
      if (savedReviewsJson) {
        const savedReviews: ReviewData[] = JSON.parse(savedReviewsJson);
        const updatedReviews = savedReviews.map(r => r.id === reviewId ? updatedReview : r);
        localStorage.setItem(savedReviewsKey, JSON.stringify(updatedReviews));
        
        // Update local state
        const generatedReviews = generateUserReviews(vehicleName);
        const generatedIds = new Set(generatedReviews.map(r => r.id));
        const uniqueSavedReviews = updatedReviews.filter(r => !generatedIds.has(r.id));
        setReviews([...uniqueSavedReviews, ...generatedReviews]);
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  // Related articles - dynamic based on current article's vehicle
  const relatedArticles = useMemo(() => {
    const articlesList: Array<{
      id: string;
      title: string;
      imageUrl: string;
      author: string;
      date: string;
      slug: string;
    }> = [];

    // If viewing Ioniq 6 N article, add it to related articles
    if (vehicleName && vehicleName.toLowerCase().includes('ioniq 6 n')) {
      const ioniq6NArticle = getArticleBySlug('2026-hyundai-ioniq-6-n-first-drive-review');
      if (ioniq6NArticle && slug !== '2026-hyundai-ioniq-6-n-first-drive-review') {
        articlesList.push({
          id: 'ioniq-6-n',
          title: ioniq6NArticle.title,
          imageUrl: ioniq6NArticle.heroImage,
          author: ioniq6NArticle.author,
          date: ioniq6NArticle.date,
          slug: '2026-hyundai-ioniq-6-n-first-drive-review'
        });
      }
    }

    // Add default related articles if we don't have enough
    if (articlesList.length < 3) {
      // Try to load articles dynamically from articles data
      const defaultArticleSlugs = [
        '2026-cadillac-optiq-v-first-drive',
        '2024-kia-ev9-yearlong-review-verdict',
        'new-details-2026-rivian-r2-ev-suv-battery-charging',
        '2025-acura-adx-awd-yearlong-review-arrival'
      ];

      defaultArticleSlugs.forEach(articleSlug => {
        if (articleSlug !== slug && articlesList.length < 3) {
          const article = getArticleBySlug(articleSlug);
          if (article) {
            articlesList.push({
              id: articleSlug,
              title: article.title,
              imageUrl: article.heroImage,
              author: article.author,
              date: article.date,
              slug: articleSlug
            });
          }
        }
      });
    }

    return articlesList.slice(0, 3);
  }, [vehicleName, slug]);

  const handleRelatedArticleClick = (slug: string) => {
    navigate(`/articles/${slug}`);
  };

  // Get all articles excluding current one for lazy loading
  const allArticles = useMemo(() => {
    const articleEntries = Object.entries(articles);
    return articleEntries
      .filter(([articleSlug]) => articleSlug !== slug)
      .map(([articleSlug, article]) => ({
        slug: articleSlug,
        title: article.title,
        imageUrl: article.heroImage,
        author: article.author,
        date: article.date,
        excerpt: article.excerpt,
      }))
      .sort((a, b) => {
        // Sort by date descending (newest first)
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
  }, [slug]);

  // Lazy loaded articles (first N articles)
  const lazyLoadedArticles = useMemo(() => {
    return allArticles.slice(0, articlesToShow);
  }, [allArticles, articlesToShow]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!loadMoreArticlesRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && articlesToShow < allArticles.length) {
          // Load 5 more articles
          setArticlesToShow(prev => Math.min(prev + 5, allArticles.length));
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before reaching the element
        threshold: 0.1,
      }
    );

    const currentRef = loadMoreArticlesRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [articlesToShow, allArticles.length]);

  // Check if rating bar should be hidden for this article
  // Car of the Year article should show rating bar even though it's premium
  const shouldHideRatingBar = slug === 'honda-electric-sports-car-timing-uncertain' || slug === 'longbow-speedster-electric-sports-car' || (isPremiumArticle && slug !== '2026-motortrend-car-of-the-year');

  // Scroll detection for sticky rate bar
  useEffect(() => {
    // Don't set up scroll detection if rating bar is hidden
    if (shouldHideRatingBar) return;

    const handleScroll = () => {
      if (!ratingsBarRef.current) return;

      const ratingsBarRect = ratingsBarRef.current.getBoundingClientRect();
      
      // When the ratings bar reaches or passes the top of the viewport
      if (ratingsBarRect.top <= 0) {
        setIsStickyBarVisible(true);
      } else {
        setIsStickyBarVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [shouldHideRatingBar]);

  // Fetch local listings when vehicle changes
  useEffect(() => {
    const loadListings = async () => {
      if (!vehicleName) return;
      
      setIsLoadingListings(true);
      try {
        const parsed = parseVehicleName(vehicleName);
        const yearNum = parseInt(parsed.year) || new Date().getFullYear();
        const fetchedListings = await fetchVehicleListings(yearNum, parsed.make, parsed.model, 4);
        // Set images for listings using vehicleImageFor
        const listingsWithImages = fetchedListings.map((listing) => {
          const listingVehicleName = `${listing.year} ${listing.make} ${listing.model}`;
          return {
            ...listing,
            image: vehicleImageFor(listingVehicleName)
          };
        });
        setListings(listingsWithImages);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
      } finally {
        setIsLoadingListings(false);
      }
    };
    
    loadListings();
  }, [vehicleName]);

  return (
    <div className="article">
      <div className="article__container">
        {/* Ratings Bar - Full Width */}
        {!shouldHideRatingBar && (
        <div ref={ratingsBarRef} className="article__ratings">
          <div className="article__ratings-left">
            {vehiclePath ? (
              <Link to={vehiclePath} className="article__vehicle-name">
                {vehicleName}
              </Link>
            ) : (
              <div className="article__vehicle-name">{vehicleName}</div>
            )}
          </div>
          <div className="article__ratings-center">
            <div 
              ref={staffRatingRef}
              className="article__rating-item article__rating-item--clickable article__rating-item--with-tooltip article__rating-item--staff" 
              onClick={handleScrollToStaffRating}
              onMouseEnter={handleStaffTooltipMouseEnter}
              onMouseLeave={handleStaffTooltipMouseLeave}
            >
              <div className="article__rating-label-wrapper">
                <span className="article__rating-label-top">MotorTrend</span>
                <span className="article__rating-label-bottom">Rating</span>
              </div>
              <span className="article__rating-value">{staffRating}</span>
              <StaffRatingTooltip
                overallRating={staffRating}
                scores={scores}
                isVisible={isStaffTooltipVisible}
                triggerRef={staffRatingRef}
                onMouseEnter={handleStaffTooltipMouseEnter}
                onMouseLeave={handleStaffTooltipMouseLeave}
                onRequestClose={() => setIsStaffTooltipVisible(false)}
              />
            </div>
            <div 
              ref={communityRatingRef}
              className="article__rating-item article__rating-item--clickable article__rating-item--with-tooltip article__rating-item--community" 
              onClick={handleScrollToCommunityRatings}
              onMouseEnter={handleTooltipMouseEnter}
              onMouseLeave={handleTooltipMouseLeave}
            >
              <div className="article__rating-label-wrapper">
                <span className="article__rating-label-top">Community</span>
                <span className="article__rating-label-bottom">Rating ({communityRatingCount})</span>
              </div>
              <img 
                src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                alt="Community Rating Star" 
                className="article__rating-icon article__rating-icon--community" 
              />
              <span className="article__rating-value">
                {communityRating % 1 === 0 
                  ? communityRating 
                  : communityRating.toFixed(1)}
              </span>
              <RatingDistributionTooltip
                distribution={ratingDistribution}
                totalReviews={communityRatingCount}
                isVisible={isTooltipVisible}
                triggerRef={communityRatingRef}
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
                onRequestClose={() => setIsTooltipVisible(false)}
              />
            </div>
            <button className="article__rate-btn article__rate-btn--mobile-hide" onClick={handleOpenRatingModal}>
              {userRating > 0 ? (
                <>
                  <div className="article__rating-label-wrapper">
                    <span className="article__rating-label-top">Your</span>
                    <span className="article__rating-label-bottom">Rating</span>
                  </div>
                  <img 
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                    alt="Your Rating Star" 
                    className="article__rating-icon article__rating-icon--add-rate" 
                  />
                  <span className="article__rating-value">{userRating}</span>
                </>
              ) : (
                <>
                  <span className="article__rating-label">Rate Your Car</span>
                  <img 
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg"
                    alt="Add Rating Star" 
                    className="article__rating-icon article__rating-icon--add-rate" 
                  />
                </>
              )}
            </button>
          </div>
          <div className="article__ratings-right">
            <button 
              className="article__cta"
              onClick={() => {
                // Scroll to local listings section or handle navigation
                const listingsSection = document.querySelector('.article__listings');
                if (listingsSection) {
                  listingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  // If no listings section exists, could navigate to a listings page
                  // For now, just log or handle as needed
                  console.log('Navigate to local listings');
                }
              }}
            >
              Local Listings
            </button>
          </div>
        </div>
        )}

        {/* Main Layout: 2/3 content, 1/3 sidebar */}
        <div className={`article__layout ${isPremiumArticle ? 'article__layout--premium' : ''}`}>
          {/* Left Column: Content (2/3) */}
          <div className={`article__content-column ${isPremiumArticle ? 'article__content-column--premium' : ''}`}>
            {/* Article Header */}
            <div className="article__header">
              <h1 className="article__title">{article.title}</h1>
              <p className="article__excerpt">{article.excerpt}</p>
            </div>

            {/* Byline Row */}
            <div className="article__byline-row">
              <div className="article__byline-content">
                <span className="article__byline-author">
                  <span className="article__author-label">By</span>
                  <span className="article__author-name">{article.author}</span>
                </span>
                <span className="article__byline-separator">|</span>
                <span className="article__byline-date">{article.date}</span>
                <span className="article__byline-separator">|</span>
                <span className="article__byline-section">{article.category}</span>
              </div>
              <button 
                className={`article__save-btn ${isSaved ? 'saved' : ''}`}
                onClick={handleBookmark}
                aria-label={isSaved ? "Remove bookmark" : "Bookmark article"}
              >
                <Icon name="bookmark" variant={isSaved ? 'filled' : 'outlined'} size={20} />
                <span>{isSaved ? 'Saved!' : 'Save'}</span>
              </button>
            </div>

            {/* Hero Section */}
            <div className={`article__hero-wrapper ${isPremiumArticle ? 'article__hero-wrapper--premium' : ''}`}>
              <div className="article__hero">
                <div className="article__hero-image-wrapper">
                  <img 
                    src={article.heroImage} 
                    alt={article.title}
                    className="article__hero-image article__image-clickable"
                    onClick={() => handleImageClick(0)}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="article__hero-overlay">
                    <button 
                      className="article__share-btn"
                      onClick={handleShare}
                      aria-label="Share article"
                    >
                      <Icon name="share" size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="article__content-wrapper">
              <div className="article__main">
                <div className="article__content">
                  {(() => {
                    // Count headings to distribute images
                    const headingIndices: number[] = [];
                    article.content.forEach((block, idx) => {
                      if (block.type === "heading") {
                        headingIndices.push(idx);
                      }
                    });

                    // Get content images (excluding hero image at index 0)
                    const contentImages = article.images.slice(1);
                    let imageIndex = 0;

                    // Count paragraphs to place MotorTrend Score after the 8th paragraph
                    let paragraphCount = 0;

                    return article.content.map((block, index) => {
                      const elements: React.ReactNode[] = [];

                      if (block.type === "heading") {
                        const tocIndex = article.content
                          .slice(0, index)
                          .filter(b => b.type === "heading").length;
                        
                        // Extract vehicle name from heading for Top 10 articles
                        let vehicleNameForImage: string | null = null;
                        let rankingNumber: string | null = null;
                        let motortrendScoreForImage: number | null = null;
                        let userScoreForImage: number | null = null;
                        let vehicleImageUrl: string | null = null;
                        
                        if (isPremiumArticle && block.text) {
                          // Extract vehicle name and ranking from heading (e.g., "10. 2025 Kia K4" -> ranking: "10", vehicle: "2025 Kia K4")
                          const headingMatch = block.text.match(/^(\d+)\.\s*(.+)$/);
                          if (headingMatch) {
                            rankingNumber = headingMatch[1];
                            vehicleNameForImage = headingMatch[2].trim();
                            motortrendScoreForImage = generateStaffRating(vehicleNameForImage);
                            userScoreForImage = generateCommunityRating(vehicleNameForImage);
                            // Get the image for this specific vehicle
                            vehicleImageUrl = vehicleImageFor(vehicleNameForImage);
                          }
                        }
                        
                        // Use vehicle-specific image if available, otherwise fall back to index-based
                        const imageToUse = vehicleImageUrl || (imageIndex < contentImages.length ? contentImages[imageIndex] : null);
                        
                        // Check if next block is a paragraph - for listicles, render heading first, then image, then paragraph
                        const nextBlock = article.content[index + 1];
                        const isListicleItem = isPremiumArticle && imageToUse && nextBlock?.type === "paragraph";
                        
                        if (isListicleItem) {
                          // Render heading first (above photo)
                          elements.push(
                            <h2 
                              key={`heading-${index}`}
                              id={`heading-${tocIndex}`}
                              className="article__heading"
                            >
                              {block.text}
                            </h2>
                          );
                          
                          // Render image after heading
                        if (imageToUse) {
                          const galleryIndex = imageIndex + 1; // +1 because hero image is at index 0
                          
                          elements.push(
                            <div 
                              key={`image-after-${index}`} 
                              className={`article__image-wrapper ${isPremiumArticle ? 'article__image-wrapper--premium' : ''}`}
                            >
                              {rankingNumber && (
                                <div className="article__image-ranking-badge" data-number={`#${rankingNumber}`}>
                                </div>
                              )}
                              <img 
                                src={imageToUse} 
                                alt={vehicleNameForImage || `${article.title} - Image ${imageIndex + 2}`}
                                className={`article__image article__image-clickable ${isPremiumArticle ? 'article__image--premium' : ''}`}
                                onClick={() => {
                                  if (vehicleNameForImage) {
                                    // Navigate to vehicle page if vehicle name exists
                                    const { year, make, model } = parseVehicleName(vehicleNameForImage);
                                    navigate(`/vehicles/${encodeURIComponent(year)}/${encodeURIComponent(make)}/${encodeURIComponent(model)}`);
                                  } else {
                                    // Otherwise open gallery
                                    handleImageClick(galleryIndex);
                                  }
                                }}
                                style={{ cursor: 'pointer' }}
                              />
                              {vehicleNameForImage && motortrendScoreForImage !== null && userScoreForImage !== null && (
                                <div className="article__image-score-overlay">
                                  <h2 className="article__image-score-vehicle-name">{vehicleNameForImage}</h2>
                                  <div className="article__image-score-ratings-list">
                                    <div className="article__image-score-rating-item">
                                      <div className="article__image-score-rating-label-wrapper">
                                        <span className="article__image-score-rating-label-top">MotorTrend</span>
                                        <span className="article__image-score-rating-label-bottom">Rating</span>
                                      </div>
                                      <div className="article__image-score-rating-value-wrapper">
                                        <span className="article__image-score-rating-value">
                                          {motortrendScoreForImage.toFixed(1)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="article__image-score-rating-item">
                                      <div className="article__image-score-rating-label-wrapper">
                                        <span className="article__image-score-rating-label-top">Community</span>
                                        <span className="article__image-score-rating-label-bottom">
                                          Rating <span className="article__image-score-rating-count">(252)</span>
                                        </span>
                                      </div>
                                      <div className="article__image-score-rating-value-wrapper">
                                        <img 
                                          src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                                          alt="Community Rating Star" 
                                          className="article__image-score-rating-icon community" 
                                        />
                                        <span className="article__image-score-rating-value">
                                          {userScoreForImage.toFixed(1)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <button 
                                    className="article__image-score-cta cta cta--primary cta--default"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const { year, make, model } = parseVehicleName(vehicleNameForImage);
                                      navigate(`/vehicles/${year}/${make}/${model}`);
                                    }}
                                  >
                                    See Local Listings
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                          // Only increment imageIndex if we used the index-based image
                          if (!vehicleImageUrl) {
                            imageIndex++;
                            }
                          }
                        } else {
                          // Original behavior: render heading first, then image
                          // Render the heading
                          elements.push(
                            <h2 
                              key={`heading-${index}`}
                              id={`heading-${tocIndex}`}
                              className="article__heading"
                            >
                              {block.text}
                            </h2>
                          );

                          // Add an image after the heading if available
                          if (imageToUse) {
                            const galleryIndex = imageIndex + 1; // +1 because hero image is at index 0
                            
                            elements.push(
                              <div 
                                key={`image-after-${index}`} 
                                className={`article__image-wrapper ${isPremiumArticle ? 'article__image-wrapper--premium' : ''}`}
                              >
                                {rankingNumber && (
                                  <div className="article__image-ranking-badge" data-number={`#${rankingNumber}`}>
                                  </div>
                                )}
                                <img 
                                  src={imageToUse} 
                                  alt={vehicleNameForImage || `${article.title} - Image ${imageIndex + 2}`}
                                  className={`article__image article__image-clickable ${isPremiumArticle ? 'article__image--premium' : ''}`}
                                  onClick={() => {
                                    if (vehicleNameForImage) {
                                      // Navigate to vehicle page if vehicle name exists
                                      const { year, make, model } = parseVehicleName(vehicleNameForImage);
                                      navigate(`/vehicles/${encodeURIComponent(year)}/${encodeURIComponent(make)}/${encodeURIComponent(model)}`);
                                    } else {
                                      // Otherwise open gallery
                                      handleImageClick(galleryIndex);
                                    }
                                  }}
                                  style={{ cursor: 'pointer' }}
                                />
                                {vehicleNameForImage && motortrendScoreForImage !== null && userScoreForImage !== null && (
                                  <div className="article__image-score-overlay">
                                    <h2 className="article__image-score-vehicle-name">{vehicleNameForImage}</h2>
                                    <div className="article__image-score-ratings-list">
                                      <div className="article__image-score-rating-item">
                                        <div className="article__image-score-rating-label-wrapper">
                                          <span className="article__image-score-rating-label-top">MotorTrend</span>
                                          <span className="article__image-score-rating-label-bottom">Rating</span>
                                        </div>
                                        <div className="article__image-score-rating-value-wrapper">
                                          <span className="article__image-score-rating-value">
                                            {motortrendScoreForImage.toFixed(1)}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="article__image-score-rating-item">
                                        <div className="article__image-score-rating-label-wrapper">
                                          <span className="article__image-score-rating-label-top">Community</span>
                                          <span className="article__image-score-rating-label-bottom">
                                            Rating <span className="article__image-score-rating-count">(252)</span>
                                          </span>
                                        </div>
                                        <div className="article__image-score-rating-value-wrapper">
                                          <img 
                                            src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                                            alt="Community Rating Star" 
                                            className="article__image-score-rating-icon community" 
                                          />
                                          <span className="article__image-score-rating-value">
                                            {userScoreForImage.toFixed(1)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <button 
                                      className="article__image-score-cta cta cta--primary cta--default"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const { year, make, model } = parseVehicleName(vehicleNameForImage);
                                        navigate(`/vehicles/${year}/${make}/${model}`);
                                      }}
                                    >
                                      See Local Listings
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                            // Only increment imageIndex if we used the index-based image
                            if (!vehicleImageUrl) {
                              imageIndex++;
                            }
                          }
                        }
                      } else if (block.type === "paragraph") {
                        paragraphCount++;
                        
                        // Render the paragraph
                        elements.push(
                          <p key={`paragraph-${index}`} className="article__paragraph">
                            {block.text}
                          </p>
                        );

                        // Add MotorTrend Score component after the 8th paragraph (skip for premium articles)
                        if (paragraphCount === 8 && !isPremiumArticle) {
                          elements.push(
                            <div key="motortrend-score" id="motortrend-score" className="article__motortrend-score">
                              <div className="article__motortrend-header">
                                <div className="article__motortrend-title-group">
                                  <h2>MotorTrend Score</h2>
                                  <div 
                                    ref={scoreInfoRef}
                                    className="article__score-info-icon"
                                    onMouseEnter={handleScoreInfoTooltipMouseEnter}
                                    onMouseLeave={handleScoreInfoTooltipMouseLeave}
                                  >
                                    <Icon name="info" variant="outlined" size={20} />
                                    {isScoreInfoTooltipVisible && (
                                      <div 
                                        className="article__score-info-tooltip"
                                        onMouseEnter={handleScoreInfoTooltipMouseEnter}
                                        onMouseLeave={handleScoreInfoTooltipMouseLeave}
                                      >
                                        <p>
                                          MotorTrend scores vehicles based on comprehensive testing of performance, efficiency, technology, and value. Our expert reviewers evaluate each vehicle through rigorous standardized testing procedures to provide objective ratings. 
                                          <Link to="/article/how-motortrend-tests-cars" className="article__score-info-link">Learn more about how MotorTrend tests cars</Link>.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <img 
                                  src="https://d2kde5ohu8qb21.cloudfront.net/files/68f6570b3ed26800022d87b6/mt-logo2.svg" 
                                  alt="MotorTrend Logo" 
                                  className="article__motortrend-logo"
                                />
                              </div>
                              <div className="article__score-card">
                                <div className="article__score-header">
                                  <h3>{motortrendScore.vehicleName}</h3>
                                  <div className="article__score-award">
                                    <img 
                                      src="https://d2kde5ohu8qb21.cloudfront.net/files/690203caffe978000201e639/trophie-11.svg" 
                                      alt="Trophy" 
                                      width={24} 
                                      height={24}
                                    />
                                    <span>{motortrendScore.award}</span>
                                    <Icon name="keyboard_arrow_down" size={16} />
                                  </div>
                                </div>
                                <div className="article__score-content">
                                  <div className="article__overall-score">
                                    <div className="article__score-circle">
                                      <span className="article__score-number">{typeof motortrendScore.overallRating === 'number' ? motortrendScore.overallRating.toFixed(1) : motortrendScore.overallRating}</span>
                                      <span className="article__score-label">MotorTrend Rating</span>
                                    </div>
                                  </div>
                                  <div className="article__score-breakdown">
                                    <div className="article__score-item">
                                      <span>Performance</span>
                                      <div className="article__score-bar">
                                        <div className="article__score-bar-fill" style={{ width: `${(motortrendScore.scores.performance / 10) * 100}%` }}></div>
                                      </div>
                                      <span>{motortrendScore.scores.performance.toFixed(1)}</span>
                                    </div>
                                    <div className="article__score-item">
                                      <span>Efficiency/Range</span>
                                      <div className="article__score-bar">
                                        <div className="article__score-bar-fill" style={{ width: `${(motortrendScore.scores.efficiency / 10) * 100}%` }}></div>
                                      </div>
                                      <span>{motortrendScore.scores.efficiency.toFixed(1)}</span>
                                    </div>
                                    <div className="article__score-item">
                                      <span>Tech/Innovation</span>
                                      <div className="article__score-bar">
                                        <div className="article__score-bar-fill" style={{ width: `${(motortrendScore.scores.tech / 10) * 100}%` }}></div>
                                      </div>
                                      <span>{motortrendScore.scores.tech.toFixed(1)}</span>
                                    </div>
                                    <div className="article__score-item">
                                      <span>Value</span>
                                      <div className="article__score-bar">
                                        <div className="article__score-bar-fill" style={{ width: `${(motortrendScore.scores.value / 10) * 100}%` }}></div>
                                      </div>
                                      <span>{motortrendScore.scores.value.toFixed(1)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="article__score-review">
                                  <div className="article__reviewer-section">
                                    <div className="article__reviewer-avatar-group">
                                      <img 
                                        src={motortrendScore.reviewer.avatar} 
                                        alt="Reviewer avatar" 
                                        className="article__reviewer-avatar"
                                        width={43}
                                        height={43}
                                      />
                                    </div>
                                    <div className="article__reviewer-info">
                                      <div className="article__reviewer-header">
                                        <div className="article__reviewer-name-group">
                                          <span className="article__reviewer-name">{motortrendScore.reviewer.name}</span>
                                        </div>
                                        <div className="article__reviewer-meta">
                                          <span className="article__reviewer-date">Driven, tested | {motortrendScore.reviewer.date}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <h3>{motortrendScore.reviewer.title}</h3>
                                  <p>{motortrendScore.reviewer.excerpt}</p>
                                  
                                  {/* Read Full Review Accordion CTA */}
                                  <div className="article__review-accordion">
                                    <button
                                      className="article__review-accordion-button"
                                      onClick={() => setIsReviewAccordionOpen(!isReviewAccordionOpen)}
                                      aria-expanded={isReviewAccordionOpen}
                                    >
                                      <span>Read Full Review</span>
                                      <svg
                                        className={`article__review-accordion-chevron ${isReviewAccordionOpen ? 'article__review-accordion-chevron--open' : ''}`}
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M5 7.5L10 12.5L15 7.5"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </button>
                                    {isReviewAccordionOpen && (
                                      <div className="article__review-accordion-content">
                                        <div className="article__review-accordion-text">
                                          {motortrendScore.reviewer.detailedSections ? (
                                            motortrendScore.reviewer.detailedSections.map((section, index) => (
                                              <div key={index} className="article__review-section">
                                                <h4 className="article__review-section-title">{section.title}</h4>
                                                {section.content.split('\n\n').map((paragraph, pIndex) => (
                                                  <p key={pIndex}>{paragraph}</p>
                                                ))}
                                              </div>
                                            ))
                                          ) : (
                                            <>
                                              <h4>Detailed Review</h4>
                                              <p>
                                                {motortrendScore.reviewer.excerpt} The vehicle has been thoroughly tested across various conditions, 
                                                from daily commuting to extended highway journeys. Performance metrics have been evaluated 
                                                including acceleration, braking, handling, and overall driving dynamics. The interior quality, 
                                                technology integration, and overall value proposition have been carefully assessed to provide 
                                                a comprehensive evaluation.
                                              </p>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      }

                      return elements;
                    }).flat();
                  })()}

              {/* Specifications Table */}
              {article.specifications && (
                <div className="article__specs">
                  <h2 className="article__specs-title">{vehicleName} Specifications</h2>
                  <table className="article__specs-table">
                    <tbody>
                      {article.specifications.basePrice && (
                        <tr>
                          <td className="article__specs-label">BASE PRICE</td>
                          <td className="article__specs-value">{article.specifications.basePrice}</td>
                        </tr>
                      )}
                      {article.specifications.layout && (
                        <tr>
                          <td className="article__specs-label">LAYOUT</td>
                          <td className="article__specs-value">{article.specifications.layout}</td>
                        </tr>
                      )}
                      {article.specifications.motors && (
                        <tr>
                          <td className="article__specs-label">MOTORS</td>
                          <td className="article__specs-value">{article.specifications.motors}</td>
                        </tr>
                      )}
                      {article.specifications.transmission && (
                        <tr>
                          <td className="article__specs-label">TRANSMISSION</td>
                          <td className="article__specs-value">{article.specifications.transmission}</td>
                        </tr>
                      )}
                      {article.specifications.curbWeight && (
                        <tr>
                          <td className="article__specs-label">CURB WEIGHT</td>
                          <td className="article__specs-value">{article.specifications.curbWeight}</td>
                        </tr>
                      )}
                      {article.specifications.wheelbase && (
                        <tr>
                          <td className="article__specs-label">WHEELBASE</td>
                          <td className="article__specs-value">{article.specifications.wheelbase}</td>
                        </tr>
                      )}
                      {article.specifications.dimensions && (
                        <tr>
                          <td className="article__specs-label">L x W x H</td>
                          <td className="article__specs-value">{article.specifications.dimensions}</td>
                        </tr>
                      )}
                      {article.specifications.zeroToSixty && (
                        <tr>
                          <td className="article__specs-label">0–60 MPH</td>
                          <td className="article__specs-value">{article.specifications.zeroToSixty}</td>
                        </tr>
                      )}
                      {article.specifications.epaFuelEcon && (
                        <tr>
                          <td className="article__specs-label">EPA CITY / HWY / COMB FUEL ECON</td>
                          <td className="article__specs-value">{article.specifications.epaFuelEcon}</td>
                        </tr>
                      )}
                      {article.specifications.epaRange && (
                        <tr>
                          <td className="article__specs-label">EPA RANGE, COMB</td>
                          <td className="article__specs-value">{article.specifications.epaRange}</td>
                        </tr>
                      )}
                      {article.specifications.onSale && (
                        <tr>
                          <td className="article__specs-label">ON SALE</td>
                          <td className="article__specs-value">{article.specifications.onSale}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            {/* Photo Gallery Bento Module */}
            {articleImages.length > 1 && (
              <div className="article__photo-gallery-bento">
                <div className="article__photo-gallery-header">
                  <h3 className="article__photo-gallery-title">Photo Gallery</h3>
                  <button
                    className="article__photo-gallery-view-all cta cta--ghost cta--default"
                    onClick={() => handleImageClick(0)}
                  >
                    View All Photos
                  </button>
                </div>
                <div className="article__photo-gallery-grid">
                  {articleImages.slice(0, 6).map((image, index) => (
                    <div
                      key={index}
                      className={`article__photo-gallery-item article__photo-gallery-item--${index === 0 ? 'large' : index < 3 ? 'medium' : 'small'}`}
                      onClick={() => handleImageClick(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${article.title} - Photo ${index + 1}`}
                        className="article__photo-gallery-thumb"
                      />
                      <div className="article__photo-gallery-overlay">
                        <Icon name="open_in_full" size={24} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

              {/* Author Bio */}
              <div className="article__author-bio">
                <h3 className="article__author-bio-title">{article.author}</h3>
                <p className="article__author-bio-text">
                  Alex's earliest memory is of a teal 1993 Ford Aspire, the car that sparked his automotive obsession. He's never driven that tiny hatchback—at six feet, 10 inches tall, he likely wouldn't fit—but has assessed hundreds of other vehicles, sharing his insights on MotorTrend as a writer and video host.
                </p>
              </div>

              {/* User Reviews */}
              <div id="community-ratings" className="article__user-reviews">
                <UserReviews
                  vehicleName={vehicleName}
                  communityRating={communityRating}
                  totalReviews={communityRatingCount}
                  ratingDistribution={[5, 3, 8, 10, 20, 30, 45, 63, 50, 18]}
                  vehicleImage={article.heroImage}
                  reviews={reviews}
                  onWriteReview={() => setIsWriteReviewModalOpen(true)}
                  onUpdateReview={handleUpdateReview}
                  defaultTab="comments"
                  activeTab={reviewsTabActive === true ? 'reviews' : reviewsTabActive === false ? 'comments' : undefined}
                />
              </div>

              {/* Local Listings */}
              <div id="local-listings" className="article__listings">
                <h2 className="article__listings-title">Local Listings</h2>
                <div className="article__listings-grid">
                  {isLoadingListings ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--color-neutrals-4)' }}>
                      Loading listings...
                    </div>
                  ) : listings.length > 0 ? (
                    listings.map((listing) => (
                      <div key={listing.id} className="article__listing-card">
                        <div className="article__listing-image">
                          <img src={listing.image || article.heroImage} alt={listing.name} />
                        </div>
                        <div className="article__listing-info">
                          <div className="article__listing-price">{listing.price}</div>
                          <div className="article__listing-name">{listing.name}</div>
                          <div className="article__listing-details">
                            <span>
                              <Icon name="speed" size={16} />
                              {listing.mileage}
                            </span>
                            <span>
                              <Icon name="location_on" size={16} />
                              {listing.dealer}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--color-neutrals-4)' }}>
                      No listings available at this time.
                    </div>
                  )}
                </div>
              </div>

              {/* Lazy Loaded Articles Section */}
              {lazyLoadedArticles.length > 0 && (
                <div className="article__lazy-articles">
                  <h2 className="article__lazy-articles-title">More Articles</h2>
                  <div className="article__lazy-articles-grid">
                    {lazyLoadedArticles.map((article) => (
                      <Link
                        key={article.slug}
                        to={`/articles/${article.slug}`}
                        className="article__lazy-article-card"
                      >
                        <div className="article__lazy-article-image">
                          <img src={article.imageUrl} alt={article.title} />
                        </div>
                        <div className="article__lazy-article-content">
                          <h3 className="article__lazy-article-title">{article.title}</h3>
                          <p className="article__lazy-article-excerpt">{article.excerpt}</p>
                          <p className="article__lazy-article-meta">
                            {article.author} | {article.date}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {/* Intersection Observer target */}
                  {articlesToShow < allArticles.length && (
                    <div ref={loadMoreArticlesRef} className="article__lazy-load-trigger">
                      <div className="article__lazy-load-spinner">Loading more articles...</div>
                    </div>
                  )}
                </div>
              )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar (1/3) - Hidden for premium articles */}
          {!isPremiumArticle && (
            <div className="article__sidebar">
              {/* Ad Container */}
              <div className="article__sidebar-section">
                <AdContainer
                  width={300}
                  height={600}
                  label="300 x 600"
                  position="right-column"
                  imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/69116380f5e41e00020d3432/822789964589118228.jpeg"
                />
              </div>

              {/* Related Articles */}
              <div className="article__sidebar-section">
                <h3 className="article__sidebar-title">Related Articles</h3>
                <div className="article__sidebar-articles">
                  {relatedArticles.map((relatedArticle) => (
                    <div 
                      key={relatedArticle.id}
                      className="article__sidebar-article"
                      onClick={() => handleRelatedArticleClick(relatedArticle.slug)}
                    >
                      <div className="article__sidebar-article-image">
                        <img 
                          src={relatedArticle.imageUrl} 
                          alt={relatedArticle.title}
                        />
                      </div>
                      <div className="article__sidebar-article-content">
                        <h4>{relatedArticle.title}</h4>
                        <p className="article__sidebar-article-meta">
                          {relatedArticle.author} | {relatedArticle.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Rate Bar - appears when scrolled */}
      {!shouldHideRatingBar && (
      <div className={`article__sticky-rate-bar ${isStickyBarVisible ? 'article__sticky-rate-bar--visible' : ''}`}>
        <div className="article__sticky-rate-bar-content">
          {vehiclePath ? (
            <Link to={vehiclePath} className="article__sticky-vehicle-name">
              {vehicleName}
            </Link>
          ) : (
            <div className="article__sticky-vehicle-name">
              {vehicleName}
            </div>
          )}
          <div className="article__sticky-ratings">
            <div 
              className="article__sticky-rating-item article__sticky-rating-item--staff" 
              onClick={handleScrollToStaffRating}
            >
              <div className="article__sticky-rating-label-wrapper">
                <span className="article__sticky-rating-label-top">MotorTrend</span>
                <span className="article__sticky-rating-label-bottom">Rating</span>
              </div>
              <span className="article__sticky-rating-value">{staffRating}</span>
            </div>
            <div 
              className="article__sticky-rating-item article__sticky-rating-item--community" 
              onClick={handleScrollToCommunityRatings}
            >
              <div className="article__sticky-rating-label-wrapper">
                <span className="article__sticky-rating-label-top">Community</span>
                <span className="article__sticky-rating-label-bottom">Rating ({communityRatingCount})</span>
              </div>
              <img 
                src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                alt="Community Rating Star" 
                className="article__sticky-rating-icon" 
              />
              <span className="article__sticky-rating-value">
                {communityRating % 1 === 0 
                  ? communityRating 
                  : communityRating.toFixed(1)}
              </span>
            </div>
            <button 
              className="article__sticky-rating-item article__sticky-rate-btn article__sticky-rate-btn--mobile-hide" 
              onClick={handleOpenRatingModal}
            >
              {userRating > 0 ? (
                <>
                  <div className="article__sticky-rating-label-wrapper">
                    <span className="article__sticky-rating-label-top">Your</span>
                    <span className="article__sticky-rating-label-bottom">Rating</span>
                  </div>
                  <img 
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                    alt="Your Rating Star" 
                    className="article__sticky-rating-icon" 
                  />
                  <span className="article__sticky-rating-value">{userRating}</span>
                </>
              ) : (
                <>
                  <span className="article__sticky-rating-label">Rate Your Car</span>
                  <img 
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg"
                    alt="Add Rating Star" 
                    className="article__sticky-rating-icon" 
                  />
                </>
              )}
            </button>
          </div>
          <button 
            className="article__sticky-cta"
            onClick={() => {
              // Scroll to local listings section or handle navigation
              const listingsSection = document.querySelector('.article__listings');
              if (listingsSection) {
                listingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                // If no listings section exists, could navigate to a listings page
                // For now, just log or handle as needed
                console.log('Navigate to local listings');
              }
            }}
          >
            Local Listings
          </button>
        </div>
      </div>
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={handleCloseRatingModal}
        vehicleName={vehicleName}
        onRate={handleSubmitRating}
        onRateAndReview={handleRateAndReview}
        onClear={handleClearRating}
        currentRating={userRating}
        hasExistingReview={hasExistingReview}
      />

      {/* Write Review Modal */}
      <WriteReviewModal
        key={`${vehicleName}-write-review-${hasExistingReview ? 'edit' : 'new'}`}
        isOpen={isWriteReviewModalOpen}
        onClose={() => {
          setIsWriteReviewModalOpen(false);
          // Don't clear reviewModalRating immediately - let it persist until next submission
          // This prevents the key from changing and causing remounts
        }}
        vehicleName={vehicleName}
        vehicleImage={article.heroImage}
        initialRating={reviewModalRating}
        existingReview={existingUserReview}
        isEditMode={hasExistingReview}
        onSubmit={(review) => {
          console.log('Article: onSubmit called with review:', review);
          console.log('Article: vehicleName:', vehicleName);
          console.log('Article: isEditMode:', hasExistingReview, 'existingReview:', existingUserReview);
          
          if (!vehicleName || vehicleName.trim() === '') {
            console.error('Article: Cannot save review - vehicleName is empty');
            return;
          }
          
          try {
            // Remove the _vehicleName helper property from review before processing
            const reviewWithVehicleName = review as ReviewData & { _vehicleName?: string };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _vehicleName, ...cleanReview } = reviewWithVehicleName;
            
            console.log('Article: Processing review, cleanReview:', cleanReview);
            
            // Convert File objects to preview URLs for display
            const reviewWithPreviews: ReviewData = {
              ...cleanReview,
              mediaPreviews: cleanReview.mediaFiles?.map((file: File) => URL.createObjectURL(file)) || []
            };
            
            // Use the same key format as VehicleDetails page for consistency
            const savedReviewsKey = `vehicleReviews_${vehicleName}`;
            console.log('Article: Using localStorage key:', savedReviewsKey);
            
            // Get existing reviews
            const savedReviewsJson = localStorage.getItem(savedReviewsKey);
            const savedReviews: ReviewData[] = savedReviewsJson ? JSON.parse(savedReviewsJson) : [];
            console.log('Article: Found', savedReviews.length, 'existing reviews');
            
            // If editing, update the existing review; otherwise add a new one
            let updatedReviews: ReviewData[];
            if (hasExistingReview && existingUserReview) {
              // Update existing review - preserve original date, add updatedDate
              const reviewToUpdate: ReviewData = {
                ...reviewWithPreviews,
                id: existingUserReview.id, // Keep original ID
                date: existingUserReview.date, // Keep original date
                updatedDate: new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
              };
              updatedReviews = savedReviews.map(r => 
                r.id === existingUserReview.id ? reviewToUpdate : r
              );
              console.log('Article: Updated existing review with ID:', existingUserReview.id);
            } else {
              // Add the new review at the beginning
              updatedReviews = [reviewWithPreviews, ...savedReviews];
              console.log('Article: Added new review, total reviews:', updatedReviews.length);
            }
            
            // Save to localStorage (convert File objects to strings for storage)
            // Note: File objects can't be serialized, so we only save the preview URLs
            const reviewsToSave = updatedReviews.map(r => ({
              ...r,
              mediaFiles: undefined, // Remove File objects as they can't be serialized
              mediaPreviews: r.mediaPreviews || [] // Keep preview URLs
            }));
            
            localStorage.setItem(savedReviewsKey, JSON.stringify(reviewsToSave));
            console.log('Article: Successfully saved review to localStorage for:', vehicleName);
            
            // Verify the save worked
            const verifySave = localStorage.getItem(savedReviewsKey);
            if (verifySave) {
              const verifyReviews = JSON.parse(verifySave);
              console.log('Article: Verified save -', verifyReviews.length, 'reviews in localStorage');
            } else {
              console.error('Article: Save verification failed - no data found in localStorage');
            }
            
            // Mark that we just saved a review to prevent useEffect from overwriting
            justSavedReviewRef.current = true;
            
            // Update local state IMMEDIATELY using functional update to prevent race conditions
            // This ensures the new review appears right away, even if useEffect runs
            setReviews(() => {
              // Get generated reviews (these are static, so we can compute them)
              const generatedReviews = generateUserReviews(vehicleName);
              const generatedIds = new Set(generatedReviews.map(r => r.id));
              
              // Filter out any generated reviews from our updated list
              const uniqueSavedReviews = updatedReviews.filter(r => !generatedIds.has(r.id));
              
              // Combine: saved reviews (with our new one) + generated reviews
              const newReviewsList = [...uniqueSavedReviews, ...generatedReviews];
              
              console.log('Article: Updated local reviews state, total reviews:', newReviewsList.length);
              console.log('Article: New review ID:', reviewWithPreviews.id);
              console.log('Article: New review title:', reviewWithPreviews.title);
              
              return newReviewsList;
            });
            
            // Only increment count if it's a new review, not an edit
            if (!hasExistingReview) {
              setCommunityRatingCount(prev => prev + 1);
            }
            
            // Close modal immediately after successful save
            setIsWriteReviewModalOpen(false);
            console.log('Article: Modal closed after successful save');
            
            // Show success toast after a brief delay
            setTimeout(() => {
              setIsToastVisible(true);
              console.log('Article: Showing success toast');
            }, 300);
            
            // Clear rating and reset flag after everything is done
            setTimeout(() => {
              setReviewModalRating(undefined);
              justSavedReviewRef.current = false;
            }, 1500);
          } catch (error) {
            console.error('Article: Error saving review:', error);
            alert('Failed to save review. Please try again.');
          }
        }}
      />

      {/* Review Submitted Modal */}
      <ReviewSubmittedToast
        isVisible={isToastVisible}
        onClose={handleCloseToast}
        onViewReview={handleViewReview}
        vehicleName={vehicleName}
      />

      {/* Photo Gallery Modal */}
      {galleryOpen && articleImages.length > 0 && (
        <div className="article__gallery-modal" onClick={handleCloseGallery}>
          <div className="article__gallery-content" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              className="article__gallery-close-btn"
              onClick={handleCloseGallery}
              aria-label="Close gallery"
            >
              <Icon name="close" size={24} />
            </button>

            {/* Navigation Buttons */}
            {articleImages.length > 1 && (
              <>
                <button
                  className="article__gallery-nav article__gallery-nav--prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGalleryPrev();
                  }}
                  aria-label="Previous image"
                >
                  <Icon name="chevron_left" size={24} />
                </button>
                <button
                  className="article__gallery-nav article__gallery-nav--next"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGalleryNext();
                  }}
                  aria-label="Next image"
                >
                  <Icon name="chevron_right" size={24} />
                </button>
              </>
            )}

            {/* Gallery Image */}
            <div className="article__gallery-image-wrapper">
              <img 
                src={articleImages[currentImageIndex]} 
                alt={`${article.title} - Image ${currentImageIndex + 1}`}
                className="article__gallery-image"
              />
            </div>

            {/* Image Counter */}
            {articleImages.length > 1 && (
              <div className="article__gallery-counter">
                {currentImageIndex + 1} / {articleImages.length}
              </div>
            )}

            {/* Gallery Dots */}
            {articleImages.length > 1 && (
              <div className="article__gallery-dots">
                {articleImages.map((_, index) => (
                  <button
                    key={index}
                    className={`article__gallery-dot ${index === currentImageIndex ? 'article__gallery-dot--active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGalleryGoTo(index);
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saved Modal */}
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        itemTitle={article.title}
        itemType="article"
      />
    </div>
  );
};

export default Article;

