/**
 * Know Your Buying Power Widget
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';

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
  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const [isInfoHovered, setIsInfoHovered] = useState(false);

  // Inject toggle styles
  useEffect(() => {
    const styleId = 'know-your-budget-toggle';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .kyb-toggle { width: 44px; height: 24px; appearance: none; background: #E5E5E5; border-radius: 12px; position: relative; cursor: pointer; transition: background 0.2s ease; flex-shrink: 0; border: none; }
        .kyb-toggle::before { content: ''; position: absolute; width: 20px; height: 20px; border-radius: 50%; background: #FFFFFF; top: 2px; left: 2px; transition: transform 0.2s ease; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); }
        .kyb-toggle:checked { background: #E90C17; }
        .kyb-toggle:checked::before { transform: translateX(20px); }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const down = parseFloat(downPayment) || 0;
    const monthly = parseFloat(monthlyPayment) || 0;
    const aprMap: Record<CreditScore, number> = { 'Excellent (740+)': 5.5, 'Good (670-739)': 7.57, 'Fair (580-669)': 10.5, 'Poor (Below 580)': 15.0 };
    const apr = aprMap[creditScore] / 100;
    const loanTerm = 60;
    const monthlyRate = apr / 12;
    let loanAmount = monthlyRate > 0 ? monthly * ((1 - Math.pow(1 + monthlyRate, -loanTerm)) / monthlyRate) : monthly * loanTerm;
    setBuyingPower(Math.round(loanAmount + down));
  }, [downPayment, creditScore, monthlyPayment]);

  const handleSeeMatches = () => {
    navigate(`/vehicles?priceMax=${buyingPower}&carType=${carType.toLowerCase().replace(' ', '-')}`);
  };

  const formatCurrency = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) || 0 : value;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
  };

  const getAPR = (): number => {
    const aprMap: Record<CreditScore, number> = { 'Excellent (740+)': 5.5, 'Good (670-739)': 7.57, 'Fair (580-669)': 10.5, 'Poor (Below 580)': 15.0 };
    return aprMap[creditScore];
  };

  // Styles
  const containerStyle: React.CSSProperties = { width: '100%', background: 'var(--color-white, #FFFFFF)', border: '1px solid var(--color-neutrals-6, #E6E8EC)', borderRadius: '16px', boxShadow: '0px 4px 8px 0px rgba(20, 20, 22, 0.1)', overflow: 'hidden' };
  const innerStyle: React.CSSProperties = { display: 'flex', minHeight: '500px' };
  const leftStyle: React.CSSProperties = { flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#FFFFFF' };
  const badgeStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', padding: '6px 12px', background: 'var(--color-blue, #186CEA)', borderRadius: '100px', width: 'fit-content' };
  const badgeTextStyle: React.CSSProperties = { fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 700, color: 'var(--color-white, #FFFFFF)', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const headerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '12px' };
  const titleStyle: React.CSSProperties = { fontFamily: 'Poppins, sans-serif', fontSize: '32px', fontWeight: 700, color: 'var(--color-neutrals-1, #141416)', margin: 0, lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '8px' };
  const infoBtnStyle: React.CSSProperties = { width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: 'transparent', color: isInfoHovered ? 'var(--color-primary-1, #E90C17)' : '#666666', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, transition: 'color 0.2s ease' };
  const descStyle: React.CSSProperties = { fontFamily: 'Geist, sans-serif', fontSize: '16px', fontWeight: 400, color: 'var(--color-neutrals-4, #6E7481)', lineHeight: 1.5, margin: 0 };
  const imageContainerStyle: React.CSSProperties = { flex: 1, display: 'flex', alignItems: 'flex-end', minHeight: '300px' };
  const imageStyle: React.CSSProperties = { width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '8px' };
  const rightStyle: React.CSSProperties = { flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--color-neutrals-7, #F4F5F6)', borderLeft: '1px solid #E5E5E5' };
  const powerDisplayStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '24px', borderBottom: '1px solid #E5E5E5' };
  const powerAmountStyle: React.CSSProperties = { fontFamily: 'Poppins, sans-serif', fontSize: '64px', fontWeight: 700, color: 'var(--color-neutrals-1, #141416)', lineHeight: 1 };
  const powerLabelStyle: React.CSSProperties = { fontFamily: 'Geist, sans-serif', fontSize: '14px', fontWeight: 500, color: '#666666' };
  const powerAprStyle: React.CSSProperties = { fontFamily: 'Geist, sans-serif', fontSize: '12px', fontWeight: 400, color: '#666666' };
  const inputsStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
  const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };
  const labelStyle: React.CSSProperties = { fontFamily: 'Geist, sans-serif', fontSize: '14px', fontWeight: 600, color: 'var(--color-neutrals-1, #141416)' };
  const selectStyle: React.CSSProperties = { width: '100%', padding: '12px 40px 12px 16px', border: '1px solid var(--color-neutrals-6, #E6E8EC)', borderRadius: '8px', background: 'var(--color-white, #FFFFFF)', fontFamily: 'Geist, sans-serif', fontSize: '16px', fontWeight: 400, color: 'var(--color-neutrals-1, #141416)', cursor: 'pointer', outline: 'none', appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%231A1B21' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' };
  const inputWrapperStyle: React.CSSProperties = { position: 'relative', display: 'flex', alignItems: 'center' };
  const currencyStyle: React.CSSProperties = { position: 'absolute', left: '16px', fontFamily: 'Geist, sans-serif', fontSize: '16px', fontWeight: 400, color: 'var(--color-neutrals-1, #141416)', pointerEvents: 'none', zIndex: 1 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px 12px 32px', border: '1px solid var(--color-neutrals-6, #E6E8EC)', borderRadius: '8px', background: 'var(--color-white, #FFFFFF)', fontFamily: 'Geist, sans-serif', fontSize: '16px', fontWeight: 400, color: 'var(--color-neutrals-1, #141416)', outline: 'none' };
  const tradeInStyle: React.CSSProperties = { paddingTop: '8px' };
  const toggleLabelStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' };
  const toggleTextStyle: React.CSSProperties = { fontFamily: 'Geist, sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutrals-1, #141416)' };
  const ctaStyle: React.CSSProperties = { width: '100%', padding: '16px 24px', border: 'none', borderRadius: '8px', background: isCtaHovered ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-1, #141416)', color: 'var(--color-white, #FFFFFF)', fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginTop: 'auto', transform: isCtaHovered ? 'translateY(-1px)' : 'none', boxShadow: isCtaHovered ? '0 4px 12px rgba(233, 12, 23, 0.3)' : 'none', transition: 'all 0.2s ease' };

  return (
    <div className={className} style={containerStyle}>
      <div style={innerStyle}>
        <div style={leftStyle}>
          <div style={badgeStyle}><span style={badgeTextStyle}>NEW</span></div>
          <div style={headerStyle}>
            <h2 style={titleStyle}>
              See Your Buying Potential
              <button style={infoBtnStyle} onMouseEnter={() => setIsInfoHovered(true)} onMouseLeave={() => setIsInfoHovered(false)} aria-label="Learn more">
                <Icon name="info" size={20} />
              </button>
            </h2>
            <p style={descStyle}>Calculate your budget and instantly see vehicles that fit your financial comfort zone.</p>
          </div>
          <div style={imageContainerStyle}>
            <img src="https://d2kde5ohu8qb21.cloudfront.net/files/693066aff847fd000218dd58/b958fa8b27417e4cfd952751e837d410.png" alt="Car" style={imageStyle} />
          </div>
        </div>

        <div style={rightStyle}>
          <div style={powerDisplayStyle}>
            <div style={powerAmountStyle}>{formatCurrency(buyingPower)}</div>
            <div style={powerLabelStyle}>Est. buying power</div>
            <div style={powerAprStyle}>Based on {getAPR()}% APR</div>
          </div>

          <div style={inputsStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Looking for</label>
              <select style={selectStyle} value={carType} onChange={(e) => setCarType(e.target.value as CarType)}>
                <option value="New car">New car</option>
                <option value="Used car">Used car</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Down payment</label>
              <div style={inputWrapperStyle}>
                <span style={currencyStyle}>$</span>
                <input type="text" style={inputStyle} value={downPayment} onChange={(e) => setDownPayment(e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" />
              </div>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Credit score</label>
              <select style={selectStyle} value={creditScore} onChange={(e) => setCreditScore(e.target.value as CreditScore)}>
                <option value="Excellent (740+)">Excellent (740+)</option>
                <option value="Good (670-739)">Good (670-739)</option>
                <option value="Fair (580-669)">Fair (580-669)</option>
                <option value="Poor (Below 580)">Poor (Below 580)</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Monthly payment</label>
              <div style={inputWrapperStyle}>
                <span style={currencyStyle}>$</span>
                <input type="text" style={inputStyle} value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" />
              </div>
            </div>
          </div>

          <div style={tradeInStyle}>
            <label style={toggleLabelStyle}>
              <input type="checkbox" className="kyb-toggle" checked={includeTradeIn} onChange={(e) => setIncludeTradeIn(e.target.checked)} />
              <span style={toggleTextStyle}>Include trade-in</span>
            </label>
          </div>

          <button style={ctaStyle} onClick={handleSeeMatches} onMouseEnter={() => setIsCtaHovered(true)} onMouseLeave={() => setIsCtaHovered(false)}>
            See your matches
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowYourBudget;
