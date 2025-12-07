/**
 * Article Reactions Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';

interface Reaction {
  id: string;
  emoji: string;
  label: string;
  count: number;
}

interface ArticleReactionsProps {
  articleSlug: string;
  vehicleName?: string;
  showTooltipsBelow?: boolean;
  className?: string;
}

const REACTION_OPTIONS: Omit<Reaction, 'count'>[] = [
  { id: 'want-it', emoji: '😍', label: 'Want It' },
  { id: 'own-it', emoji: '🔑', label: 'Own It' },
  { id: 'like-it', emoji: '👍', label: 'Like It' },
  { id: 'respect-it', emoji: '💪', label: 'Respect It' },
  { id: 'hot-ride', emoji: '🔥', label: 'Hot Ride' },
];

export const ArticleReactions: React.FC<ArticleReactionsProps> = ({ 
  articleSlug, 
  vehicleName, 
  showTooltipsBelow = false,
  className = '',
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [isTriggerHovered, setIsTriggerHovered] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>(() => {
    return REACTION_OPTIONS.map(option => ({
      ...option,
      count: Math.floor(Math.random() * 50) + 10,
    }));
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Inject keyframes
  useEffect(() => {
    const styleId = 'article-reactions-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes reactionPopupSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes reactionPopupSlideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    try {
      const savedReactions = localStorage.getItem(`article-reactions-${articleSlug}`);
      if (savedReactions) {
        const data = JSON.parse(savedReactions);
        if (data.userReaction) setUserReaction(data.userReaction);
        if (data.reactions) {
          setReactions(REACTION_OPTIONS.map(option => {
            const savedReaction = data.reactions.find((r: Reaction) => r.id === option.id);
            return { ...option, count: savedReaction ? savedReaction.count : Math.floor(Math.random() * 50) + 10 };
          }));
        }
      }
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  }, [articleSlug]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsPopupOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsPopupOpen(false), 200);
  };

  useEffect(() => {
    return () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); };
  }, []);

  const addToProfileSection = (reactionId: string) => {
    if ((reactionId === 'want-it' || reactionId === 'own-it') && vehicleName) {
      try {
        const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        const vehicles = onboardingData.vehicles || [];
        const ownership = reactionId === 'want-it' ? 'want' : 'own';
        const existingIdx = vehicles.findIndex((v: any) => v.name?.toLowerCase() === vehicleName.toLowerCase());
        if (existingIdx >= 0) vehicles[existingIdx].ownership = ownership;
        else vehicles.push({ name: vehicleName, ownership });
        onboardingData.vehicles = vehicles;
        localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
        window.dispatchEvent(new CustomEvent('onboardingDataUpdated'));
      } catch (error) {
        console.error('Error adding to profile section:', error);
      }
    }
  };

  const handleReaction = (reactionId: string) => {
    setReactions(prevReactions => {
      const newReactions = prevReactions.map(r => {
        if (r.id === reactionId) return { ...r, count: userReaction === reactionId ? r.count : r.count + 1 };
        if (r.id === userReaction) return { ...r, count: Math.max(0, r.count - 1) };
        return r;
      });
      const newUserReaction = userReaction === reactionId ? null : reactionId;
      try {
        localStorage.setItem(`article-reactions-${articleSlug}`, JSON.stringify({ userReaction: newUserReaction, reactions: newReactions }));
      } catch (e) {}
      if (newUserReaction) addToProfileSection(reactionId);
      return newReactions;
    });
    setUserReaction(prev => (prev === reactionId ? null : reactionId));
    setIsPopupOpen(false);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (userReaction) {
      setReactions(prev => {
        const newReactions = prev.map(r => r.id === userReaction ? { ...r, count: Math.max(0, r.count - 1) } : r);
        try { localStorage.setItem(`article-reactions-${articleSlug}`, JSON.stringify({ userReaction: null, reactions: newReactions })); } catch (e) {}
        return newReactions;
      });
      setUserReaction(null);
      setIsPopupOpen(false);
    } else {
      handleReaction('like-it');
    }
  };

  const userReactionData = reactions.find(r => r.id === userReaction);

  // Styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  };

  const triggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    padding: 0,
    backgroundColor: (isTriggerHovered || userReaction) ? 'var(--color-neutrals-7, #F4F5F6)' : 'transparent',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 150ms ease-in-out',
    transform: isTriggerHovered ? 'scale(1.1)' : 'none',
  };

  const triggerIconStyle: React.CSSProperties = {
    fontSize: '22px',
    lineHeight: 1,
    transition: 'transform 150ms ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: isTriggerHovered ? 'scale(1.15)' : 'none',
  };

  const popupStyle: React.CSSProperties = {
    position: 'absolute',
    ...(showTooltipsBelow ? { top: 'calc(100% + 8px)' } : { bottom: 'calc(100% + 8px)' }),
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 24px',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(20, 20, 22, 0.1)',
    zIndex: 1000,
    animation: showTooltipsBelow ? 'reactionPopupSlideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'reactionPopupSlideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const getOptionStyle = (optionId: string): React.CSSProperties => {
    const isHovered = hoveredOption === optionId;
    return {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px',
      background: isHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'none',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'all 150ms ease-in-out',
      minWidth: '48px',
      minHeight: '48px',
      transform: isHovered ? 'scale(1.2) translateY(-4px)' : 'none',
    };
  };

  const emojiStyle: React.CSSProperties = {
    fontSize: '28px',
    lineHeight: 1,
  };

  const getTooltipStyle = (optionId: string): React.CSSProperties => ({
    position: 'absolute',
    ...(showTooltipsBelow ? { top: 'calc(100% + 4px)' } : { bottom: 'calc(100% + 4px)' }),
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '4px 24px',
    backgroundColor: 'var(--color-neutrals-1, #141416)',
    color: 'var(--color-white, #FFFFFF)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    borderRadius: '4px',
    opacity: hoveredOption === optionId ? 1 : 0,
    pointerEvents: 'none',
    transition: 'opacity 150ms ease-in-out',
    zIndex: 1001,
  });

  return (
    <div 
      ref={containerRef}
      className={className}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        style={triggerStyle}
        onClick={handleTriggerClick}
        onMouseEnter={() => setIsTriggerHovered(true)}
        onMouseLeave={() => setIsTriggerHovered(false)}
        aria-label={userReaction ? 'Remove reaction' : 'Like It'}
        title={userReaction ? 'Click to remove reaction' : 'Click to Like, or hover for more reactions'}
      >
        {userReactionData ? (
          <span style={triggerIconStyle}>{userReactionData.emoji}</span>
        ) : (
          <span style={{ ...triggerIconStyle, color: 'var(--color-neutrals-2, #23262F)' }}>
            <ThumbsUp size={22} />
          </span>
        )}
      </button>

      {isPopupOpen && (
        <div style={popupStyle}>
          {REACTION_OPTIONS.map(reaction => (
            <button
              key={reaction.id}
              style={getOptionStyle(reaction.id)}
              onClick={() => handleReaction(reaction.id)}
              onMouseEnter={() => setHoveredOption(reaction.id)}
              onMouseLeave={() => setHoveredOption(null)}
              aria-label={reaction.label}
            >
              <span style={emojiStyle}>{reaction.emoji}</span>
              <span style={getTooltipStyle(reaction.id)}>{reaction.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleReactions;

