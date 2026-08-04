/**
 * Rankings & Awards Page Component
 * MotorTrend rankings index adapted from the Car and Driver rankings template.
 */

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleOneTap } from '../../components/GoogleOneTap';
import { Icon } from '../../components/Icon';
import { useGoogleOneTap } from '../../hooks/useGoogleOneTap';
import { HIGH_INTENT_PAGES } from '../../utils/cdpTracking';
import vehicleDatabase from '../../data/vehicles';
import type { Vehicle } from '../../types/vehicle';
import './RankingsAndAwards.css';

type BodyStyleConfig = {
  key: string;
  title: string;
  navLabel: string;
  description: string;
  icon: string;
};

type RankedVehicle = Vehicle & {
  rank: number;
};

type BodyStyleRow = BodyStyleConfig & {
  count: number;
  vehicles: RankedVehicle[];
};

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

const vehiclePath = (vehicle: Vehicle) => `/vehicles/${vehicle.slug}`;

const formatMoney = (value: number) => `$${value.toLocaleString()}`;

const formatPriceRange = (vehicle: Vehicle) => {
  if (vehicle.priceRange) return vehicle.priceRange;
  return `${formatMoney(vehicle.priceMin)} - ${formatMoney(vehicle.priceMax)}`;
};

const getAvailableYears = () => (
  Array.from(new Set(vehicleDatabase.map((vehicle) => vehicle.year)))
    .sort((a, b) => Number(b) - Number(a))
);

const getBodyStyleRows = (selectedYear: string): BodyStyleRow[] => (
  BODY_STYLE_CONFIG
    .map((config) => {
      const vehicles = vehicleDatabase
        .filter((vehicle) => vehicle.bodyStyle.toLowerCase() === config.key.toLowerCase())
        .filter((vehicle) => vehicle.year === selectedYear)
        .sort((a, b) => b.staffRating - a.staffRating);

      return {
        ...config,
        count: vehicles.length,
        vehicles: vehicles.slice(0, 3).map((vehicle, index) => ({
          ...vehicle,
          rank: index + 1,
        })),
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
  const [selectedYear, setSelectedYear] = useState(() => availableYears[0] ?? '2026');
  const bodyStyleRows = useMemo(() => getBodyStyleRows(selectedYear), [selectedYear]);
  const totalVehiclesRanked = useMemo(
    () => bodyStyleRows.reduce((total, row) => total + row.count, 0),
    [bodyStyleRows],
  );

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
            <span>Expert Rankings</span>
          </div>
          <h1 className="rankings-awards__title" id="rankings-title">
            Find the Best Car for You
          </h1>
          <p className="rankings-awards__subtitle">
            MotorTrend editors rate, compare, and rank the latest cars, trucks, and SUVs so shoppers can move from research to shortlist faster.
          </p>
          <dl className="rankings-awards__stats" aria-label="Rankings overview">
            <div>
              <dt>Vehicles Ranked</dt>
              <dd>{totalVehiclesRanked}</dd>
            </div>
            <div>
              <dt>Categories</dt>
              <dd>{bodyStyleRows.length}</dd>
            </div>
            <div>
              <dt>Model Year</dt>
              <dd>
                <label className="rankings-awards__year-select-label">
                  <span className="rankings-awards__sr-only">Select model year</span>
                  <select
                    className="rankings-awards__year-select"
                    value={selectedYear}
                    onChange={(event) => setSelectedYear(event.target.value)}
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </label>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <nav className="rankings-awards__subnav" aria-label="Ranking categories">
        <div className="rankings-awards__container rankings-awards__subnav-inner">
          {bodyStyleRows.map((row) => (
            <a className="rankings-awards__subnav-link" href={`#${row.key.toLowerCase()}`} key={row.key}>
              <img src={row.icon} alt="" />
              <span>{row.navLabel}</span>
            </a>
          ))}
        </div>
      </nav>

      <div className="rankings-awards__container rankings-awards__body-rows">
        {bodyStyleRows.map((row) => (
          <section className="rankings-awards__body-row" id={row.key.toLowerCase()} key={row.key}>
            <div className="rankings-awards__body-row-intro">
              <img className="rankings-awards__body-row-icon" src={row.icon} alt="" />
              <p className="rankings-awards__body-row-count">{row.count} vehicles ranked</p>
              <h2>{row.title}</h2>
              <p>{row.description}</p>
              <Link className="rankings-awards__body-row-cta" to={`/vehicles?bodyStyle=${encodeURIComponent(row.key)}`}>
                View All {row.navLabel}
                <Icon name="arrow_forward" size={18} />
              </Link>
            </div>

            <div className="rankings-awards__cards" aria-label={`${row.title} top ranked vehicles`}>
              {row.vehicles.map((vehicle) => (
                <article className="rankings-awards__vehicle-card" key={vehicle.id}>
                  <Link className="rankings-awards__vehicle-card-link" to={vehiclePath(vehicle)}>
                    <div className="rankings-awards__vehicle-media">
                      <img src={vehicle.image} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} loading="lazy" />
                      <span className="rankings-awards__rank-badge">#{vehicle.rank}</span>
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

                      <span className="rankings-awards__shop-link">
                        Shop New {vehicle.model}
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

export default RankingsAndAwards;
