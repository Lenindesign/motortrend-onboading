# Top Ten Carousel - All Categories

This document lists all the categories available in the Top Ten Carousel component.

## Vehicle Types
- **SUV**
- **Sedan**
- **Truck**
- **Coupe**

## Subcategories
- **All** (shows top 10 across all subcategories, excludes vehicles with starting price > $150k)
- **Subcompact**
- **Compact**
- **Midsize**
- **Full-Size**
- **Luxury**
- **Electric**
- **Performance** (vehicles with starting price > $150k only)

## Complete Category Combinations

### SUV Categories
1. **Top Ten SUVs - All Categories**
2. **Top Ten SUVs - Subcompact**
3. **Top Ten SUVs - Compact**
4. **Top Ten SUVs - Midsize**
5. **Top Ten SUVs - Full-Size**
6. **Top Ten SUVs - Luxury**
7. **Top Ten SUVs - Electric**
8. **Top Ten SUVs - Performance**

### Sedan Categories
1. **Top Ten Sedans - All Categories**
2. **Top Ten Sedans - Subcompact**
3. **Top Ten Sedans - Compact**
4. **Top Ten Sedans - Midsize**
5. **Top Ten Sedans - Full-Size**
6. **Top Ten Sedans - Luxury**
7. **Top Ten Sedans - Electric**
8. **Top Ten Sedans - Performance**

### Truck Categories
1. **Top Ten Trucks - All Categories**
2. **Top Ten Trucks - Compact**
3. **Top Ten Trucks - Midsize**
4. **Top Ten Trucks - Full-Size**
5. **Top Ten Trucks - Luxury**
6. **Top Ten Trucks - Electric**
7. **Top Ten Trucks - Performance**

### Coupe Categories
1. **Top Ten Coupes - All Categories**
2. **Top Ten Coupes - Compact**
3. **Top Ten Coupes - Midsize**
4. **Top Ten Coupes - Luxury**
5. **Top Ten Coupes - Electric**
6. **Top Ten Coupes - Performance**

## Ranking Logic

Vehicles are ranked by:
1. **MotorTrend Staff Rating** (primary criteria)
2. **Year** (newer vehicles prioritized when ratings are equal)

The top 10 vehicles are selected and displayed in reverse order (rank 10 to rank 1).

## Price Filtering

- Vehicles with a starting price (priceMin) greater than $150,000 are **excluded** from all regular subcategories (including "All Categories")
- Vehicles with a starting price greater than $150,000 are **only** included in the "Performance" subcategory
- This ensures high-end performance vehicles are separated from regular categories

## Notes

- The actual vehicle rankings are dynamically calculated based on the current vehicle database
- Rankings update automatically when vehicle ratings change
- Each category shows the top 10 vehicles that match both the vehicle type and subcategory filters
- The "All Categories" option shows the top 10 vehicles of that type regardless of subcategory (excluding vehicles > $150k)

