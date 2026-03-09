/**
 * Events data utility
 * Provides event data, types, and helpers for the Events page template.
 * Supports multi-brand events (MotorTrend, HOT ROD, Road & Track).
 */

export type EventBrand = 'motortrend' | 'hotrod' | 'roadandtrack' | 'caranddriver';
export type EventStatus = 'upcoming' | 'ongoing' | 'past' | 'sold-out';
export type EventType = 'experience' | 'power-tour' | 'rally' | 'show' | 'track-day' | 'meetup' | 'virtual' | 'membership' | 'drag-week' | 'power-fest';

export interface EventHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface EventPricing {
  label: string;
  price: number;
  originalPrice?: number;
  unit: string;
  ctaText: string;
  ctaUrl: string;
}

export interface EventScheduleDay {
  date: string;
  title: string;
  location: string;
  description: string;
  highlights?: string[];
}

export interface EventTestimonial {
  quote: string;
  author: string;
}

export interface EventFAQ {
  question: string;
  answer: string;
}

export interface EventSponsor {
  name: string;
  logo: string;
  tier: 'title' | 'presenting' | 'official';
}

export interface EventData {
  id: string;
  slug: string;
  brand: EventBrand;
  type: EventType;
  status: EventStatus;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  logo?: string;
  dates: {
    start: string;
    end: string;
    displayText: string;
  };
  location: {
    primary: string;
    region?: string;
    mapUrl?: string;
  };
  pricing: EventPricing[];
  highlights: EventHighlight[];
  schedule: EventScheduleDay[];
  gallery: string[];
  testimonials: EventTestimonial[];
  faq: EventFAQ[];
  sponsors: EventSponsor[];
  registrationUrl: string;
  tags: string[];
  featuredArticles?: { title: string; slug: string; image: string }[];
  externalLinks?: { label: string; url: string }[];
  ticketsUrl?: string;
}

export const brandConfig: Record<EventBrand, { name: string; color: string; logo: string; tagline: string; icon: string; iconImage?: string }> = {
  motortrend: {
    name: 'MotorTrend',
    color: '#E90C17',
    logo: 'https://www.motortrend.com/uploads/2022/02/MotorTrend-logo.png',
    tagline: 'The Ultimate Automotive Experience',
    icon: 'speed',
    iconImage: '/images/mt-brand-icon.svg',
  },
  hotrod: {
    name: 'HOT ROD',
    color: '#FF6600',
    logo: 'https://www.hotrod.com/uploads/sites/21/2020/05/hot-rod-logo-red.png',
    tagline: 'Power Tour & Beyond',
    icon: 'local_fire_department',
    iconImage: '/images/hotrod-brand-icon.svg',
  },
  roadandtrack: {
    name: 'Road & Track',
    color: '#1A1A1A',
    logo: 'https://www.roadandtrack.com/uploads/sites/2/2022/03/road-track-logo.png',
    tagline: 'Experiences Worth Driving For',
    icon: 'route',
    iconImage: '/images/randt-brand-icon.svg',
  },
  caranddriver: {
    name: 'Car and Driver',
    color: '#0057B8',
    logo: 'https://www.caranddriver.com/uploads/sites/1/2022/03/car-and-driver-logo.png',
    tagline: 'Performance Tested',
    icon: 'timer',
    iconImage: '/images/cad-brand-icon.svg',
  },
};

const eventsData: EventData[] = [
  {
    id: 'hrpt-2026',
    slug: 'hot-rod-power-tour-2026',
    brand: 'hotrod',
    type: 'power-tour',
    status: 'upcoming',
    title: 'HOT ROD Power Tour 2026',
    subtitle: 'The Ultimate Cross-Country Driving Event',
    description: 'Join thousands of hot rod and muscle car enthusiasts for the most iconic cross-country automotive tour in America. Seven days, seven cities, one incredible adventure. Drive your ride across the heartland alongside legends and first-timers alike.',
    heroImage: '/images/hrpt-2026-hero.png',
    dates: {
      start: '2026-06-08',
      end: '2026-06-14',
      displayText: 'June 8–14, 2026',
    },
    location: {
      primary: 'Southeast United States',
      region: 'Nashville, TN to Tampa, FL',
    },
    pricing: [
      {
        label: 'Long Hauler',
        price: 150,
        unit: 'per vehicle',
        ctaText: 'Register Now',
        ctaUrl: '/events/hot-rod-power-tour-2026/register',
      },
      {
        label: 'Single Day',
        price: 25,
        unit: 'per day',
        ctaText: 'Get Day Pass',
        ctaUrl: '/events/hot-rod-power-tour-2026/register',
      },
    ],
    highlights: [
      { icon: 'route', title: 'Epic Route', description: '1,500+ miles across 7 states with curated scenic routes and pit stops.' },
      { icon: 'groups', title: '5,000+ Vehicles', description: 'The largest touring automotive event in America with hot rods, muscle cars, and customs.' },
      { icon: 'speed', title: 'Drag Racing', description: 'Drag strip access at multiple stops — run your car down the quarter mile.' },
      { icon: 'local_activity', title: 'Car Shows', description: 'Daily car shows with awards, plus the legendary Pro Street Alley.' },
      { icon: 'restaurant', title: 'Local Flavor', description: 'Curated food, music, and culture at every stop along the route.' },
      { icon: 'emoji_events', title: 'Awards & Prizes', description: 'Long Hauler awards, best-of-show trophies, and surprise giveaways.' },
    ],
    schedule: [
      { date: 'June 8', title: 'Day 1: Kickoff in Nashville', location: 'Nashville, TN', description: 'Registration, car show, and opening night celebration at Nashville Superspeedway.', highlights: ['Registration opens at 7 AM', 'Welcome concert', 'Car show & cruising'] },
      { date: 'June 9', title: 'Day 2: Cruise to Chattanooga', location: 'Chattanooga, TN', description: '180-mile scenic cruise through Tennessee hill country with drag racing at the local strip.', highlights: ['Scenic mountain route', 'Drag strip access', 'Downtown cruise-in'] },
      { date: 'June 10', title: 'Day 3: Atlanta Bound', location: 'Atlanta, GA', description: 'Roll into Atlanta for a massive car show at Atlanta Motor Speedway.', highlights: ['Atlanta Motor Speedway', 'Pro Street Alley', 'Night cruise'] },
      { date: 'June 11', title: 'Day 4: South to Macon', location: 'Macon, GA', description: 'A shorter cruise day with more time for car shows and community events.', highlights: ['Southern hospitality stops', 'Live music', 'Swap meet'] },
      { date: 'June 12', title: 'Day 5: Jacksonville Run', location: 'Jacksonville, FL', description: 'Cross into Florida with coastal cruising and beachside car displays.', highlights: ['Coastal highway route', 'Beach car show', 'Sunset cruise'] },
      { date: 'June 13', title: 'Day 6: Daytona Detour', location: 'Daytona Beach, FL', description: 'Special stop at Daytona International Speedway for laps and events.', highlights: ['Daytona Speedway access', 'Parade laps', 'Racing demonstrations'] },
      { date: 'June 14', title: 'Day 7: Finish in Tampa', location: 'Tampa, FL', description: 'The grand finale with the closing ceremony, final car show, and Long Hauler awards.', highlights: ['Closing ceremony', 'Long Hauler awards', 'Final car show & celebration'] },
    ],
    gallery: [
      'https://d2kde5ohu8qb21.cloudfront.net/files/hrpt-gallery-1.jpg',
      'https://d2kde5ohu8qb21.cloudfront.net/files/hrpt-gallery-2.jpg',
      'https://d2kde5ohu8qb21.cloudfront.net/files/hrpt-gallery-3.jpg',
      'https://d2kde5ohu8qb21.cloudfront.net/files/hrpt-gallery-4.jpg',
    ],
    testimonials: [
      { quote: 'Power Tour is the best week of my year. Nothing beats 1,500 miles with your best friends and 5,000 hot rods.', author: 'Mike G., Long Hauler since 2012' },
      { quote: 'I drove my \'69 Camaro across six states and it was the most incredible automotive experience of my life.', author: 'Sarah T., First-time Long Hauler' },
      { quote: 'The community, the cars, the open road — Power Tour is absolutely unmatched.', author: 'Dave R., 10-year veteran' },
    ],
    faq: [
      { question: 'What is a Long Hauler?', answer: 'A Long Hauler is someone who drives the entire route from start to finish. You\'ll receive a special Long Hauler award and commemorative plaque at the closing ceremony.' },
      { question: 'Can I join for just one day?', answer: 'Absolutely! Single-day passes are available at each stop. You can experience the car show, drag racing, and events at any individual location.' },
      { question: 'What kind of vehicles can participate?', answer: 'All vehicles are welcome — hot rods, muscle cars, trucks, customs, and even daily drivers. If it has wheels and an engine, bring it!' },
      { question: 'Is there support for breakdowns?', answer: 'Yes, we have a support crew and partner tow services along the route. Mechanical support is available at each stop.' },
    ],
    sponsors: [],
    registrationUrl: '/events/hot-rod-power-tour-2026/register',
    tags: ['hot-rod', 'power-tour', 'cross-country', 'car-show', 'drag-racing'],
    featuredArticles: [
      { title: 'HOT ROD Power Tour 2025: Epic Gallery of Long Haulers', slug: 'hrpt-2025-gallery', image: 'https://d2kde5ohu8qb21.cloudfront.net/files/hrpt-2025-long-haulers.jpg' },
      { title: 'Touring the United States One Power Tour at a Time', slug: 'touring-us-power-tour', image: 'https://d2kde5ohu8qb21.cloudfront.net/files/hrpt-touring-us.jpg' },
      { title: 'Pro Street Alley: The Cars That Stole the Show', slug: 'pro-street-alley-2025', image: 'https://d2kde5ohu8qb21.cloudfront.net/files/pro-street-alley.jpg' },
    ],
  },
  {
    id: 'rt-northwest-shift-2026',
    slug: 'northwest-shift-2026',
    brand: 'roadandtrack',
    type: 'experience',
    status: 'upcoming',
    title: 'Northwest Shift 2026',
    subtitle: 'Oregon + Washington',
    description: 'Join us for the best driving experiences the Pacific Northwest has to offer — on the road, on the track, and even off-road. Get your adrenaline pumping at Portland International Raceway, hone your rally skills at DirtFish Rally School, and cruise stunning mountain roads curated by Road & Track editors.',
    heroImage: '/images/rt-northwest-shift-hero.png',
    dates: {
      start: '2026-06-10',
      end: '2026-06-13',
      displayText: 'June 10–13, 2026',
    },
    location: {
      primary: 'Oregon + Washington',
      region: 'Pacific Northwest',
    },
    pricing: [
      {
        label: 'Single Car Entry',
        price: 10995,
        originalPrice: 13995,
        unit: 'includes driver + one guest',
        ctaText: 'Apply Now',
        ctaUrl: '/events/northwest-shift-2026/register',
      },
    ],
    highlights: [
      { icon: 'sports_score', title: 'Track Time', description: 'Lead-follow sessions, autocross competition, and ride-alongs at Portland International Raceway.' },
      { icon: 'landscape', title: 'Scenic Drives', description: 'Oregon and Washington\'s spectacular mountain roads, including Mount Rainier and White Pass Scenic Byway.' },
      { icon: 'terrain', title: 'DirtFish Rally School', description: 'Masterclass in rally driving — throttle management, weight transfer, and left-foot braking in rally-prepared Subarus.' },
      { icon: 'hotel', title: 'Luxury Stays', description: 'Three nights at boutique hotels: Sentinel Hotel Portland, Paradise Inn, and Willows Lodge.' },
      { icon: 'restaurant', title: 'Culinary Experiences', description: 'Indulge in the region\'s finest flavors, from local favorites and gourmet cuisine to craft cocktails.' },
      { icon: 'card_giftcard', title: 'Exclusive Access', description: 'Connect with the most knowledgeable automotive experts in the industry and R&T editors.' },
    ],
    schedule: [
      { date: 'June 10', title: 'Day 1: Portland Arrival', location: 'Portland, OR', description: 'Check in at Sentinel Hotel Portland. Welcome reception and driver briefing with Road & Track editors.', highlights: ['Check-in & welcome', 'Driver briefing', 'Welcome dinner'] },
      { date: 'June 11', title: 'Day 2: Track Day at PIR', location: 'Portland International Raceway', description: 'A full day at Portland International Raceway with lead-follow sessions, autocross, and high-speed ride-alongs.', highlights: ['Lead-follow sessions', 'Autocross competition', 'Ride-alongs with editors'] },
      { date: 'June 12', title: 'Day 3: Mountain Drive to Rainier', location: 'Mount Rainier National Park', description: 'Editor-led rally through mountain passes to Mount Rainier. Overnight at Paradise Inn.', highlights: ['Scenic mountain drive', 'Mount Rainier stop', 'Wine country dinner'] },
      { date: 'June 13', title: 'Day 4: DirtFish & Farewell', location: 'DirtFish Rally School, WA', description: 'Rally school in the morning, awards lunch at Willows Lodge, and farewell.', highlights: ['DirtFish Rally School', 'Awards ceremony', 'Farewell lunch'] },
    ],
    gallery: [
      'https://d2kde5ohu8qb21.cloudfront.net/files/rt-nws-gallery-1.jpg',
      'https://d2kde5ohu8qb21.cloudfront.net/files/rt-nws-gallery-2.jpg',
      'https://d2kde5ohu8qb21.cloudfront.net/files/rt-nws-gallery-3.jpg',
      'https://d2kde5ohu8qb21.cloudfront.net/files/rt-nws-gallery-4.jpg',
    ],
    testimonials: [
      { quote: 'An extraordinary four days of incredible roads, world-class tracks, and genuine camaraderie with fellow enthusiasts.', author: 'James K.' },
      { quote: 'The rally through Mount Rainier was breathtaking. Worth every penny — I\'m already signed up for next year.', author: 'Angela M.' },
    ],
    faq: [
      { question: 'What kind of car should I bring?', answer: 'Any performance-oriented vehicle is welcome. Sports cars, grand tourers, and performance SUVs are all popular choices. The roads and track are suitable for all experience levels.' },
      { question: 'Is the rally school included?', answer: 'Yes! Registration includes DirtFish Rally School driving program for one driver. A second driver can be added for an additional fee on a first-come, first-served basis.' },
      { question: 'Are accommodations included?', answer: 'Yes, three nights of double-occupancy hotel stays at Sentinel Hotel Portland, Paradise Inn, and Willows Lodge are included in the entry fee.' },
      { question: 'What meals are included?', answer: 'All breakfasts, lunches, the welcome dinner, wine country dinner, and farewell awards lunch are included.' },
    ],
    sponsors: [
      { name: 'Corient', logo: 'https://d2kde5ohu8qb21.cloudfront.net/files/corient-logo.png', tier: 'presenting' },
    ],
    registrationUrl: '/events/northwest-shift-2026/register',
    tags: ['road-and-track', 'experience', 'track-day', 'rally', 'pacific-northwest'],
    featuredArticles: [
      { title: 'What to Expect at a Road & Track Experience', slug: 'rt-experience-guide', image: 'https://d2kde5ohu8qb21.cloudfront.net/files/rt-experience-guide.jpg' },
      { title: 'The Best Driving Roads in the Pacific Northwest', slug: 'best-roads-pnw', image: 'https://d2kde5ohu8qb21.cloudfront.net/files/best-roads-pnw.jpg' },
    ],
  },
  {
    id: 'mt-auto-show-2026',
    slug: 'motortrend-auto-show-2026',
    brand: 'motortrend',
    type: 'show',
    status: 'upcoming',
    title: 'MotorTrend Auto Show 2026',
    subtitle: 'The Future of Driving, Today',
    description: 'Experience the most anticipated vehicles of the year up close. Test drive the latest EVs, see concept cars before anyone else, and hear from the engineers and designers shaping the future of mobility.',
    heroImage: '/images/mt-auto-show-hero.png',
    dates: {
      start: '2026-11-14',
      end: '2026-11-22',
      displayText: 'November 14–22, 2026',
    },
    location: {
      primary: 'Los Angeles Convention Center',
      region: 'Los Angeles, CA',
    },
    pricing: [
      {
        label: 'General Admission',
        price: 20,
        unit: 'per person',
        ctaText: 'Buy Tickets',
        ctaUrl: '/events/motortrend-auto-show-2026/register',
      },
      {
        label: 'VIP Experience',
        price: 150,
        originalPrice: 200,
        unit: 'per person',
        ctaText: 'Get VIP Pass',
        ctaUrl: '/events/motortrend-auto-show-2026/register',
      },
    ],
    highlights: [
      { icon: 'directions_car', title: 'Test Drives', description: 'Get behind the wheel of the newest models from top manufacturers on our indoor and outdoor courses.' },
      { icon: 'auto_awesome', title: 'World Debuts', description: 'See concept cars and production reveals before they hit the road.' },
      { icon: 'bolt', title: 'EV Experience', description: 'Dedicated electric vehicle zone with test drives, charging demos, and technology showcases.' },
      { icon: 'mic', title: 'Expert Panels', description: 'Hear from MotorTrend editors, automotive engineers, and industry leaders.' },
      { icon: 'family_restroom', title: 'Family Friendly', description: 'Interactive exhibits, kids\' zones, and activities for enthusiasts of all ages.' },
      { icon: 'local_parking', title: 'Car Corral', description: 'Show off your own ride in the MotorTrend Car Corral — open to all makes and models.' },
    ],
    schedule: [
      { date: 'Nov 14–15', title: 'Media & VIP Preview', location: 'LA Convention Center', description: 'Exclusive early access for media and VIP ticket holders with manufacturer presentations.', highlights: ['Manufacturer reveals', 'Editor meet & greet', 'VIP lounge access'] },
      { date: 'Nov 16–22', title: 'Public Days', location: 'LA Convention Center', description: 'Open to the public with test drives, exhibits, and daily programming.', highlights: ['Open 10 AM – 8 PM daily', 'Test drive slots throughout the day', 'Live stage events'] },
    ],
    gallery: [],
    testimonials: [
      { quote: 'Seeing the concepts up close and getting to test drive the latest EVs in one place — you can\'t beat it.', author: 'Carlos P.' },
      { quote: 'Took the whole family and we all had a blast. The kids loved the interactive exhibits.', author: 'Michelle L.' },
    ],
    faq: [
      { question: 'Where do I park?', answer: 'Parking is available at the LA Convention Center garage and nearby lots. VIP ticket holders receive complimentary parking.' },
      { question: 'Can I test drive at the show?', answer: 'Yes! Multiple manufacturers offer test drives on our indoor and outdoor courses. Sign up for time slots on-site or through the event app.' },
      { question: 'Is there a discount for MotorTrend subscribers?', answer: 'Yes, MotorTrend+ subscribers receive $5 off general admission and early VIP access pricing.' },
    ],
    sponsors: [],
    registrationUrl: '/events/motortrend-auto-show-2026/register',
    tags: ['motortrend', 'auto-show', 'test-drives', 'ev', 'los-angeles'],
  },
  {
    id: 'rt-editor-roundtable',
    slug: 'editor-roundtable-2026',
    brand: 'roadandtrack',
    type: 'virtual',
    status: 'upcoming',
    title: 'R&T Editor Roundtable',
    subtitle: 'Members-Only Virtual Event',
    description: 'Join Road & Track editors for an exclusive virtual roundtable. Get behind-the-scenes scoops, ask burning questions, and be the first to hear about upcoming issues and features. Available to All Access members.',
    heroImage: '/images/rt-editor-roundtable.png',
    dates: { start: '2026-02-03', end: '2026-02-03', displayText: 'February 3, 2026' },
    location: { primary: 'Digital', region: 'Virtual Event' },
    pricing: [{ label: 'All Access Membership', price: 50, unit: 'per year', ctaText: 'Join Now', ctaUrl: 'https://shop.roadandtrack.com/road-track-all-access-membership-2.html' }],
    highlights: [
      { icon: 'videocam', title: 'Live Video', description: 'Stream live from your device — desktop or mobile.' },
      { icon: 'chat', title: 'Q&A with Editors', description: 'Ask Road & Track editors anything in a live Q&A format.' },
      { icon: 'lock', title: 'Members Only', description: 'Exclusive to R&T All Access and Premium members.' },
    ],
    schedule: [{ date: 'Feb 3', title: 'Live Roundtable', location: 'Virtual', description: 'Editors discuss the latest issue, upcoming features, and answer member questions live.' }],
    gallery: [], testimonials: [], faq: [], sponsors: [],
    registrationUrl: 'https://shop.roadandtrack.com/road-track-all-access-membership-2.html',
    tags: ['road-and-track', 'virtual', 'members-only', 'editors'],
    externalLinks: [{ label: 'R&T Membership', url: 'https://shop.roadandtrack.com/road-track-all-access-membership-2.html' }],
  },
  {
    id: 'rt-desert-run-600',
    slug: 'desert-run-600-2026',
    brand: 'roadandtrack',
    type: 'experience',
    status: 'upcoming',
    title: 'Desert Run 600',
    subtitle: 'Nevada · Utah · Arizona',
    description: 'A 600-mile multi-day driving experience through the stunning deserts of the American Southwest. Navigate canyons, cruise through red rock country, and push your driving limits on roads curated by Road & Track editors.',
    heroImage: '/images/rt-desert-run-600.png',
    dates: { start: '2026-04-14', end: '2026-04-17', displayText: 'April 14–17, 2026' },
    location: { primary: 'Nevada, Utah, Arizona', region: 'American Southwest' },
    pricing: [{ label: 'Single Car Entry', price: 13995, unit: 'includes driver + one guest', ctaText: 'Apply Now', ctaUrl: 'https://experiences.roadandtrack.com/desert-run-600' }],
    highlights: [
      { icon: 'landscape', title: '600 Miles of Desert Roads', description: 'Curated routes through Nevada, Utah, and Arizona canyon country.' },
      { icon: 'hotel', title: 'Premium Accommodations', description: 'Luxury resort stays at each stop along the route.' },
      { icon: 'restaurant', title: 'Culinary Experiences', description: 'Chef-curated meals featuring Southwest cuisine.' },
      { icon: 'groups', title: 'Editor-Led Rally', description: 'Drive alongside Road & Track editors and fellow enthusiasts.' },
    ],
    schedule: [
      { date: 'Apr 14', title: 'Day 1: Nevada Departure', location: 'Las Vegas, NV', description: 'Welcome reception and driver briefing before heading into the desert.' },
      { date: 'Apr 15', title: 'Day 2: Canyon Country', location: 'Utah', description: 'Drive through spectacular canyon roads and red rock formations.' },
      { date: 'Apr 16', title: 'Day 3: Arizona Bound', location: 'Arizona', description: 'Desert highways and mountain passes leading into Arizona.' },
      { date: 'Apr 17', title: 'Day 4: Finish & Farewell', location: 'Scottsdale, AZ', description: 'Final drive, awards ceremony, and farewell dinner.' },
    ],
    gallery: [], testimonials: [], faq: [], sponsors: [],
    registrationUrl: 'https://experiences.roadandtrack.com/desert-run-600',
    tags: ['road-and-track', 'experience', 'desert', 'southwest', 'rally'],
    externalLinks: [{ label: 'R&T Experiences', url: 'https://experiences.roadandtrack.com/desert-run-600' }],
    ticketsUrl: 'https://experiences.roadandtrack.com/desert-run-600',
  },
  {
    id: 'rt-ring-to-spa',
    slug: 'ring-to-spa-2026',
    brand: 'roadandtrack',
    type: 'experience',
    status: 'upcoming',
    title: 'Ring to Spa 2026',
    subtitle: 'Germany · Belgium · Netherlands',
    description: 'The ultimate European driving experience. Drive the legendary Nürburgring Nordschleife, cruise to Circuit de Spa-Francorchamps, and explore the finest roads of Germany, Belgium, and the Netherlands with Road & Track editors.',
    heroImage: '/images/rt-ring-to-spa.png',
    dates: { start: '2026-10-06', end: '2026-10-13', displayText: 'October 6–13, 2026' },
    location: { primary: 'Germany, Belgium, Netherlands', region: 'Europe' },
    pricing: [{ label: 'Entry Fee', price: 0, unit: 'TBC', ctaText: 'Get Notified', ctaUrl: 'https://experiences.roadandtrack.com/ring-to-spa-2026' }],
    highlights: [
      { icon: 'sports_score', title: 'Nürburgring Nordschleife', description: 'Laps on the legendary 12.9-mile circuit through the Eifel mountains.' },
      { icon: 'flag', title: 'Spa-Francorchamps', description: 'Track time at one of the most iconic circuits in motorsport history.' },
      { icon: 'route', title: 'European Grand Tour', description: 'Editor-curated routes through three countries over eight unforgettable days.' },
      { icon: 'hotel', title: 'Luxury European Hotels', description: 'Stays at hand-picked boutique hotels and historic properties.' },
    ],
    schedule: [],
    gallery: [], testimonials: [], faq: [], sponsors: [],
    registrationUrl: 'https://experiences.roadandtrack.com/ring-to-spa-2026',
    tags: ['road-and-track', 'experience', 'europe', 'nurburgring', 'spa'],
    externalLinks: [{ label: 'R&T Experiences', url: 'https://experiences.roadandtrack.com/ring-to-spa-2026' }],
  },
  {
    id: 'rt-hudson-quattrocento',
    slug: 'hudson-quattrocento-2026',
    brand: 'roadandtrack',
    type: 'experience',
    status: 'upcoming',
    title: 'Hudson Quattrocento',
    subtitle: 'New York · Connecticut',
    description: 'A premium fall driving experience through the Hudson Valley and Connecticut countryside. Enjoy peak foliage, world-class restaurants, and winding roads through some of the most beautiful scenery on the East Coast.',
    heroImage: '/images/rt-hudson-quattrocento.png',
    dates: { start: '2026-10-27', end: '2026-10-30', displayText: 'October 27–30, 2026' },
    location: { primary: 'New York, Connecticut', region: 'Northeast' },
    pricing: [{ label: 'Single Car Entry', price: 19995, unit: 'includes driver + one guest', ctaText: 'Apply Now', ctaUrl: 'https://experiences.roadandtrack.com/ring-to-spa-2026' }],
    highlights: [
      { icon: 'park', title: 'Fall Foliage Routes', description: 'Drive through peak autumn colors in the Hudson Valley and Connecticut hills.' },
      { icon: 'restaurant', title: 'Farm-to-Table Dining', description: 'Exceptional culinary experiences at the region\'s top restaurants.' },
      { icon: 'hotel', title: 'Boutique Stays', description: 'Luxury accommodations in historic Hudson Valley properties.' },
      { icon: 'directions_car', title: 'Curated Routes', description: 'Editor-selected roads through rolling countryside and river valleys.' },
    ],
    schedule: [],
    gallery: [], testimonials: [], faq: [], sponsors: [],
    registrationUrl: 'https://experiences.roadandtrack.com/ring-to-spa-2026',
    tags: ['road-and-track', 'experience', 'northeast', 'fall', 'hudson-valley'],
    externalLinks: [{ label: 'R&T Experiences', url: 'https://experiences.roadandtrack.com/ring-to-spa-2026' }],
    ticketsUrl: 'https://experiences.roadandtrack.com/ring-to-spa-2026',
  },
  {
    id: 'mt-roadkill-nights-2026',
    slug: 'roadkill-nights-2026',
    brand: 'motortrend',
    type: 'show',
    status: 'upcoming',
    title: 'Roadkill Nights 2026',
    subtitle: 'Powered by Dodge',
    description: 'The ultimate street-legal drag racing event returns. Burn rubber on Woodward Avenue in one of the most electrifying nights in American automotive culture. Drag racing, burnout contests, thrill rides, and more.',
    heroImage: '/images/mt-roadkill-nights.png',
    dates: { start: '2026-08-08', end: '2026-08-08', displayText: 'August 8, 2026' },
    location: { primary: 'Pontiac, MI', region: 'Detroit Metro' },
    pricing: [{ label: 'General Admission', price: 0, unit: 'TBC', ctaText: 'Get Tickets', ctaUrl: '/events/roadkill-nights-2026/register' }],
    highlights: [
      { icon: 'speed', title: 'Street-Legal Drag Racing', description: 'Race down Woodward Avenue in a sanctioned, street-legal drag event.' },
      { icon: 'local_fire_department', title: 'Burnout Contest', description: 'Compete for the ultimate burnout crown.' },
      { icon: 'directions_car', title: 'Thrill Rides', description: 'Ride along in high-performance vehicles driven by professionals.' },
      { icon: 'fastfood', title: 'Food & Entertainment', description: 'Live music, food trucks, and vendor displays all night.' },
    ],
    schedule: [{ date: 'Aug 8', title: 'Roadkill Nights', location: 'Woodward Ave, Pontiac, MI', description: 'Gates open in the afternoon. Drag racing, burnouts, thrill rides, and entertainment run through the evening.' }],
    gallery: [], testimonials: [], faq: [], sponsors: [],
    registrationUrl: '/events/roadkill-nights-2026/register',
    tags: ['motortrend', 'roadkill', 'drag-racing', 'detroit'],
    externalLinks: [
      { label: 'HOT ROD Page', url: 'https://www.hotrod.com/roadkill-nights' },
      { label: 'Event Coverage', url: 'https://www.hotrod.com/features/roadkill-nights-2025-heads-up-racing' },
    ],
  },
  {
    id: 'hr-drag-week-2026',
    slug: 'hot-rod-drag-week-2026',
    brand: 'hotrod',
    type: 'drag-week',
    status: 'upcoming',
    title: 'HOT ROD Drag Week 2026',
    subtitle: 'Route 66 Edition',
    description: 'The toughest drag race on the planet. Drive your car to the track, race it, drive to the next track, and do it all over again for five straight days. Street-legal vehicles only — no trailers allowed.',
    heroImage: '/images/hr-drag-week-2026.png',
    dates: { start: '2026-09-14', end: '2026-09-18', displayText: 'September 14–18, 2026' },
    location: { primary: 'IL, MO', region: 'Route 66 Corridor' },
    pricing: [{ label: 'Racer Entry', price: 0, unit: 'TBC', ctaText: 'Register', ctaUrl: 'https://forms.office.com/Pages/ResponsePage.aspx?id=55RIqMWH40CXgzINAzSzzP7PF8YOCl1OlWg7cbQM9j1UNDRQWTFBVlk3MjNKVlo0N09CQ0tWSlJUWS4u' }],
    highlights: [
      { icon: 'speed', title: '5 Days, 5 Tracks', description: 'Race at a different drag strip every day — your car must drive between each one.' },
      { icon: 'block', title: 'No Trailers', description: 'All vehicles must be street-legal and drive the entire route under their own power.' },
      { icon: 'emoji_events', title: 'Fastest Street Car', description: 'Compete for the title of the fastest street car in America.' },
      { icon: 'route', title: 'Route 66 Corridor', description: 'Race across the historic Route 66 heartland.' },
    ],
    schedule: [
      { date: 'Sep 14', title: 'Day 1: Route 66 Raceway', location: 'Joliet, IL', description: 'Registration, tech inspection, and first round of racing.' },
      { date: 'Sep 15', title: 'Day 2: Drive & Race', location: 'TBC', description: 'Drive to the second track and race.' },
      { date: 'Sep 16', title: 'Day 3: Midweek Grind', location: 'MO', description: 'The longest drive day with racing at a Missouri track.' },
      { date: 'Sep 17', title: 'Day 4: Push Through', location: 'TBC', description: 'Fourth track with competition heating up.' },
      { date: 'Sep 18', title: 'Day 5: Finals', location: 'TBC', description: 'Final round of racing and awards ceremony.' },
    ],
    gallery: [], testimonials: [], faq: [], sponsors: [],
    registrationUrl: 'https://forms.office.com/Pages/ResponsePage.aspx?id=55RIqMWH40CXgzINAzSzzP7PF8YOCl1OlWg7cbQM9j1UNDRQWTFBVlk3MjNKVlo0N09CQ0tWSlJUWS4u',
    tags: ['hot-rod', 'drag-week', 'drag-racing', 'route-66', 'street-legal'],
    externalLinks: [
      { label: 'HOT ROD Page', url: 'https://www.hotrod.com/hot-rod-drag-week' },
      { label: 'Schedule & Route', url: 'https://www.hotrod.com/events/2026-hot-rod-drag-week-schedule-route-66-raceway' },
    ],
    ticketsUrl: 'https://forms.office.com/Pages/ResponsePage.aspx?id=55RIqMWH40CXgzINAzSzzP7PF8YOCl1OlWg7cbQM9j1UNDRQWTFBVlk3MjNKVlo0N09CQ0tWSlJUWS4u',
  },
  {
    id: 'hr-power-fest-2026',
    slug: 'hot-rod-power-fest-2026',
    brand: 'hotrod',
    type: 'power-fest',
    status: 'upcoming',
    title: 'HOT ROD Power Fest 2026',
    subtitle: 'Coming This Fall',
    description: 'HOT ROD Power Fest brings together the best of hot rod culture — car shows, drag racing, burnout contests, swap meets, and live entertainment. Details coming soon.',
    heroImage: '/images/hr-power-fest-2026.png',
    dates: { start: '2026-10-01', end: '2026-10-01', displayText: 'October 2026 (TBC)' },
    location: { primary: 'TBC' },
    pricing: [{ label: 'TBC', price: 0, unit: 'TBC', ctaText: 'Get Notified', ctaUrl: '/events/hot-rod-power-fest-2026' }],
    highlights: [
      { icon: 'local_activity', title: 'Car Show', description: 'Massive car show featuring hot rods, customs, and muscle cars.' },
      { icon: 'speed', title: 'Drag Racing', description: 'Heads-up drag racing competition.' },
      { icon: 'local_fire_department', title: 'Burnout Contest', description: 'Tire-shredding competition for bragging rights.' },
      { icon: 'storefront', title: 'Swap Meet & Vendors', description: 'Parts, gear, and memorabilia from top vendors.' },
    ],
    schedule: [], gallery: [], testimonials: [], faq: [], sponsors: [],
    registrationUrl: '/events/hot-rod-power-fest-2026',
    tags: ['hot-rod', 'power-fest', 'car-show', 'drag-racing'],
  },
  {
    id: 'cd-lightning-lap-2026',
    slug: 'lightning-lap-2026',
    brand: 'caranddriver',
    type: 'track-day',
    status: 'upcoming',
    title: 'Lightning Lap 2026',
    subtitle: 'Virginia International Raceway',
    description: 'Car and Driver\'s legendary performance test returns to Virginia International Raceway. The most comprehensive track test of production vehicles — where lap times, data, and driver impressions determine the fastest cars money can buy.',
    heroImage: '/images/cd-lightning-lap.png',
    dates: { start: '2026-04-01', end: '2026-04-30', displayText: 'April 2026 (TBC)' },
    location: { primary: 'Virginia International Raceway', region: 'Alton, VA' },
    pricing: [{ label: 'TBC', price: 0, unit: 'TBC', ctaText: 'Learn More', ctaUrl: '/events/lightning-lap-2026' }],
    highlights: [
      { icon: 'timer', title: 'Lap Time Shootout', description: 'Production vehicles compete for the fastest lap times at VIR Grand Course.' },
      { icon: 'analytics', title: 'Data-Driven Testing', description: 'Comprehensive telemetry, performance data, and expert analysis.' },
      { icon: 'sports_score', title: 'VIR Grand Course', description: '4.1-mile, 24-turn road course — one of America\'s most demanding tracks.' },
      { icon: 'article', title: 'Editorial Coverage', description: 'Full results and analysis published in Car and Driver magazine and online.' },
    ],
    schedule: [], gallery: [], testimonials: [], faq: [], sponsors: [],
    registrationUrl: '/events/lightning-lap-2026',
    tags: ['car-and-driver', 'lightning-lap', 'track-test', 'vir', 'performance'],
  },
];

export const getEvents = (): EventData[] => eventsData;

export const getEventBySlug = (slug: string): EventData | undefined =>
  eventsData.find(e => e.slug === slug);

export const getEventsByBrand = (brand: EventBrand): EventData[] =>
  eventsData.filter(e => e.brand === brand);

export const getEventsByStatus = (status: EventStatus): EventData[] =>
  eventsData.filter(e => e.status === status);

export const getUpcomingEvents = (): EventData[] =>
  eventsData.filter(e => e.status === 'upcoming' || e.status === 'ongoing');

export const formatEventPrice = (price: number): string => {
  if (price >= 1000) return `$${price.toLocaleString()}`;
  return `$${price}`;
};
