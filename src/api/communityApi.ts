// ID generation handled inline using Date.now() and template strings

// Interfaces
export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null; // For current user session
  replies?: Comment[];
}

export interface Post {
  id: string;
  communityId: string;
  author: User;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null; // For current user session
  commentCount: number;
  tags?: string[];
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
  banner?: string;
  memberCount: number;
  isJoined?: boolean; // For current user session
  rules?: string[];
  createdAt: string;
  publisher?: string; // For categorizing communities by publisher (e.g., 'Hearst')
}

// Seed Data
const SEED_COMMUNITIES: Community[] = [
  {
    id: 'comm_cartalk',
    slug: 'cartalk',
    name: 'Car Talk',
    description: 'General discussion about cars, repairs, and advice.',
    icon: 'https://media.licdn.com/dms/image/v2/C4E03AQHtqO_iePac8w/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1516156390736?e=2147483647&v=beta&t=Cr4Lvzi3H2OQasXRIKsWR2MLEKG1nv0pU2_N_qcyrbY',
    memberCount: 12500,
    createdAt: new Date().toISOString(),
    rules: ['Be respectful', 'No spam', 'Stay on topic'],
  },
  {
    id: 'comm_autos',
    slug: 'autos',
    name: 'Autos',
    description: 'News, reviews, and industry updates.',
    icon: 'https://hips.hearstapps.com/mtg-prod/65cb04ad68f1fc0008ae81f5/2020-motortrend-car-of-the-year-contenders-1.jpg',
    memberCount: 8900,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'comm_askcarguys',
    slug: 'askcarguys',
    name: 'Ask Car Guys',
    description: 'Expert advice from mechanics and enthusiasts.',
    icon: 'https://www.motortrend.com/files/6925f180232f000002bdb7f7/2027-telluride-10-cool-things-lineup-01.jpg',
    memberCount: 5400,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'comm_whatcar',
    slug: 'whatcarshouldibuy',
    name: 'What Car Should I Buy?',
    description: 'Help choosing your next vehicle.',
    icon: 'https://static0.carbuzzimages.com/wordpress/wp-content/uploads/gallery-images/original/1210000/900/1210962.jpg',
    memberCount: 15200,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'comm_caranddriver',
    slug: 'caranddriver',
    name: 'Car and Driver',
    description: 'Join the Car and Driver community for automotive discussions and insights.',
    icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692e5cd3c2af34000266b93d/group1175889264.svg',
    memberCount: 9800,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'comm_hotrodpowertour',
    slug: 'hotrodpowertour',
    name: 'HOT ROD POWER TOUR',
    description: 'Join the HOT ROD Power Tour community for discussions about the annual road trip event, car builds, and hot rod culture.',
    icon: 'https://www.sema.org/sites/default/files/inline-images/HRPT-1410x790.jpg',
    memberCount: 7200,
    createdAt: new Date().toISOString(),
    rules: ['Be respectful', 'Share your Power Tour experiences', 'Show off your builds'],
  },
  {
    id: 'comm_motortrend',
    slug: 'motortrend',
    name: 'MotorTrend',
    description: 'The official MotorTrend community. Get the latest car reviews, news, and insights from our expert team.',
    icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f6de8441f73a00024a546f/mtavatar.svg',
    memberCount: 50000,
    createdAt: new Date().toISOString(),
    rules: ['Be respectful', 'No spam', 'Stay on topic', 'Follow MotorTrend community guidelines'],
  },
  {
    id: 'comm_esquire',
    slug: 'esquire',
    name: 'Esquire',
    description: 'Join the Esquire community for style, culture, and lifestyle discussions.',
    icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/6931a14cf522b300025a1432/icon-0uk5pi9k.svg',
    memberCount: 12000,
    createdAt: new Date().toISOString(),
    publisher: 'Hearst',
  },
  {
    id: 'comm_menshealth',
    slug: 'menshealth',
    name: "Men's Health",
    description: 'Join the Men\'s Health community for fitness, health, and wellness discussions.',
    icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/6931a150f522b300025a1433/icon-pp5oy5jy.svg',
    memberCount: 15000,
    createdAt: new Date().toISOString(),
    publisher: 'Hearst',
  },
  {
    id: 'comm_popularmechanics',
    slug: 'popularmechanics',
    name: 'Popular Mechanics',
    description: 'Join the Popular Mechanics community for science, technology, and DIY discussions.',
    icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/6931a14f01f974000277653f/icon-e7jv600c.svg',
    memberCount: 18000,
    createdAt: new Date().toISOString(),
    publisher: 'Hearst',
  },
  {
    id: 'comm_roadandtrack',
    slug: 'roadandtrack',
    name: 'Road & Track',
    description: 'Join the Road & Track community for automotive performance, racing, and enthusiast discussions.',
    icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/6931a14e01f974000277653d/icon-17204tuu.svg',
    memberCount: 14000,
    createdAt: new Date().toISOString(),
    publisher: 'Hearst',
  },
  {
    id: 'comm_bicycling',
    slug: 'bicycling',
    name: 'Bicycling',
    description: 'Join the Bicycling community for cycling tips, gear reviews, and training discussions.',
    icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/6931a15001f9740002776542/icon-semed7vd.svg',
    memberCount: 11000,
    createdAt: new Date().toISOString(),
    publisher: 'Hearst',
  },
  {
    id: 'comm_delish',
    slug: 'delish',
    name: 'Delish',
    description: 'Join the Delish community for recipes, cooking tips, and food discussions.',
    icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/6931a38385dbf90002d04ec9/logo-4efffb6.svg',
    memberCount: 16000,
    createdAt: new Date().toISOString(),
    publisher: 'Hearst',
  },
];

const SEED_POSTS: Post[] = [
  // Car Talk Community Posts
  {
    id: 'post_cartalk_1',
    communityId: 'comm_cartalk',
    author: { id: 'user_1', name: 'GearHead99' },
    title: 'Strange noise when turning left',
    content: 'I have a 2018 Honda Civic and hear a clicking sound when turning fully left. Any ideas?',
    image: 'https://neighborhoodtirepros.com/Files/Images/Blog/AdobeStock_231890538%20copy.jpg',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    upvotes: 15,
    downvotes: 1,
    commentCount: 4,
  },
  {
    id: 'post_cartalk_2',
    communityId: 'comm_cartalk',
    author: { id: 'user_3', name: 'CarEnthusiast' },
    title: 'Best oil change interval for high mileage vehicles?',
    content: 'My 2010 Toyota Camry just hit 150k miles. Should I stick with 5k mile intervals or go longer?',
    image: 'https://hips.hearstapps.com/hmg-prod/images/oil5981-667dbd6cb2cec.jpg',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    upvotes: 28,
    downvotes: 2,
    commentCount: 12,
  },
  {
    id: 'post_cartalk_3',
    communityId: 'comm_cartalk',
    author: { id: 'user_4', name: 'MechanicMike' },
    title: 'DIY brake pad replacement tips',
    content: 'Just replaced my front brake pads for the first time. Here are some tips I learned along the way!',
    image: 'https://repairsmith-prod-wordpress.s3.amazonaws.com/2020/05/brake-pads-diy.jpg',
    createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    upvotes: 42,
    downvotes: 0,
    commentCount: 18,
  },
  {
    id: 'post_cartalk_4',
    communityId: 'comm_cartalk',
    author: { id: 'user_5', name: 'WeekendWrencher' },
    title: 'Battery died after sitting for 2 weeks',
    content: 'Left my car parked for 2 weeks and now the battery is completely dead. Is this normal?',
    image: 'https://www.lesschwab.com/on/demandware.static/-/Library-Sites-LesSchwabLibrary/default/dw04192261/images/learningCenter/article/content/jump-starting-car.jpg',
    createdAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    upvotes: 19,
    downvotes: 1,
    commentCount: 7,
  },
  {
    id: 'post_cartalk_5',
    communityId: 'comm_cartalk',
    author: { id: 'user_6', name: 'AutoRepairGuru' },
    title: 'Check engine light: P0420 code',
    content: 'Got a P0420 code (catalyst efficiency below threshold). Should I replace the O2 sensor or the whole catalytic converter?',
    image: 'https://www.motorbiscuit.com/wp-content/uploads/2025/04/check-engine-light-car.jpg',
    createdAt: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
    upvotes: 35,
    downvotes: 3,
    commentCount: 15,
  },
  
  // Autos Community Posts
  {
    id: 'post_autos_1',
    communityId: 'comm_autos',
    author: { id: 'user_2', name: 'AutoNewsBot' },
    title: '2025 Toyota Camry Hybrid Review',
    content: 'The new Camry Hybrid offers impressive fuel economy and a surprisingly sporty drive.',
    image: 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4ee3d49161300084044e1/2025-toyota-camry-hybrid-xse-2.jpg',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    upvotes: 120,
    downvotes: 5,
    commentCount: 22,
  },
  {
    id: 'post_autos_2',
    communityId: 'comm_autos',
    author: { id: 'user_7', name: 'CarReviewer' },
    title: '2026 Honda Accord: First Impressions',
    content: 'Just got behind the wheel of the new Accord. The interior quality is impressive and the ride is smooth.',
    image: 'https://hips.hearstapps.com/hmg-prod/images/2024-honda-accord-sport-hybrid-101-673b7a93c4168.jpg?crop=0.637xw:0.535xh;0.298xw,0.363xh&resize=1200:*',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    upvotes: 89,
    downvotes: 4,
    commentCount: 31,
  },
  {
    id: 'post_geico_ad_home',
    communityId: 'comm_autos',
    author: { id: 'user_geico', name: 'GEICO' },
    title: 'Save Money on Car Insurance - Get a Quote Today',
    content: 'Protect your vehicle with GEICO. Get a free quote and see how much you could save. 24/7 customer service and competitive rates.',
    image: 'https://d2kde5ohu8qb21.cloudfront.net/files/6930ba485b2bea0002f46bea/geico2.jpg',
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago (recent to help with sorting)
    upvotes: 210,
    downvotes: 5,
    commentCount: 15,
  },
  {
    id: 'post_autos_3',
    communityId: 'comm_autos',
    author: { id: 'user_8', name: 'IndustryInsider' },
    title: 'Electric vehicle sales hit record high',
    content: 'EV sales continue to grow, with Tesla leading the pack. What does this mean for traditional automakers?',
    image: 'https://www.autoblog.com/.image/w_3840,q_auto:good,c_limit/MjEwMDAwNTA3OTY2NTk2NTEz/electric-vehicles.jpg',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    upvotes: 156,
    downvotes: 8,
    commentCount: 45,
  },
  {
    id: 'post_autos_4',
    communityId: 'comm_autos',
    author: { id: 'user_9', name: 'MotorTrendFan' },
    title: '2025 Car of the Year contenders announced',
    content: 'The finalists are in! Which vehicle do you think will take home the trophy this year?',
    image: 'https://hips.hearstapps.com/mtg-prod/672d04f2e5388a00084f6b33/000-motortrend-car-of-the-year-contenders-2025-alan-muir-design.jpg',
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    upvotes: 203,
    downvotes: 12,
    commentCount: 67,
  },
  {
    id: 'post_autos_5',
    communityId: 'comm_autos',
    author: { id: 'user_10', name: 'AutoJournalist' },
    title: 'New safety features coming to 2026 models',
    content: 'Advanced driver assistance systems are becoming standard. Here\'s what to expect in next year\'s models.',
    image: 'https://di-uploads-pod10.dealerinspire.com/landroverbrooklyn/uploads/2025/07/2026-Range-Rover-Evoque-Infotainment-and-Safety-Features.jpg',
    createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    upvotes: 94,
    downvotes: 6,
    commentCount: 28,
  },
  
  // Ask Car Guys Community Posts
  {
    id: 'post_askcarguys_1',
    communityId: 'comm_askcarguys',
    author: { id: 'user_11', name: 'CertifiedMechanic' },
    title: 'Transmission fluid change: DIY or shop?',
    content: 'Is it worth doing a transmission fluid change yourself, or should I take it to a professional?',
    image: 'https://blueridgeauto.co/wp-content/uploads/2025/06/image4.png',
    createdAt: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
    upvotes: 31,
    downvotes: 2,
    commentCount: 14,
  },
  {
    id: 'post_askcarguys_2',
    communityId: 'comm_askcarguys',
    author: { id: 'user_12', name: 'TechExpert' },
    title: 'Best diagnostic tool for home mechanics?',
    content: 'Looking for recommendations on OBD-II scanners. What do you use and why?',
    image: 'https://hips.hearstapps.com/hmg-prod/images/sim4983-68a60e36e7fad.jpg?crop=1.00xw:0.751xh;0,0.102xh&resize=1400:*',
    createdAt: new Date(Date.now() - 9000000).toISOString(), // 2.5 hours ago
    upvotes: 47,
    downvotes: 1,
    commentCount: 21,
  },
  {
    id: 'post_askcarguys_3',
    communityId: 'comm_askcarguys',
    author: { id: 'user_13', name: 'MasterTech' },
    title: 'Timing belt vs timing chain: What\'s the difference?',
    content: 'Many people confuse these two. Here\'s a breakdown of the differences and maintenance requirements.',
    image: 'https://cdn.skfmediahub.skf.com/api/public/09435b9bb22725bc/main/09435b9bb22725bc_main.jpg',
    createdAt: new Date(Date.now() - 12600000).toISOString(), // 3.5 hours ago
    upvotes: 58,
    downvotes: 0,
    commentCount: 19,
  },
  {
    id: 'post_askcarguys_4',
    communityId: 'comm_askcarguys',
    author: { id: 'user_14', name: 'EngineGuru' },
    title: 'Why does my car shake at idle?',
    content: 'My 2015 Ford F-150 shakes when idling. Engine mounts? Spark plugs? What should I check first?',
    image: 'https://irp.cdn-website.com/1c946c7d/dms3rep/multi/Engine+Bay+Lou-s+Car+Care+Baldwinsville+NY+13027.jpg',
    createdAt: new Date(Date.now() - 16200000).toISOString(), // 4.5 hours ago
    upvotes: 24,
    downvotes: 1,
    commentCount: 11,
  },
  {
    id: 'post_askcarguys_5',
    communityId: 'comm_askcarguys',
    author: { id: 'user_15', name: 'DiagnosticPro' },
    title: 'AC not cooling: Common causes',
    content: 'Summer is here and my AC stopped working. What are the most common issues I should check?',
    image: 'https://keepincool.com.au/wp-content/uploads/2025/01/5-Reasons-Car-AC-Not-Blowing-Cold-Air-And-Fixes-scaled.jpg',
    createdAt: new Date(Date.now() - 19800000).toISOString(), // 5.5 hours ago
    upvotes: 39,
    downvotes: 2,
    commentCount: 16,
  },
  
  // What Car Should I Buy? Community Posts
  {
    id: 'post_whatcar_1',
    communityId: 'comm_whatcar',
    author: { id: 'user_16', name: 'FirstTimeBuyer' },
    title: 'Looking for reliable SUV under $30k',
    content: 'Need a family SUV that\'s reliable and won\'t break the bank. Considering Honda CR-V or Toyota RAV4. Thoughts?',
    image: 'https://hips.hearstapps.com/hmg-prod/images/2024-chevrolet-trax-activ-2935-65395b258d994.jpg?crop=0.712xw:0.532xh;0.0849xw,0.386xh&resize=1400:*',
    createdAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
    upvotes: 52,
    downvotes: 3,
    commentCount: 24,
  },
  {
    id: 'post_whatcar_2',
    communityId: 'comm_whatcar',
    author: { id: 'user_17', name: 'CommuterSeeker' },
    title: 'Best hybrid for daily 50-mile commute?',
    content: 'Driving 50 miles each way to work. Looking for the best hybrid that\'s comfortable and fuel efficient.',
    image: 'https://hips.hearstapps.com/mtg-prod/65a09b49101eb7000872ebad/2023-toyota-prius-prime-50-1.jpg',
    createdAt: new Date(Date.now() - 25200000).toISOString(), // 7 hours ago
    upvotes: 68,
    downvotes: 4,
    commentCount: 29,
  },
  {
    id: 'post_whatcar_3',
    communityId: 'comm_whatcar',
    author: { id: 'user_18', name: 'BudgetBuyer' },
    title: 'Used vs new: What\'s the better value?',
    content: 'Trying to decide between a 2-year-old certified pre-owned or a brand new model. What would you do?',
    image: 'https://d2kde5ohu8qb21.cloudfront.net/files/690a603369a9550002fb94bc/021-2026-honda-passport-rtl.jpg',
    createdAt: new Date(Date.now() - 28800000).toISOString(), // 8 hours ago
    upvotes: 41,
    downvotes: 5,
    commentCount: 18,
  },
  {
    id: 'post_whatcar_4',
    communityId: 'comm_whatcar',
    author: { id: 'user_19', name: 'FamilyDriver' },
    title: 'Need 3-row SUV for growing family',
    content: 'Family is expanding and we need more space. Looking at Telluride, Palisade, or Highlander. Recommendations?',
    image: 'https://cloudfront-us-east-1.images.arcpublishing.com/crain/FEPHOMFVGJDRBGYHXFWB3GXFKM.jpg',
    createdAt: new Date(Date.now() - 32400000).toISOString(), // 9 hours ago
    upvotes: 75,
    downvotes: 2,
    commentCount: 33,
  },
  {
    id: 'post_whatcar_5',
    communityId: 'comm_whatcar',
    author: { id: 'user_20', name: 'SportyDriver' },
    title: 'Best sports sedan under $40k?',
    content: 'Want something fun to drive but still practical. Considering BMW 3 Series, Audi A4, or Genesis G70.',
    image: 'https://hips.hearstapps.com/hmg-prod/images/2025-honda-civic-sport-touring-hybrid-106-66ba34ddaa207.jpg',
    createdAt: new Date(Date.now() - 36000000).toISOString(), // 10 hours ago
    upvotes: 61,
    downvotes: 7,
    commentCount: 27,
  },
  
  // Car and Driver Community Posts
  {
    id: 'post_caranddriver_1',
    communityId: 'comm_caranddriver',
    author: { id: 'user_21', name: 'CDEditor' },
    title: '2025 Performance Car of the Year',
    content: 'We\'ve tested all the contenders. Here\'s our comprehensive review of this year\'s best performance vehicles.',
    image: 'https://hips.hearstapps.com/hmg-prod/images/2023-chevrolet-corvette-stingray-convertible-3lt-z51-307-1665496970.jpg',
    createdAt: new Date(Date.now() - 39600000).toISOString(), // 11 hours ago
    upvotes: 142,
    downvotes: 9,
    commentCount: 38,
  },
  {
    id: 'post_caranddriver_2',
    communityId: 'comm_caranddriver',
    author: { id: 'user_22', name: 'TestDriver' },
    title: 'Track day: Porsche 911 vs Corvette C8',
    content: 'Head-to-head comparison on the track. Which one comes out on top?',
    image: 'https://hips.hearstapps.com/hmg-prod/images/gt3rs-c8-v2b-1586194055.jpg',
    createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    upvotes: 98,
    downvotes: 6,
    commentCount: 42,
  },
  {
    id: 'post_caranddriver_3',
    communityId: 'comm_caranddriver',
    author: { id: 'user_23', name: 'AutoWriter' },
    title: 'Long-term test: 10,000 miles with the new Mustang',
    content: 'After 10k miles, here\'s what we love and what we don\'t about Ford\'s latest pony car.',
    image: 'https://www.motortrend.com/uploads/2023/08/003-2024-Mustang-GT-6MT-front-three-quarters-in-action.jpg',
    createdAt: new Date(Date.now() - 46800000).toISOString(), // 13 hours ago
    upvotes: 87,
    downvotes: 4,
    commentCount: 35,
  },
  {
    id: 'post_caranddriver_4',
    communityId: 'comm_caranddriver',
    author: { id: 'user_24', name: 'RoadTester' },
    title: 'Electric supercars: The future is here',
    content: 'We drove the latest electric supercars. The performance is mind-blowing, but are they practical?',
    image: 'https://hips.hearstapps.com/autoweek/assets/s3fs-public/03-lamborghini-terzo-millennio-3_4_front.jpg',
    createdAt: new Date(Date.now() - 50400000).toISOString(), // 14 hours ago
    upvotes: 113,
    downvotes: 8,
    commentCount: 41,
  },
  {
    id: 'post_caranddriver_5',
    communityId: 'comm_caranddriver',
    author: { id: 'user_25', name: 'CarReviewer' },
    title: 'Best handling cars under $50k',
    content: 'We\'ve tested dozens of cars. Here are the ones that impressed us most with their handling and driving dynamics.',
    image: 'https://us-west-2.graphassets.com/ALxjZdtQIQOudrzeO6hSgz/TikYmMKQN66MvfV9psoV',
    createdAt: new Date(Date.now() - 54000000).toISOString(), // 15 hours ago
    upvotes: 129,
    downvotes: 11,
    commentCount: 48,
  },
  // HOT ROD POWER TOUR Community Posts
  {
    id: 'post_hotrodpowertour_1',
    communityId: 'comm_hotrodpowertour',
    author: { id: 'user_50', name: 'PowerTourVeteran' },
    title: '2025 Power Tour: Who\'s going?',
    content: 'The 2025 HOT ROD Power Tour is coming up! Who\'s planning to make the trip this year? Let\'s share our builds and meet up plans!',
    image: 'https://cdn.shopify.com/s/files/1/0268/2352/4429/files/2017_HRPT_Day_03_059.jpg',
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    upvotes: 87,
    downvotes: 2,
    commentCount: 23,
  },
  {
    id: 'post_hotrodpowertour_2',
    communityId: 'comm_hotrodpowertour',
    author: { id: 'user_51', name: 'HotRodBuilder' },
    title: 'Best Mods for Power Tour 2025',
    content: 'What modifications are you planning for this year\'s Power Tour? Share your build plans and get feedback from the community!',
    image: 'https://www.motortrend.com/uploads/sites/5/2023/08/003-2024-Mustang-GT-6MT-front-three-quarters-in-action.jpg',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    upvotes: 65,
    downvotes: 1,
    commentCount: 18,
  },
  {
    id: 'post_hotrodpowertour_geico_ad',
    communityId: 'comm_hotrodpowertour',
    author: { id: 'user_geico', name: 'GEICO' },
    title: 'Protect Your Ride on Power Tour 2025',
    content: 'Get the coverage you need for your Power Tour adventure. GEICO offers competitive rates and 24/7 customer service to keep you protected on the road.',
    image: 'https://d2kde5ohu8qb21.cloudfront.net/files/6930b7bd3cb4320002bdd0a6/geico.png',
    createdAt: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
    upvotes: 45,
    downvotes: 0,
    commentCount: 5,
  },
  
  // MotorTrend Community Posts
  {
    id: 'post_motortrend_1',
    communityId: 'comm_motortrend',
    author: { id: 'user_mt_1', name: 'MotorTrend Editorial' },
    title: '2026 MotorTrend Car of the Year: The Winners and Finalists',
    content: 'We\'ve tested hundreds of vehicles this year, and after rigorous evaluation, we\'re excited to announce our Car of the Year finalists. From electric vehicles to performance machines, this year\'s competition was fierce.',
    image: 'https://d2kde5ohu8qb21.cloudfront.net/files/68ed9028b76c7c0002cf2104/003-2026volkswagen-golf-gti-r-coty.jpg',
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    upvotes: 245,
    downvotes: 3,
    commentCount: 42,
  },
  {
    id: 'post_motortrend_2',
    communityId: 'comm_motortrend',
    author: { id: 'user_mt_2', name: 'MotorTrend Reviews' },
    title: 'First Drive: 2026 Chevrolet Corvette ZR1 - The Ultimate American Supercar',
    content: 'We just got behind the wheel of the new ZR1, and it\'s everything we hoped for. With 1,064 horsepower and track-tested performance, this is the most powerful Corvette ever built. Full review coming soon!',
    image: 'https://d2kde5ohu8qb21.cloudfront.net/files/691b05132301ef0002f28cb8/621d52b9ab9894256510bf3018db47a1.jpg',
    createdAt: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
    upvotes: 189,
    downvotes: 2,
    commentCount: 38,
  },
  {
    id: 'post_motortrend_3',
    communityId: 'comm_motortrend',
    author: { id: 'user_mt_3', name: 'MotorTrend Tech' },
    title: 'Electric Vehicle Range Test: Which EVs Actually Meet Their EPA Estimates?',
    content: 'We put 12 popular electric vehicles through our real-world range test. Some exceeded expectations, while others fell short. Here\'s what we found and which EVs you can trust for long road trips.',
    image: 'https://d2kde5ohu8qb21.cloudfront.net/files/691636a53f45e800024bf486/001-2025-cadillac-vistiq-vs-lucid-gravity-vs-volvo-ex90.jpg',
    createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    upvotes: 312,
    downvotes: 5,
    commentCount: 67,
  },
  
  // Esquire Community Posts
  {
    id: 'post_esquire_1',
    communityId: 'comm_esquire',
    author: { id: 'user_esquire_1', name: 'Esquire Editorial' },
    title: 'The Jonas Brothers: Two Decades In, A Legacy Act With Hits to Prove It',
    content: 'The #JonasBrothers are musical veterans. Never mind the fact that they\'re only in their mid-30s. Two decades into their careers, they\'re officially a legacy act—with the hits to prove it.\n\nSince coming apart and exploring life on their own, the JoBros have become a stronger unit. And their next twenty years have only just begun.\n\nStory by Dave Holmes\n\nPhotographed by Billy Kidd\n\nStyled by Mark Holmes\n\nGrooming by Marissa Machado\n\nTailoring by Suzy Yun\n\nEsquire Design Director Martin Hoops\n\nEsquire Visual Director James Morris\n\nEsquire Entertainment Director Andrea Cuttler\n\nEsquire Editor-in-Chief Michael Sebastian',
    image: 'https://d2kde5ohu8qb21.cloudfront.net/files/6931a446df56f80002017a16/568262900-1180744377245152-1900907009731257623-n.jpg',
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    upvotes: 128,
    downvotes: 1,
    commentCount: 24,
  },
  {
    id: 'post_esquire_2',
    communityId: 'comm_esquire',
    author: { id: 'user_esquire_2', name: 'Esquire Style' },
    title: 'The Coolest Things for the Coolest People You Know',
    content: 'From luxurious leathers to snacks and scents, these are the coolest things for the coolest people you know.',
    image: 'https://d2kde5ohu8qb21.cloudfront.net/files/6931a4ecf522b300025a1434/16219943632514205774.jpeg',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    upvotes: 95,
    downvotes: 0,
    commentCount: 18,
  },
  {
    id: 'post_esquire_3',
    communityId: 'comm_esquire',
    author: { id: 'user_esquire_3', name: 'Esquire Music' },
    title: 'Florence Welch, Lily Allen, and Brandi Carlile: Confronting Struggles Through Music',
    content: 'In different ways and with very different sounds, Florence Welch, Lily Allen, and Brandi Carlile all confronted their own struggles and managed to be both cathartic and creatively thrilling.',
    image: 'https://d2kde5ohu8qb21.cloudfront.net/files/6931a5ac01f9740002776546/593449860-1215967070389549-2765656914296172558-n.jpg',
    createdAt: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
    upvotes: 112,
    downvotes: 2,
    commentCount: 31,
  },
  
  // Men's Health Community Posts
  {
    id: 'post_menshealth_1',
    communityId: 'comm_menshealth',
    author: { id: 'user_menshealth_1', name: 'Men\'s Health Fitness' },
    title: '9 Reasons You Need Strength Training in Your Life',
    content: 'Strength training isn\'t just about building muscle—it\'s about transforming your life. From boosting metabolism to improving mental health, here are nine compelling reasons why strength training should be a non-negotiable part of your fitness routine.',
    image: 'https://d2kde5ohu8qb21.cloudfront.net/files/6931a66401f9740002776547/594468833-1415948256556630-6332666672800229607-n.jpg',
    createdAt: new Date(Date.now() - 2400000).toISOString(), // 40 minutes ago
    upvotes: 156,
    downvotes: 1,
    commentCount: 42,
  },
  {
    id: 'post_menshealth_2',
    communityId: 'comm_menshealth',
    author: { id: 'user_menshealth_2', name: 'Men\'s Health Nutrition' },
    title: 'Tired of Powders and Bars? Use These Creative Ways to Hit Your Protein Needs When You Travel.',
    content: 'Traveling doesn\'t mean you have to sacrifice your protein goals. Skip the powders and bars and discover these creative, delicious ways to meet your protein needs while on the road. From airport-friendly options to hotel room hacks, we\'ve got you covered.',
    image: 'https://d2kde5ohu8qb21.cloudfront.net/files/6931a74cf522b300025a1436/593451365-1415739333244189-6264539126554493333-n.jpg',
    createdAt: new Date(Date.now() - 4800000).toISOString(), // 1.3 hours ago
    upvotes: 134,
    downvotes: 0,
    commentCount: 28,
  },
  
  // Popular Mechanics Community Posts
  {
    id: 'post_popularmechanics_1',
    communityId: 'comm_popularmechanics',
    author: { id: 'user_popularmechanics_1', name: 'Popular Mechanics Science' },
    title: 'Archaeologists Found 6,000-Year-Old Artifacts Under One of England\'s Most Hallowed Buildings',
    content: 'In a remarkable archaeological discovery, researchers have uncovered 6,000-year-old artifacts beneath one of England\'s most revered historical structures. The findings shed new light on the ancient history of the site and reveal fascinating insights into early human civilization.',
    image: 'https://d2kde5ohu8qb21.cloudfront.net/files/6931b97caf193f0002077421/11905983392533026799.jpeg',
    createdAt: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
    upvotes: 178,
    downvotes: 2,
    commentCount: 45,
  },
];

// Seed Comments
const SEED_COMMENTS: Comment[] = [
  // Comments for post_cartalk_1 (Strange noise when turning left)
  {
    id: 'comment_cartalk_1_1',
    postId: 'post_cartalk_1',
    author: { id: 'user_26', name: 'AutoMechanic' },
    content: 'Sounds like it could be a CV joint issue. Have you checked the boots for any tears?',
    createdAt: new Date(Date.now() - 3300000).toISOString(),
    upvotes: 8,
    downvotes: 0,
  },
  {
    id: 'comment_cartalk_1_2',
    postId: 'post_cartalk_1',
    author: { id: 'user_27', name: 'HondaOwner' },
    content: 'I had the same issue with my 2017 Civic. Turned out to be the front axle. Get it checked soon!',
    createdAt: new Date(Date.now() - 3000000).toISOString(),
    upvotes: 5,
    downvotes: 0,
  },
  {
    id: 'comment_cartalk_1_3',
    postId: 'post_cartalk_1',
    author: { id: 'user_28', name: 'DIYExpert' },
    content: 'Could also be a wheel bearing. Does the noise get louder when you turn?',
    createdAt: new Date(Date.now() - 2700000).toISOString(),
    upvotes: 3,
    downvotes: 1,
  },
  {
    id: 'comment_cartalk_1_4',
    postId: 'post_cartalk_1',
    author: { id: 'user_29', name: 'CarGuru' },
    content: 'Check your power steering fluid level first. Sometimes it\'s the simplest things.',
    createdAt: new Date(Date.now() - 2400000).toISOString(),
    upvotes: 2,
    downvotes: 0,
  },
  
  // Comments for post_cartalk_2 (Oil change interval)
  {
    id: 'comment_cartalk_2_1',
    postId: 'post_cartalk_2',
    author: { id: 'user_30', name: 'ToyotaTech' },
    content: 'At 150k, I\'d stick with 5k intervals. Better safe than sorry with high mileage engines.',
    createdAt: new Date(Date.now() - 6900000).toISOString(),
    upvotes: 12,
    downvotes: 1,
  },
  {
    id: 'comment_cartalk_2_2',
    postId: 'post_cartalk_2',
    author: { id: 'user_31', name: 'OilExpert' },
    content: 'If you\'re using synthetic oil, you can go 7.5k-10k. Conventional? Stick with 5k.',
    createdAt: new Date(Date.now() - 6600000).toISOString(),
    upvotes: 9,
    downvotes: 0,
  },
  {
    id: 'comment_cartalk_2_3',
    postId: 'post_cartalk_2',
    author: { id: 'user_32', name: 'HighMileagePro' },
    content: 'My Camry has 200k and I still do 5k. The engine runs like new. Worth the extra cost.',
    createdAt: new Date(Date.now() - 6300000).toISOString(),
    upvotes: 7,
    downvotes: 0,
  },
  
  // Comments for post_cartalk_3 (DIY brake pad replacement)
  {
    id: 'comment_cartalk_3_1',
    postId: 'post_cartalk_3',
    author: { id: 'user_33', name: 'BrakeSpecialist' },
    content: 'Great job! Don\'t forget to bed in the new pads properly. First 200 miles are crucial.',
    createdAt: new Date(Date.now() - 10500000).toISOString(),
    upvotes: 15,
    downvotes: 0,
  },
  {
    id: 'comment_cartalk_3_2',
    postId: 'post_cartalk_3',
    author: { id: 'user_34', name: 'WeekendMechanic' },
    content: 'What pads did you go with? I\'m about to do mine and looking for recommendations.',
    createdAt: new Date(Date.now() - 10200000).toISOString(),
    upvotes: 6,
    downvotes: 0,
  },
  {
    id: 'comment_cartalk_3_3',
    postId: 'post_cartalk_3',
    author: { id: 'user_35', name: 'AutoDIY' },
    content: 'Pro tip: Use brake cleaner on the rotors before installing new pads. Prevents squealing.',
    createdAt: new Date(Date.now() - 9900000).toISOString(),
    upvotes: 11,
    downvotes: 0,
  },
  
  // Comments for post_autos_1 (2025 Toyota Camry Hybrid Review)
  {
    id: 'comment_autos_1_1',
    postId: 'post_autos_1',
    author: { id: 'user_36', name: 'HybridOwner' },
    content: 'I\'ve had mine for 6 months now. Getting 52 MPG average. Absolutely love it!',
    createdAt: new Date(Date.now() - 84000000).toISOString(),
    upvotes: 24,
    downvotes: 1,
  },
  {
    id: 'comment_autos_1_2',
    postId: 'post_autos_1',
    author: { id: 'user_37', name: 'CarReviewer' },
    content: 'The hybrid system is so smooth. You barely notice when it switches between electric and gas.',
    createdAt: new Date(Date.now() - 81000000).toISOString(),
    upvotes: 18,
    downvotes: 0,
  },
  {
    id: 'comment_autos_1_3',
    postId: 'post_autos_1',
    author: { id: 'user_38', name: 'ToyotaFan' },
    content: 'How does it compare to the Accord Hybrid? That\'s my other option.',
    createdAt: new Date(Date.now() - 78000000).toISOString(),
    upvotes: 12,
    downvotes: 0,
  },
  
  // Comments for post_autos_4 (2025 Car of the Year)
  {
    id: 'comment_autos_4_1',
    postId: 'post_autos_4',
    author: { id: 'user_39', name: 'AwardWatcher' },
    content: 'My money is on the Escalade IQ. That thing is incredible!',
    createdAt: new Date(Date.now() - 330000000).toISOString(),
    upvotes: 45,
    downvotes: 3,
  },
  {
    id: 'comment_autos_4_2',
    postId: 'post_autos_4',
    author: { id: 'user_40', name: 'CarEnthusiast' },
    content: 'The Golf GTI R deserves it. Best all-around car in years.',
    createdAt: new Date(Date.now() - 327000000).toISOString(),
    upvotes: 38,
    downvotes: 2,
  },
  {
    id: 'comment_autos_4_3',
    postId: 'post_autos_4',
    author: { id: 'user_41', name: 'MotorTrendFan' },
    content: 'Can\'t wait to see the results! This year has some amazing contenders.',
    createdAt: new Date(Date.now() - 324000000).toISOString(),
    upvotes: 22,
    downvotes: 0,
  },
  
  // Comments for post_askcarguys_3 (Timing belt vs chain)
  {
    id: 'comment_askcarguys_3_1',
    postId: 'post_askcarguys_3',
    author: { id: 'user_42', name: 'EngineBuilder' },
    content: 'Timing chains last much longer but are more expensive to replace. Belts are cheaper but need regular replacement.',
    createdAt: new Date(Date.now() - 12300000).toISOString(),
    upvotes: 19,
    downvotes: 0,
  },
  {
    id: 'comment_askcarguys_3_2',
    postId: 'post_askcarguys_3',
    author: { id: 'user_43', name: 'MechanicPro' },
    content: 'Most modern cars use chains. If your belt breaks, your engine is toast. That\'s why intervals matter!',
    createdAt: new Date(Date.now() - 12000000).toISOString(),
    upvotes: 14,
    downvotes: 0,
  },
  
  // Comments for post_whatcar_1 (Reliable SUV under $30k)
  {
    id: 'comment_whatcar_1_1',
    postId: 'post_whatcar_1',
    author: { id: 'user_44', name: 'SUVOwner' },
    content: 'RAV4 all the way. I\'ve had mine for 5 years, zero issues. Best purchase I ever made.',
    createdAt: new Date(Date.now() - 21300000).toISOString(),
    upvotes: 28,
    downvotes: 1,
  },
  {
    id: 'comment_whatcar_1_2',
    postId: 'post_whatcar_1',
    author: { id: 'user_45', name: 'HondaLover' },
    content: 'CR-V has more cargo space and a better interior. Test drive both!',
    createdAt: new Date(Date.now() - 21000000).toISOString(),
    upvotes: 21,
    downvotes: 2,
  },
  {
    id: 'comment_whatcar_1_3',
    postId: 'post_whatcar_1',
    author: { id: 'user_46', name: 'FamilyDriver' },
    content: 'Don\'t forget about the Mazda CX-5. More fun to drive than both, and just as reliable.',
    createdAt: new Date(Date.now() - 20700000).toISOString(),
    upvotes: 15,
    downvotes: 0,
  },
  
  // Comments for post_caranddriver_2 (Porsche 911 vs Corvette C8)
  {
    id: 'comment_caranddriver_2_1',
    postId: 'post_caranddriver_2',
    author: { id: 'user_47', name: 'TrackDriver' },
    content: 'Corvette is faster in a straight line, but the 911 handles like nothing else. Depends on what you value.',
    createdAt: new Date(Date.now() - 42900000).toISOString(),
    upvotes: 32,
    downvotes: 2,
  },
  {
    id: 'comment_caranddriver_2_2',
    postId: 'post_caranddriver_2',
    author: { id: 'user_48', name: 'PorscheOwner' },
    content: '911 all day. The build quality and refinement are on another level. Worth every penny.',
    createdAt: new Date(Date.now() - 42600000).toISOString(),
    upvotes: 25,
    downvotes: 5,
  },
  {
    id: 'comment_caranddriver_2_3',
    postId: 'post_caranddriver_2',
    author: { id: 'user_49', name: 'CorvetteFan' },
    content: 'C8 is half the price and just as fast. No brainer for me!',
    createdAt: new Date(Date.now() - 42300000).toISOString(),
    upvotes: 18,
    downvotes: 3,
  },
];

// Helper to get current user (mock)
const getCurrentUser = (): User => {
  try {
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      return {
        id: 'current_user',
        name: data.name || 'You',
        avatar: data.avatar,
      };
    }
  } catch (e) {
    console.error('Error reading user data', e);
  }
  return { id: 'guest', name: 'Guest' };
};

// Local Storage Keys
const STORAGE_KEYS = {
  COMMUNITIES: 'community_app_communities',
  POSTS: 'community_app_posts',
  COMMENTS: 'community_app_comments',
  VOTES: 'community_app_votes', // Store user votes: { [itemId]: 'up' | 'down' }
  JOINS: 'community_app_joins', // Store joined communities: { [communityId]: boolean }
};

// API Methods

// --- Communities ---

export const getCommunities = (): Community[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMMUNITIES);
    let communities: Community[] = stored ? JSON.parse(stored) : [];
    
    // If no stored data, initialize with seed
    if (!stored || communities.length === 0) {
      communities = SEED_COMMUNITIES;
      localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(SEED_COMMUNITIES));
    } else {
      // Create a map of seed communities by ID for quick lookup
      const seedMap = new Map(SEED_COMMUNITIES.map(c => [c.id, c]));
      
      // Update existing seed communities with latest properties (like icons)
      // and add any new seed communities
      communities = communities.map(c => {
        const seedCommunity = seedMap.get(c.id);
        if (seedCommunity) {
          // Update properties from seed data, but preserve user-specific data like memberCount changes
          return {
            ...seedCommunity,
            memberCount: c.memberCount || seedCommunity.memberCount,
          };
        }
        return c; // Keep user-created communities as-is
      });
      
      // Add any new seed communities that don't exist
      const existingIds = new Set(communities.map(c => c.id));
      const newCommunities = SEED_COMMUNITIES.filter(c => !existingIds.has(c.id));
      if (newCommunities.length > 0) {
        communities = [...communities, ...newCommunities];
      }
      
      localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(communities));
    }

    // Merge with user join status
    const joins = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOINS) || '{}');
    return communities.map(c => ({
      ...c,
      isJoined: !!joins[c.id]
    }));
  } catch (error) {
    console.error('Error getting communities:', error);
    return SEED_COMMUNITIES;
  }
};

export const getCommunityBySlug = (slug: string): Community | undefined => {
  const communities = getCommunities();
  return communities.find(c => c.slug === slug);
};

export const createCommunity = (name: string, description: string, icon?: string): Community => {
  const communities = getCommunities();
  const newCommunity: Community = {
    id: `comm_${Date.now()}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name,
    description,
    icon,
    memberCount: 1,
    createdAt: new Date().toISOString(),
    isJoined: true,
  };

  const updatedCommunities = [...communities, newCommunity];
  localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(updatedCommunities));
  
  // Auto-join creator
  toggleJoin(newCommunity.id);

  return newCommunity;
};

export const toggleJoin = (communityId: string): boolean => {
  const joins = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOINS) || '{}');
  const isJoined = !joins[communityId];
  
  joins[communityId] = isJoined;
  localStorage.setItem(STORAGE_KEYS.JOINS, JSON.stringify(joins));

  // Update member count (mock logic)
  // Update the stored list member count directly
  const storedCommunitiesString = localStorage.getItem(STORAGE_KEYS.COMMUNITIES);
  if (storedCommunitiesString) {
      const storedCommunities: Community[] = JSON.parse(storedCommunitiesString);
      const updatedList = storedCommunities.map(c => {
          if (c.id === communityId) {
              return { ...c, memberCount: c.memberCount + (isJoined ? 1 : -1) };
          }
          return c;
      });
      localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(updatedList));
  }

  return isJoined;
};

// --- Posts ---

export const getPosts = (communityId?: string): Post[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
    let posts: Post[] = stored ? JSON.parse(stored) : [];
    
    // If no stored data, initialize with seed
    if (!stored || posts.length === 0) {
      posts = SEED_POSTS;
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(SEED_POSTS));
    } else {
      // Create a map of seed posts by ID for quick lookup
      const seedMap = new Map(SEED_POSTS.map(p => [p.id, p]));
      
      // Update existing seed posts with latest properties (like images)
      // and add any new seed posts
      posts = posts.map(p => {
        const seedPost = seedMap.get(p.id);
        if (seedPost) {
          // For ad posts, always use seed data to ensure correct positioning
          const isAdPost = p.id.includes('_ad') || p.id.includes('geico');
          if (isAdPost) {
            // Use seed data for ad posts to maintain correct scores
            return {
              ...seedPost,
              userVote: p.userVote || null, // Preserve user vote if exists
            };
          }
          // Update properties from seed data, but preserve user interactions for regular posts
          return {
            ...seedPost,
            upvotes: p.upvotes || seedPost.upvotes,
            downvotes: p.downvotes || seedPost.downvotes,
            commentCount: p.commentCount || seedPost.commentCount,
          };
        }
        return p; // Keep user-created posts as-is
      });
      
      // Add any new seed posts that don't exist
      const existingIds = new Set(posts.map(p => p.id));
      const newPosts = SEED_POSTS.filter(p => !existingIds.has(p.id));
      if (newPosts.length > 0) {
        posts = [...posts, ...newPosts];
      }
      
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    }

    // Filter if communityId provided
    if (communityId) {
      posts = posts.filter(p => p.communityId === communityId);
    }

    // Merge with user votes
    const votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES) || '{}');
    return posts.map(p => ({
      ...p,
      userVote: votes[p.id] || null
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
};

export const getPostById = (postId: string): Post | undefined => {
  const posts = getPosts(); // This handles the vote merging
  return posts.find(p => p.id === postId);
};

export const createPost = (communityId: string, title: string, content: string, image?: string): Post => {
  const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || JSON.stringify(SEED_POSTS));
  const currentUser = getCurrentUser();
  
  const newPost: Post = {
    id: `post_${Date.now()}`,
    communityId,
    author: currentUser,
    title,
    content,
    image,
    createdAt: new Date().toISOString(),
    upvotes: 1, // Starts with self-upvote usually
    downvotes: 0,
    commentCount: 0,
  };

  const updatedPosts = [newPost, ...posts];
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updatedPosts));
  
  // Auto-vote
  toggleVote('post', newPost.id, 'up');

  return newPost;
};

// --- Comments ---

export const getComments = (postId: string): Comment[] => {
  let allComments: Comment[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '[]');
  
  // If no stored comments, initialize with seed
  if (allComments.length === 0) {
    allComments = SEED_COMMENTS;
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(SEED_COMMENTS));
  } else {
    // Merge any new seed comments that don't exist in stored data
    const existingIds = new Set(allComments.map(c => c.id));
    const newComments = SEED_COMMENTS.filter(c => !existingIds.has(c.id));
    if (newComments.length > 0) {
      allComments = [...allComments, ...newComments];
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(allComments));
    }
  }
  
  const votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES) || '{}');
  
  return allComments
    .filter(c => c.postId === postId)
    .map(c => ({
      ...c,
      userVote: votes[c.id] || null
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addComment = (postId: string, content: string): Comment => {
  const allComments: Comment[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '[]');
  const currentUser = getCurrentUser();
  
  const newComment: Comment = {
    id: `comment_${Date.now()}`,
    postId,
    author: currentUser,
    content,
    createdAt: new Date().toISOString(),
    upvotes: 1,
    downvotes: 0,
  };

  const updatedComments = [...allComments, newComment];
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(updatedComments));

  // Update post comment count
  const posts: Post[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
  const updatedPosts = posts.map(p => {
      if (p.id === postId) {
          return { ...p, commentCount: (p.commentCount || 0) + 1 };
      }
      return p;
  });
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updatedPosts));

  return newComment;
};

// --- Voting ---

export const toggleVote = (type: 'post' | 'comment', id: string, direction: 'up' | 'down'): void => {
  const votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES) || '{}');
  const currentVote = votes[id];
  
  // Determine new vote state
  let newVote: 'up' | 'down' | null = direction;
  if (currentVote === direction) {
    newVote = null; // Toggle off
  }

  // Update local storage for user state
  if (newVote) {
    votes[id] = newVote;
  } else {
    delete votes[id];
  }
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));

  // Update counts in the actual data source
  const storageKey = type === 'post' ? STORAGE_KEYS.POSTS : STORAGE_KEYS.COMMENTS;
  const storedItems: (Post | Comment)[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  const updatedItems = storedItems.map(item => {
    if (item.id === id) {
      let { upvotes, downvotes } = item;
      
      // Remove old vote effect
      if (currentVote === 'up') upvotes--;
      if (currentVote === 'down') downvotes--;
      
      // Apply new vote effect
      if (newVote === 'up') upvotes++;
      if (newVote === 'down') downvotes++;

      return { ...item, upvotes, downvotes };
    }
    return item;
  });

  localStorage.setItem(storageKey, JSON.stringify(updatedItems));
};

