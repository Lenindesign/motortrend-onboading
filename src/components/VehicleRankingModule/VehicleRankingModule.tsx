import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import { LIVE_RANKING_ENTRIES } from '../../pages/RankingsAndAwards/RankingsAndAwards';
import vehicleDatabase from '../../data/vehicles';
import { vehicleImageFor } from '../../utils/vehicleImages';
import './VehicleRankingModule.css';

interface VehicleRankingModuleProps {
  year: string;
  make: string;
  model: string;
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const rankingSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const vehiclePhoto = (year: string, make: string, model: string) => {
  const target = normalize(`${make} ${model}`);
  const localVehicle = vehicleDatabase.find((vehicle) => {
    const candidate = normalize(`${vehicle.make} ${vehicle.model}`);
    return vehicle.year === year && (candidate.includes(target) || target.includes(candidate));
  });

  return localVehicle?.image ?? vehicleImageFor(`${year} ${make} ${model}`);
};

const startingPrice = (priceRange: string) => {
  const amount = priceRange.match(/\$[\d,]+/)?.[0];
  return amount ? `Starting at ${amount}` : 'View pricing';
};

export const VehicleRankingModule: React.FC<VehicleRankingModuleProps> = ({ year, make, model }) => {
  const ranking = useMemo(() => {
    const entries = Object.entries(LIVE_RANKING_ENTRIES).flatMap(([category, vehicles]) =>
      vehicles.map((vehicle) => ({ ...vehicle, category })),
    );
    const current = entries.find((entry) =>
      entry.year === year && normalize(entry.make) === normalize(make) && normalize(entry.model) === normalize(model),
    );

    if (!current) return null;

    const categoryEntries = entries
      .filter((entry) => entry.category === current.category && entry.subcategory === current.subcategory)
      .sort((a, b) => a.rank - b.rank || b.rating - a.rating);
    const currentIndex = categoryEntries.findIndex((entry) => entry.year === current.year
      && normalize(entry.make) === normalize(current.make)
      && normalize(entry.model) === normalize(current.model));

    if (currentIndex < 0 || categoryEntries.length < 2) return null;

    const visibleCount = Math.min(categoryEntries.length, 6);
    const startIndex = Math.max(0, Math.min(currentIndex - 2, categoryEntries.length - visibleCount));
    const vehicles = categoryEntries.slice(startIndex, startIndex + visibleCount);
    const categoryPath = `/rankings-awards/${current.category.toLowerCase()}/${rankingSlug(current.subcategory)}`;

    return {
      currentRank: current.rank,
      category: current.subcategory,
      categoryPath,
      vehicles,
    };
  }, [year, make, model]);

  if (!ranking) return null;

  return (
    <section className="vehicle-ranking" aria-labelledby="vehicle-ranking-title">
      <header className="vehicle-ranking__header">
        <div>
          <p className="vehicle-ranking__eyebrow">MotorTrend Rankings</p>
          <h2 id="vehicle-ranking-title">Where This Vehicle Ranks</h2>
        </div>
        <Link className="vehicle-ranking__category-link" to={ranking.categoryPath}>
          View {ranking.category}
          <Icon name="chevron_right" size={20} />
        </Link>
      </header>

      <p className="vehicle-ranking__position">
        <span>#{ranking.currentRank}</span> in {ranking.category}
      </p>

      <div className="vehicle-ranking__grid">
        {ranking.vehicles.map((vehicle) => {
          const isCurrent = vehicle.year === year
            && normalize(vehicle.make) === normalize(make)
            && normalize(vehicle.model) === normalize(model);
          const vehicleUrl = `/vehicles/${vehicle.year}/${encodeURIComponent(vehicle.make)}/${encodeURIComponent(vehicle.model.replace(/\s+/g, '-'))}`;
          const formattedRating = Number.isInteger(vehicle.rating) ? vehicle.rating.toFixed(0) : vehicle.rating.toFixed(1);

          return (
            <article className={`vehicle-ranking__card${isCurrent ? ' vehicle-ranking__card--current' : ''}`} key={`${vehicle.year}-${vehicle.make}-${vehicle.model}`}>
              <Link className="vehicle-ranking__photo-link" to={vehicleUrl} aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`}>
                <img
                  src={vehiclePhoto(vehicle.year, vehicle.make, vehicle.model)}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="vehicle-ranking__rank-badge">{vehicle.rank}</span>
              </Link>
              <div className="vehicle-ranking__card-content">
                <div className="vehicle-ranking__vehicle-line">
                  <h3>{vehicle.make} {vehicle.model}</h3>
                  <span className="vehicle-ranking__rating"><strong>{formattedRating}</strong><small>/10</small></span>
                </div>
                <p className="vehicle-ranking__price">{startingPrice(vehicle.priceRange)}</p>
                <Link className="vehicle-ranking__shop-link" to={vehicleUrl}>Shop {vehicle.model}</Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default VehicleRankingModule;
