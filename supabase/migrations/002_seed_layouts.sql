-- Seed Journey Builder layouts with pre-configured components
-- Run this in Supabase SQL Editor to populate all 8 experiences

-- A-shopper: Full data + Shopping intent
UPDATE journey_layouts SET sections = '[
  {"componentId": "TopTenCarouselLeads", "props": {"initialVehicleType": "dynamic:preferredBodyStyle", "initialSubcategory": "All"}, "enabled": true},
  {"componentId": "HeroPlusThree", "props": {"title": "Recommended For You", "showAd": true}, "enabled": true},
  {"componentId": "WhatIsMyCarWorth", "props": {}, "enabled": true},
  {"componentId": "UserRatingsReviews", "props": {}, "enabled": true},
  {"componentId": "PersonalizedVehicles", "props": {}, "enabled": true},
  {"componentId": "NewsSection", "props": {"title": "Latest Car News From our Experts", "maxItems": 10, "showAd": true}, "enabled": true},
  {"componentId": "VehiclesSection", "props": {"title": "Top Ranked Vehicles", "showAd": true}, "enabled": true},
  {"componentId": "CommunityPostsPromo", "props": {"title": "Trending in Community", "maxPosts": 6, "showAd": true}, "enabled": true},
  {"componentId": "TopTenCarousel", "props": {"initialVehicleType": "Sedan", "initialSubcategory": "All"}, "enabled": true}
]'::jsonb
WHERE layout_key = 'A-shopper';

-- A-browser: Full data + Enthusiast/Browsing
UPDATE journey_layouts SET sections = '[
  {"componentId": "TrendingStories", "props": {}, "enabled": true},
  {"componentId": "TopTenCarousel", "props": {"initialVehicleType": "Performance", "initialSubcategory": "All"}, "enabled": true},
  {"componentId": "PersonalizedVehicles", "props": {}, "enabled": true},
  {"componentId": "HeroPlusThree", "props": {"title": "Recommended For You", "showAd": true}, "enabled": true},
  {"componentId": "WhatIsMyCarWorth", "props": {}, "enabled": true},
  {"componentId": "NewsSection", "props": {"title": "Latest Car News From our Experts", "maxItems": 10, "showAd": true}, "enabled": true},
  {"componentId": "VehiclesSection", "props": {"title": "Top Ranked Vehicles", "showAd": true}, "enabled": true},
  {"componentId": "CommunityPostsPromo", "props": {"title": "Trending in Community", "maxPosts": 6, "showAd": true}, "enabled": true}
]'::jsonb
WHERE layout_key = 'A-browser';

-- B-shopper: Want only + Shopping intent
UPDATE journey_layouts SET sections = '[
  {"componentId": "TopTenCarouselLeads", "props": {"initialVehicleType": "dynamic:preferredBodyStyle", "initialSubcategory": "All"}, "enabled": true},
  {"componentId": "HeroPlusThree", "props": {"title": "Recommended For You", "showAd": true}, "enabled": true},
  {"componentId": "UserRatingsReviews", "props": {}, "enabled": true},
  {"componentId": "KnowYourBudget", "props": {}, "enabled": true},
  {"componentId": "PersonalizedVehicles", "props": {}, "enabled": true},
  {"componentId": "NewsSection", "props": {"title": "Latest Car News From our Experts", "maxItems": 10, "showAd": true}, "enabled": true},
  {"componentId": "VehiclesSection", "props": {"title": "Top Ranked Vehicles", "showAd": true}, "enabled": true},
  {"componentId": "CommunityPostsPromo", "props": {"title": "Trending in Community", "maxPosts": 6, "showAd": true}, "enabled": true}
]'::jsonb
WHERE layout_key = 'B-shopper';

-- B-browser: Want only + Enthusiast/Browsing
UPDATE journey_layouts SET sections = '[
  {"componentId": "TopTenCarouselLeads", "props": {"initialVehicleType": "dynamic:preferredBodyStyle", "initialSubcategory": "All"}, "enabled": true},
  {"componentId": "TrendingStories", "props": {}, "enabled": true},
  {"componentId": "HeroPlusThree", "props": {"title": "Recommended For You", "showAd": true}, "enabled": true},
  {"componentId": "PersonalizedVehicles", "props": {}, "enabled": true},
  {"componentId": "NewsSection", "props": {"title": "Latest Car News From our Experts", "maxItems": 10, "showAd": true}, "enabled": true},
  {"componentId": "VehiclesSection", "props": {"title": "Top Ranked Vehicles", "showAd": true}, "enabled": true},
  {"componentId": "CommunityPostsPromo", "props": {"title": "Trending in Community", "maxPosts": 6, "showAd": true}, "enabled": true}
]'::jsonb
WHERE layout_key = 'B-browser';

-- C-shopper: Own only + Shopping intent
UPDATE journey_layouts SET sections = '[
  {"componentId": "WhatIsMyCarWorth", "props": {}, "enabled": true},
  {"componentId": "HeroPlusThree", "props": {"title": "Recommended For You", "showAd": true}, "enabled": true},
  {"componentId": "TopTenCarouselLeads", "props": {"initialVehicleType": "SUV", "initialSubcategory": "All"}, "enabled": true},
  {"componentId": "UserRatingsReviews", "props": {}, "enabled": true},
  {"componentId": "PersonalizedVehicles", "props": {}, "enabled": true},
  {"componentId": "NewsSection", "props": {"title": "Latest Car News From our Experts", "maxItems": 10, "showAd": true}, "enabled": true},
  {"componentId": "VehiclesSection", "props": {"title": "Top Ranked Vehicles", "showAd": true}, "enabled": true},
  {"componentId": "CommunityPostsPromo", "props": {"title": "Trending in Community", "maxPosts": 6, "showAd": true}, "enabled": true}
]'::jsonb
WHERE layout_key = 'C-shopper';

-- C-browser: Own only + Enthusiast/Browsing
UPDATE journey_layouts SET sections = '[
  {"componentId": "TrendingStories", "props": {}, "enabled": true},
  {"componentId": "TopTenCarousel", "props": {"initialVehicleType": "Performance", "initialSubcategory": "All"}, "enabled": true},
  {"componentId": "WhatIsMyCarWorth", "props": {}, "enabled": true},
  {"componentId": "HeroPlusThree", "props": {"title": "Recommended For You", "showAd": true}, "enabled": true},
  {"componentId": "PersonalizedVehicles", "props": {}, "enabled": true},
  {"componentId": "NewsSection", "props": {"title": "Latest Car News From our Experts", "maxItems": 10, "showAd": true}, "enabled": true},
  {"componentId": "VehiclesSection", "props": {"title": "Top Ranked Vehicles", "showAd": true}, "enabled": true},
  {"componentId": "CommunityPostsPromo", "props": {"title": "Trending in Community", "maxPosts": 6, "showAd": true}, "enabled": true}
]'::jsonb
WHERE layout_key = 'C-browser';

-- D-shopper: No data + Shopping intent
UPDATE journey_layouts SET sections = '[
  {"componentId": "TopTenCarouselLeads", "props": {"initialVehicleType": "SUV", "initialSubcategory": "All"}, "enabled": true},
  {"componentId": "HeroPlusThree", "props": {"title": "Recommended For You", "showAd": true}, "enabled": true},
  {"componentId": "KnowYourBudget", "props": {}, "enabled": true},
  {"componentId": "NewsSection", "props": {"title": "Latest Car News From our Experts", "maxItems": 10, "showAd": true}, "enabled": true},
  {"componentId": "VehiclesSection", "props": {"title": "Top Ranked Vehicles", "showAd": true}, "enabled": true},
  {"componentId": "CommunityPostsPromo", "props": {"title": "Trending in Community", "maxPosts": 6, "showAd": true}, "enabled": true},
  {"componentId": "TopTenCarousel", "props": {"initialVehicleType": "Sedan", "initialSubcategory": "All"}, "enabled": true}
]'::jsonb
WHERE layout_key = 'D-shopper';

-- D-browser: No data + Anonymous/Browsing (Default experience)
UPDATE journey_layouts SET sections = '[
  {"componentId": "HeroPlusThree", "props": {"title": "Recommended For You", "showAd": true}, "enabled": true},
  {"componentId": "TrendingStories", "props": {}, "enabled": true},
  {"componentId": "TopTenCarousel", "props": {"initialVehicleType": "SUV", "initialSubcategory": "All"}, "enabled": true},
  {"componentId": "NewsSection", "props": {"title": "Latest Car News From our Experts", "maxItems": 10, "showAd": true}, "enabled": true},
  {"componentId": "VehiclesSection", "props": {"title": "Top Ranked Vehicles", "showAd": true}, "enabled": true},
  {"componentId": "CommunityPostsPromo", "props": {"title": "Trending in Community", "maxPosts": 6, "showAd": true}, "enabled": true},
  {"componentId": "TopTenCarousel", "props": {"initialVehicleType": "Sedan", "initialSubcategory": "All"}, "enabled": true}
]'::jsonb
WHERE layout_key = 'D-browser';

-- Verify the updates
SELECT layout_key, name, jsonb_array_length(sections) as component_count FROM journey_layouts ORDER BY layout_key;

