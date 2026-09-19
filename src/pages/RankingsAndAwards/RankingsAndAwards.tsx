/**
 * Rankings & Awards Page Component
 * MotorTrend rankings index adapted from the Car and Driver rankings template.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleOneTap } from '../../components/GoogleOneTap';
import { Icon } from '../../components/Icon';
import { Button } from '../../design-system/components';
import { useGoogleOneTap } from '../../hooks/useGoogleOneTap';
import { HIGH_INTENT_PAGES } from '../../utils/cdpTracking';
import vehicleDatabase from '../../data/vehicles';
import type { Vehicle } from '../../types/vehicle';
import { vehicleImageFor } from '../../utils/vehicleImages';
import './RankingsAndAwards.css';

const rankingSubcategorySlug = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const rankedSubcategoryCount = (key: string) => (CATEGORY_SUBCATEGORIES[key] ?? []).filter(([label]) => !label.startsWith('#1 Ranked')).length;

type BodyStyleConfig = {
  key: string;
  title: string;
  navLabel: string;
  description: string;
  icon: string;
};

type RankedVehicle = Vehicle & {
  rank: number;
  subcategory: string;
  sourceUrl: string;
};

type BodyStyleRow = BodyStyleConfig & {
  count: number;
  vehicles: RankedVehicle[];
};

export const RankingCategoryIcon: React.FC<{ src: string }> = ({ src }) => {
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(src)
      .then((response) => response.text())
      .then((markup) => {
        if (cancelled) return;

        const document = new DOMParser().parseFromString(markup, 'image/svg+xml');
        const svg = document.documentElement;
        svg.querySelectorAll('[data-background="true"]').forEach((element) => {
          element.classList.add('rankings-awards__subnav-icon-background');
        });
        setSvgMarkup(svg.outerHTML);
      })
      .catch(() => {
        if (!cancelled) setSvgMarkup(null);
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <span className="rankings-awards__subnav-icon" aria-hidden="true">
      {svgMarkup ? <span dangerouslySetInnerHTML={{ __html: svgMarkup }} /> : <img src={src} alt="" />}
    </span>
  );
};

const BreakerAd: React.FC = () => (
  <aside className="rankings-awards__breaker-ad" aria-label="Advertisement">
    <span className="rankings-awards__breaker-ad-label">Advertisement</span>
    <a className="rankings-awards__breaker-ad-link" href="https://www.nissanusa.com/" target="_blank" rel="noreferrer">
      <img src="/images/nissan-breaker-ad.png" alt="Nissan year-end sales event" />
    </a>
  </aside>
);

const BODY_STYLE_CONFIG: BodyStyleConfig[] = [
  {
    key: 'SUV',
    title: 'Best SUVs',
    navLabel: 'SUVs',
    description: 'Family crossovers, adventure rigs, and luxury SUVs ranked by MotorTrend editors.',
    icon: '/images/body-style-icons/suv.svg',
  },
  {
    key: 'Sedan',
    title: 'Best Sedans',
    navLabel: 'Sedans',
    description: 'Smart commuters, premium four-doors, and sport sedans for every daily drive.',
    icon: '/images/body-style-icons/sedan.svg',
  },
  {
    key: 'Truck',
    title: 'Best Trucks',
    navLabel: 'Trucks',
    description: 'Work-ready pickups and lifestyle trucks ranked for capability, value, and comfort.',
    icon: '/images/body-style-icons/truck.svg',
  },
  {
    key: 'Coupe',
    title: 'Best Coupes',
    navLabel: 'Coupes',
    description: 'Driver-focused two-doors with the performance and style enthusiasts expect.',
    icon: '/images/body-style-icons/coupe.svg',
  },
  {
    key: 'Hatchback',
    title: 'Best Hatchbacks',
    navLabel: 'Hatchbacks',
    description: 'Practical, efficient, and fun small cars with flexible cargo space.',
    icon: '/images/body-style-icons/hatchback.svg',
  },
  {
    key: 'Convertible',
    title: 'Best Convertibles',
    navLabel: 'Convertibles',
    description: 'Open-air cars ranked for style, refinement, and weekend-road appeal.',
    icon: '/images/body-style-icons/convertible.svg',
  },
  {
    key: 'Wagon',
    title: 'Best Wagons',
    navLabel: 'Wagons',
    description: 'Long-roof utility with car-like handling and everyday usability.',
    icon: '/images/body-style-icons/van.svg',
  },
];

export const RANKINGS_NAV_ITEMS = [
  { label: 'Best SUVs', href: '#suv', image: '/images/body-style-icons/suv.svg' },
  { label: 'Best Sedans', href: '#sedan', image: '/images/body-style-icons/sedan.svg' },
  { label: 'Best Crossovers', href: '#suv', image: '/images/body-style-icons/hatchback.svg' },
  { label: 'Best Trucks', href: '#truck', image: '/images/body-style-icons/truck.svg' },
  { label: 'Best Coupes', href: '#coupe', image: '/images/body-style-icons/coupe.svg' },
  { label: 'Best Convertibles', href: '#convertible', image: '/images/body-style-icons/convertible.svg' },
  { label: 'Best Wagons', href: '#wagon', image: '/images/body-style-icons/van.svg' },
  { label: 'Best Hatchbacks', href: '#hatchback', image: '/images/body-style-icons/hatchback.svg' },
  { label: 'Best Used Cars', href: '/used-cars', image: '/images/body-style-icons/sedan.svg' },
];

const SUV_SUBCATEGORIES = [
  ['#1 Ranked SUVs', 'https://www.motortrend.com/rankings/suvs/top-rated'],
  ['Best Subcompact SUVs', 'https://www.motortrend.com/rankings/suvs/subcompact'],
  ['Best Compact SUVs', 'https://www.motortrend.com/rankings/suvs/compact'],
  ['Best Midsize SUVs', 'https://www.motortrend.com/rankings/suvs/midsize'],
  ['Best Full-Size SUVs', 'https://www.motortrend.com/rankings/suvs/full-size'],
  ['Best 3-Row SUVs for Families', 'https://www.motortrend.com/rankings/suvs/3-row/family'],
  ['Best 3-Row SUVs Under $40,000', 'https://www.motortrend.com/rankings/suvs/3-row/under-40k'],
  ['Best 3-Row SUVs Under $50,000', 'https://www.motortrend.com/rankings/suvs/3-row/under-50k'],
  ['Best 3-Row SUVs Under $65,000', 'https://www.motortrend.com/rankings/suvs/3-row/under-65k'],
  ['Best 3-Row SUVs Under $75,000', 'https://www.motortrend.com/rankings/suvs/3-row/under-75k'],
  ['Cheapest SUVs', 'https://www.motortrend.com/rankings/suvs/cheapest'],
  ['SUVs Under $30,000', 'https://www.motortrend.com/rankings/suvs/under-30k'],
  ['SUVs Under $40,000', 'https://www.motortrend.com/rankings/suvs/under-40k'],
  ['SUVs Under $50,000', 'https://www.motortrend.com/rankings/suvs/under-50k'],
  ['SUVs Under $70,000', 'https://www.motortrend.com/rankings/suvs/under-70k'],
  ['Best SUVs Over $70,000', 'https://www.motortrend.com/rankings/suvs/over-70k'],
  ['Best Electric Subcompact SUVs', 'https://www.motortrend.com/rankings/suvs/electric/subcompact'],
  ['Best Electric Compact SUVs', 'https://www.motortrend.com/rankings/suvs/electric/compact'],
  ['Best Electric Midsize SUVs', 'https://www.motortrend.com/rankings/suvs/electric/midsize'],
  ['Electric SUVs Under $45,000', 'https://www.motortrend.com/rankings/suvs/electric/under-45k'],
  ['Best Subcompact Hybrid SUVs', 'https://www.motortrend.com/rankings/suvs/hybrid/subcompact'],
  ['Best Compact Hybrid SUVs', 'https://www.motortrend.com/rankings/suvs/hybrid/compact'],
  ['Best Midsize Hybrid SUVs', 'https://www.motortrend.com/rankings/suvs/hybrid/midsize'],
  ['Best Full-Size Hybrid SUVs', 'https://www.motortrend.com/rankings/suvs/hybrid/full-size'],
  ['Best Luxury Subcompact SUVs', 'https://www.motortrend.com/rankings/suvs/luxury/subcompact'],
  ['Best Luxury Compact SUVs', 'https://www.motortrend.com/rankings/suvs/luxury/compact'],
  ['Best Luxury Midsize SUVs', 'https://www.motortrend.com/rankings/suvs/luxury/midsize'],
  ['Best Luxury Full-Size SUVs', 'https://www.motortrend.com/rankings/suvs/luxury/full-size'],
  ['Best Off-Road SUVs', 'https://www.motortrend.com/rankings/suvs/off-road'],
  ['Best Family SUVs', 'https://www.motortrend.com/rankings/suvs/family'],
  ['Best Crossovers', 'https://www.motortrend.com/rankings/suvs/crossovers'],
  ['Best AWD SUVs', 'https://www.motortrend.com/rankings/suvs/awd'],
  ['Best Compact Performance SUVs', 'https://www.motortrend.com/rankings/suvs/performance-compact'],
  ['Best Midsize Performance SUVs', 'https://www.motortrend.com/rankings/suvs/performance-midsize'],
  ['Best 7-seater SUVs', 'https://www.motortrend.com/rankings/suvs/7-seater'],
  ['Best 8-seater SUVs', 'https://www.motortrend.com/rankings/suvs/8-seater'],
  ["Best SUVs with Captain's Seats", 'https://www.motortrend.com/rankings/suvs/captain-seats'],
  ['SUVs with the Most Gas Mileage', 'https://www.motortrend.com/rankings/suvs/gas-mileage'],
  ['Safest SUVs', 'https://www.motortrend.com/rankings/suvs/safest'],
] as const;

const CROSSOVER_SUBCATEGORIES = [
  ['#1 Ranked Crossovers', 'https://www.motortrend.com/rankings/suvs/crossovers/top-rated'],
  ['Best Subcompact Crossovers', 'https://www.motortrend.com/rankings/suvs/crossovers/subcompact'],
  ['Best Compact Crossovers', 'https://www.motortrend.com/rankings/suvs/crossovers/compact'],
  ['Best Midsize Crossovers', 'https://www.motortrend.com/rankings/suvs/crossovers/midsize'],
  ['Best Electric Crossovers', 'https://www.motortrend.com/rankings/suvs/crossovers/electric'],
  ['Best Hybrid Crossovers', 'https://www.motortrend.com/rankings/suvs/crossovers/hybrid'],
  ['Safest Crossovers', 'https://www.motortrend.com/rankings/suvs/crossovers/safest'],
  ['Cheapest Crossovers', 'https://www.motortrend.com/rankings/suvs/crossovers/cheapest'],
] as const;

export const CATEGORY_SUBCATEGORIES: Record<string, readonly (readonly [string, string])[]> = {
  SUV: SUV_SUBCATEGORIES,
  Crossover: CROSSOVER_SUBCATEGORIES,
  Sedan: [
    ['#1 Ranked Sedans', 'https://www.motortrend.com/rankings/sedans/top-rated'],
    ['Best Compact Sedans', 'https://www.motortrend.com/rankings/sedans/compact'],
    ['Best Midsize Sedans', 'https://www.motortrend.com/rankings/sedans/midsize'],
    ['Best Full-Size Sedans', 'https://www.motortrend.com/rankings/sedans/full-size'],
    ['Cheapest Sedans', 'https://www.motortrend.com/rankings/sedans/cheapest'],
    ['Sedans Under $30,000', 'https://www.motortrend.com/rankings/sedans/under-30k'],
    ['Sedans Under $40,000', 'https://www.motortrend.com/rankings/sedans/under-40k'],
    ['Sedans Under $50,000', 'https://www.motortrend.com/rankings/sedans/under-50k'],
    ['Sedans Under $70,000', 'https://www.motortrend.com/rankings/sedans/under-70k'],
    ['Best Sedans Over $70,000', 'https://www.motortrend.com/rankings/sedans/over-70k'],
    ['Safest Sedans', 'https://www.motortrend.com/rankings/sedans/safest'],
    ['Best Family Sedans', 'https://www.motortrend.com/rankings/sedans/family'],
    ['Best Premium Sedans', 'https://www.motortrend.com/rankings/sedans/premium'],
    ['Best Compact Performance Sedans', 'https://www.motortrend.com/rankings/sedans/performance-compact'],
    ['Best Performance Sedans', 'https://www.motortrend.com/rankings/sedans/performance'],
    ['Sedans with the Most Gas Mileage', 'https://www.motortrend.com/rankings/sedans/gas-mileage'],
  ],
  Truck: [
    ['#1 Ranked Trucks', 'https://www.motortrend.com/rankings/pickup-trucks/top-rated'],
    ['Best Compact Trucks', 'https://www.motortrend.com/rankings/pickup-trucks/compact'],
    ['Best Midsize Pickup Trucks', 'https://www.motortrend.com/rankings/pickup-trucks/midsize'],
    ['Best Full-Size Trucks', 'https://www.motortrend.com/rankings/pickup-trucks/full-size'],
    ['Best Heavy-Duty Trucks', 'https://www.motortrend.com/rankings/pickup-trucks/heavy-duty'],
    ['Best Electric Trucks', 'https://www.motortrend.com/rankings/pickup-trucks/electric'],
  ],
  Coupe: [
    ['Best Coupes', 'https://www.motortrend.com/rankings/coupes'],
    ['Best Performance Coupes', 'https://www.motortrend.com/rankings/coupes/performance'],
    ['Best Premium Performance Coupes', 'https://www.motortrend.com/rankings/coupes/premium-performance'],
    ['Best Sports Cars', 'https://www.motortrend.com/rankings/sports-cars'],
  ],
  Hatchback: [
    ['#1 Ranked Hatchbacks', 'https://www.motortrend.com/rankings/hatchbacks/top-rated'],
    ['Best Small Hatchbacks', 'https://www.motortrend.com/rankings/hatchbacks/small'],
    ['Best Compact Hybrid Hatchbacks', 'https://www.motortrend.com/rankings/hatchbacks/hybrid'],
  ],
  Convertible: [
    ['Best Convertibles', 'https://www.motortrend.com/rankings/convertibles'],
    ['Best Performance Convertibles', 'https://www.motortrend.com/rankings/convertibles/performance'],
    ['Best Luxury Convertibles', 'https://www.motortrend.com/rankings/convertibles/luxury'],
  ],
  Wagon: [
    ['Best Station Wagons', 'https://www.motortrend.com/rankings/station-wagons'],
    ['Best Performance Station Wagons', 'https://www.motortrend.com/rankings/station-wagons/performance'],
    ['Best Luxury Station Wagons', 'https://www.motortrend.com/rankings/station-wagons/luxury'],
    ['Best Hybrid Station Wagons', 'https://www.motortrend.com/rankings/station-wagons/hybrid'],
  ],
};

const vehiclePath = (vehicle: RankedVehicle) => vehicle.sourceUrl;

type LiveRankingEntry = {
  year: string;
  make: string;
  model: string;
  rank: number;
  rating: number;
  priceRange: string;
  priceMin: number;
  priceMax: number;
  fuelType: Vehicle['fuelType'];
  mpg?: string;
  subcategory: string;
  sourceUrl: string;
};

const categorySubcategoryFor = (vehicle: Vehicle, category: string) => {
  const price = vehicle.priceMin;
  const name = `${vehicle.make} ${vehicle.model}`.toLowerCase();
  if (category === 'SUV') {
    if (vehicle.fuelType === 'Electric') return 'Best Electric Compact SUVs';
    if (vehicle.fuelType === 'Hybrid' || vehicle.fuelType === 'Plug-in Hybrid') return 'Best Compact Hybrid SUVs';
    if (vehicle.seatingCapacity && vehicle.seatingCapacity >= 7) return 'Best 3-Row SUVs for Families';
    if (price < 30000) return 'Best Subcompact SUVs';
    if (price >= 60000) return 'Best Full-Size SUVs';
    return 'Best Compact SUVs';
  }
  if (category === 'Sedan') {
    if (vehicle.fuelType === 'Electric') return 'Best Electric Sedans';
    if (vehicle.fuelType === 'Hybrid' || vehicle.fuelType === 'Plug-in Hybrid') return 'Best Midsize Sedans';
    if (price < 30000) return 'Best Compact Sedans';
    if (price >= 70000 || /g90|s-class|7 series|model s|eqe/.test(name)) return 'Best Full-Size Sedans';
    return 'Best Midsize Sedans';
  }
  if (category === 'Truck') {
    if (vehicle.fuelType === 'Electric') return 'Best Electric Trucks';
    if (price < 35000) return 'Best Compact Trucks';
    if (price < 55000) return 'Best Midsize Pickup Trucks';
    return 'Best Full-Size Trucks';
  }
  if (category === 'Hatchback') return vehicle.fuelType === 'Hybrid' ? 'Best Compact Hybrid Hatchbacks' : price < 30000 ? 'Best Small Hatchbacks' : 'Best Compact Hatchbacks';
  if (category === 'Convertible') return price >= 70000 ? 'Best Luxury Convertibles' : 'Best Performance Convertibles';
  if (category === 'Wagon') return vehicle.fuelType === 'Hybrid' ? 'Best Hybrid Station Wagons' : price >= 50000 ? 'Best Luxury Station Wagons' : 'Best Performance Station Wagons';
  return price >= 50000 ? 'Best Premium Performance Coupes' : 'Best Performance Coupes';
};

const sourcePathFor = (vehicle: Vehicle) => `/vehicles/${vehicle.year}/${vehicle.make}/${vehicle.model.replace(/\s+/g, '-')}`;

// Rankings are sourced from the normalized vehicle catalog. Its image fields resolve
// to Hearst/MotorTrend CDN photography, so every card uses the same real vehicle
// record for its metadata, rating, price, and image.
export const LIVE_RANKING_ENTRIES: Record<string, LiveRankingEntry[]> = Object.fromEntries(
  BODY_STYLE_CONFIG.map(({ key }) => {
    const entries = vehicleDatabase
      .filter((vehicle) => vehicle.bodyStyle.toLowerCase() === key.toLowerCase())
      .map((vehicle) => ({
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        rank: 0,
        rating: vehicle.staffRating,
        priceRange: vehicle.priceRange,
        priceMin: vehicle.priceMin,
        priceMax: vehicle.priceMax,
        fuelType: vehicle.fuelType,
        mpg: vehicle.mpg,
        subcategory: categorySubcategoryFor(vehicle, key),
        sourceUrl: sourcePathFor(vehicle),
      }))
      .sort((a, b) => b.rating - a.rating || a.priceMin - b.priceMin)
      .map((entry, _index, all) => ({
        ...entry,
        rank: all.filter((candidate) => candidate.subcategory === entry.subcategory && candidate.rating > entry.rating).length + 1,
      }));
    return [key, entries];
  }),
) as Record<string, LiveRankingEntry[]>;

export const rankingEntriesForSubcategory = (entries: LiveRankingEntry[], label: string) => {
  const normalized = label.toLowerCase();
  if (normalized.startsWith('#1 ranked') || normalized === 'all subcategories') return entries;
  let filtered = entries;
  if (normalized.includes('electric')) filtered = filtered.filter((entry) => entry.fuelType === 'Electric');
  else if (normalized.includes('hybrid')) filtered = filtered.filter((entry) => entry.fuelType === 'Hybrid' || entry.fuelType === 'Plug-in Hybrid');
  else if (normalized.includes('under-') || normalized.includes('under $')) {
    const threshold = Number(normalized.match(/(?:under[- ]?\$?)(\d+)/)?.[1] ?? 0) * 1000;
    filtered = filtered.filter((entry) => entry.priceMin < threshold);
  } else if (normalized.includes('over-') || normalized.includes('over $')) {
    const threshold = Number(normalized.match(/(?:over[- ]?\$?)(\d+)/)?.[1] ?? 70) * 1000;
    filtered = filtered.filter((entry) => entry.priceMin >= threshold);
  } else if (normalized.includes('safest') || normalized.includes('family') || normalized.includes('3-row') || normalized.includes('7-seater') || normalized.includes('8-seater')) {
    filtered = filtered.filter((entry) => entry.subcategory.includes('3-Row') || entry.subcategory.includes('Full-Size'));
  } else if (normalized.includes('performance') || normalized.includes('sports')) {
    filtered = filtered.filter((entry) => entry.rating >= 8.5);
  } else if (normalized.includes('luxury') || normalized.includes('premium')) {
    filtered = filtered.filter((entry) => entry.priceMin >= 50000);
  } else if (normalized.includes('compact') || normalized.includes('small') || normalized.includes('subcompact')) {
    filtered = filtered.filter((entry) => entry.priceMin < 40000);
  } else if (normalized.includes('midsize')) {
    filtered = filtered.filter((entry) => entry.priceMin >= 30000 && entry.priceMin < 70000);
  } else if (normalized.includes('full-size')) {
    filtered = filtered.filter((entry) => entry.priceMin >= 60000);
  }
  return (filtered.length ? filtered : entries).sort((a, b) => b.rating - a.rating || a.priceMin - b.priceMin);
};

const formatMoney = (value: number) => `$${value.toLocaleString()}`;

const formatPriceRange = (vehicle: Vehicle) => {
  if (vehicle.priceRange) return vehicle.priceRange;
  return `${formatMoney(vehicle.priceMin)} - ${formatMoney(vehicle.priceMax)}`;
};

const getAvailableYears = () => (
  Array.from(new Set(vehicleDatabase.map((vehicle) => vehicle.year)))
    .sort((a, b) => Number(b) - Number(a))
);

const normalizeVehicleName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const getLocalVehicle = (entry: LiveRankingEntry) => {
  const target = normalizeVehicleName(`${entry.make} ${entry.model}`);
  return vehicleDatabase.find((vehicle) => {
    const candidate = normalizeVehicleName(`${vehicle.make} ${vehicle.model}`);
    return vehicle.year === entry.year && (candidate.includes(target) || target.includes(candidate));
  });
};

const priceValue = (priceRange: string, index: 0 | 1) => {
  const values = priceRange.match(/\d[\d,]*/g) ?? [];
  return Number((values[index] ?? '0').replace(/,/g, ''));
};

const makeRankedVehicle = (entry: LiveRankingEntry, bodyStyle: string): RankedVehicle => {
  const localVehicle = getLocalVehicle(entry);
  return {
    ...(localVehicle ?? {
      id: `${entry.year}-${entry.make}-${entry.model}`,
      image: vehicleImageFor(`${entry.year} ${entry.make} ${entry.model}`),
      galleryImages: [],
      communityRating: entry.rating,
      reviewCount: 0,
      drivetrain: 'FWD' as Vehicle['drivetrain'],
      transmission: 'Automatic' as Vehicle['transmission'],
      horsepower: undefined,
      seatingCapacity: undefined,
      cargoSpace: undefined,
      features: [],
      featured: false,
      award: undefined,
      tags: [],
      slug: `${entry.year}/${entry.make}/${entry.model}`,
      bodyStyle,
    }),
    id: localVehicle?.id ?? `${entry.year}-${entry.make}-${entry.model}`,
    year: entry.year,
    make: entry.make,
    model: entry.model,
    bodyStyle,
    image: localVehicle?.image ?? vehicleImageFor(`${entry.year} ${entry.make} ${entry.model}`),
    priceRange: entry.priceRange,
    priceMin: priceValue(entry.priceRange, 0),
    priceMax: priceValue(entry.priceRange, 1),
    staffRating: entry.rating,
    fuelType: entry.fuelType,
    mpg: entry.mpg,
    rank: entry.rank,
    subcategory: entry.subcategory,
    sourceUrl: entry.sourceUrl,
  };
};

const featuredEntriesForCategory = (category: string, entries: LiveRankingEntry[], fallbackEntries: LiveRankingEntry[]) => {
  const categoryLabels = (CATEGORY_SUBCATEGORIES[category] ?? []).map(([label]) => label);
  const configuredSubcategories = categoryLabels
    .filter((label) => !label.startsWith('#1 Ranked'))
    .slice(0, 3);
  const topRankedLabel = categoryLabels.find((label) => label.startsWith('#1 Ranked'));
  if (configuredSubcategories.length < 3 && topRankedLabel) configuredSubcategories.push(topRankedLabel);
  const selectedSubcategories = new Set<string>();
  const selectedVehicles = new Set<string>();
  const pool = [...entries, ...fallbackEntries];
  const configuredEntries = configuredSubcategories.map((label) => {
    const exactLabel = label.toLowerCase();
    const exactEntry = pool.find((entry) => entry.subcategory.toLowerCase() === exactLabel);
    const semanticEntry = pool.find((entry) => {
      if (selectedSubcategories.has(entry.subcategory)) return false;
      const subcategory = entry.subcategory.toLowerCase();
      if (exactLabel.includes('subcompact')) return subcategory.includes('subcompact');
      if (exactLabel.includes('compact')) return subcategory.includes('compact') && !subcategory.includes('subcompact');
      if (exactLabel.includes('midsize')) return subcategory.includes('midsize');
      if (exactLabel.includes('full-size')) return subcategory.includes('full-size');
      return false;
    });
    const priceFallback = pool.find((entry) => {
      if (selectedSubcategories.has(entry.subcategory) || entry.fuelType === 'Electric' || entry.fuelType === 'Hybrid' || entry.fuelType === 'Plug-in Hybrid') return false;
      if (exactLabel.includes('subcompact')) return entry.priceMin < 30000;
      if (exactLabel.includes('compact')) return entry.priceMin >= 30000 && entry.priceMin < 50000;
      if (exactLabel.includes('midsize')) return entry.priceMin >= 35000 && entry.priceMin < 70000;
      return false;
    });
    const entry = exactEntry
      ?? semanticEntry
      ?? priceFallback
      // Some body styles have fewer catalog records than editorial
      // subcategories; keep the three-column overview populated with a
      // distinct real vehicle rather than dropping the column.
      ?? pool.find((candidate) => !selectedVehicles.has(candidate.sourceUrl));
    if (!entry) return null;
    selectedSubcategories.add(entry.subcategory);
    selectedVehicles.add(entry.sourceUrl);
    // The overview represents the first-ranked vehicle for the requested
    // category, even when the catalog only has a price-based fallback.
    return { ...entry, subcategory: label, rank: 1 };
  }).filter((entry): entry is LiveRankingEntry => Boolean(entry));

  return configuredEntries.slice(0, 3);
};

const getBodyStyleRows = (selectedYear: string): BodyStyleRow[] => (
  BODY_STYLE_CONFIG
    .map((config) => {
      const vehicles = vehicleDatabase
        .filter((vehicle) => vehicle.bodyStyle.toLowerCase() === config.key.toLowerCase())
        .filter((vehicle) => vehicle.year === selectedYear)
        .sort((a, b) => b.staffRating - a.staffRating);

      const allLiveEntries = LIVE_RANKING_ENTRIES[config.key] ?? [];
      const yearEntries = allLiveEntries.filter((entry) => entry.year === selectedYear);
      // Keep every category populated when the selected model year is not yet
      // represented in the catalog; the fallback remains real catalog data.
      const sourceEntries = yearEntries.length ? yearEntries : allLiveEntries;
      const featuredEntries = featuredEntriesForCategory(config.key, sourceEntries, allLiveEntries);

      return {
        ...config,
        count: vehicles.length || sourceEntries.length,
        vehicles: featuredEntries.slice(0, 3).map((entry) => makeRankedVehicle(entry, config.key)),
      };
    })
    .filter((row) => row.vehicles.length > 0)
);

const RankingsAndAwards: React.FC = () => {
  const { showOneTap, dismissOneTap } = useGoogleOneTap({
    pageType: HIGH_INTENT_PAGES.CAR_RANKINGS,
    autoTrigger: true,
    triggerDelay: 2500,
  });

  const availableYears = useMemo(() => getAvailableYears(), []);
  const selectedYear = availableYears[0] ?? '2026';
  const bodyStyleRows = useMemo(() => getBodyStyleRows(selectedYear), [selectedYear]);
  const subnavTrackRef = useRef<HTMLDivElement>(null);
  const [openSubcategory, setOpenSubcategory] = useState<string | null>(null);
  const scrollSubnav = (direction: 'left' | 'right') => {
    subnavTrackRef.current?.scrollBy({ left: direction === 'left' ? -360 : 360, behavior: 'smooth' });
  };
  // The overview represents the complete rankings catalog, not just the three
  // featured #1 cards rendered in each visible row. Include every vehicle in
  // the local rankings dataset and every primary destination in the category
  // navigation (including Crossovers and Used Cars).
  return (
    <main className="rankings-awards" id="main-content">
      {showOneTap && (
        <GoogleOneTap
          mode="prompt"
          pageType={HIGH_INTENT_PAGES.CAR_RANKINGS}
          context="signin"
          autoSelect={false}
          promptDelay={2500}
          onDismiss={dismissOneTap}
        />
      )}

      <section className="rankings-awards__hero" aria-labelledby="rankings-title">
        <div className="rankings-awards__container rankings-awards__hero-inner">
          <div className="rankings-awards__eyebrow">
            <span className="rankings-awards__eyebrow-badge" aria-hidden="true">
              <img className="rankings-awards__eyebrow-mark" src="/images/mt-brand-icon.svg" alt="" />
            </span>
            <span>Ultimate Car Rankings</span>
          </div>
          <h1 className="rankings-awards__title" id="rankings-title">
            Find the Best Car for You
          </h1>
          <p className="rankings-awards__subtitle">
            MotorTrend editors rate, compare, and rank the latest cars, trucks, and SUVs across 13 categories so shoppers can move from research to shortlist faster.
          </p>
        </div>
      </section>

      <nav className="rankings-awards__subnav" aria-label="Ranking categories">
        <div className="rankings-awards__container rankings-awards__subnav-inner">
          <button className="rankings-awards__subnav-arrow" type="button" aria-label="Scroll ranking categories left" onClick={() => scrollSubnav('left')}>
            <Icon name="chevron_left" size={24} />
          </button>
          <div className="rankings-awards__subnav-track" ref={subnavTrackRef}>
            {RANKINGS_NAV_ITEMS.map((item, index) => (
              <a className={`rankings-awards__subnav-link${index === 0 ? ' is-active' : ''}`} href={item.href} key={item.label}>
                <RankingCategoryIcon src={item.image} />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
          <button className="rankings-awards__subnav-arrow" type="button" aria-label="Scroll ranking categories right" onClick={() => scrollSubnav('right')}>
            <Icon name="chevron_right" size={24} />
          </button>
        </div>
      </nav>

      <BreakerAd />

      <div className="rankings-awards__container rankings-awards__body-rows">
        {bodyStyleRows.map((row, index) => (
          <React.Fragment key={row.key}>
            <section className="rankings-awards__body-row" id={row.key.toLowerCase()}>
            <div className="rankings-awards__body-row-intro">
              <img className="rankings-awards__body-row-icon" src={row.icon} alt="" />
              <h2>{row.title}</h2>
              <div className="rankings-awards__subcategory-menu">
              <button
                className="rankings-awards__subcategory-select"
                type="button"
                aria-label={`View all ${row.title} subcategories`}
                aria-haspopup="menu"
                aria-expanded={openSubcategory === row.key}
                onClick={() => setOpenSubcategory(openSubcategory === row.key ? null : row.key)}
              >
                <span>{rankedSubcategoryCount(row.key)} Subcategories</span>
                <Icon name={openSubcategory === row.key ? 'expand_less' : 'expand_more'} size={18} />
              </button>
              {openSubcategory === row.key && (
                <div className="rankings-awards__subcategory-list" role="menu" aria-label={`${row.title} subcategories`}>
                  {(CATEGORY_SUBCATEGORIES[row.key] ?? []).map(([label, href]) => (
                    <Link
                      key={href}
                      to={`/rankings-awards/${row.key.toLowerCase()}/${rankingSubcategorySlug(label)}`}
                      role="menuitem"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
              </div>
              <p>{row.description.replace(/\.$/, '')} across {rankedSubcategoryCount(row.key)} subcategories.</p>
              <Button
                className="rankings-awards__body-row-cta"
                component={Link}
                to={`/rankings-awards/${row.key.toLowerCase()}`}
                color="secondary"
                variant="solid"
                size="default"
                icon={<Icon name="arrow_forward" size={18} />}
                iconPosition="right"
              >
                View All
              </Button>
            </div>

            <div className="rankings-awards__cards" aria-label={`${row.title} top ranked vehicles`}>
              {row.vehicles.map((vehicle) => (
                <article className="rankings-awards__vehicle-card" key={`${row.key}-${vehicle.subcategory}-${vehicle.sourceUrl}`}>
                  <a className="rankings-awards__vehicle-card-link" href={vehiclePath(vehicle)} target="_blank" rel="noreferrer">
                    <div className="rankings-awards__vehicle-card-title">
                      {vehicle.subcategory.startsWith('Best ') ? vehicle.subcategory : `Best ${vehicle.subcategory}`}
                    </div>
                    <div className="rankings-awards__vehicle-media">
                      <img src={vehicle.image} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} loading="lazy" />
                      {vehicle.rank === 1 ? (
                        <img
                          className="rankings-awards__rank-badge rankings-awards__rank-badge--graphic"
                          src="/images/number-1.svg"
                          alt="Ranked number 1"
                        />
                      ) : (
                        <span className="rankings-awards__rank-badge">#{vehicle.rank}</span>
                      )}
                    </div>

                    <div className="rankings-awards__vehicle-body">
                      <div className="rankings-awards__vehicle-head">
                        <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                        <div className="rankings-awards__rating" aria-label={`MotorTrend rating ${vehicle.staffRating} out of 10`}>
                          <strong>{vehicle.staffRating}</strong>
                          <span>/10</span>
                        </div>
                      </div>

                      <dl className="rankings-awards__vehicle-specs">
                        <div>
                          <dt>MSRP</dt>
                          <dd>{formatPriceRange(vehicle)}</dd>
                        </div>
                        <div>
                          <dt>Powertrain</dt>
                          <dd>{vehicle.fuelType}</dd>
                        </div>
                        {vehicle.mpg && (
                          <div>
                            <dt>MPG</dt>
                            <dd>{vehicle.mpg}</dd>
                          </div>
                        )}
                      </dl>

                      <div className="rankings-awards__card-actions">
                        <span className="rankings-awards__shop-link">Shop New {vehicle.model}</span>
                        <span className="rankings-awards__full-list-link">See Full List</span>
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>
            </section>
            {(index + 1) % 2 === 0 && index < bodyStyleRows.length - 1 && <BreakerAd />}
          </React.Fragment>
        ))}
      </div>
    </main>
  );
};

export default RankingsAndAwards;
