// Map common makes/models to representative images used across the app
const vehicleImageMap: Record<string, string> = {
  // Sports/Performance
  'mustang': 'https://d2kde5ohu8qb21.cloudfront.net/files/68c9c7f8c0aa4a0002763d55/002-2025-ford-mustang-gtd-front-three-quarter-action.jpg',
  'camaro': 'https://d2kde5ohu8qb21.cloudfront.net/files/68da999cde18ff0002d1b4a0/000-2014-chevy-camaro-zl1-chett-levay-lead.jpg',
  'corvette': 'https://d2kde5ohu8qb21.cloudfront.net/files/6892b5b0b6d64f0002a3dc4b/2026chevroletcorvettezr1xquailsilverlimitededitionsportscarsupercarvetteconvertible-8.jpg',
  'supra': 'https://images.unsplash.com/photo-1619767886558-efdc259c3988?w=800&q=80&auto=format&fit=crop',
  'wrx': 'https://d2kde5ohu8qb21.cloudfront.net/files/68791475d0bc610002e15175/2025subaruunchartedinorangelowrearthreequarters.jpg',
  'm3': 'https://d2kde5ohu8qb21.cloudfront.net/files/68e820187f1963000225fdd9/2026bmwm2turbodesigneditioncoupesportscar-26.jpg',
  '911': 'https://d2kde5ohu8qb21.cloudfront.net/files/68dc4bec967ad900029a891c/006-2025-porsche-911-t.jpg',

  // Sedans/Hatchbacks
  'civic': 'https://d2kde5ohu8qb21.cloudfront.net/files/65dcf5210e091c0008b94fd0/2020-honda-civic-si-coupe-front-three-quarter.jpg',
  'accord': 'https://d2kde5ohu8qb21.cloudfront.net/files/679d37b803565f0008090975/21-2025-honda-accord-front-view.jpg',
  'corolla': 'https://d2kde5ohu8qb21.cloudfront.net/files/68dc6648bbe5640002b8f5db/007-2025-toyota-gr-corolla.jpg',
  'altima': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a38d2e36557c0008a5e89e/2021-nissan-altima-sr-vc-turbo-24.jpg',
  'sentra': 'https://d2kde5ohu8qb21.cloudfront.net/files/68d1d958af6f83000296dd9a/2026nissansentra-oem21.jpg',
  'gti': 'https://d2kde5ohu8qb21.cloudfront.net/files/68ed9049b76c7c0002cf2115/025-2026volkswagen-golf-gti-r-coty.jpg',

  // SUVs/Trucks
  'suburban': 'https://d2kde5ohu8qb21.cloudfront.net/files/65b8d9bfcad57f00087ba770/2021-chevrolet-suburban-frt-02.jpg',
  'bronco': 'https://d2kde5ohu8qb21.cloudfront.net/files/67237b68a0efe50008b489ed/2025fordbroncowildfundsemasuv10.png',
  'bronco sport': 'https://d2kde5ohu8qb21.cloudfront.net/files/674e2b7efe24400008290ba0/003-2025-ford-bronco-free-wheeling.jpg',
  'f-150': 'https://d2kde5ohu8qb21.cloudfront.net/files/68c090307123160002bf3d2c/2025fordf-150roushperformancert6offroadpickuptruck-15.jpg',
  'silverado': 'https://d2kde5ohu8qb21.cloudfront.net/files/68913ffd88ee3a00023d0ca4/silveradoevwtrangetestdynamic.png',
  'ram': 'https://d2kde5ohu8qb21.cloudfront.net/files/68b8a8e72e52fc0002299f4c/1-2026-ram-2500-warlock.jpg',
  'rav4': 'https://d2kde5ohu8qb21.cloudfront.net/files/682cd83b39615000089431b5/2026toyotarav4hybridsuvcrossover-1.jpg',
  'cr-v': 'https://d2kde5ohu8qb21.cloudfront.net/files/685edc71f123b4000238efd1/10-2026-honda-cr-v-trailsport.jpg',
  'cx-5': 'https://d2kde5ohu8qb21.cloudfront.net/files/686c4f52a5f0070002f31f87/2026mazdacx-517.jpg',

  // Kia
  'stinger': 'https://d2kde5ohu8qb21.cloudfront.net/files/65c317fbd42a2f00084bae9d/2020-kia-stinger-gt2-awd-front-three-quarter-in-motion-2.jpg',

  // Tesla
  'model 3': 'https://d2kde5ohu8qb21.cloudfront.net/files/68e5862037f20500027cfb5f/2026teslamodel3standardrwdevelectricvehiclesedan-14.jpg',
  'model s': 'https://d2kde5ohu8qb21.cloudfront.net/files/68e5863676e22400025001a9/2026teslamodelystandardrwdsuvevelectricvehiclecrossover-12.jpg'
};

export const vehicleImageFor = (vehicleName: string): string => {
  const name = vehicleName.toLowerCase();
  const keysBySpecificity = Object.keys(vehicleImageMap).sort((a, b) => b.length - a.length);
  for (const key of keysBySpecificity) {
    if (name.includes(key)) return vehicleImageMap[key];
  }
  return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&auto=format&fit=crop';
};

export default vehicleImageFor;


