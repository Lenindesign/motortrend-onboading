/**
 * Know Your Buying Power Widget
 * Budget calculator to help users determine how much car they can afford
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import './KnowYourBudget.css';

export interface KnowYourBudgetProps {
  className?: string;
}

type CarType = 'New car' | 'Used car';
type CreditScore = 'Excellent (740+)' | 'Good (670-739)' | 'Fair (580-669)' | 'Poor (Below 580)';

export const KnowYourBudget: React.FC<KnowYourBudgetProps> = ({ className }) => {
  const navigate = useNavigate();
  const [carType, setCarType] = useState<CarType>('Used car');
  const [downPayment, setDownPayment] = useState<string>('2500');
  const [creditScore, setCreditScore] = useState<CreditScore>('Good (670-739)');
  const [monthlyPayment, setMonthlyPayment] = useState<string>('500');
  const [includeTradeIn, setIncludeTradeIn] = useState<boolean>(false);
  const [buyingPower, setBuyingPower] = useState<number>(27411);

  // Calculate buying power based on inputs
  useEffect(() => {
    const calculateBuyingPower = () => {
      const down = parseFloat(downPayment) || 0;
      const monthly = parseFloat(monthlyPayment) || 0;
      
      // Get APR based on credit score
      const aprMap: Record<CreditScore, number> = {
        'Excellent (740+)': 5.5,
        'Good (670-739)': 7.57,
        'Fair (580-669)': 10.5,
        'Poor (Below 580)': 15.0
      };
      
      const apr = aprMap[creditScore] / 100;
      const loanTerm = 60; // 60 months (5 years)
      
      // Calculate loan amount from monthly payment
      // Using standard loan formula: P = M * [(1 - (1 + r)^-n) / r]
      // Where P = principal, M = monthly payment, r = monthly rate, n = number of months
      const monthlyRate = apr / 12;
      let loanAmount = 0;
      
      if (monthlyRate > 0) {
        loanAmount = monthly * ((1 - Math.pow(1 + monthlyRate, -loanTerm)) / monthlyRate);
      } else {
        loanAmount = monthly * loanTerm;
      }
      
      // Total buying power = loan amount + down payment
      const total = loanAmount + down;
      
      setBuyingPower(Math.round(total));
    };

    calculateBuyingPower();
  }, [downPayment, creditScore, monthlyPayment]);

  const handleSeeMatches = () => {
    // Navigate to vehicles page with budget filter
    const maxPrice = buyingPower;
    navigate(`/vehicles?priceMax=${maxPrice}&carType=${carType.toLowerCase().replace(' ', '-')}`);
  };

  const formatCurrency = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) || 0 : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getAPR = (): number => {
    const aprMap: Record<CreditScore, number> = {
      'Excellent (740+)': 5.5,
      'Good (670-739)': 7.57,
      'Fair (580-669)': 10.5,
      'Poor (Below 580)': 15.0
    };
    return aprMap[creditScore];
  };

  return (
    <div className={`know-your-budget ${className || ''}`}>
      <div className="know-your-budget__container">
        {/* Left Section */}
        <div className="know-your-budget__left">
          <div className="know-your-budget__badge">
            <span>NEW</span>
          </div>
          <div className="know-your-budget__header">
            <h2 className="know-your-budget__title">
              See Your Buying Potential
              <button className="know-your-budget__info-button" aria-label="Learn more about buying potential">
                <Icon name="info" size={20} />
              </button>
            </h2>
            <p className="know-your-budget__description">
            Calculate your budget and instantly see vehicles that fit your financial comfort zone.
            </p>
          </div>
          <div className="know-your-budget__image-container">
            <img 
              src="https://d2kde5ohu8qb21.cloudfront.net/files/693066aff847fd000218dd58/b958fa8b27417e4cfd952751e837d410.png" 
              alt="Car" 
              className="know-your-budget__image"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="know-your-budget__right">
          {/* Buying Power Display */}
          <div className="know-your-budget__power-display">
            <div className="know-your-budget__power-amount">
              {formatCurrency(buyingPower)}
            </div>
            <div className="know-your-budget__power-label">
              Est. buying power
            </div>
            <div className="know-your-budget__power-apr">
              Based on {getAPR()}% APR
            </div>
          </div>

          {/* Input Fields */}
          <div className="know-your-budget__inputs">
            {/* Looking For */}
            <div className="know-your-budget__field">
              <label className="know-your-budget__label">Looking for</label>
              <select
                className="know-your-budget__select"
                value={carType}
                onChange={(e) => setCarType(e.target.value as CarType)}
              >
                <option value="New car">New car</option>
                <option value="Used car">Used car</option>
              </select>
            </div>

            {/* Down Payment */}
            <div className="know-your-budget__field">
              <label className="know-your-budget__label">Down payment</label>
              <div className="know-your-budget__input-wrapper">
                <span className="know-your-budget__currency">$</span>
                <input
                  type="text"
                  className="know-your-budget__input"
                  value={downPayment}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setDownPayment(value);
                  }}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Credit Score */}
            <div className="know-your-budget__field">
              <label className="know-your-budget__label">Credit score</label>
              <select
                className="know-your-budget__select"
                value={creditScore}
                onChange={(e) => setCreditScore(e.target.value as CreditScore)}
              >
                <option value="Excellent (740+)">Excellent (740+)</option>
                <option value="Good (670-739)">Good (670-739)</option>
                <option value="Fair (580-669)">Fair (580-669)</option>
                <option value="Poor (Below 580)">Poor (Below 580)</option>
              </select>
            </div>

            {/* Monthly Payment */}
            <div className="know-your-budget__field">
              <label className="know-your-budget__label">Monthly payment</label>
              <div className="know-your-budget__input-wrapper">
                <span className="know-your-budget__currency">$</span>
                <input
                  type="text"
                  className="know-your-budget__input"
                  value={monthlyPayment}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setMonthlyPayment(value);
                  }}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Trade-In Toggle */}
          <div className="know-your-budget__trade-in">
            <label className="know-your-budget__toggle-label">
              <input
                type="checkbox"
                className="know-your-budget__toggle"
                checked={includeTradeIn}
                onChange={(e) => setIncludeTradeIn(e.target.checked)}
              />
              <span className="know-your-budget__toggle-text">Include trade-in</span>
            </label>
          </div>

          {/* CTA Button */}
          <button
            className="know-your-budget__cta"
            onClick={handleSeeMatches}
          >
            See your matches
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowYourBudget;

