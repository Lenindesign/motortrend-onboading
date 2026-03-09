/**
 * Events data utility
 * Provides event data, types, and helpers for the Events page template.
 * Supports multi-brand events (MotorTrend, HOT ROD, Road & Track).
 */

export type EventBrand = 'motortrend' | 'hotrod' | 'roadandtrack';
export type EventStatus = 'upcoming' | 'ongoing' | 'past' | 'sold-out';
export type EventType = 'experience' | 'power-tour' | 'rally' | 'show' | 'track-day' | 'meetup' | 'virtual' | 'membership';

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
}

export const brandConfig: Record<EventBrand, { name: string; color: string; logo: string; tagline: string }> = {
  motortrend: {
    name: 'MotorTrend',
    color: '#E90C17',
    logo: 'https://www.motortrend.com/uploads/2022/02/MotorTrend-logo.png',
    tagline: 'The Ultimate Automotive Experience',
  },
  hotrod: {
    name: 'HOT ROD',
    color: '#FF6600',
    logo: 'https://www.hotrod.com/uploads/sites/21/2020/05/hot-rod-logo-red.png',
    tagline: 'Power Tour & Beyond',
  },
  roadandtrack: {
    name: 'Road & Track',
    color: '#1A1A1A',
    logo: 'https://www.roadandtrack.com/uploads/sites/2/2022/03/road-track-logo.png',
    tagline: 'Experiences Worth Driving For',
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
    heroImage: 'https://d2kde5ohu8qb21.cloudfront.net/files/hotrod-power-tour-hero.jpg',
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
    heroImage: 'https://d2kde5ohu8qb21.cloudfront.net/files/rt-northwest-shift-hero.jpg',
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
    heroImage: 'https://d2kde5ohu8qb21.cloudfront.net/files/mt-auto-show-hero.jpg',
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
