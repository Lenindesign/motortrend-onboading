/**
 * Sitemap Page
 * Comprehensive list of all pages, articles, and vehicles
 */

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../../utils/articles';
import { getVehicles } from '../../api/vehiclesApi';
import './Sitemap.css';

export const Sitemap: React.FC = () => {
  // Get all article slugs and titles
  const articleList = useMemo(() => {
    return Object.entries(articles).map(([slug, article]) => ({
      slug,
      title: article.title,
      date: article.date,
      category: article.category
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  // Get all vehicles organized by make
  const vehiclesByMake = useMemo(() => {
    const organized: Record<string, Array<{ name: string; year: string; make: string; model: string; url: string }>> = {};
    const allVehicles = getVehicles();
    
    allVehicles.forEach(vehicle => {
      const make = vehicle.make;
      
      if (!organized[make]) {
        organized[make] = [];
      }
      
      organized[make].push({
        name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        url: `/vehicles/${vehicle.year}/${encodeURIComponent(vehicle.make)}/${encodeURIComponent(vehicle.model)}`
      });
    });
    
    // Sort vehicles within each make by year (newest first) then model
    Object.keys(organized).forEach(make => {
      organized[make].sort((a, b) => {
        const yearDiff = parseInt(b.year) - parseInt(a.year);
        if (yearDiff !== 0) return yearDiff;
        return a.model.localeCompare(b.model);
      });
    });
    
    return organized;
  }, []);

  // Index pages
  const indexPages = [
    { path: '/', name: 'Home' },
    { path: '/vehicles', name: 'All Vehicles' },
    { path: '/new-cars', name: 'New Cars' },
    { path: '/used-cars', name: 'Used Cars' },
    { path: '/car-reviews', name: 'Car Reviews' },
    { path: '/compare-vehicles', name: 'Compare Vehicles' },
    { path: '/news-and-reviews', name: 'News & Reviews' },
    { path: '/latest-news', name: 'Latest News' },
    { path: '/videos', name: 'Videos' },
    { path: '/ev-hub', name: 'EV Hub' },
    { path: '/rankings-and-awards', name: 'Rankings & Awards' },
    { path: '/community', name: 'Community' },
    { path: '/membership', name: 'Membership' },
    { path: '/profile', name: 'Profile' },
  ];

  const sortedMakes = useMemo(() => {
    return Object.keys(vehiclesByMake).sort();
  }, [vehiclesByMake]);

  return (
    <div className="sitemap">
      <div className="sitemap__container">
        <header className="sitemap__header">
          <h1 className="sitemap__title">Site Map</h1>
          <p className="sitemap__description">
            Complete directory of all pages, articles, and vehicles on MotorTrend
          </p>
        </header>

        {/* Index Pages */}
        <section className="sitemap__section">
          <h2 className="sitemap__section-title">Main Pages</h2>
          <div className="sitemap__grid">
            {indexPages.map(page => (
              <Link 
                key={page.path} 
                to={page.path} 
                className="sitemap__link"
              >
                {page.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Articles */}
        <section className="sitemap__section">
          <h2 className="sitemap__section-title">
            Articles ({articleList.length})
          </h2>
          <div className="sitemap__list">
            {articleList.map(article => (
              <Link 
                key={article.slug} 
                to={`/article/${article.slug}`}
                className="sitemap__article-link"
              >
                <span className="sitemap__article-title">{article.title}</span>
                <span className="sitemap__article-meta">
                  {article.category} • {article.date}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Vehicles by Make */}
        <section className="sitemap__section">
          <h2 className="sitemap__section-title">
            Vehicles by Make ({getVehicles().length} total)
          </h2>
          {sortedMakes.map(make => (
            <div key={make} className="sitemap__make-section">
              <h3 className="sitemap__make-title">
                {make} ({vehiclesByMake[make].length})
              </h3>
              <div className="sitemap__vehicle-grid">
                {vehiclesByMake[make].map(vehicle => (
                  <Link 
                    key={vehicle.url} 
                    to={vehicle.url}
                    className="sitemap__vehicle-link"
                  >
                    {vehicle.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Sitemap;

