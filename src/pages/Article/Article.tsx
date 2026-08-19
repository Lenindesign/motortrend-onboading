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
import { Badge } from '../../components/atoms/Badge/Badge';
import { ActionBadge } from '../../components/molecules/ActionBadge';
import { AuthPromptModal } from '../../components/AuthPromptModal';
import { generateUserReviews } from '../../utils/vehicleUserReviews';
import { generateCommunityRating, generateStaffRating } from '../../utils/vehicleRatings';
import { getVehicleByName } from '../../api/vehiclesApi';
import { useRating } from '../../contexts/RatingContext';
import { useAuth } from '../../contexts/AuthContext';
import { type ReviewData } from '../../components/UserReviews';
import { getArticleBySlug, getDefaultArticle, articles } from '../../utils/articles';
import { parseVehicleName } from '../../utils/vehicleImages';
import { fetchVehicleListings, type VehicleListing } from '../../utils/vehicleListings';
import { vehicleImageFor } from '../../utils/vehicleImages';
// HIDDEN: import { ArticleReactions } from '../../components/ArticleReactions';
import { QAModal, type QAItem } from '../../components/QAModal';
import StickyRateBar from '../../components/StickyRateBar';
import ArticleHero from '../../components/ArticleHero/ArticleHero';
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
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingModalVehicleName, setRatingModalVehicleName] = useState('');
  const [reviewModalRating, setReviewModalRating] = useState<number | undefined>(undefined);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [communityRatingCount, setCommunityRatingCount] = useState(25);
  const [isVehicleAccordionOpen] = useState(false);
  const [reviewsTabActive, setReviewsTabActive] = useState<boolean | undefined>(undefined);
  const [listings, setListings] = useState<VehicleListing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const justSavedReviewRef = useRef<boolean>(false);
  const loadMoreArticlesRef = useRef<HTMLDivElement>(null);
  const { getUserRating, setUserRating, clearRating } = useRating();
  const { isAuthenticated } = useAuth();

  // Auth prompt modal state
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [authPromptAction, setAuthPromptAction] = useState<'rate' | 'review' | 'save' | 'comment'>('rate');

  // Q&A modal state
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);
  const [qaQuestions, setQaQuestions] = useState<QAItem[]>([]);

  // Photo gallery state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Lazy load articles state
  const [articlesToShow, setArticlesToShow] = useState(5);

  // Sticky bar vehicle selector (comparison articles: which vehicle's ratings to show in the bar)
  const [selectedStickyVehicleIndex, setSelectedStickyVehicleIndex] = useState(0);

  // Helper function to render star rating (0-10 scale, displays as 0-5 stars)
  const renderStarRating = (ratingValue: number) => {
    // ratingValue is already on 0-10 scale, convert to 0-5 scale for display
    const normalizedRating = ratingValue / 2;

    return (
      <div className="article__rating-stars">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star < Math.ceil(normalizedRating);
          const isHalf = star === Math.ceil(normalizedRating) && normalizedRating % 1 !== 0;

          return (
            <div key={star} className={`article__star-wrapper ${isHalf ? 'article__star-wrapper--half' : ''}`}>
              {/* Outline star */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="article__star article__star--outline">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="none"
                  stroke="#33C4FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Filled star (full or half) */}
              {isFilled && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="article__star article__star--filled">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="#33C4FF"
                  />
                </svg>
              )}
              {isHalf && (
                <div className="article__star-half-fill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="article__star">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="#33C4FF"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Load article data based on slug
  const articleData = useMemo(() => {
    const loadedArticle = slug ? getArticleBySlug(slug) : getDefaultArticle();
    if (!loadedArticle) {
      // Fallback to default if article not found
      return getDefaultArticle();
    }
    return loadedArticle;
  }, [slug]);

  // Generate consistent comment count based on article slug
  const commentCount = useMemo(() => {
    const hash = (slug || 'default').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.floor((hash % 50) + 10); // Random count between 10-59
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

  // Check if this is a comparison article with multiple vehicles
  const comparisonVehicles = useMemo(() => {
    return articleData.comparisonVehicles || [];
  }, [articleData]);

  const isComparisonArticle = comparisonVehicles.length > 1;
  const primaryVehicle = isComparisonArticle ? comparisonVehicles[0] : vehicleName;
  const additionalVehicles = isComparisonArticle ? comparisonVehicles.slice(1) : [];

  // Parse vehicle name to get year, make, and model for navigation
  const vehiclePath = useMemo(() => {
    const targetVehicle = isComparisonArticle ? primaryVehicle : vehicleName;
    if (!targetVehicle) return null;
    const { year, make, model } = parseVehicleName(targetVehicle);
    return `/vehicles/${year}/${make}/${model}`;
  }, [vehicleName, isComparisonArticle, primaryVehicle]);

  // For comparison articles: which vehicle is selected in the sticky bar (name + path + ratings)
  const stickyBarVehicleName = isComparisonArticle ? comparisonVehicles[selectedStickyVehicleIndex] : vehicleName;
  const stickyBarVehiclePath = useMemo(() => {
    if (!stickyBarVehicleName) return null;
    const { year, make, model } = parseVehicleName(stickyBarVehicleName);
    return `/vehicles/${year}/${make}/${model}`;
  }, [stickyBarVehicleName]);
  const apiVehicleDataForBar = useMemo(() => getVehicleByName(stickyBarVehicleName), [stickyBarVehicleName]);
  const staffRatingForBar = useMemo(() => {
    if (apiVehicleDataForBar?.staffRating != null) return apiVehicleDataForBar.staffRating;
    if (articleData.motortrendScore?.overallRating != null && stickyBarVehicleName === vehicleName) return articleData.motortrendScore.overallRating;
    return generateStaffRating(stickyBarVehicleName);
  }, [apiVehicleDataForBar, articleData.motortrendScore, stickyBarVehicleName, vehicleName]);
  const communityRatingForBar = useMemo(() => apiVehicleDataForBar?.communityRating ?? generateCommunityRating(stickyBarVehicleName), [apiVehicleDataForBar, stickyBarVehicleName]);
  const userRatingForBar = getUserRating(stickyBarVehicleName);

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

    if (!isAuthenticated) {
      setAuthPromptAction('save');
      setIsAuthPromptOpen(true);
      return;
    }

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

  // Generate sample Q&A data based on the article/vehicle
  useEffect(() => {
    const generateQAData = (): QAItem[] => {
      const vName = vehicleName || articleData.title;
      const hash = (slug || 'default').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

      // Load user-submitted questions from localStorage
      const savedQAKey = `articleQA_${slug || 'default'}`;
      let savedQuestions: QAItem[] = [];
      try {
        const savedJson = localStorage.getItem(savedQAKey);
        if (savedJson) {
          savedQuestions = JSON.parse(savedJson);
        }
      } catch (e) {
        console.error('Error loading saved Q&A:', e);
      }

      // Generate seed questions based on the article
      const seedQuestions: QAItem[] = [
        {
          id: `q-seed-1-${hash}`,
          question: `How does the ${vName} compare to its competitors in terms of daily drivability?`,
          author: 'CarEnthusiast42',
          date: 'Jan 15, 2026',
          upvotes: 24,
          isEditorPick: true,
          answers: [
            {
              id: `a-seed-1-1-${hash}`,
              text: `Great question! In our testing, the ${vName} excels in daily driving scenarios. The ride quality is smooth, visibility is good, and the infotainment system is intuitive. It handles highway cruising and city traffic equally well.`,
              author: articleData.author,
              isEditor: true,
              date: 'Jan 16, 2026',
              upvotes: 18,
            },
            {
              id: `a-seed-1-2-${hash}`,
              text: `I've owned one for 3 months now and it's been fantastic for my commute. The adaptive cruise control works flawlessly in stop-and-go traffic.`,
              author: 'DailyDriver2025',
              date: 'Jan 17, 2026',
              upvotes: 7,
            },
          ],
        },
        {
          id: `q-seed-2-${hash}`,
          question: `What's the real-world fuel economy/range like compared to the EPA estimates?`,
          author: 'EcoMinded',
          date: 'Jan 12, 2026',
          upvotes: 19,
          answers: [
            {
              id: `a-seed-2-1-${hash}`,
              text: `During our long-term testing, we found the real-world numbers to be within 5-8% of EPA estimates, which is pretty typical. Highway driving tends to match closely, while city driving can vary more depending on your habits.`,
              author: articleData.author,
              isEditor: true,
              date: 'Jan 13, 2026',
              upvotes: 12,
            },
          ],
        },
        {
          id: `q-seed-3-${hash}`,
          question: `Is the base model worth it, or should I step up to the mid trim?`,
          author: 'SmartBuyer',
          date: 'Jan 10, 2026',
          upvotes: 15,
          answers: [
            {
              id: `a-seed-3-1-${hash}`,
              text: `The mid trim adds meaningful features like heated seats, a larger display, and better driver assistance tech. If it fits your budget, the mid trim offers the best value-to-features ratio in the lineup.`,
              author: articleData.author,
              isEditor: true,
              date: 'Jan 11, 2026',
              upvotes: 9,
            },
            {
              id: `a-seed-3-2-${hash}`,
              text: `I went with the base and honestly I'm happy. The standard features are solid and the ride quality is the same across trims. Save the money unless you really want the tech package.`,
              author: 'BudgetFirst',
              date: 'Jan 12, 2026',
              upvotes: 5,
            },
            {
              id: `a-seed-3-3-${hash}`,
              text: `Mid trim all the way. The wireless CarPlay alone is worth it, plus the premium audio system is significantly better.`,
              author: 'TechLover99',
              date: 'Jan 13, 2026',
              upvotes: 3,
            },
          ],
        },
        {
          id: `q-seed-4-${hash}`,
          question: `How's the back seat space for car seats and kids?`,
          author: 'ParentLife',
          date: 'Jan 8, 2026',
          upvotes: 11,
          answers: [],
        },
        {
          id: `q-seed-5-${hash}`,
          question: `Are there any common reliability concerns to watch out for?`,
          author: 'ReliabilityMatters',
          date: 'Jan 5, 2026',
          upvotes: 8,
          answers: [
            {
              id: `a-seed-5-1-${hash}`,
              text: `It's still relatively early to make long-term reliability claims, but so far we haven't encountered any major issues during our extended testing period. The build quality feels solid overall.`,
              author: articleData.author,
              isEditor: true,
              date: 'Jan 6, 2026',
              upvotes: 6,
            },
          ],
        },
      ];

      // Merge saved questions with seed questions (saved take priority by ID)
      const savedIds = new Set(savedQuestions.map(q => q.id));
      const uniqueSeedQuestions = seedQuestions.filter(q => !savedIds.has(q.id));
      return [...savedQuestions, ...uniqueSeedQuestions];
    };

    setQaQuestions(generateQAData());
  }, [slug, vehicleName, articleData]);

  // Save Q&A activity to user profile in localStorage
  const saveQAToProfile = (activity: {
    type: 'asked' | 'liked';
    questionId: string;
    questionText: string;
    articleSlug: string;
    articleTitle: string;
    date: string;
  }) => {
    try {
      const key = 'userQAActivity';
      const existing = localStorage.getItem(key);
      const activities: typeof activity[] = existing ? JSON.parse(existing) : [];

      // Avoid duplicates (same question + same type)
      const isDuplicate = activities.some(
        a => a.questionId === activity.questionId && a.type === activity.type
      );
      if (!isDuplicate) {
        activities.unshift(activity);
        // Keep only last 50 activities
        localStorage.setItem(key, JSON.stringify(activities.slice(0, 50)));
      }
    } catch (e) {
      console.error('Error saving Q&A activity to profile:', e);
    }
  };

  // Q&A handlers
  const handleSubmitQuestion = (questionText: string) => {
    if (!isAuthenticated) {
      setAuthPromptAction('comment');
      setIsAuthPromptOpen(true);
      return;
    }

    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newQ: QAItem = {
      id: `q-user-${Date.now()}`,
      question: questionText,
      author: 'You',
      date: now,
      upvotes: 0,
      answers: [],
    };

    // Save to user profile
    saveQAToProfile({
      type: 'asked',
      questionId: newQ.id,
      questionText: questionText,
      articleSlug: slug || 'default',
      articleTitle: article.title,
      date: now,
    });

    setQaQuestions(prev => {
      const updated = [newQ, ...prev];
      // Save to localStorage
      try {
        const savedQAKey = `articleQA_${slug || 'default'}`;
        const userQuestions = updated.filter(q => q.id.startsWith('q-user-'));
        localStorage.setItem(savedQAKey, JSON.stringify(userQuestions));
      } catch (e) {
        console.error('Error saving Q&A:', e);
      }
      return updated;
    });
  };

  const handleSubmitAnswer = (questionId: string, answerText: string) => {
    if (!isAuthenticated) {
      setAuthPromptAction('comment');
      setIsAuthPromptOpen(true);
      return;
    }

    const newAnswer = {
      id: `a-user-${Date.now()}`,
      text: answerText,
      author: 'You',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      upvotes: 0,
    };

    setQaQuestions(prev =>
      prev.map(q =>
        q.id === questionId ? { ...q, answers: [...q.answers, newAnswer] } : q
      )
    );
  };

  const handleUpvoteQuestion = (questionId: string) => {
    // Find the question to save to profile
    const question = qaQuestions.find(q => q.id === questionId);
    if (question) {
      saveQAToProfile({
        type: 'liked',
        questionId: question.id,
        questionText: question.question,
        articleSlug: slug || 'default',
        articleTitle: article.title,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });
    }

    setQaQuestions(prev =>
      prev.map(q =>
        q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
      )
    );
  };

  const handleUpvoteAnswer = (questionId: string, answerId: string) => {
    setQaQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, answers: q.answers.map(a => a.id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a) }
          : q
      )
    );
  };

  // AI answer generator - creates contextual responses based on the question and vehicle/article
  const handleAskAI = (questionId: string, questionText: string) => {
    const vName = vehicleName || articleData.title;
    const qLower = questionText.toLowerCase();

    // Generate a contextual AI response based on question keywords
    let aiResponse = '';

    if (qLower.includes('fuel') || qLower.includes('mpg') || qLower.includes('range') || qLower.includes('economy') || qLower.includes('efficient')) {
      aiResponse = `Based on the article and available data for the ${vName}, fuel efficiency is competitive within its segment. EPA estimates should be taken as a guideline — real-world results typically vary by 5-10% depending on driving conditions, terrain, and driving style. For the most accurate numbers, consider MotorTrend's long-term testing data which reflects mixed real-world driving scenarios.`;
    } else if (qLower.includes('price') || qLower.includes('cost') || qLower.includes('worth') || qLower.includes('value') || qLower.includes('afford')) {
      aiResponse = `The ${vName} offers solid value in its price bracket. When evaluating cost, consider the total ownership picture: insurance rates, expected maintenance costs, resale value, and available incentives or rebates. The mid-trim often represents the best value-to-feature ratio. Check our local listings for current market pricing in your area.`;
    } else if (qLower.includes('reliab') || qLower.includes('problem') || qLower.includes('issue') || qLower.includes('recall') || qLower.includes('break')) {
      aiResponse = `Reliability data for the ${vName} is based on manufacturer track records, early owner reports, and industry projections. While it's still early for long-term data on newer models, the platform and powertrain have proven dependable in MotorTrend's extended testing. Always check for any open recalls or TSBs (Technical Service Bulletins) before purchasing.`;
    } else if (qLower.includes('compare') || qLower.includes('vs') || qLower.includes('versus') || qLower.includes('competitor') || qLower.includes('better than')) {
      aiResponse = `The ${vName} competes well in its segment. Key differentiators include its design philosophy, tech integration, and driving dynamics. For a detailed head-to-head comparison, check out MotorTrend's comparison tool where you can evaluate specs, ratings, and pricing side by side. Each competitor has unique strengths depending on your priorities.`;
    } else if (qLower.includes('family') || qLower.includes('kid') || qLower.includes('car seat') || qLower.includes('space') || qLower.includes('room') || qLower.includes('cargo')) {
      aiResponse = `For family use, the ${vName} offers a practical interior layout. Key considerations include LATCH system accessibility for car seats, rear legroom measurements, cargo volume with seats up and folded, and the number of USB ports for passengers. MotorTrend's review covers the interior dimensions in detail — we recommend test-fitting your specific car seats during a dealership visit.`;
    } else if (qLower.includes('drive') || qLower.includes('handle') || qLower.includes('ride') || qLower.includes('comfort') || qLower.includes('steer')) {
      aiResponse = `According to MotorTrend's testing of the ${vName}, the driving experience prioritizes a balance of comfort and engagement. The suspension tuning provides composed handling without sacrificing ride comfort on rough surfaces. Steering feel is responsive and well-weighted. For specific driving impressions, refer to our detailed performance scores in the MotorTrend Review section of this article.`;
    } else if (qLower.includes('tech') || qLower.includes('screen') || qLower.includes('infotainment') || qLower.includes('carplay') || qLower.includes('android')) {
      aiResponse = `The ${vName}'s technology suite is a strong point. It features modern infotainment with responsive touchscreen controls, wireless smartphone integration (Apple CarPlay and Android Auto), and a comprehensive driver assistance package. The user interface is intuitive, though some deeper settings require menu navigation. OTA updates keep the system current with new features over time.`;
    } else if (qLower.includes('buy') || qLower.includes('purchase') || qLower.includes('deal') || qLower.includes('negotiate') || qLower.includes('lease')) {
      aiResponse = `When shopping for the ${vName}, here are some tips based on current market conditions: Check multiple dealerships for competitive quotes, look into manufacturer incentives and loyalty programs, consider timing your purchase around model-year transitions for better deals, and don't overlook certified pre-owned options if available. Use our marketplace to compare local listings and prices.`;
    } else {
      aiResponse = `Based on MotorTrend's review and testing of the ${vName}, here's what we can share: This vehicle has been evaluated across performance, efficiency, technology, and value dimensions. Our editorial team has driven and tested it extensively. For the most specific answer to your question, we recommend checking the detailed sections of this article, the MotorTrend Score breakdown, and user reviews from verified owners below.`;
    }

    // Add the AI answer to the question
    const aiAnswer = {
      id: `a-ai-${Date.now()}`,
      text: aiResponse,
      author: 'MotorTrend AI',
      isAI: true,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      upvotes: 0,
    };

    setQaQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, answers: [aiAnswer, ...q.answers] }
          : q
      )
    );
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
        avatar: "https://www.motortrend.com/files/690637eaf09ade000224c6b1/group1318348122.png",
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
  // Use API data as single source of truth for ratings
  // Priority: API data > Article motortrendScore > Generated rating
  const apiVehicleData = useMemo(() => getVehicleByName(vehicleName), [vehicleName]);
  const communityRating = useMemo(() => {
    return apiVehicleData?.communityRating ?? generateCommunityRating(vehicleName);
  }, [apiVehicleData, vehicleName]);

  const staffRating = useMemo(() => {
    // Priority 1: API data (single source of truth)
    if (apiVehicleData?.staffRating) {
      return apiVehicleData.staffRating;
    }
    // Priority 2: Article motortrendScore (if available)
    if (motortrendScore.overallRating && article.motortrendScore) {
      return motortrendScore.overallRating;
    }
    // Priority 3: Generated rating (fallback only)
    return generateStaffRating(vehicleName);
  }, [apiVehicleData, motortrendScore, article.motortrendScore, vehicleName]);

  // Generate scores for staff rating tooltip
  const staffRatingScores = useMemo(() => ({
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
  const handleOpenRatingModal = (vehicleForModal?: string) => {
    if (!isAuthenticated) {
      setAuthPromptAction('rate');
      setIsAuthPromptOpen(true);
      return;
    }
    setRatingModalVehicleName(vehicleForModal ?? vehicleName);
    setIsRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setIsRatingModalOpen(false);
  };

  const handleSubmitRating = (rating: number) => {
    setUserRating(ratingModalVehicleName, rating);
    setIsRatingModalOpen(false);
  };

  const handleClearRating = () => {
    clearRating(ratingModalVehicleName);
    try {
      const savedReviewsKey = `vehicleReviews_${ratingModalVehicleName}`;
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
        const generatedReviews = generateUserReviews(ratingModalVehicleName);
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
    setUserRating(ratingModalVehicleName, rating);
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

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (tooltipHideTimeoutRef.current) {
        clearTimeout(tooltipHideTimeoutRef.current);
      }
      if (staffTooltipHideTimeoutRef.current) {
        clearTimeout(staffTooltipHideTimeoutRef.current);
      }
    };
  }, []);


  // Scroll handlers
  const handleScrollToStaffRating = () => {
    const staffRatingSection = document.getElementById('motortrend-score');
    if (staffRatingSection) {
      const headerOffset = 100; // Account for sticky nav bar height
      const elementPosition = staffRatingSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollToCommunityRatings = () => {
    // Force open the Reviews tab
    setReviewsTabActive(true);

    const communityRatingsSection = document.getElementById('community-ratings');
    if (communityRatingsSection) {
      const headerOffset = 100; // Account for sticky nav bar height
      const elementPosition = communityRatingsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
      const headerOffset = 100; // Account for sticky nav bar height
      const elementPosition = reviewsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
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

  // Fetch local listings when vehicle changes
  useEffect(() => {
    const loadListings = async () => {
      if (!vehicleName) return;

      setIsLoadingListings(true);
      try {
        const parsed = parseVehicleName(vehicleName);
        const yearNum = parseInt(parsed.year) || new Date().getFullYear();
        const fetchedListings = await fetchVehicleListings(yearNum, parsed.make, parsed.model, 4);
        // Set images for listings using vehicleImageFor only as fallback
        const listingsWithImages = fetchedListings.map((listing) => {
          const listingVehicleName = `${listing.year} ${listing.make} ${listing.model}`;
          return {
            ...listing,
            image: listing.image || vehicleImageFor(listingVehicleName)
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
      {/* Rating bar scrolls with content; global navigation owns sticky behavior. */}
      {!shouldHideRatingBar && (
        <StickyRateBar
          vehicleName={isComparisonArticle ? stickyBarVehicleName : vehicleName}
          vehiclePath={(isComparisonArticle ? stickyBarVehiclePath : vehiclePath) || undefined}
          vehicles={isComparisonArticle ? comparisonVehicles.map(name => {
            try {
              const { year, make, model } = parseVehicleName(name);
              return { name, path: `/vehicles/${year}/${make}/${model}` };
            } catch {
              return { name };
            }
          }) : undefined}
          selectedVehicleIndex={selectedStickyVehicleIndex}
          onSelectVehicle={isComparisonArticle ? setSelectedStickyVehicleIndex : undefined}
          ratings={[
            {
              type: 'motortrend',
              value: isComparisonArticle ? staffRatingForBar : staffRating,
              onClick: handleScrollToStaffRating,
              iconSrc: 'https://www.motortrend.com/files/692374f1d13f5100022ddf61/mticon.svg',
              iconAlt: 'MT',
              format: 'vehicle-details'
            },
            {
              type: 'user-reviews',
              value: isComparisonArticle ? communityRatingForBar : communityRating,
              onClick: handleScrollToCommunityRatings,
              label: 'User Reviews',
              showStars: true,
              showHalfStars: true
            },
            {
              type: 'your-rating',
              value: isComparisonArticle ? userRatingForBar : userRating,
              onClick: isComparisonArticle ? () => handleOpenRatingModal(stickyBarVehicleName) : handleOpenRatingModal,
              showStars: true,
              showHalfStars: true
            }
          ]}
          ctaText="See Local Listings"
          ctaOnClick={() => {
            const listingsSection = document.querySelector('.article__listings');
            if (listingsSection) {
              const headerOffset = 100;
              const elementPosition = listingsSection.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            } else {
              console.log('Navigate to local listings');
            }
          }}
          hideCtaButton={true}
          isVisible={true}
          isSticky={false}
          staffRatingScores={(!isComparisonArticle || stickyBarVehicleName === vehicleName) ? staffRatingScores : undefined}
          ratingDistribution={ratingDistribution}
          totalReviews={communityRatingCount}
          commentsLink={{
            href: '#community-ratings',
            label: 'Comments',
            count: commentCount,
            ariaLabel: `Jump to ${commentCount} article comments`
          }}
        />
      )}
      <div className="article__container">
        {/* Vehicle Accordion - Additional Vehicles */}
        {isComparisonArticle && isVehicleAccordionOpen && (
          <div className="article__vehicle-accordion">
            {additionalVehicles.map((vehicle, index) => {
              const vehiclePathForItem = (() => {
                try {
                  const { year, make, model } = parseVehicleName(vehicle);
                  return `/vehicles/${year}/${make}/${model}`;
                } catch {
                  return null;
                }
              })();
              // Use API data as single source of truth for ratings
              const apiVehicleData = getVehicleByName(vehicle);
              const staffRatingForVehicle = apiVehicleData?.staffRating ?? generateStaffRating(vehicle);
              const communityRatingForVehicle = apiVehicleData?.communityRating ?? generateCommunityRating(vehicle);
              const userRatingForVehicle = getUserRating(vehicle);

              return (
                <div key={index} className="article__vehicle-accordion-item">
                  <div className="article__vehicle-accordion-left">
                    {vehiclePathForItem ? (
                      <Link to={vehiclePathForItem} className="article__vehicle-accordion-name">
                        {vehicle}
                      </Link>
                    ) : (
                      <div className="article__vehicle-accordion-name">{vehicle}</div>
                    )}
                  </div>
                  <div className="article__vehicle-accordion-center">
                    <div className="article__rating-item article__rating-item--clickable article__rating-item--with-tooltip article__rating-item--staff">
                      <div className="article__rating-label-wrapper">
                        <span className="article__rating-label-top">MotorTrend</span>
                        <span className="article__rating-label-bottom">Rating</span>
                      </div>
                      <img
                        src="https://www.motortrend.com/files/692374f1d13f5100022ddf61/mticon.svg"
                        alt="MotorTrend"
                        className="article__rating-icon article__rating-icon--staff"
                      />
                                      <span className="article__rating-value">{typeof staffRatingForVehicle === 'number' ? staffRatingForVehicle.toFixed(1) : staffRatingForVehicle}</span>
                    </div>
                    <div className="article__rating-item article__rating-item--clickable article__rating-item--with-tooltip article__rating-item--community">
                      <div className="article__rating-label-wrapper">
                        <span className="article__rating-label-top">Community</span>
                        <span className="article__rating-label-bottom">Rating ({communityRatingCount})</span>
                      </div>
                      <img
                        src="https://www.motortrend.com/files/691bde547554840002bab60c/star.svg"
                        alt="Community Rating Star"
                        className="article__rating-icon article__rating-icon--community"
                      />
                      <span className="article__rating-value">
                        {communityRatingForVehicle.toFixed(1)}
                      </span>
                    </div>
                    <button
                      className="article__rate-btn article__rate-btn--mobile-hide"
                      onClick={() => {
                        setUserRating(vehicle, 0);
                        setIsRatingModalOpen(true);
                      }}
                    >
                      {userRatingForVehicle > 0 ? (
                        <>
                          <div className="article__rating-label-wrapper">
                            <span className="article__rating-label-top">Your</span>
                            <span className="article__rating-label-bottom">Rating</span>
                          </div>
                          <img
                            src="https://www.motortrend.com/files/691bde547554840002bab60c/star.svg"
                            alt="Your Rating Star"
                            className="article__rating-icon article__rating-icon--add-rate"
                          />
                          <span className="article__rating-value">{userRatingForVehicle}</span>
                        </>
                      ) : (
                        <>
                          <div className="article__rating-label-wrapper">
                            <span className="article__rating-label-top">Rate</span>
                            <span className="article__rating-label-bottom">This Car</span>
                          </div>
                          <img
                            src="https://www.motortrend.com/files/691bde5264217700021d6b71/star-stroke.svg"
                            alt="Add Rating Star"
                            className="article__rating-icon article__rating-icon--add-rate"
                          />
                        </>
                      )}
                    </button>
                  </div>
                  <div className="article__vehicle-accordion-right">
                    <button
                      className="article__cta"
                      onClick={() => {
                        const listingsSection = document.querySelector('.article__listings');
                        if (listingsSection) {
                          const headerOffset = 100; // Account for sticky nav bar height
                          const elementPosition = listingsSection.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                          });
                        } else {
                          console.log('Navigate to local listings');
                        }
                      }}
                    >
                      Local Listings
                    </button>
                  </div>
                </div>
              );
            })}
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
                {/* HIDDEN: ArticleReactions thumbs up
                <span className="article__byline-separator">|</span>
                <ArticleReactions
                  articleSlug={slug || 'default'}
                  vehicleName={primaryVehicle || vehicleName || undefined}
                />
                */}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="article__save-btn article__save-btn--qa"
                  onClick={() => setIsQAModalOpen(true)}
                  aria-label="Open Q&A"
                >
                  <Icon name="auto_awesome" size={20} />
                  <span>Q&A</span>
                  {qaQuestions.length > 0 && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '18px',
                      height: '18px',
                      padding: '0 5px',
                      backgroundColor: 'var(--color-primary-1, #E90C17)',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'white',
                      lineHeight: 1,
                    }}>
                      {qaQuestions.length}
                    </span>
                  )}
                </button>
                <button
                  className={`article__save-btn ${isSaved ? 'saved' : ''}`}
                  onClick={handleBookmark}
                  aria-label={isSaved ? "Remove bookmark" : "Bookmark article"}
                >
                  <Icon name="bookmark" variant={isSaved ? 'filled' : 'outlined'} size={20} />
                  <span>{isSaved ? 'Saved!' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* Hero Section */}
            <div className={`article__hero-wrapper ${isPremiumArticle ? 'article__hero-wrapper--premium' : ''}`}>
              <ArticleHero
                imageUrl={article.heroImage}
                videoUrl={article.heroVideo}
                title={article.title}
                onShare={handleShare}
                onImageClick={() => handleImageClick(0)}
              />
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
                        let vehicleImageUrl: string | null = null;
                        let motortrendScoreForImage: number | null = null;
                        let userScoreForImage: number | null = null;

                        if (isPremiumArticle && block.text) {
                          // Extract vehicle name and ranking from heading (e.g., "10. 2025 Kia K4" -> ranking: "10", vehicle: "2025 Kia K4")
                          const headingMatch = block.text.match(/^(\d+)\.\s*(.+)$/);
                          if (headingMatch) {
                            rankingNumber = headingMatch[1];
                            vehicleNameForImage = headingMatch[2].trim();
                            // Get ratings and image for this vehicle from API (single source of truth)
                            const apiVehicleDataForImage = getVehicleByName(vehicleNameForImage);
                            motortrendScoreForImage = apiVehicleDataForImage?.staffRating ?? generateStaffRating(vehicleNameForImage);
                            userScoreForImage = apiVehicleDataForImage?.communityRating ?? generateCommunityRating(vehicleNameForImage);
                            vehicleImageUrl = apiVehicleDataForImage?.image ?? vehicleImageFor(vehicleNameForImage);
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
                                <div className="article__image-ranking-badge">
                                  <span className="article__ranking-content">
                                    <span className="article__ranking-hash">#</span>
                                    <span className="article__ranking-number">{rankingNumber}</span>
                                  </span>
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
                                <div className="article__rating-overlay">
                                  <div className="article__rating-left-content">
                                    <div className="article__badges-row">
                                      <ActionBadge
                                        text="Buyers Guide"
                                        variant="secondary"
                                        href={`/vehicles/${encodeURIComponent(parseVehicleName(vehicleNameForImage).year)}/${encodeURIComponent(parseVehicleName(vehicleNameForImage).make)}/${encodeURIComponent(parseVehicleName(vehicleNameForImage).model)}`}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          const { year, make, model } = parseVehicleName(vehicleNameForImage!);
                                          navigate(`/vehicles/${encodeURIComponent(year)}/${encodeURIComponent(make)}/${encodeURIComponent(model)}`);
                                        }}
                                        className="article__buyers-guide-badge"
                                      />
                                      <ActionBadge
                                        text="See Local Listings"
                                        variant="primary"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          const { year, make, model } = parseVehicleName(vehicleNameForImage!);
                                          navigate(`/vehicles/${encodeURIComponent(year)}/${encodeURIComponent(make)}/${encodeURIComponent(model)}`);
                                        }}
                                        className="article__buyers-guide-badge"
                                      />
                                    </div>
                                    <h2 className="article__rating-overlay-name">#{rankingNumber} {vehicleNameForImage}</h2>
                                  </div>
                                  <div className="article__ratings-list">
                                    <div className="article__rating-item">
                                      <div className="article__rating-score-row">
                                        <img
                                          src="https://www.motortrend.com/files/692374f1d13f5100022ddf61/mticon.svg"
                                          alt="MotorTrend"
                                          className="article__rating-mt-badge"
                                        />
                                        <div className="article__rating-score-large">
                                          {motortrendScoreForImage.toFixed(1)}
                                          <span className="article__rating-score-max">/10</span>
                                      </div>
                                    </div>
                                      <div className="article__rating-label-row">
                                        <span className="article__rating-motortrend-text">MotorTrend Rating</span>
                                      </div>
                                    </div>
                                    <div className="article__rating-item article__rating-item--community">
                                      {renderStarRating(userScoreForImage)}
                                      <div className="article__rating-text">
                                        User Reviews <Badge variant="info" size="sm">{(userScoreForImage / 2).toFixed(1)}/5</Badge>
                                      </div>
                                    </div>
                                  </div>
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
                                  <div className="article__image-ranking-badge">
                                    <span className="article__ranking-content">
                                      <span className="article__ranking-hash">#</span>
                                      <span className="article__ranking-number">{rankingNumber}</span>
                                    </span>
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
                                  <div className="article__rating-overlay">
                                    <h2 className="article__rating-overlay-name">#{rankingNumber} {vehicleNameForImage}</h2>
                                    <div className="article__ratings-list">
                                      <div className="article__rating-item">
                                        <div className="article__rating-score-row">
                                          <img
                                            src="https://www.motortrend.com/files/692374f1d13f5100022ddf61/mticon.svg"
                                            alt="MotorTrend"
                                            className="article__rating-mt-badge"
                                          />
                                          <div className="article__rating-score-large">
                                            {motortrendScoreForImage.toFixed(1)}
                                            <span className="article__rating-score-max">/10</span>
                                        </div>
                                      </div>
                                        <div className="article__rating-label-row">
                                          <span className="article__rating-motortrend-text">MotorTrend Rating</span>
                                        </div>
                                      </div>
                                      <div className="article__rating-item article__rating-item--community">
                                        {renderStarRating(userScoreForImage)}
                                        <div className="article__rating-text">
                                          User Reviews <Badge variant="info" size="sm">{(userScoreForImage / 2).toFixed(1)}/5</Badge>
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      className="article__listing-btn"
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
                        if (paragraphCount === 8 && !isPremiumArticle && motortrendScore) {
                          const formatScore = (score: number) => score.toFixed(1);

                          elements.push(
                            <div key="motortrend-score" id="motortrend-score" className="article__motortrend-score">
                              <div className="article__motortrend-header">
                                <h2>MotorTrend Review</h2>
                                <img
                                  src="https://www.motortrend.com/files/68f6570b3ed26800022d87b6/mt-logo2.svg"
                                  alt="MotorTrend Logo"
                                  className="article__motortrend-logo"
                                />
                              </div>
                              <div className="article__score-card">
                                <div className="article__score-header">
                                  <h3>{motortrendScore.vehicleName}</h3>
                                  <div className="article__score-award">
                                    <img
                                      src="https://www.motortrend.com/files/690203caffe978000201e639/trophie-11.svg"
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
                                      <span className="article__score-number">{formatScore(motortrendScore.overallRating)}</span>
                                      <div className="article__score-label-row">
                                        <img
                                          src="https://www.motortrend.com/files/692374f1d13f5100022ddf61/mticon.svg"
                                          alt="MotorTrend"
                                          className="article__score-mt-badge"
                                        />
                                        <span className="article__score-label">MotorTrend Rating</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="article__score-breakdown">
                                    <div className="article__score-item">
                                      <span>Performance</span>
                                      <div className="article__score-bar">
                                        <div className="article__score-bar-fill" style={{ width: `${(motortrendScore.scores.performance / 10) * 100}%` }}></div>
                                      </div>
                                      <span>{formatScore(motortrendScore.scores.performance)}</span>
                                    </div>
                                    <div className="article__score-item">
                                      <span>Efficiency/Range</span>
                                      <div className="article__score-bar">
                                        <div className="article__score-bar-fill" style={{ width: `${(motortrendScore.scores.efficiency / 10) * 100}%` }}></div>
                                      </div>
                                      <span>{formatScore(motortrendScore.scores.efficiency)}</span>
                                    </div>
                                    <div className="article__score-item">
                                      <span>Tech/Innovation</span>
                                      <div className="article__score-bar">
                                        <div className="article__score-bar-fill" style={{ width: `${(motortrendScore.scores.tech / 10) * 100}%` }}></div>
                                      </div>
                                      <span>{formatScore(motortrendScore.scores.tech)}</span>
                                    </div>
                                    <div className="article__score-item">
                                      <span>Value</span>
                                      <div className="article__score-bar">
                                        <div className="article__score-bar-fill" style={{ width: `${(motortrendScore.scores.value / 10) * 100}%` }}></div>
                                      </div>
                                      <span>{formatScore(motortrendScore.scores.value)}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Staff Review */}
                                <div className="article__score-review">
                                  {/* Reviewer Avatar Section */}
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
                                          <div className="article__reviewer-badge--with-tooltip">
                                            <img
                                              src="https://www.motortrend.com/files/692374f1d13f5100022ddf61/mticon.svg"
                                              alt="MT badge"
                                              className="article__reviewer-badge"
                                              width={16}
                                              height={16}
                                            />
                                            <div className="article__reviewer-badge-tooltip">
                                              {motortrendScore.reviewer.title}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="article__reviewer-meta">
                                          <span className="article__reviewer-date">Driven, tested | {motortrendScore.reviewer.date}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <h3>{motortrendScore.reviewer.title}</h3>
                                  <p>{motortrendScore.reviewer.excerpt}</p>

                                  {/* Read Full Review Link */}
                                  <div className="article__review-accordion">
                                    {(() => {
                                      // Parse vehicle name to get year, make, and model for navigation
                                      const vehicleNameForLink = motortrendScore.vehicleName;
                                      const parsed = parseVehicleName(vehicleNameForLink);
                                      const vehiclePath = parsed ? `/vehicles/${parsed.year}/${parsed.make}/${parsed.model}` : '#';

                                      return (
                                        <button
                                          className="article__review-accordion-button"
                                          onClick={() => {
                                            if (parsed) {
                                              navigate(vehiclePath);
                                            }
                                          }}
                                        >
                                          <span>Read Full Review</span>
                                          <Icon name="chevron_right" size={20} />
                                        </button>
                                      );
                                    })()}
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
              {/* Ad Container - Direct placement for sticky behavior */}
              <AdContainer
                width={300}
                height={600}
                label="300 x 600"
                position="right-column"
                imageUrl="https://www.motortrend.com/files/69116380f5e41e00020d3432/822789964589118228.jpeg"
              />

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

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={handleCloseRatingModal}
        vehicleName={ratingModalVehicleName || vehicleName}
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

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
        action={authPromptAction}
      />

      {/* Q&A Modal */}
      <QAModal
        isOpen={isQAModalOpen}
        onClose={() => setIsQAModalOpen(false)}
        articleTitle={article.title}
        articleSlug={slug || 'default'}
        vehicleName={vehicleName}
        questions={qaQuestions}
        onSubmitQuestion={handleSubmitQuestion}
        onSubmitAnswer={handleSubmitAnswer}
        onUpvoteQuestion={handleUpvoteQuestion}
        onUpvoteAnswer={handleUpvoteAnswer}
        onAskAI={handleAskAI}
      />
    </div>
  );
};

export default Article;
