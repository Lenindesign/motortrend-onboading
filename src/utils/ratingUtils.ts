/**
 * Calculate overall rating from category ratings
 * Returns the average of all provided category ratings
 */
export function computeOverallRating(
  categoryRatings: {
    reliability?: number;
    driverExperience?: number;
    budgetFriendly?: number;
    manufacturerWarranty?: number;
  }
): number {
  const ratings: number[] = [];
  
  if (categoryRatings.reliability && categoryRatings.reliability > 0) {
    ratings.push(categoryRatings.reliability);
  }
  if (categoryRatings.driverExperience && categoryRatings.driverExperience > 0) {
    ratings.push(categoryRatings.driverExperience);
  }
  if (categoryRatings.budgetFriendly && categoryRatings.budgetFriendly > 0) {
    ratings.push(categoryRatings.budgetFriendly);
  }
  if (categoryRatings.manufacturerWarranty && categoryRatings.manufacturerWarranty > 0) {
    ratings.push(categoryRatings.manufacturerWarranty);
  }
  
  if (ratings.length === 0) {
    return 0;
  }
  
  // Calculate average and round to 1 decimal place
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  const average = sum / ratings.length;
  return Math.round(average * 10) / 10; // Round to 1 decimal place
}

