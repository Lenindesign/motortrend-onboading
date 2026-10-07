import React, { useEffect, useState } from 'react';
import { ModalShell } from '../atoms/ModalShell';
import Icon from '../Icon';
import { Button, TextField } from '../../design-system/components';
import {
  getPriceAlertSignup,
  notifyPriceAlertSignup,
  signUpForPriceAlert,
} from '../../utils/priceAlerts';
import { useAuth } from '../../contexts/AuthContext';
import './PriceAlertsModal.css';

export interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Vehicle name for context e.g. "2025 Honda Accord" */
  vehicleName?: string;
  /** Called after the alert has been created successfully */
  onSignedUp?: () => void;
}

export const PriceAlertsModal: React.FC<PriceAlertsModalProps> = ({
  isOpen,
  onClose,
  vehicleName,
  onSignedUp,
}) => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const savedSignup = getPriceAlertSignup();
    setEmail(savedSignup?.email ?? '');
    setZip(savedSignup?.zip ?? '');
    setSubmitted(false);
    setError('');
  }, [isOpen, vehicleName]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedZip = zip.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Enter a valid email address to continue.');
      return;
    }
    if (!/^\d{5}$/.test(trimmedZip)) {
      setError('Enter a valid 5-digit ZIP code to find local offers.');
      return;
    }
    const vehicle = vehicleName?.trim() || 'this vehicle';
    setIsSubmitting(true);
    try {
      const configured = await notifyPriceAlertSignup(
        vehicle,
        trimmedEmail,
        trimmedZip,
        user && !user.isAnonymous ? user.id : undefined,
      );
      if (!configured) {
        setError('We couldn’t set up your alerts right now. Please try again shortly.');
        return;
      }

      signUpForPriceAlert(vehicle, trimmedEmail, trimmedZip);
      setSubmitted(true);
      onSignedUp?.();
      window.setTimeout(() => {
        onClose();
      }, 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  const vehicleLabel = vehicleName ? ` for ${vehicleName}` : '';

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="480px" ariaLabelledBy="price-alerts-title">
      <div className="price-alerts-modal">
        <header className="price-alerts-modal__header">
          <h2 id="price-alerts-title">Get price alerts{vehicleLabel}</h2>
        </header>
        <p className="price-alerts-modal__intro">
          Get emailed when new deals become available for this vehicle, including incentives, cash offers, and lease deals. No account is required.
        </p>

        {submitted ? (
          <div className="price-alerts-modal__success" role="status" aria-live="polite">
            <Icon name="check_circle" size={24} />
            <span>Your deal alerts are set for {vehicleName || 'this vehicle'}.</span>
          </div>
        ) : (
          <form className="price-alerts-modal__form" onSubmit={handleSubmit} noValidate>
            <TextField
              className="price-alerts-modal__field"
              label={<>Email address <span aria-hidden="true">*</span></>}
              id="price-alert-email"
              aria-label="Email address"
              aria-describedby={error ? 'price-alert-error' : undefined}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              fullWidth
            />

            <TextField
              className="price-alerts-modal__field"
              label={<>ZIP code <span aria-hidden="true">*</span></>}
              id="price-alert-zip"
              aria-label="ZIP code"
              aria-describedby={error ? 'price-alert-error' : 'price-alert-zip-help'}
              type="text"
              inputMode="numeric"
              value={zip}
              onChange={(event) => setZip(event.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="12345"
              autoComplete="postal-code"
              maxLength={5}
              required
              helperText={<span id="price-alert-zip-help">Used to find offers available near you.</span>}
              fullWidth
            />

            {error && <p className="price-alerts-modal__error" id="price-alert-error" role="alert">{error}</p>}

            <Button
              className="price-alerts-modal__submit"
              type="submit"
              color="primary"
              size="large"
              fullWidth
              disabled={isSubmitting}
              icon={<Icon name="notifications" variant="filled" size={20} />}
              style={{ height: '48px' }}
            >
              {isSubmitting ? 'Setting up alerts…' : 'Get price alerts'}
            </Button>
          </form>
        )}

      </div>
    </ModalShell>
  );
};

export default PriceAlertsModal;
