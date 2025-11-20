/**
 * Article Reactions Component
 * Facebook/LinkedIn-style emoji reaction system for car articles
 * Car-culture-friendly reactions: Want It, Own It, Like It, Respect It, Hot Ride
 */

import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import './ArticleReactions.css';

interface Reaction {
  id: string;
  emoji: string;
  label: string;
  count: number;
}

interface ArticleReactionsProps {
  articleSlug: string;
  vehicleName?: string; // Optional vehicle name for articles about specific vehicles
  showTooltipsBelow?: boolean; // Show tooltips below instead of above (for prime template)
}

const REACTION_OPTIONS: Omit<Reaction, 'count'>[] = [
  { id: 'want-it', emoji: '😍', label: 'Want It' },
  { id: 'own-it', emoji: '🔑', label: 'Own It' },
  { id: 'like-it', emoji: '👍', label: 'Like It' },
  { id: 'respect-it', emoji: '💪', label: 'Respect It' },
  { id: 'hot-ride', emoji: '🔥', label: 'Hot Ride' },
];

export const ArticleReactions: React.FC<ArticleReactionsProps> = ({ articleSlug, vehicleName, showTooltipsBelow = false }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Reaction[]>(() => {
    // Initialize with some sample counts
    return REACTION_OPTIONS.map(option => ({
      ...option,
      count: Math.floor(Math.random() * 50) + 10,
    }));
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Load user's saved reaction from localStorage
  useEffect(() => {
    try {
      const savedReactions = localStorage.getItem(`article-reactions-${articleSlug}`);
      if (savedReactions) {
        const data = JSON.parse(savedReactions);
        if (data.userReaction) {
          setUserReaction(data.userReaction);
        }
        if (data.reactions) {
          // Merge saved counts with current REACTION_OPTIONS to ensure emojis are always up-to-date
          setReactions(REACTION_OPTIONS.map(option => {
            const savedReaction = data.reactions.find((r: Reaction) => r.id === option.id);
            return {
              ...option,
              count: savedReaction ? savedReaction.count : Math.floor(Math.random() * 50) + 10,
            };
          }));
        }
      }
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  }, [articleSlug]);

  // Handle hover interactions
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsPopupOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsPopupOpen(false);
    }, 200);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Helper to add vehicle to profile sections
  const addToProfileSection = (reactionId: string) => {
    if (reactionId === 'want-it' || reactionId === 'own-it') {
      // Only add if we have a vehicle name
      if (!vehicleName) {
        console.warn('No vehicle name provided for reaction');
        return;
      }

      try {
        // Get onboarding data
        const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        const vehicles = onboardingData.vehicles || [];
        
        // Determine ownership type
        const ownership = reactionId === 'want-it' ? 'want' : 'own';
        
        // Check if vehicle already exists
        const existingVehicleIndex = vehicles.findIndex(
          (v: any) => v.name && v.name.toLowerCase() === vehicleName.toLowerCase()
        );
        
        if (existingVehicleIndex >= 0) {
          // Update existing vehicle's ownership
          vehicles[existingVehicleIndex].ownership = ownership;
        } else {
          // Add new vehicle
          vehicles.push({
            name: vehicleName,
            ownership: ownership
          });
        }
        
        // Save back to localStorage
        onboardingData.vehicles = vehicles;
        localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
        
        // Dispatch event to notify Profile page to update
        window.dispatchEvent(new CustomEvent('onboardingDataUpdated'));
        
        console.log(`✅ Added "${vehicleName}" to profile as "${ownership}"`);
      } catch (error) {
        console.error('Error adding to profile section:', error);
      }
    }
  };

  const handleReaction = (reactionId: string) => {
    setReactions(prevReactions => {
      const newReactions = prevReactions.map(reaction => {
        if (reaction.id === reactionId) {
          // Add reaction
          return {
            ...reaction,
            count: userReaction === reactionId ? reaction.count : reaction.count + 1,
          };
        } else if (reaction.id === userReaction) {
          // Remove previous reaction
          return {
            ...reaction,
            count: Math.max(0, reaction.count - 1),
          };
        }
        return reaction;
      });

      const newUserReaction = userReaction === reactionId ? null : reactionId;

      // Save to localStorage
      try {
        localStorage.setItem(
          `article-reactions-${articleSlug}`,
          JSON.stringify({
            userReaction: newUserReaction,
            reactions: newReactions,
          })
        );
      } catch (error) {
        console.error('Error saving reaction:', error);
      }

      // Add to profile section if Want It or Own It
      if (newUserReaction) {
        addToProfileSection(reactionId);
      }

      return newReactions;
    });

    // Toggle reaction (if clicking same reaction, remove it)
    setUserReaction(prev => (prev === reactionId ? null : reactionId));
    setIsPopupOpen(false);
  };

  // Handle clicking on the trigger button
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If user has a reaction selected, remove it
    if (userReaction) {
      setReactions(prevReactions => {
        const newReactions = prevReactions.map(reaction => {
          if (reaction.id === userReaction) {
            return {
              ...reaction,
              count: Math.max(0, reaction.count - 1),
            };
          }
          return reaction;
        });

        // Save to localStorage
        try {
          localStorage.setItem(
            `article-reactions-${articleSlug}`,
            JSON.stringify({
              userReaction: null,
              reactions: newReactions,
            })
          );
        } catch (error) {
          console.error('Error saving reaction:', error);
        }

        return newReactions;
      });

      setUserReaction(null);
      setIsPopupOpen(false);
    } else {
      // If no reaction selected, clicking thumbs up selects "like-it"
      handleReaction('like-it');
    }
  };

  const getUserReactionData = () => {
    return reactions.find(r => r.id === userReaction);
  };

  const userReactionData = getUserReactionData();

  return (
    <div 
      ref={containerRef}
      className={`article-reactions ${showTooltipsBelow ? 'article-reactions--tooltips-below' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`article-reactions__trigger ${userReaction ? 'article-reactions__trigger--active' : ''}`}
        onClick={handleTriggerClick}
        aria-label={userReaction ? 'Remove reaction' : 'Like It'}
        title={userReaction ? 'Click to remove reaction' : 'Click to Like, or hover for more reactions'}
      >
        {userReactionData ? (
          <span className="article-reactions__trigger-icon">
            {userReactionData.emoji}
          </span>
        ) : (
          <span className="article-reactions__trigger-icon article-reactions__trigger-icon--lucide">
            <ThumbsUp size={22} />
          </span>
        )}
      </button>

      {isPopupOpen && (
        <div className="article-reactions__popup">
          {REACTION_OPTIONS.map(reaction => (
            <button
              key={reaction.id}
              className="article-reactions__option"
              onClick={() => handleReaction(reaction.id)}
              aria-label={reaction.label}
            >
              <span className="article-reactions__option-emoji">
                {reaction.emoji}
              </span>
              <span className="article-reactions__option-tooltip">
                {reaction.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleReactions;

