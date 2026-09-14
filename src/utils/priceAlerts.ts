/**
 * Price Alerts / Price Locker – MVP
 * Persists signups in localStorage for vehicles the user wants price/incentive alerts for.
 */

const STORAGE_KEY = 'priceAlertSignups';

export interface PriceAlertSignup {
  email: string;
  zip?: string;
  vehicles: string[];
  updatedAt: string;
}

export async function notifyPriceAlertSignup(
  vehicleName: string,
  email: string,
  zip?: string,
  subscriberId?: string,
): Promise<boolean> {
  try {
    const response = await fetch('/api/price-alert-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscriberId: subscriberId || import.meta.env.VITE_NOVU_SUBSCRIBER_ID || '6aa4b90867ef7f19e018b5c6',
        email,
        vehicleName,
        zip,
        destination: window.location.pathname,
      }),
    });
    if (!response.ok) return false;
    const result = await response.json() as { configured?: boolean };
    return result.configured === true;
  } catch (error) {
    console.warn('Price alert notification could not be sent:', error);
    return false;
  }
}

function getStored(): PriceAlertSignup | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error reading price alert signups:', e);
    return null;
  }
}

function setStored(data: PriceAlertSignup): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('priceAlertsUpdated'));
  } catch (e) {
    console.error('Error saving price alert signups:', e);
  }
}

/** Check if user has price alerts for a vehicle (by name) */
export function hasPriceAlert(vehicleName: string): boolean {
  const data = getStored();
  return data?.vehicles?.includes(vehicleName) ?? false;
}

/** Get all vehicles the user has signed up for price alerts */
export function getPriceAlertVehicles(): string[] {
  const data = getStored();
  return data?.vehicles ?? [];
}

/** Get full signup record (email, zip, vehicles) */
export function getPriceAlertSignup(): PriceAlertSignup | null {
  return getStored();
}

/** Sign up for price alerts for a vehicle. If email provided, update stored email. */
export function signUpForPriceAlert(vehicleName: string, email: string, zip?: string): void {
  const current = getStored();
  const vehicles = current?.vehicles ?? [];
  if (vehicles.includes(vehicleName)) {
    setStored({
      email: email || (current?.email ?? ''),
      zip: zip ?? current?.zip,
      vehicles,
      updatedAt: new Date().toISOString(),
    });
    return;
  }
  setStored({
    email: email || (current?.email ?? ''),
    zip: zip ?? current?.zip,
    vehicles: [...vehicles, vehicleName],
    updatedAt: new Date().toISOString(),
  });
}

/** Remove price alert for a vehicle */
export function removePriceAlert(vehicleName: string): void {
  const current = getStored();
  if (!current?.vehicles?.length) return;
  const vehicles = current.vehicles.filter((v) => v !== vehicleName);
  if (vehicles.length === 0) {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('priceAlertsUpdated'));
    } catch (e) {
      console.error('Error removing price alerts:', e);
    }
    return;
  }
  setStored({
    ...current,
    vehicles,
    updatedAt: new Date().toISOString(),
  });
}

/** Toggle price alert for a vehicle; returns new state (true = now has alert) */
export function togglePriceAlert(vehicleName: string, email: string, zip?: string): boolean {
  if (hasPriceAlert(vehicleName)) {
    removePriceAlert(vehicleName);
    return false;
  }
  signUpForPriceAlert(vehicleName, email, zip);
  return true;
}
