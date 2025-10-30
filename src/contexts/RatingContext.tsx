import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface RatingContextType {
  userRatings: Record<string, number>; // vehicleName -> rating
  setUserRating: (vehicleName: string, rating: number) => void;
  getUserRating: (vehicleName: string) => number;
  clearRating: (vehicleName: string) => void;
  clearAllRatings: () => void;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

interface RatingProviderProps {
  children: ReactNode;
}

export const RatingProvider: React.FC<RatingProviderProps> = ({ children }) => {
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});

  // Load ratings from localStorage on mount
  useEffect(() => {
    const savedRatings = localStorage.getItem('userRatings');
    if (savedRatings) {
      try {
        setUserRatings(JSON.parse(savedRatings));
      } catch (error) {
        console.error('Error loading ratings from localStorage:', error);
      }
    }
  }, []);

  // Save ratings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userRatings', JSON.stringify(userRatings));
  }, [userRatings]);

  const setUserRating = (vehicleName: string, rating: number) => {
    setUserRatings(prev => ({
      ...prev,
      [vehicleName]: rating
    }));
  };

  const getUserRating = (vehicleName: string): number => {
    return userRatings[vehicleName] || 0;
  };

  const clearRating = (vehicleName: string) => {
    setUserRatings(prev => {
      const newRatings = { ...prev };
      delete newRatings[vehicleName];
      return newRatings;
    });
  };

  const clearAllRatings = () => {
    setUserRatings({});
  };

  const value: RatingContextType = {
    userRatings,
    setUserRating,
    getUserRating,
    clearRating,
    clearAllRatings
  };

  return (
    <RatingContext.Provider value={value}>
      {children}
    </RatingContext.Provider>
  );
};

export const useRating = (): RatingContextType => {
  const context = useContext(RatingContext);
  if (context === undefined) {
    throw new Error('useRating must be used within a RatingProvider');
  }
  return context;
};
