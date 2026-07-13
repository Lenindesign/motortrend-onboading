import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { getVehicles } from '../../api/vehiclesApi';
import type { Vehicle } from '../../types/vehicle';
import './Deals.css';

interface Deal {
  id: string;
  vehicle: Vehicle;
  headline: string;
  savings: string;
  detailLabel: string;
  detailValue: string;
  secondaryDetailLabel?: string;
  secondaryDetailValue?: string;
  expires: string;
  tags: string[];
  showMsrp?: boolean;
}

interface DealSection {
  id: string;
  title: string;
  description: string;
  dealCount: number;
  deals: Deal[];
}

const allVehicles = getVehicles({ sortBy: 'rating', sortOrder: 'desc' });
const DEALS_PER_RAIL_SEGMENT = 12;

const formatMoney = (amount: number) => `$${amount.toLocaleString()}`;

const vehiclePath = (vehicle: Vehicle) => `/vehicles/${vehicle.slug}`;

const chunkDeals = <T,>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

const findVehicle = (make: string, model: string, fallback: Vehicle): Vehicle => {
  const normalizedMake = make.toLowerCase();
  const normalizedModel = model.toLowerCase();
  const sameMakeVehicles = allVehicles
    .filter((vehicle) => vehicle.make.toLowerCase() === normalizedMake)
    .sort((first, second) => parseInt(second.year, 10) - parseInt(first.year, 10) || second.staffRating - first.staffRating);
  return sameMakeVehicles.find((vehicle) => vehicle.model.toLowerCase() === normalizedModel)
    ?? sameMakeVehicles.find((vehicle) => vehicle.model.toLowerCase().includes(normalizedModel))
    ?? fallback;
};

const makeDeal = (
  id: string,
  vehicle: Vehicle,
  headline: string,
  savings: string,
  detailValue: string,
  expires: string,
  options: {
    detailLabel?: string;
    secondaryDetailLabel?: string;
    secondaryDetailValue?: string;
    tags?: string[];
    showMsrp?: boolean;
  } = {},
): Deal => ({
  id,
  vehicle,
  headline,
  savings,
  detailLabel: options.detailLabel ?? 'Term',
  detailValue,
  secondaryDetailLabel: options.secondaryDetailLabel,
  secondaryDetailValue: options.secondaryDetailValue,
  expires,
  tags: options.tags ?? [],
  showMsrp: options.showMsrp,
});

const createBuyingDeals = (fallback: Vehicle): Deal[] => {
  const bmw3 = findVehicle('BMW', '3 Series', fallback);
  const golf = findVehicle('Volkswagen', 'Golf', fallback);
  const trax = findVehicle('Chevrolet', 'Trax', fallback);
  const trailblazer = findVehicle('Chevrolet', 'Trailblazer', fallback);
  const rav4 = findVehicle('Toyota', 'RAV4', fallback);
  const crv = findVehicle('Honda', 'CR-V', fallback);
  const cx5 = findVehicle('Mazda', 'CX-5', fallback);
  const f150 = findVehicle('Ford', 'F-150', fallback);
  const silverado = findVehicle('Chevrolet', 'Silverado', fallback);
  const ioniq5 = findVehicle('Hyundai', 'Ioniq 5', fallback);
  const f150Lightning = findVehicle('Ford', 'F-150 Lightning', f150);
  const rav4Hybrid = findVehicle('Toyota', 'RAV4 Hybrid', rav4);
  const camry = findVehicle('Toyota', 'Camry', fallback);
  const accord = findVehicle('Honda', 'Accord', fallback);
  const mustang = findVehicle('Ford', 'Mustang', fallback);
  const civic = findVehicle('Honda', 'Civic', fallback);
  const maverick = findVehicle('Ford', 'Maverick', fallback);
  const jetta = findVehicle('Volkswagen', 'Jetta', fallback);

  return [
    makeDeal('buy-bmw3-cash', bmw3, '$2,500', 'Cash Back', '4-5%', '5/1/26', { detailLabel: 'Est. off MSRP', tags: ['cash', 'luxury'] }),
    makeDeal('buy-bmw3-apr', bmw3, '4.99% APR', '$146/mo. below avg.', '36-60 months', '5/1/26', { tags: ['apr', 'luxury'] }),
    makeDeal('buy-golf', golf, '0% APR', '$287/mo. below avg.', '60 months', '5/1/26', { tags: ['apr'] }),
    makeDeal('buy-trax', trax, '0% APR', '$417/mo. below avg.', '48 months', '5/1/26', { tags: ['apr', 'suv'] }),
    makeDeal('buy-trailblazer', trailblazer, '0% APR', '$462/mo. below avg.', '60 months', '5/1/26', { tags: ['apr', 'suv'] }),
    makeDeal('buy-colorado-cash', findVehicle('Chevrolet', 'Colorado', fallback), '$2,500', 'Cash Back', '5-7%', '5/1/26', { detailLabel: 'Est. off MSRP', tags: ['cash', 'truck'] }),
    makeDeal('buy-colorado-apr', findVehicle('Chevrolet', 'Colorado', fallback), '0% APR', '$394/mo. below avg.', '60 months', '5/1/26', { tags: ['apr', 'truck'] }),
    makeDeal('buy-silverado-cash', silverado, '$3,500', 'Cash Back', '4-6%', '5/1/26', { detailLabel: 'Est. off MSRP', tags: ['cash', 'truck'] }),
    makeDeal('buy-silverado-apr', silverado, '4.4% APR', '$210/mo. above avg.', '72 months', '5/1/26', { tags: ['apr', 'truck'] }),
    makeDeal('buy-rav4', rav4, '3.99% APR', '$528/mo. above avg.', '60 months', '5/1/26', { tags: ['apr', 'suv'] }),
    makeDeal('buy-crv', crv, '4.9% APR', '$194/mo. above avg.', '60 months', '5/1/26', { tags: ['apr', 'suv'] }),
    makeDeal('buy-cx5', cx5, '2.9% APR', '$266/mo. below avg.', '36 months', '5/1/26', { tags: ['apr', 'suv'] }),
    makeDeal('buy-f150', f150, '3.9% APR', '$295/mo. above avg.', '60 months', '5/1/26', { tags: ['apr', 'truck'] }),
    makeDeal('buy-f150-lightning', f150Lightning, '1.9% APR', '$388/mo. below avg.', '60 months', '5/1/26', { tags: ['apr', 'ev', 'truck'] }),
    makeDeal('buy-ioniq5', ioniq5, '1.99% APR', '$284/mo. below avg.', '60 months', '5/1/26', { tags: ['apr', 'ev'] }),
    makeDeal('buy-rav4-hybrid', rav4Hybrid, '4.49% APR', '$142/mo. above avg.', '60 months', '5/1/26', { tags: ['apr', 'hybrid', 'suv'] }),
    makeDeal('buy-camry', camry, '3.49% APR', '$189/mo. below avg.', '60 months', '5/1/26', { tags: ['apr', 'sedan'] }),
    makeDeal('buy-accord', accord, '3.9% APR', '$121/mo. below avg.', '48 months', '5/1/26', { tags: ['apr', 'sedan'] }),
    makeDeal('buy-civic', civic, '3.9% APR', '$218/mo. below avg.', '48 months', '5/1/26', { tags: ['apr', 'sedan'] }),
    makeDeal('buy-maverick', maverick, '4.9% APR', '$172/mo. below avg.', '60 months', '5/1/26', { tags: ['apr', 'truck'] }),
    makeDeal('buy-jetta-cash', jetta, '$1,000', 'Cash Back', '3-4%', '5/1/26', { detailLabel: 'Est. off MSRP', tags: ['cash', 'sedan'] }),
    makeDeal('buy-mustang', mustang, '5.9% APR', '$91/mo. above avg.', '60 months', '5/1/26', { tags: ['apr', 'performance'] }),
  ];
};

const makeLeaseDeal = (
  id: string,
  vehicle: Vehicle,
  monthlyPayment: string,
  expires: string,
  mileageAllowance: string,
  tags: string[] = [],
) => makeDeal(id, vehicle, monthlyPayment, 'Lease', '36 months', expires, {
  detailLabel: 'Term',
  secondaryDetailLabel: 'Mileage Allowance',
  secondaryDetailValue: mileageAllowance,
  showMsrp: false,
  tags: ['lease', ...tags],
});

const createLeaseDeals = (fallback: Vehicle): Deal[] => {
  const a4 = findVehicle('Audi', 'A4', fallback);
  const bmw3 = findVehicle('BMW', '3 Series', fallback);
  const i4 = findVehicle('BMW', 'i4', fallback);
  const bolt = findVehicle('Chevrolet', 'Bolt EV', fallback);
  const colorado = findVehicle('Chevrolet', 'Colorado', fallback);
  const silverado = findVehicle('Chevrolet', 'Silverado', fallback);
  const trailblazer = findVehicle('Chevrolet', 'Trailblazer', fallback);
  const traverse = findVehicle('Chevrolet', 'Traverse', fallback);
  const trax = findVehicle('Chevrolet', 'Trax', fallback);
  const escape = findVehicle('Ford', 'Escape', fallback);
  const f150 = findVehicle('Ford', 'F-150', fallback);
  const maverick = findVehicle('Ford', 'Maverick', fallback);
  const crv = findVehicle('Honda', 'CR-V', fallback);
  const accord = findVehicle('Honda', 'Accord', fallback);
  const elantra = findVehicle('Hyundai', 'Elantra', fallback);
  const ioniq5 = findVehicle('Hyundai', 'Ioniq 5', fallback);
  const forte = findVehicle('Kia', 'Forte', fallback);
  const cx5 = findVehicle('Mazda', 'CX-5', fallback);
  const sentra = findVehicle('Nissan', 'Sentra', fallback);
  const rav4 = findVehicle('Toyota', 'RAV4', fallback);
  const camry = findVehicle('Toyota', 'Camry', fallback);
  const prius = findVehicle('Toyota', 'Prius', fallback);
  const jetta = findVehicle('Volkswagen', 'Jetta', fallback);

  return [
    makeLeaseDeal('lease-audi-a4', a4, '$439/mo', '5/1/26', '10,000 mi/yr', ['sedan', 'luxury', 'over400']),
    makeLeaseDeal('lease-bmw3', bmw3, '$429/mo', '5/1/26', '10,000 mi/yr', ['sedan', 'luxury', 'over400']),
    makeLeaseDeal('lease-bmw-i4', i4, '$549/mo', '5/1/26', '10,000 mi/yr', ['sedan', 'ev', 'over400']),
    makeLeaseDeal('lease-bolt', bolt, '$249/mo', '5/1/26', '12,000 mi/yr', ['ev', 'hatchback', 'under300']),
    makeLeaseDeal('lease-colorado', colorado, '$399/mo', '5/1/26', '10,000 mi/yr', ['truck', 'under400']),
    makeLeaseDeal('lease-traverse', traverse, '$329/mo', '5/1/26', '10,000 mi/yr', ['suv', 'under400']),
    makeLeaseDeal('lease-silverado', silverado, '$459/mo', '5/1/26', '10,000 mi/yr', ['truck', 'over400']),
    makeLeaseDeal('lease-trailblazer', trailblazer, '$289/mo', '5/1/26', '10,000 mi/yr', ['suv', 'under300']),
    makeLeaseDeal('lease-trax', trax, '$299/mo', '5/1/26', '10,000 mi/yr', ['suv', 'under300']),
    makeLeaseDeal('lease-escape', escape, '$289/mo', '5/1/26', '10,500 mi/yr', ['suv', 'under300']),
    makeLeaseDeal('lease-f150', f150, '$429/mo', '5/1/26', '10,500 mi/yr', ['truck', 'over400']),
    makeLeaseDeal('lease-maverick', maverick, '$339/mo', '5/1/26', '10,500 mi/yr', ['truck', 'under400']),
    makeLeaseDeal('lease-crv', crv, '$299/mo', '5/1/26', '10,000 mi/yr', ['suv', 'under300']),
    makeLeaseDeal('lease-accord', accord, '$319/mo', '5/1/26', '10,000 mi/yr', ['sedan', 'under400']),
    makeLeaseDeal('lease-elantra', elantra, '$239/mo', '5/1/26', '10,000 mi/yr', ['sedan', 'under300']),
    makeLeaseDeal('lease-ioniq5', ioniq5, '$249/mo', '5/1/26', '10,000 mi/yr', ['ev', 'suv', 'under300']),
    makeLeaseDeal('lease-forte', forte, '$219/mo', '5/1/26', '10,000 mi/yr', ['sedan', 'under300']),
    makeLeaseDeal('lease-cx5', cx5, '$309/mo', '5/1/26', '10,000 mi/yr', ['suv', 'under400']),
    makeLeaseDeal('lease-sentra', sentra, '$229/mo', '5/1/26', '10,000 mi/yr', ['sedan', 'under300']),
    makeLeaseDeal('lease-rav4', rav4, '$349/mo', '5/1/26', '10,000 mi/yr', ['suv', 'under400']),
    makeLeaseDeal('lease-camry', camry, '$289/mo', '5/1/26', '10,000 mi/yr', ['sedan', 'under300']),
    makeLeaseDeal('lease-prius', prius, '$319/mo', '5/1/26', '10,000 mi/yr', ['hybrid', 'hatchback', 'under400']),
    makeLeaseDeal('lease-jetta', jetta, '$259/mo', '5/1/26', '10,000 mi/yr', ['sedan', 'under300']),
  ];
};

const createDealSections = (fallback: Vehicle): DealSection[] => {
  const buyingDeals = createBuyingDeals(fallback);
  const leaseDeals = createLeaseDeals(fallback);
  const rav4 = findVehicle('Toyota', 'RAV4', fallback);
  const crv = findVehicle('Honda', 'CR-V', fallback);
  const cx5 = findVehicle('Mazda', 'CX-5', fallback);
  const f150 = findVehicle('Ford', 'F-150', fallback);
  const silverado = findVehicle('Chevrolet', 'Silverado', fallback);
  const tacoma = findVehicle('Toyota', 'Tacoma', fallback);
  const ioniq5 = findVehicle('Hyundai', 'Ioniq 5', fallback);
  const f150Lightning = findVehicle('Ford', 'F-150 Lightning', f150);
  const rav4Hybrid = findVehicle('Toyota', 'RAV4 Hybrid', rav4);
  const camry = findVehicle('Toyota', 'Camry', fallback);
  const accord = findVehicle('Honda', 'Accord', fallback);
  const mustang = findVehicle('Ford', 'Mustang', fallback);

  return [
    {
      id: 'buying',
      title: 'Buying Deals',
      description: '0% APR, cash back, special low-rate financing, and below-market rates for shoppers ready to buy.',
      dealCount: 100,
      deals: buyingDeals.slice(2, 5),
    },
    {
      id: 'leasing',
      title: 'Lease Deals',
      description: 'Low monthly payments, flexible terms, and short commitments for drivers who want a newer vehicle more often.',
      dealCount: 83,
      deals: leaseDeals.slice(14, 17),
    },
    {
      id: 'suv',
      title: 'Best SUV Deals',
      description: 'Top incentives on SUVs and crossovers, from efficient compact runabouts to family-ready utility vehicles.',
      dealCount: 57,
      deals: [
        makeDeal('suv-rav4', rav4, '3.99% APR', '$528/mo. above avg.', '60 months', '5/1/26'),
        makeDeal('suv-crv', crv, '$299/mo', '$322/mo. below avg.', '36 months', '5/1/26'),
        makeDeal('suv-cx5', cx5, '2.9% APR', '$266/mo. below avg.', '36 months', '5/1/26'),
      ],
    },
    {
      id: 'truck',
      title: 'Best Truck Deals',
      description: 'Current offers on light-duty and midsize pickups with work-ready capability and weekend range.',
      dealCount: 18,
      deals: [
        makeDeal('truck-f150', f150, '3.9% APR', '$295/mo. above avg.', '60 months', '5/1/26'),
        makeDeal('truck-silverado', silverado, '4.4% APR', '$210/mo. above avg.', '72 months', '5/1/26'),
        makeDeal('truck-tacoma', tacoma, '$349/mo', '$184/mo. below avg.', '36 months', '5/1/26'),
      ],
    },
    {
      id: 'electrified',
      title: 'EV and Hybrid Deals',
      description: 'Electric and hybrid incentives for shoppers balancing monthly payment, efficiency, and range confidence.',
      dealCount: 42,
      deals: [
        makeDeal('ev-ioniq5', ioniq5, '$249/mo', '$517/mo. below avg.', '24 months', '5/1/26'),
        makeDeal('ev-lightning', f150Lightning, '1.9% APR', '$388/mo. below avg.', '60 months', '5/1/26'),
        makeDeal('ev-rav4hybrid', rav4Hybrid, '4.49% APR', '$142/mo. above avg.', '60 months', '5/1/26'),
      ],
    },
    {
      id: 'body-style',
      title: 'Buying by Body Style',
      description: 'A quick cross-shop by shape for shoppers who already know what kind of vehicle fits their life.',
      dealCount: 76,
      deals: [
        makeDeal('body-camry', camry, '3.49% APR', '$189/mo. below avg.', '60 months', '5/1/26'),
        makeDeal('body-accord', accord, '$289/mo', '$274/mo. below avg.', '36 months', '5/1/26'),
        makeDeal('body-mustang', mustang, '5.9% APR', '$91/mo. above avg.', '60 months', '5/1/26'),
      ],
    },
  ];
};

const buyingFilters = [
  { id: 'all', label: 'All Deals', summary: 'buying deals' },
  { id: 'apr', label: 'APR Deals', summary: 'APR deals' },
  { id: 'cash', label: 'Cash Back', summary: 'cash-back deals' },
];

type BuyingSortOption = 'make' | 'expires' | 'rating';
type BuyingFilterKey = 'dealType' | 'bodyStyle' | 'make' | 'fuelType';

interface BuyingFilterState {
  dealType: string;
  bodyStyle: string;
  make: string;
  fuelType: string;
}

interface BuyingFilterOption {
  value: string;
  label: string;
}

const defaultBuyingFilterState: BuyingFilterState = {
  dealType: 'all',
  bodyStyle: 'all',
  make: 'all',
  fuelType: 'all',
};

const buyingSortOptions: Array<{ value: BuyingSortOption; label: string }> = [
  { value: 'make', label: 'Make Model (A-Z)' },
  { value: 'expires', label: 'Expiring Soonest' },
  { value: 'rating', label: 'MT Rating (High to Low)' },
];

const buyingDealTypeOptions: BuyingFilterOption[] = buyingFilters.map((filter) => ({
  value: filter.id,
  label: filter.label,
}));

const leaseDealTypeOptions: BuyingFilterOption[] = [
  { value: 'all', label: 'All Lease Deals' },
  { value: 'under300', label: 'Under $300/mo' },
  { value: 'under400', label: '$300-$399/mo' },
  { value: 'over400', label: '$400+/mo' },
  { value: 'ev', label: 'EV Lease Deals' },
];

const buyingBodyStyleOptions: BuyingFilterOption[] = [
  { value: 'all', label: 'All Body Styles' },
  { value: 'SUV', label: 'SUV' },
  { value: 'Truck', label: 'Truck' },
  { value: 'Sedan', label: 'Sedan' },
  { value: 'Hatchback', label: 'Hatchback' },
  { value: 'Coupe', label: 'Coupe' },
];

const buyingFuelTypeOptions: BuyingFilterOption[] = [
  { value: 'all', label: 'All Fuel Types' },
  { value: 'Gas', label: 'Gas' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Hybrid', label: 'Hybrid' },
];

const parseDealExpiration = (expires: string) => {
  const [month, day, year] = expires.split('/').map(Number);
  if (!month || !day || !year) return Number.MAX_SAFE_INTEGER;
  return new Date(2000 + year, month - 1, day).getTime();
};

const compareDealVehicleName = (first: Deal, second: Deal) => {
  const firstName = `${first.vehicle.make} ${first.vehicle.model}`;
  const secondName = `${second.vehicle.make} ${second.vehicle.model}`;
  return firstName.localeCompare(secondName);
};

const filterAndSortBuyingDeals = (
  deals: Deal[],
  filters: BuyingFilterState,
  sortBy: BuyingSortOption,
) => {
  const filteredDeals = deals.filter((deal) => {
    if (filters.dealType !== 'all' && !deal.tags.includes(filters.dealType)) return false;
    if (filters.bodyStyle !== 'all' && deal.vehicle.bodyStyle !== filters.bodyStyle) return false;
    if (filters.make !== 'all' && deal.vehicle.make !== filters.make) return false;
    if (filters.fuelType !== 'all' && deal.vehicle.fuelType !== filters.fuelType) return false;
    return true;
  });

  return [...filteredDeals].sort((first, second) => {
    if (sortBy === 'rating') {
      return second.vehicle.staffRating - first.vehicle.staffRating || compareDealVehicleName(first, second);
    }

    if (sortBy === 'expires') {
      return parseDealExpiration(first.expires) - parseDealExpiration(second.expires) || compareDealVehicleName(first, second);
    }

    return compareDealVehicleName(first, second);
  });
};

const getBuyingFilterLabels = (
  filters: BuyingFilterState,
  dealTypeOptions: BuyingFilterOption[] = buyingDealTypeOptions,
) => {
  const labels: string[] = [];
  const dealTypeLabel = dealTypeOptions.find((option) => option.value === filters.dealType)?.label;
  const bodyStyleLabel = buyingBodyStyleOptions.find((option) => option.value === filters.bodyStyle)?.label;
  const fuelTypeLabel = buyingFuelTypeOptions.find((option) => option.value === filters.fuelType)?.label;

  if (filters.dealType !== 'all' && dealTypeLabel) labels.push(dealTypeLabel);
  if (filters.bodyStyle !== 'all' && bodyStyleLabel) labels.push(bodyStyleLabel);
  if (filters.make !== 'all') labels.push(filters.make);
  if (filters.fuelType !== 'all' && fuelTypeLabel) labels.push(fuelTypeLabel);

  return labels;
};

const Deals: React.FC = () => {
  const fallbackVehicle = allVehicles[0];
  const dealSections = useMemo(() => fallbackVehicle ? createDealSections(fallbackVehicle) : [], [fallbackVehicle]);
  const [requestedDeal, setRequestedDeal] = useState<Deal | null>(null);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!fallbackVehicle) {
    return (
      <main className="deals-page">
        <section className="deals-hero">
          <div className="deals-hero__inner">
            <h1>Best New Car Deals for July 2026</h1>
            <p>Deals are unavailable while vehicle data loads.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="deals-page" id="main-content">
      <section className="deals-hero" aria-labelledby="deals-title">
        <div className="deals-hero__inner">
          <nav className="deals-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <Icon name="chevron_right" size={18} />
            <span>Deals</span>
          </nav>

          <div className="deals-hero__content">
            <div>
              <h1 id="deals-title">Best New Car Deals for July 2026</h1>
              <p>
                Track current manufacturer incentives, finance rates, cash-back offers, and lease specials,
                paired with MotorTrend ratings to help you find the right car at the right payment.
              </p>
              <div className="deals-hero__actions" aria-label="Deal category shortcuts">
                <button type="button" onClick={() => scrollToSection('buying')}>
                  Buying Deals
                  <Icon name="arrow_forward" size={18} />
                </button>
                <button type="button" onClick={() => scrollToSection('leasing')}>
                  Leasing Deals
                  <Icon name="arrow_forward" size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="deals-content">
        {dealSections.map((section) => (
          <section className="deals-row" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
            <div className="deals-row__intro">
              <p className="deals-row__count">{section.dealCount} deals</p>
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              <p>{section.description}</p>
              {section.id === 'buying' ? (
                <Link to="/deals/best-buying-deals" className="deals-row__link deals-row__link--primary">
                  View All Buying Deals
                  <Icon name="arrow_forward" size={17} />
                </Link>
              ) : section.id === 'leasing' ? (
                <Link to="/deals/lease" className="deals-row__link deals-row__link--primary">
                  View All Lease Deals
                  <Icon name="arrow_forward" size={17} />
                </Link>
              ) : (
                <a href={`#${section.id}`} className="deals-row__link">
                  View All
                  <Icon name="arrow_forward" size={17} />
                </a>
              )}
            </div>
            <div className="deals-row__cards">
              {section.deals.map((deal) => (
                <DealCard
                  deal={deal}
                  key={deal.id}
                  onRequest={() => setRequestedDeal(deal)}
                />
              ))}
            </div>
          </section>
        ))}

        <section className="deals-resources" aria-labelledby="resources-title">
          <div>
            <h2 id="resources-title">More Resources</h2>
            <p>Keep researching with MotorTrend shopping tools, rankings, and ownership guides.</p>
          </div>
          <div className="deals-resources__grid">
            <Link to="/rankings-awards">
              <Icon name="workspace_premium" size={24} />
              <span>Expert Rankings</span>
            </Link>
            <Link to="/auto-loan-calculator">
              <Icon name="calculate" size={24} />
              <span>Auto Loan Calculator</span>
            </Link>
            <Link to="/vehicles">
              <Icon name="directions_car" size={24} />
              <span>Browse All Vehicles</span>
            </Link>
          </div>
        </section>
      </div>

      {requestedDeal && (
        <div className="deals-toast" role="status" aria-live="polite">
          <div>
            <strong>Deal request ready</strong>
            <span>{requestedDeal.vehicle.year} {requestedDeal.vehicle.make} {requestedDeal.vehicle.model} - {requestedDeal.headline}</span>
          </div>
          <button type="button" onClick={() => setRequestedDeal(null)} aria-label="Dismiss deal request message">
            <Icon name="close" size={18} />
          </button>
        </div>
      )}
    </main>
  );
};

export const BuyingDealsPage: React.FC = () => {
  const fallbackVehicle = allVehicles[0];
  const buyingDeals = useMemo(() => fallbackVehicle ? createBuyingDeals(fallbackVehicle) : [], [fallbackVehicle]);
  const [requestedDeal, setRequestedDeal] = useState<Deal | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<BuyingFilterState>(defaultBuyingFilterState);
  const [sortBy, setSortBy] = useState<BuyingSortOption>('make');

  const filteredDeals = useMemo(
    () => filterAndSortBuyingDeals(buyingDeals, appliedFilters, sortBy),
    [appliedFilters, buyingDeals, sortBy],
  );
  const dealSegments = useMemo(
    () => chunkDeals(filteredDeals, DEALS_PER_RAIL_SEGMENT),
    [filteredDeals],
  );
  const makeOptions = useMemo(
    () => [...new Set(buyingDeals.map((deal) => deal.vehicle.make))].sort(),
    [buyingDeals],
  );
  const appliedFilterLabels = getBuyingFilterLabels(appliedFilters);
  const resultSummary = appliedFilterLabels.length > 0
    ? `${filteredDeals.length} featured buying deals - ${appliedFilterLabels.join(', ')}`
    : `${filteredDeals.length} featured buying deals`;

  if (!fallbackVehicle) {
    return (
      <main className="deals-page buying-deals-page">
        <section className="deals-hero deals-hero--buying">
          <div className="deals-hero__inner">
            <h1>Best Car Buying Deals for July 2026</h1>
            <p>Buying deals are unavailable while vehicle data loads.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="deals-page buying-deals-page" id="main-content">
      <section className="deals-hero deals-hero--buying" aria-labelledby="buying-deals-title">
        <div className="deals-hero__inner">
          <nav className="deals-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <Icon name="chevron_right" size={18} />
            <Link to="/deals">Deals</Link>
            <Icon name="chevron_right" size={18} />
            <span>Best Buying Deals</span>
          </nav>

          <div className="deals-hero__content">
            <h1 id="buying-deals-title">Best Car Buying Deals for July 2026</h1>
            <p>
              Manufacturer-backed APR and cash-back incentives can lower the total cost of a new car.
              Compare current MotorTrend-rated models, savings, terms, and expiration dates.
            </p>
          </div>
        </div>
      </section>

      <section className="buying-deals-toolbar" aria-label="Buying deal controls">
        <div className="buying-deals-toolbar__inner">
          <div className="buying-deals-toolbar__summary">
            <strong>100 deals</strong>
            <span>Buying Deals</span>
          </div>
          <button
            type="button"
            className="buying-deals-filter-toggle"
            onClick={() => setIsFilterModalOpen(true)}
            aria-expanded={isFilterModalOpen}
            aria-haspopup="dialog"
          >
            <Icon name="tune" size={18} />
            Filters
          </button>
        </div>
      </section>

      {isFilterModalOpen && (
        <BuyingFilterModal
          deals={buyingDeals}
          dealTypeOptions={buyingDealTypeOptions}
          filters={appliedFilters}
          makeOptions={makeOptions}
          mode="buy"
          sortBy={sortBy}
          onApply={(nextFilters, nextSortBy) => {
            setAppliedFilters(nextFilters);
            setSortBy(nextSortBy);
            setIsFilterModalOpen(false);
          }}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}

      <div className="buying-deals-content buying-deals-content--with-rail">
        <div className="buying-deals-results" aria-live="polite">
          {dealSegments.map((segmentDeals, segmentIndex) => (
            <React.Fragment key={`buying-deals-segment-${segmentIndex}`}>
              <DealsBreakerAd
                deal={segmentDeals[0]}
                label={segmentIndex === 0 ? 'MotorTrend marketplace' : 'More buying offers'}
              />
              {segmentIndex === 0 && (
                <div className="buying-deals-results__head">
                  <p>{resultSummary}</p>
                </div>
              )}
              <section
                className="buying-deals-segment"
                aria-label={`Buying deals ${segmentIndex + 1}`}
              >
                <div className="buying-deals-segment__main">
                  <div className="buying-deals-grid">
                    {segmentDeals.map((deal) => (
                      <DealCard
                        deal={deal}
                        key={deal.id}
                        onRequest={() => setRequestedDeal(deal)}
                      />
                    ))}
                  </div>
                </div>
                <DealsAdRail
                  imageAlt={`${segmentDeals[0]?.vehicle.year ?? ''} ${segmentDeals[0]?.vehicle.make ?? ''} ${segmentDeals[0]?.vehicle.model ?? ''}`.trim()}
                  imageUrl={segmentDeals[0]?.vehicle.image}
                />
              </section>
            </React.Fragment>
          ))}
        </div>
      </div>

      {requestedDeal && (
        <DealRequestToast
          deal={requestedDeal}
          onDismiss={() => setRequestedDeal(null)}
        />
      )}
    </main>
  );
};

export const LeaseDealsPage: React.FC = () => {
  const fallbackVehicle = allVehicles[0];
  const leaseDeals = useMemo(() => fallbackVehicle ? createLeaseDeals(fallbackVehicle) : [], [fallbackVehicle]);
  const [requestedDeal, setRequestedDeal] = useState<Deal | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<BuyingFilterState>(defaultBuyingFilterState);
  const [sortBy, setSortBy] = useState<BuyingSortOption>('make');

  const filteredDeals = useMemo(
    () => filterAndSortBuyingDeals(leaseDeals, appliedFilters, sortBy),
    [appliedFilters, leaseDeals, sortBy],
  );
  const dealSegments = useMemo(
    () => chunkDeals(filteredDeals, DEALS_PER_RAIL_SEGMENT),
    [filteredDeals],
  );
  const makeOptions = useMemo(
    () => [...new Set(leaseDeals.map((deal) => deal.vehicle.make))].sort(),
    [leaseDeals],
  );
  const appliedFilterLabels = getBuyingFilterLabels(appliedFilters, leaseDealTypeOptions);
  const resultSummary = appliedFilterLabels.length > 0
    ? `${filteredDeals.length} featured lease deals - ${appliedFilterLabels.join(', ')}`
    : `${filteredDeals.length} featured lease deals`;

  if (!fallbackVehicle) {
    return (
      <main className="deals-page buying-deals-page lease-deals-page">
        <section className="deals-hero deals-hero--lease">
          <div className="deals-hero__inner">
            <h1>Best Car Lease Deals for July 2026</h1>
            <p>Lease deals are unavailable while vehicle data loads.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="deals-page buying-deals-page lease-deals-page" id="main-content">
      <section className="deals-hero deals-hero--lease" aria-labelledby="lease-deals-title">
        <div className="deals-hero__inner">
          <nav className="deals-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <Icon name="chevron_right" size={18} />
            <Link to="/deals">Deals</Link>
            <Icon name="chevron_right" size={18} />
            <span>Lease Deals</span>
          </nav>

          <div className="deals-hero__content">
            <h1 id="lease-deals-title">Best Car Lease Deals for July 2026</h1>
            <p>
              Leasing lets you drive a brand-new car with lower monthly payments than buying.
              Compare current MotorTrend-rated lease specials, monthly payments, terms, and mileage allowances.
            </p>
          </div>
        </div>
      </section>

      <section className="buying-deals-toolbar" aria-label="Lease deal controls">
        <div className="buying-deals-toolbar__inner">
          <div className="buying-deals-toolbar__summary">
            <strong>83 deals</strong>
            <span>Lease Deals</span>
          </div>
          <button
            type="button"
            className="buying-deals-filter-toggle"
            onClick={() => setIsFilterModalOpen(true)}
            aria-expanded={isFilterModalOpen}
            aria-haspopup="dialog"
          >
            <Icon name="tune" size={18} />
            Filters
          </button>
        </div>
      </section>

      {isFilterModalOpen && (
        <BuyingFilterModal
          deals={leaseDeals}
          dealTypeOptions={leaseDealTypeOptions}
          filters={appliedFilters}
          makeOptions={makeOptions}
          mode="lease"
          sortBy={sortBy}
          onApply={(nextFilters, nextSortBy) => {
            setAppliedFilters(nextFilters);
            setSortBy(nextSortBy);
            setIsFilterModalOpen(false);
          }}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}

      <div className="buying-deals-content buying-deals-content--with-rail">
        <div className="buying-deals-results" aria-live="polite">
          {dealSegments.map((segmentDeals, segmentIndex) => (
            <React.Fragment key={`lease-deals-segment-${segmentIndex}`}>
              <DealsBreakerAd
                deal={segmentDeals[0]}
                label={segmentIndex === 0 ? 'MotorTrend lease marketplace' : 'More lease offers'}
                variant="lease"
              />
              {segmentIndex === 0 && (
                <div className="buying-deals-results__head">
                  <p>{resultSummary}</p>
                </div>
              )}
              <section
                className="buying-deals-segment"
                aria-label={`Lease deals ${segmentIndex + 1}`}
              >
                <div className="buying-deals-segment__main">
                  <div className="buying-deals-grid">
                    {segmentDeals.map((deal) => (
                      <DealCard
                        deal={deal}
                        key={deal.id}
                        onRequest={() => setRequestedDeal(deal)}
                      />
                    ))}
                  </div>
                </div>
                <DealsAdRail
                  imageAlt={`${segmentDeals[0]?.vehicle.year ?? ''} ${segmentDeals[0]?.vehicle.make ?? ''} ${segmentDeals[0]?.vehicle.model ?? ''}`.trim()}
                  imageUrl={segmentDeals[0]?.vehicle.image}
                  variant="lease"
                />
              </section>
            </React.Fragment>
          ))}
        </div>
      </div>

      {requestedDeal && (
        <DealRequestToast
          deal={requestedDeal}
          onDismiss={() => setRequestedDeal(null)}
        />
      )}
    </main>
  );
};

interface BuyingFilterModalProps {
  deals: Deal[];
  dealTypeOptions: BuyingFilterOption[];
  filters: BuyingFilterState;
  makeOptions: string[];
  mode: 'buy' | 'lease';
  sortBy: BuyingSortOption;
  onApply: (filters: BuyingFilterState, sortBy: BuyingSortOption) => void;
  onClose: () => void;
}

const BuyingFilterModal: React.FC<BuyingFilterModalProps> = ({
  deals,
  dealTypeOptions,
  filters,
  makeOptions,
  mode,
  sortBy,
  onApply,
  onClose,
}) => {
  const [draftFilters, setDraftFilters] = useState<BuyingFilterState>(filters);
  const [draftSortBy, setDraftSortBy] = useState<BuyingSortOption>(sortBy);
  const [expandedSection, setExpandedSection] = useState<BuyingFilterKey | null>(null);

  const draftResultCount = useMemo(
    () => filterAndSortBuyingDeals(deals, draftFilters, draftSortBy).length,
    [deals, draftFilters, draftSortBy],
  );

  const filterSections: Array<{ id: BuyingFilterKey; label: string; options: BuyingFilterOption[] }> = [
    { id: 'dealType', label: 'Deal Type', options: dealTypeOptions },
    { id: 'bodyStyle', label: 'Body Style', options: buyingBodyStyleOptions },
    {
      id: 'make',
      label: 'Make',
      options: [
        { value: 'all', label: 'All Makes' },
        ...makeOptions.map((make) => ({ value: make, label: make })),
      ],
    },
    { id: 'fuelType', label: 'Fuel Type', options: buyingFuelTypeOptions },
  ];

  const updateDraftFilter = (key: BuyingFilterKey, value: string) => {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetDraftFilters = () => {
    setDraftFilters(defaultBuyingFilterState);
    setDraftSortBy('make');
  };

  return (
    <div
      className="buying-filter-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="buying-filter-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="buying-filter-modal-title"
      >
        <header className="buying-filter-modal__header">
          <h2 id="buying-filter-modal-title">Filters</h2>
          <button type="button" onClick={onClose} aria-label="Close filters">
            <Icon name="close" size={22} />
          </button>
        </header>

        <div className="buying-filter-modal__body">
          <div className="buying-filter-modal__segments" aria-label="Deal mode">
            {mode === 'lease' ? (
              <span aria-current="page">Lease</span>
            ) : (
              <Link to="/deals/lease">Lease</Link>
            )}
            {mode === 'buy' ? (
              <span aria-current="page">Buy</span>
            ) : (
              <Link to="/deals/best-buying-deals">Buy</Link>
            )}
          </div>

          <section className="buying-filter-modal__section buying-filter-modal__section--open" aria-labelledby="buying-sort-heading">
            <div className="buying-filter-modal__section-title">
              <h3 id="buying-sort-heading">Sort by</h3>
              <Icon name="keyboard_arrow_up" size={22} />
            </div>
            <div className="buying-filter-modal__choices">
              {buyingSortOptions.map((option) => (
                <label className="buying-filter-modal__choice" key={option.value}>
                  <input
                    type="radio"
                    name="buying-sort"
                    checked={draftSortBy === option.value}
                    onChange={() => setDraftSortBy(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </section>

          {filterSections.map((section) => {
            const isExpanded = expandedSection === section.id;
            return (
              <section className="buying-filter-modal__section" key={section.id}>
                <button
                  type="button"
                  className="buying-filter-modal__section-toggle"
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  aria-expanded={isExpanded}
                >
                  <span className="buying-filter-modal__section-label">{section.label}</span>
                  <Icon name={isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={22} />
                </button>

                {isExpanded && (
                  <div className="buying-filter-modal__choices">
                    {section.options.map((option) => (
                      <label className="buying-filter-modal__choice" key={option.value}>
                        <input
                          type="radio"
                          name={`buying-${section.id}`}
                          checked={draftFilters[section.id] === option.value}
                          onChange={() => updateDraftFilter(section.id, option.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <footer className="buying-filter-modal__footer">
          <button type="button" className="buying-filter-modal__clear" onClick={resetDraftFilters}>
            Clear All
          </button>
          <button
            type="button"
            className="buying-filter-modal__show"
            onClick={() => onApply(draftFilters, draftSortBy)}
          >
            Show {draftResultCount} Results
          </button>
        </footer>
      </section>
    </div>
  );
};

interface DealRequestToastProps {
  deal: Deal;
  onDismiss: () => void;
}

type DealsAdVariant = 'buying' | 'lease';

interface DealsAdRailProps {
  imageAlt?: string;
  imageUrl?: string;
  variant?: DealsAdVariant;
}

interface DealsBreakerAdProps {
  deal?: Deal;
  label: string;
  variant?: DealsAdVariant;
}

const DealsBreakerAd: React.FC<DealsBreakerAdProps> = ({ deal, label, variant = 'buying' }) => {
  const vehicle = deal?.vehicle;
  const vehicleLabel = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'new cars';
  const isLease = variant === 'lease';
  const featuredValue = isLease ? deal?.headline : vehicle ? formatMoney(vehicle.priceMin) : null;
  const valueLabel = isLease ? 'Lease from' : 'Starting at';
  const detailCopy = isLease ? 'Current lease special near you' : 'MSRP* with current buying incentives';
  const secondaryAction = isLease ? 'Compare leases' : 'Compare deals';

  return (
    <aside className="deals-breaker-ad" aria-label="Advertisement">
      <Link to="/vehicles" className="deals-breaker-ad__creative">
        <span className="deals-breaker-ad__media">
          {vehicle?.image && (
            <img
              className="deals-breaker-ad__image"
              src={vehicle.image}
              alt={vehicleLabel}
              loading="lazy"
            />
          )}
          <span>
            <strong>MotorTrend</strong>
            <em>{label}</em>
          </span>
        </span>
        <span className="deals-breaker-ad__offer">
          <span>{vehicleLabel}</span>
          {featuredValue && (
            <strong>
              <span>{valueLabel}</span>
              <em>{featuredValue}</em>
            </strong>
          )}
          <small>{detailCopy}</small>
        </span>
        <span className="deals-breaker-ad__actions">
          <em>Find yours</em>
          <em>{secondaryAction}</em>
        </span>
      </Link>
    </aside>
  );
};

const DealsAdRail: React.FC<DealsAdRailProps> = ({ imageAlt = '', imageUrl, variant = 'buying' }) => {
  const isLease = variant === 'lease';
  const headline = isLease ? 'Find your next leased car' : 'Find your next new car';
  const body = isLease ? 'Compare local lease listings and current specials.' : 'Compare local listings and current incentives.';
  const action = isLease ? 'Browse leases' : 'Browse listings';

  return (
    <aside className="deals-ad-rail" aria-label="Advertisement">
      <div className="deals-ad-rail__sticky">
        <span className="deals-ad-rail__label">Advertisement</span>
        <Link to="/vehicles" className="deals-ad-rail__creative deals-ad-rail__creative--skyscraper">
          {imageUrl && (
            <img
              className="deals-ad-rail__image"
              src={imageUrl}
              alt={imageAlt}
              loading="lazy"
            />
          )}
          <span className="deals-ad-rail__eyebrow">MotorTrend Marketplace</span>
          <strong>{headline}</strong>
          <span>{body}</span>
          <em>{action}</em>
        </Link>
      </div>
    </aside>
  );
};

const DealRequestToast: React.FC<DealRequestToastProps> = ({ deal, onDismiss }) => (
  <div className="deals-toast" role="status" aria-live="polite">
    <div>
      <strong>Deal request ready</strong>
      <span>{deal.vehicle.year} {deal.vehicle.make} {deal.vehicle.model} - {deal.headline}</span>
    </div>
    <button type="button" onClick={onDismiss} aria-label="Dismiss deal request message">
      <Icon name="close" size={18} />
    </button>
  </div>
);

interface DealCardProps {
  deal: Deal;
  onRequest: () => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onRequest }) => {
  const { vehicle } = deal;
  const vehicleLabel = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const detailItems = [
    ...(deal.showMsrp === false ? [] : [{ label: 'MSRP Range', value: `${formatMoney(vehicle.priceMin)} - ${formatMoney(vehicle.priceMax)}` }]),
    { label: deal.detailLabel, value: deal.detailValue },
    ...(deal.secondaryDetailLabel && deal.secondaryDetailValue
      ? [{ label: deal.secondaryDetailLabel, value: deal.secondaryDetailValue }]
      : []),
  ];

  return (
    <article className="deal-card" aria-label={`${vehicleLabel} ${deal.headline}`}>
      <div className="deal-card__header">
        <h3>
          <Link to={vehiclePath(vehicle)}>{vehicleLabel}</Link>
        </h3>
        <div className="deal-card__rating" aria-label={`MotorTrend rating ${vehicle.staffRating} out of 10`}>
          <div className="deal-card__rating-score">
            <strong>{vehicle.staffRating}</strong>
            <span>/10</span>
          </div>
          <span className="deal-card__rating-label">MT Rating</span>
        </div>
      </div>

      <div className="deal-card__media">
        <Link to={vehiclePath(vehicle)} aria-label={`View ${vehicleLabel}`}>
          <img src={vehicle.image} alt={vehicleLabel} loading="lazy" />
        </Link>
      </div>

      <div className="deal-card__body">
        <div className="deal-card__metric">
          <strong>{deal.headline}</strong>
          <span>{deal.savings}</span>
          <em>Expires {deal.expires}</em>
        </div>

        <dl className="deal-card__details">
          {detailItems.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="deal-card__actions">
          <button type="button" onClick={onRequest}>Get This Deal</button>
          <Link to={vehiclePath(vehicle)}>Shop New {vehicle.model}</Link>
        </div>
      </div>
    </article>
  );
};

export default Deals;
