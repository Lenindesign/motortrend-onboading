import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import vehicleDatabase from '../../data/vehicles';
import { vehicleImageFor } from '../../utils/vehicleImages';
import { CATEGORY_SUBCATEGORIES, LIVE_RANKING_ENTRIES, RankingCategoryIcon, RANKINGS_NAV_ITEMS } from './RankingsAndAwards';
import './RankingCategoryPage.css';
import './RankingsAndAwards.css';

const CATEGORY_META: Record<string, { title: string; description: string; icon: string; subcategories: string[] }> = {
  suv: {
    title: 'Best SUVs',
    description: 'Family crossovers, adventure rigs, and luxury SUVs ranked by MotorTrend editors.',
    icon: '/images/body-style-icons/suv.svg',
    subcategories: ['All Subcategories', 'Best Subcompact SUVs', 'Best Compact SUVs', 'Best Midsize SUVs', 'Best Full-Size SUVs'],
  },
  sedan: {
    title: 'Best Sedans',
    description: 'Smart commuters, premium four-doors, and sport sedans for every daily drive.',
    icon: '/images/body-style-icons/sedan.svg',
    subcategories: ['All Subcategories', 'Best Compact Sedans', 'Best Midsize Sedans', 'Best Full-Size Sedans'],
  },
  crossover: {
    title: 'Best Crossovers',
    description: 'Versatile crossovers ranked for comfort, practicality, efficiency, and everyday capability.',
    icon: '/images/body-style-icons/hatchback.svg',
    subcategories: ['All Subcategories', 'Best Subcompact Crossovers', 'Best Compact Crossovers', 'Best Midsize Crossovers'],
  },
  truck: {
    title: 'Best Trucks',
    description: 'Work-ready pickups and lifestyle trucks ranked for capability, value, and comfort.',
    icon: '/images/body-style-icons/truck.svg',
    subcategories: ['All Subcategories', 'Best Compact Trucks', 'Best Midsize Pickup Trucks', 'Best Full-Size Trucks'],
  },
  coupe: {
    title: 'Best Coupes',
    description: 'Driver-focused two-doors with the performance and style enthusiasts expect.',
    icon: '/images/body-style-icons/coupe.svg',
    subcategories: ['All Subcategories', 'Best Sports Cars', 'Best Performance Coupes'],
  },
  hatchback: {
    title: 'Best Hatchbacks',
    description: 'Practical, efficient, and fun small cars with flexible cargo space.',
    icon: '/images/body-style-icons/hatchback.svg',
    subcategories: ['All Subcategories', 'Best Small Hatchbacks', 'Best Compact Hatchbacks'],
  },
  convertible: {
    title: 'Best Convertibles',
    description: 'Open-air cars ranked for style, refinement, and weekend-road appeal.',
    icon: '/images/body-style-icons/convertible.svg',
    subcategories: ['All Subcategories', 'Best Performance Convertibles', 'Best Luxury Convertibles'],
  },
  wagon: {
    title: 'Best Wagons',
    description: 'Long-roof utility with car-like handling and everyday usability.',
    icon: '/images/body-style-icons/van.svg',
    subcategories: ['All Subcategories', 'Best Performance Station Wagons', 'Best Luxury Station Wagons'],
  },
};

const localVehicleFor = (year: string, make: string, model: string) => {
  const normalized = `${make} ${model}`.toLowerCase().replace(/[^a-z0-9]/g, '');
  return vehicleDatabase.find((vehicle) =>
    vehicle.year === year && `${vehicle.make} ${vehicle.model}`.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normalized),
  );
};

const RANKINGS_METHODOLOGY = 'At MotorTrend, our experts rigorously evaluate the best SUVs to help you find the right vehicle with confidence. Backed by more than 75 years of automotive testing and experience, we drive, measure, and compare hundreds of cars, SUVs, and trucks every year to ensure our rankings reflect real-world performance, comfort, technology, safety, and value. Every SUV on this list has been reviewed by seasoned editors and vehicle testers who combine objective test results with hands-on impressions. From acceleration and efficiency to design and practicality, each ranking and score represents deep expertise, not opinion. Trust MotorTrend’s comprehensive testing and transparent methodology to discover the SUVs that truly stand out above the rest.';
const TROPHY_TOP_ICON = 'https://www.motortrend.com/uploads/sites/5/2020/06/trophie-top.svg';
const subcategoryId = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const RankingCategoryPage: React.FC = () => {
  const { category = 'suv', subcategory } = useParams();
  const normalizedCategory = category.toLowerCase();
  const meta = CATEGORY_META[normalizedCategory] ?? CATEGORY_META.suv;
  const categoryName = meta.title.replace(/^Best /, '').replace(/s$/, '');
  const entries = LIVE_RANKING_ENTRIES[normalizedCategory === 'suv' ? 'SUV' : normalizedCategory[0].toUpperCase() + normalizedCategory.slice(1)] ?? LIVE_RANKING_ENTRIES.SUV;
  const categoryKey = normalizedCategory === 'suv' ? 'SUV' : normalizedCategory[0].toUpperCase() + normalizedCategory.slice(1);
  const allSubcategoryLinks = (CATEGORY_SUBCATEGORIES[categoryKey] ?? meta.subcategories.map((label) => [label, '#'] as const))
    .filter(([label]) => label !== 'All Subcategories' && !label.startsWith('#1 Ranked'));
  const selectedSubcategory = subcategory
    ? allSubcategoryLinks.find(([label]) => subcategoryId(label) === subcategory.toLowerCase())
    : undefined;
  const isFullListPage = Boolean(selectedSubcategory);
  const subcategoryLinks = isFullListPage ? [selectedSubcategory!] : allSubcategoryLinks;
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState('');
  const categoryRailRef = useRef<HTMLDivElement>(null);
  const subcategoryTrackRef = useRef<HTMLDivElement>(null);
  const scrollCategoryRail = (direction: 'left' | 'right') => {
    categoryRailRef.current?.scrollBy({ left: direction === 'left' ? -360 : 360, behavior: 'smooth' });
  };
  const scrollSubcategoryRail = (direction: 'left' | 'right') => {
    subcategoryTrackRef.current?.scrollBy({ left: direction === 'left' ? -360 : 360, behavior: 'smooth' });
  };

  useEffect(() => {
    const sections = subcategoryLinks
      .map(([label]) => document.getElementById(subcategoryId(label)))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver((observedSections) => {
      const visibleSection = observedSections
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
      if (visibleSection) setActiveSubcategory(visibleSection.target.id);
    }, { rootMargin: '-190px 0px -55% 0px', threshold: 0 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categoryKey]);

  useEffect(() => {
    if (!activeSubcategory || !subcategoryTrackRef.current) return;
    const activeLink = subcategoryTrackRef.current.querySelector<HTMLAnchorElement>(`a[href="#${activeSubcategory}"]`);
    if (!activeLink) return;
    const row = subcategoryTrackRef.current;
    const targetLeft = activeLink.offsetLeft - (row.clientWidth - activeLink.offsetWidth) / 2;
    row.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  }, [activeSubcategory]);

  const renderRankingCard = (entry: typeof entries[number], index: number) => {
    const localVehicle = localVehicleFor(entry.year, entry.make, entry.model);
    const vehicleHref = `/vehicles/${entry.year}/${entry.make}/${entry.model.replace(/\s+/g, '-')}`;
    const mpg = entry.mpg ? `Up to ${entry.mpg.split('/')[0]} city / ${entry.mpg.split('/')[1]} highway` : '—';
    return (
      <article className="ranking-category-page__card" key={`${entry.make}-${entry.model}-${index}`}>
        <Link to={vehicleHref} className="ranking-category-page__image-wrap">
          <img src={localVehicle?.image ?? vehicleImageFor(`${entry.year} ${entry.make} ${entry.model}`)} alt={`${entry.year} ${entry.make} ${entry.model}`} />
          <img className="ranking-category-page__rank-badge" src={index === 0 ? '/images/number-1.svg' : TROPHY_TOP_ICON} alt={index === 0 ? 'Ranked number 1' : `Ranked number ${index + 1}`} />
        </Link>
        <div className="ranking-category-page__card-body">
          <div className="ranking-category-page__card-title-row">
            <h3>{entry.year} {entry.make} {entry.model}</h3>
            <div className="ranking-category-page__rating"><strong>{entry.rating}</strong><span>/10</span></div>
          </div>
          <dl>
            <div><dt>Starting at</dt><dd>{entry.priceRange.split(' - ')[0]}</dd></div>
            <div><dt>MPG</dt><dd>{mpg}</dd></div>
          </dl>
          <Link className="ranking-category-page__card-cta" to={vehicleHref}>See Local Listings<Icon name="arrow_forward" size={17} /></Link>
          <p className="ranking-category-page__card-description">Interested in the {entry.year} {entry.make} {entry.model}? Learn more about it in the MotorTrend Buyer&apos;s Guide right here. <Link to={vehicleHref}>Read more</Link></p>
        </div>
      </article>
    );
  };

  return (
    <main className="ranking-category-page" id="main-content">
      <section className={`ranking-category-page__hero${isDescriptionExpanded ? ' is-description-expanded' : ''}`}>
        <div className="ranking-category-page__container">
          <Link className="ranking-category-page__hero-kicker" to="/rankings-awards" aria-label="Ultimate Car Rankings index">
            <span className="ranking-category-page__hero-kicker-badge"><img src="/images/mt-brand-icon.svg" alt="" /></span>
            <span>Ultimate Car Rankings</span>
          </Link>
          <h1>Find the Best {categoryName} for You</h1>
          <div className="ranking-category-page__hero-description">
            <p>
              {isDescriptionExpanded ? RANKINGS_METHODOLOGY : `MotorTrend editors rate, compare, and rank the latest ${meta.title.replace(/^Best /, '')} so shoppers can move from research to shortlist faster. ${RANKINGS_METHODOLOGY}`}
            </p>
            <button type="button" aria-expanded={isDescriptionExpanded} onClick={() => setIsDescriptionExpanded((expanded) => !expanded)}>
              {isDescriptionExpanded ? 'Read less' : 'Read more'}
              <Icon name={isDescriptionExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={18} />
            </button>
          </div>
        </div>
      </section>

      <nav className="rankings-awards__subnav" aria-label="Ranking categories">
        <div className="ranking-category-page__container rankings-awards__subnav-inner">
          <button className="rankings-awards__subnav-arrow" type="button" aria-label="Scroll ranking categories left" onClick={() => scrollCategoryRail('left')}>
            <Icon name="chevron_left" size={24} />
          </button>
          <div className="rankings-awards__subnav-track" ref={categoryRailRef}>
          {RANKINGS_NAV_ITEMS.map((item) => {
            const slug = item.label === 'Best Used Cars' ? null : item.label.replace(/^Best /, '').toLowerCase().replace(/s$/, '');
            const href = item.href.startsWith('/') ? item.href : `/rankings-awards/${slug ?? 'suv'}`;
            const isActive = item.label === meta.title;
            return (
            <Link
              key={item.label}
              className={`rankings-awards__subnav-link${isActive ? ' is-active' : ''}`}
              to={href}
            >
              <RankingCategoryIcon src={item.image} />
              <span>{item.label}</span>
            </Link>
            );
          })}
          </div>
          <button className="rankings-awards__subnav-arrow" type="button" aria-label="Scroll ranking categories right" onClick={() => scrollCategoryRail('right')}>
            <Icon name="chevron_right" size={24} />
          </button>
        </div>
      </nav>

      <nav className="ranking-category-page__subcategory-row" aria-label={`${categoryName} subcategories`}>
        <button className="ranking-category-page__subcategory-arrow ranking-category-page__subcategory-arrow--left" type="button" aria-label="Scroll subcategories left" onClick={() => scrollSubcategoryRail('left')}>
          <Icon name="chevron_left" size={22} />
        </button>
        <div ref={subcategoryTrackRef} className="ranking-category-page__container ranking-category-page__subcategory-track">
          {subcategoryLinks.map(([label]) => {
            const id = subcategoryId(label);
            const isActive = activeSubcategory === id;
            return (
            <a key={label} className={isActive ? 'is-active' : undefined} aria-current={isActive ? 'location' : undefined} href={`#${id}`}>
              {label}
            </a>
            );
          })}
        </div>
        <button className="ranking-category-page__subcategory-arrow ranking-category-page__subcategory-arrow--right" type="button" aria-label="Scroll subcategories right" onClick={() => scrollSubcategoryRail('right')}>
          <Icon name="chevron_right" size={22} />
        </button>
      </nav>

      <div className="ranking-category-page__ad" aria-label="Advertisement">
        <span>Advertisement</span>
        <img src="/images/nissan-breaker-ad.png" alt="Nissan year-end sales event" />
      </div>

      <section className="ranking-category-page__container ranking-category-page__content">
        <div className="ranking-category-page__subcategory-sections">
          {subcategoryLinks.map(([label], index) => (
            <React.Fragment key={label}>
              <section className="ranking-category-page__subcategory-section" id={subcategoryId(label)}>
                <div className="ranking-category-page__subcategory-section-header">
                  <div>
                    <span className="ranking-category-page__subcategory-kicker">{index === 0 ? 'Featured rankings' : `${categoryName} rankings`}</span>
                    <h2>{label}</h2>
                  </div>
                  {!isFullListPage && (
                    <Link to={`/rankings-awards/${normalizedCategory}/${subcategoryId(label)}`}>See Full List<Icon name="arrow_forward" size={17} /></Link>
                  )}
                </div>
                <p>Explore MotorTrend&apos;s {label.toLowerCase()} rankings, expert testing, and buying advice.</p>
                <div className="ranking-category-page__subcategory-section-layout">
                  <div className="ranking-category-page__subcategory-section-cards">
                    {(label === 'All Subcategories' || label.startsWith('#1 Ranked')
                      ? entries.slice(0, 3)
                      : entries.filter((entry) => label.toLowerCase().replace('crossovers', 'suvs').includes(entry.subcategory.toLowerCase().split(' ')[0]) || entry.subcategory.toLowerCase().includes(label.toLowerCase().replace('crossovers', 'suvs').replace('best ', '').replace('sedans', '').trim()))
                    ).map(renderRankingCard)}
                  </div>
                  <aside className="ranking-category-page__subcategory-section-ad" aria-label="Advertisement">
                    <span>Advertisement</span>
                  </aside>
                </div>
              </section>
              {index < subcategoryLinks.length - 1 && (
                <div className="ranking-category-page__subcategory-breaker-ad" aria-label="Advertisement">
                  <span>Advertisement</span>
                  <img src="/images/nissan-breaker-ad.png" alt="Nissan year-end sales event" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
    </main>
  );
};

export default RankingCategoryPage;
