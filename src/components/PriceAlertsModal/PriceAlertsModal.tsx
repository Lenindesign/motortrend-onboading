/**
 * Price Alerts Modal – MVP
 * Sign up for price/incentive alerts for a vehicle. Option to just get emails or register for community.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalShell } from '../atoms/ModalShell';
import Icon from '../Icon';
import { signUpForPriceAlert } from '../../utils/priceAlerts';

export interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Vehicle name for context e.g. "2025 Honda Accord" */
  vehicleName?: string;
  /** Called after successful signup (so parent can refresh state) */
  onSignedUp?: () => void;
}

export const PriceAlertsModal: React.FC<PriceAlertsModalProps> = ({
  isOpen,
  onClose,
  vehicleName,
  onSignedUp,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    const vehicle = vehicleName?.trim() || 'this vehicle';
    signUpForPriceAlert(vehicle, trimmed, zip.trim() || undefined);
    setSubmitted(true);
    onSignedUp?.();
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setEmail('');
      setZip('');
    }, 1800);
  };

  const handleRegisterAndAlerts = () => {
    onClose();
    navigate('/signin?intent=register&returnUrl=' + encodeURIComponent(window.location.pathname));
  };

  const title = vehicleName ? `Price alerts for ${vehicleName}` : 'Price alerts';
  const subtitle = vehicleName
    ? `We'll email you when prices or incentives change for this vehicle.`
    : `We'll email you when prices or incentives change for your saved vehicles.`;

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} width="440px">
      <div style={{ padding: '28px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: 'var(--border-radius-md, 8px)',
            background: 'rgba(233, 12, 23, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="notifications" size={24} style={{ color: 'var(--color-primary-1, #E90C17)' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 700, fontSize: '20px',
            color: 'var(--color-neutrals-1, #141416)', margin: 0,
          }}>
            {title}
          </h2>
        </div>
        <p style={{
          fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '14px', lineHeight: 1.5,
          color: 'var(--color-neutrals-4, #6E7481)', margin: '0 0 24px',
        }}>
          {subtitle}
        </p>

        {submitted ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
            background: 'rgba(0, 128, 0, 0.08)', borderRadius: 'var(--border-radius-md, 8px)',
            color: 'var(--color-semantic-success, #0A7B0A)',
          }}>
            <Icon name="check_circle" size={24} />
            <span style={{ fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 600 }}>You're signed up for price alerts.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="price-alert-email" style={{
                display: 'block', fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '12px', fontWeight: 600,
                color: 'var(--color-neutrals-3, #353945)', marginBottom: '6px',
              }}>
                Email address <span style={{ color: 'var(--color-primary-1)' }}>*</span>
              </label>
              <input
                id="price-alert-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                style={{
                  width: '100%', padding: '12px 14px', fontFamily: 'var(--font-body, Geist, sans-serif)',
                  fontSize: '14px', color: 'var(--color-neutrals-1, #141416)', backgroundColor: 'var(--color-white, #FFFFFF)',
                  border: '1px solid var(--color-neutrals-6, #E6E8EC)',
                  borderRadius: 'var(--border-radius-md, 8px)', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="price-alert-zip" style={{
                display: 'block', fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '12px', fontWeight: 600,
                color: 'var(--color-neutrals-3, #353945)', marginBottom: '6px',
              }}>
                Zip code <span style={{ color: 'var(--color-neutrals-5)', fontWeight: 400 }}>(optional, for local incentives)</span>
              </label>
              <input
                id="price-alert-zip"
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="12345"
                maxLength={5}
                style={{
                  width: '100%', padding: '12px 14px', fontFamily: 'var(--font-body, Geist, sans-serif)',
                  fontSize: '14px', color: 'var(--color-neutrals-1, #141416)', backgroundColor: 'var(--color-white, #FFFFFF)',
                  border: '1px solid var(--color-neutrals-6, #E6E8EC)',
                  borderRadius: 'var(--border-radius-md, 8px)', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            {error && (
              <p style={{ color: 'var(--color-primary-1)', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
            )}
            <button
              type="submit"
              style={{
                width: '100%', padding: '14px', background: 'var(--color-neutrals-1, #141416)', color: 'white',
                border: 'none', borderRadius: 'var(--border-radius-md, 8px)',
                fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 600, fontSize: '14px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <Icon name="notifications" size={20} />
              Get price alerts
            </button>
          </form>
        )}

        {!submitted && (
          <p style={{
            fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '13px', color: 'var(--color-neutrals-4, #6E7481)',
            marginTop: '20px', textAlign: 'center',
          }}>
            Or{' '}
            <button
              type="button"
              onClick={handleRegisterAndAlerts}
              style={{
                background: 'none', border: 'none', padding: 0, color: 'var(--color-primary-1)', fontWeight: 600,
                cursor: 'pointer', textDecoration: 'underline',
              }}
            >
              register for community & get price alerts
            </button>
          </p>
        )}
      </div>
    </ModalShell>
  );
};

export default PriceAlertsModal;
