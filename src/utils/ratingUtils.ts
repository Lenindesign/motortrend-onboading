/**
 * Calculate overall rating from category ratings
 * Returns the average of all provided category ratings
 */
export function computeOverallRating(
  categoryRatings: {
    comfort?: number;
    reliability?: number;
    interior?: number;
    value?: number;
    safety?: number;
  }
): number {
  const ratings: number[] = [];
  
  if (categoryRatings.comfort && categoryRatings.comfort > 0) {
    ratings.push(categoryRatings.comfort);
  }
  if (categoryRatings.reliability && categoryRatings.reliability > 0) {
    ratings.push(categoryRatings.reliability);
  }
  if (categoryRatings.interior && categoryRatings.interior > 0) {
    ratings.push(categoryRatings.interior);
  }
  if (categoryRatings.value && categoryRatings.value > 0) {
    ratings.push(categoryRatings.value);
  }
  if (categoryRatings.safety && categoryRatings.safety > 0) {
    ratings.push(categoryRatings.safety);
  }
  
  if (ratings.length === 0) {
    return 0;
  }
  
  // Calculate average and round to 1 decimal place
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  const average = sum / ratings.length;
  return Math.round(average * 10) / 10; // Round to 1 decimal place
}

