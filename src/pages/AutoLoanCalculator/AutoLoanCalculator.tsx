import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookmarkSimple,
  Car,
  CarProfile,
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
  CheckCircle,
  CurrencyDollar,
  Info,
  MagnifyingGlass,
  SkipForward,
  WarningCircle,
} from '@phosphor-icons/react';
import { Button, CardShell, Section, TextField } from '../../design-system/components';
import {
  getVehicleBySlug,
  getVehicles,
  searchVehicles,
  type Vehicle,
} from '../../api/vehiclesApi';
import './AutoLoanCalculator.css';

type StartMode = 'price' | 'monthly';
type VehicleCondition = 'new' | 'used';
type CalculatorStepSlug = 'loan-terms' | 'vehicle' | 'trade' | 'review';
type VehiclePathMode = 'known' | 'browsing';
type SelectedState = 'CA' | 'FL' | 'TX' | 'NY' | 'IL';
type BrowsableBodyStyle = 'SUV' | 'Sedan' | 'Truck' | 'Coupe' | 'Hatchback' | 'Wagon' | 'Convertible';
type EstimateAccordionKey = 'totalInterest' | 'netTrade' | 'taxesFees';

interface StepMeta {
  slug: '' | CalculatorStepSlug;
  label: string;
  title: string;
  copy: string;
  optional?: boolean;
}

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

const BASE_PATH = '/auto-loan-calculator';

const steps: StepMeta[] = [
  {
    slug: '',
    label: 'Budget',
    title: 'Choose your starting point',
    copy: 'Start with either a target vehicle price or the monthly payment you want to protect.',
  },
  {
    slug: 'loan-terms',
    label: 'Loan Terms',
    title: 'Adjust your financing assumptions',
    copy: 'Down payment, rate, and loan term are the biggest levers on the monthly number.',
  },
  {
    slug: 'vehicle',
    label: 'Vehicle',
    title: 'Pick a vehicle',
    copy: 'Know exactly what you want, or just have a vehicle type in mind? Either works. You can also skip this and refine it later.',
    optional: true,
  },
  {
    slug: 'trade',
    label: 'Trade & Fees',
    title: 'Trade-in, taxes & fees',
    copy: 'Add your trade-in details and state for a more accurate estimate.',
  },
  {
    slug: 'review',
    label: 'Estimate',
    title: 'Your MotorTrend payment estimate',
    copy: 'Use this as your planning snapshot, then shop the vehicles that fit the number.',
  },
];

const stateOptions: SelectOption<SelectedState>[] = [
  { value: 'CA', label: 'California' },
  { value: 'FL', label: 'Florida' },
  { value: 'TX', label: 'Texas' },
  { value: 'NY', label: 'New York' },
  { value: 'IL', label: 'Illinois' },
];

const salesTaxRates: Record<SelectedState, number> = {
  CA: 0.0725,
  FL: 0.06,
  TX: 0.0625,
  NY: 0.04,
  IL: 0.0625,
};

const feeGuidanceCopy: Record<SelectedState, string> = {
  CA: 'Registration, title, and dealer fees can run higher here. Use your best local estimate if you already have one.',
  FL: 'Registration, title, and dealer fees vary by county and retailer. Treat this as planning guidance only.',
  TX: 'Dealer fees, title, and registration can still move the out-the-door number. Adjust this if you have a local quote.',
  NY: 'Taxes may be lower than some states, but title, registration, and doc fees still matter for the final estimate.',
  IL: 'This is a good planning placeholder for registration and dealer charges before you have a written quote.',
};

const bodyStyleMap: Record<BrowsableBodyStyle, { label: string; iconSrc: string; description: string }> = {
  SUV: {
    label: 'SUV',
    iconSrc: '/images/body-style-icons/suv.svg',
    description: 'Family haulers, adventure rigs, and compact crossovers.',
  },
  Sedan: {
    label: 'Sedan',
    iconSrc: '/images/body-style-icons/sedan.svg',
    description: 'Efficient commuters and sharper sport sedans.',
  },
  Truck: {
    label: 'Truck',
    iconSrc: '/images/body-style-icons/truck.svg',
    description: 'Pickups, tow rigs, and work-ready options.',
  },
  Coupe: {
    label: 'Coupe',
    iconSrc: '/images/body-style-icons/coupe.svg',
    description: 'Two-door performance, style, and halo cars.',
  },
  Hatchback: {
    label: 'Hatchback',
    iconSrc: '/images/body-style-icons/hatchback.svg',
    description: 'Compact, practical, and often electrified picks.',
  },
  Wagon: {
    label: 'Wagon',
    iconSrc: '/images/body-style-icons/van.svg',
    description: 'Long-roof utility with a lower stance.',
  },
  Convertible: {
    label: 'Convertible',
    iconSrc: '/images/body-style-icons/convertible.svg',
    description: 'Top-down weekend and premium cruising options.',
  },
};

const browsableBodyStyles = Object.keys(bodyStyleMap) as BrowsableBodyStyle[];

const defaultVehicleSlug = '2026/Honda/CR-V';

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return moneyFormatter.format(Math.round(value));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function parseNumericInput(value: string) {
  const numeric = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
}

function calculateLoanPayment(principal: number, apr: number, termMonths: number) {
  if (principal <= 0) return 0;
  const monthlyRate = apr / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
}

function calculatePrincipalFromBudget(monthlyBudget: number, apr: number, termMonths: number) {
  if (monthlyBudget <= 0) return 0;
  const monthlyRate = apr / 100 / 12;
  if (monthlyRate === 0) return monthlyBudget * termMonths;
  return monthlyBudget * ((1 - Math.pow(1 + monthlyRate, -termMonths)) / monthlyRate);
}

function getStepIndex(stepSlug?: string) {
  if (!stepSlug) return 0;
  const index = steps.findIndex((step) => step.slug === stepSlug);
  return index >= 0 ? index : 0;
}

function getStepPath(stepIndex: number) {
  const step = steps[clamp(stepIndex, 0, steps.length - 1)];
  return step.slug ? `${BASE_PATH}/${step.slug}` : BASE_PATH;
}

function formatTermLabel(termMonths: number) {
  return `${termMonths} mo`;
}

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: React.ReactNode;
  value: T;
  onChange: (nextValue: T) => void;
  options: SelectOption<T>[];
}) {
  return (
    <label className="mt-loan-calc__select-field">
      <span className="mt-loan-calc__field-label">{label}</span>
      <span className="mt-loan-calc__select-wrap">
        <select value={value} onChange={(event) => onChange(event.target.value as T)} className="mt-loan-calc__select">
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <CaretDown size={18} weight="bold" aria-hidden />
      </span>
    </label>
  );
}

function FieldLabelWithInfo({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-loan-calc__field-label-inline">
      {children}
      <Info size={18} weight="regular" aria-hidden />
    </span>
  );
}

export const AutoLoanCalculator: React.FC = () => {
  const navigate = useNavigate();
  const { stepSlug } = useParams<{ stepSlug?: CalculatorStepSlug }>();
  const [startMode, setStartMode] = useState<StartMode>('price');
  const [vehiclePrice, setVehiclePrice] = useState('30000');
  const [monthlyBudget, setMonthlyBudget] = useState('592');
  const [downPayment, setDownPayment] = useState('3000');
  const [apr, setApr] = useState('7.0');
  const [condition, setCondition] = useState<VehicleCondition>('new');
  const [loanTerm, setLoanTerm] = useState(60);
  const [vehiclePathMode, setVehiclePathMode] = useState<VehiclePathMode>('known');
  const [vehicleSearch, setVehicleSearch] = useState('2026 Honda CR-V');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);
  const [selectedVehicleSlug, setSelectedVehicleSlug] = useState(defaultVehicleSlug);
  const [browsedBodyStyle, setBrowsedBodyStyle] = useState<BrowsableBodyStyle>('SUV');
  const [tradeInValue, setTradeInValue] = useState('0');
  const [amountOwed, setAmountOwed] = useState('0');
  const [selectedState, setSelectedState] = useState<SelectedState>('CA');
  const [salesTaxPercent, setSalesTaxPercent] = useState((salesTaxRates.CA * 100).toFixed(2));
  const [fees, setFees] = useState('1073');
  const [includeFeesInLoan, setIncludeFeesInLoan] = useState(true);
  const [openEstimateAccordions, setOpenEstimateAccordions] = useState<Record<EstimateAccordionKey, boolean>>({
    totalInterest: false,
    netTrade: false,
    taxesFees: false,
  });
  const searchMenuRef = useRef<HTMLDivElement | null>(null);
  const bodyStyleCarouselRef = useRef<HTMLDivElement | null>(null);
  const shellTopRef = useRef<HTMLDivElement | null>(null);

  const stepIndex = getStepIndex(stepSlug);
  const previousStepIndexRef = useRef(stepIndex);
  const currentStep = steps[stepIndex];
  const allVehicles = useMemo(() => getVehicles({ useApiOnly: true }), []);

  const selectedVehicle = useMemo(() => {
    return getVehicleBySlug(selectedVehicleSlug) ?? allVehicles[0];
  }, [allVehicles, selectedVehicleSlug]);

  useEffect(() => {
    setSalesTaxPercent((salesTaxRates[selectedState] * 100).toFixed(2));
  }, [selectedState]);

  useEffect(() => {
    const previousStepIndex = previousStepIndexRef.current;
    previousStepIndexRef.current = stepIndex;

    if (previousStepIndex === stepIndex && stepIndex === 0) return undefined;
    if (!shellTopRef.current) return undefined;

    const frame = window.requestAnimationFrame(() => {
      if (!shellTopRef.current) return;
      const shellTop = shellTopRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: shellTop, behavior: 'auto' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [stepIndex]);

  useEffect(() => {
    if (!showSearchResults) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) return;
      if (searchMenuRef.current?.contains(event.target)) return;
      setShowSearchResults(false);
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchResults]);

  const aprValue = clamp(parseNumericInput(apr), 0, 20);
  const priceValue = clamp(parseNumericInput(vehiclePrice), 5000, 120000);
  const monthlyBudgetValue = clamp(parseNumericInput(monthlyBudget), 150, 1800);
  const downPaymentValue = clamp(parseNumericInput(downPayment), 0, 25000);
  const tradeInValueNumber = parseNumericInput(tradeInValue);
  const amountOwedNumber = parseNumericInput(amountOwed);
  const netTradeIn = tradeInValueNumber - amountOwedNumber;
  const feesValue = parseNumericInput(fees);
  const salesTaxRate = clamp(parseNumericInput(salesTaxPercent), 0, 20) / 100;

  const derived = useMemo(() => {
    const rawPrice = startMode === 'price'
      ? priceValue
      : Math.max(
          5000,
          calculatePrincipalFromBudget(monthlyBudgetValue, aprValue, loanTerm)
            - (includeFeesInLoan ? feesValue + priceValue * salesTaxRate : 0)
            + downPaymentValue
            + Math.max(netTradeIn, 0),
        );

    const targetVehiclePrice = clamp(rawPrice, 5000, 120000);
    const taxes = Math.max(targetVehiclePrice - Math.max(netTradeIn, 0), 0) * salesTaxRate;
    const taxesAndFees = taxes + feesValue;
    const financedPrincipal = Math.max(
      targetVehiclePrice
        - downPaymentValue
        - Math.max(netTradeIn, 0)
        + (includeFeesInLoan ? taxesAndFees : 0)
        + Math.max(-netTradeIn, 0),
      0,
    );
    const monthlyPayment = calculateLoanPayment(financedPrincipal, aprValue, loanTerm);
    const totalLoanPayments = monthlyPayment * loanTerm;
    const totalInterestPaid = Math.max(totalLoanPayments - financedPrincipal, 0);
    const cashDueAtSigning = downPaymentValue + (includeFeesInLoan ? 0 : taxesAndFees);
    const totalPaid = totalLoanPayments + cashDueAtSigning;
    const monthlyDelta = monthlyPayment - monthlyBudgetValue;

    return {
      targetVehiclePrice,
      taxes,
      taxesAndFees,
      financedPrincipal,
      monthlyPayment,
      totalLoanPayments,
      totalInterestPaid,
      cashDueAtSigning,
      totalPaid,
      monthlyDelta,
      negativeEquity: Math.max(amountOwedNumber - tradeInValueNumber, 0),
    };
  }, [
    amountOwedNumber,
    aprValue,
    downPaymentValue,
    feesValue,
    includeFeesInLoan,
    loanTerm,
    monthlyBudgetValue,
    netTradeIn,
    priceValue,
    salesTaxRate,
    startMode,
    tradeInValueNumber,
  ]);

  const searchResults = useMemo(() => {
    if (vehicleSearch.trim().length < 2) return [];
    return searchVehicles(vehicleSearch, 8);
  }, [vehicleSearch]);

  const matchedBrowseVehicles = useMemo(() => {
    const pool = getVehicles({
      useApiOnly: true,
      bodyStyle: [browsedBodyStyle],
      sortBy: 'rating',
      sortOrder: 'desc',
    });

    return pool
      .filter((vehicle) => vehicle.priceMin <= derived.targetVehiclePrice * 1.2)
      .slice(0, 4);
  }, [browsedBodyStyle, derived.targetVehiclePrice]);

  const selectedBrowseVehicles = useMemo(() => {
    return matchedBrowseVehicles.map((vehicle) => ({
      vehicle,
      isInRange: vehicle.priceMin <= derived.targetVehiclePrice,
      estimatedMonthly: calculateLoanPayment(
        Math.max(
          vehicle.priceMin
            - downPaymentValue
            - Math.max(netTradeIn, 0)
            + (includeFeesInLoan ? vehicle.priceMin * salesTaxRate + feesValue : 0)
            + Math.max(-netTradeIn, 0),
          0,
        ),
        aprValue,
        loanTerm,
      ),
    }));
  }, [
    aprValue,
    derived.targetVehiclePrice,
    downPaymentValue,
    feesValue,
    includeFeesInLoan,
    loanTerm,
    matchedBrowseVehicles,
    netTradeIn,
    salesTaxRate,
  ]);

  const reviewVehicleCards = useMemo(() => {
    const sourceVehicles = selectedBrowseVehicles.length > 0
      ? selectedBrowseVehicles.map(({ vehicle, estimatedMonthly }) => ({ vehicle, estimatedMonthly }))
      : allVehicles.slice(0, 4).map((vehicle) => ({
          vehicle,
          estimatedMonthly: calculateLoanPayment(
            Math.max(
              vehicle.priceMin
                - downPaymentValue
                - Math.max(netTradeIn, 0)
                + (includeFeesInLoan ? vehicle.priceMin * salesTaxRate + feesValue : 0)
                + Math.max(-netTradeIn, 0),
              0,
            ),
            aprValue,
            loanTerm,
          ),
        }));

    return sourceVehicles.slice(0, 4);
  }, [allVehicles, aprValue, downPaymentValue, feesValue, includeFeesInLoan, loanTerm, netTradeIn, salesTaxRate, selectedBrowseVehicles]);

  const amortizationRows = useMemo(() => {
    let balance = derived.financedPrincipal;
    const monthlyRate = aprValue / 100 / 12;

    return Array.from({ length: Math.min(5, Math.ceil(loanTerm / 12)) }, (_, index) => {
      let principalPaid = 0;
      let interestPaid = 0;
      const monthsInYear = Math.min(12, loanTerm - index * 12);

      for (let month = 0; month < monthsInYear; month += 1) {
        const interest = monthlyRate > 0 ? balance * monthlyRate : 0;
        const principal = Math.min(derived.monthlyPayment - interest, balance);
        interestPaid += interest;
        principalPaid += principal;
        balance = Math.max(balance - principal, 0);
      }

      return {
        year: `Year ${index + 1}`,
        principal: principalPaid,
        interest: interestPaid,
        balance,
      };
    });
  }, [aprValue, derived.financedPrincipal, derived.monthlyPayment, loanTerm]);

  const sidebarCopy = startMode === 'monthly'
    ? `Based on a ${formatCurrency(monthlyBudgetValue)} target payment, ${loanTerm} months, and ${aprValue.toFixed(1)}% APR.`
    : `Based on a ${formatCurrency(derived.targetVehiclePrice)} target vehicle price, ${loanTerm} months, and ${aprValue.toFixed(1)}% APR.`;

  const selectedVehicleLabel = selectedVehicle
    ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
    : 'No vehicle selected';
  const selectedVehiclePath = selectedVehicle
    ? `/vehicles/${encodeURIComponent(selectedVehicle.year)}/${encodeURIComponent(selectedVehicle.make)}/${encodeURIComponent(selectedVehicle.model)}`
    : '/vehicles';

  const handleSelectedVehicleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return;
    }

    event.preventDefault();
    navigate(selectedVehiclePath);
  };

  const goToStep = (nextIndex: number) => {
    navigate(getStepPath(nextIndex));
  };

  const handleContinue = () => {
    if (stepIndex < steps.length - 1) {
      goToStep(stepIndex + 1);
      return;
    }

    const params = new URLSearchParams();
    params.set('priceMax', String(Math.round(derived.targetVehiclePrice)));
    params.set('vehicleType', condition);
    if (vehiclePathMode === 'browsing') {
      params.set('bodyStyle', browsedBodyStyle);
    } else if (selectedVehicle) {
      params.set('search', `${selectedVehicle.make} ${selectedVehicle.model}`);
    }
    navigate(`/vehicles?${params.toString()}`);
  };

  const handleBack = () => {
    if (stepIndex === 0) return;
    goToStep(stepIndex - 1);
  };

  const applySearchResult = (vehicle: Vehicle) => {
    setSelectedVehicleSlug(vehicle.slug);
    setVehicleSearch(`${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    setShowSearchResults(false);
  };

  const scrollBodyStyleCarousel = (direction: -1 | 1) => {
    const carousel = bodyStyleCarouselRef.current;
    if (!carousel) return;

    const firstTile = carousel.querySelector<HTMLElement>('.mt-loan-calc__body-style-tile');
    const scrollAmount = firstTile ? firstTile.offsetWidth + 14 : 240;
    carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  };

  const toggleEstimateAccordion = (section: EstimateAccordionKey) => {
    setOpenEstimateAccordions((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const renderBudgetStep = () => (
    <>
      <div className="mt-loan-calc__choice-grid">
        <button
          type="button"
          className={`mt-loan-calc__choice-card${startMode === 'price' ? ' is-active' : ''}`}
          onClick={() => setStartMode('price')}
        >
          <span className="mt-loan-calc__choice-icon">
            <Car size={18} weight="regular" aria-hidden />
          </span>
          <span className="mt-loan-calc__choice-title">Start with vehicle price</span>
          <span className="mt-loan-calc__choice-copy">
            We&apos;ll use this price as your budget target throughout the experience.
          </span>
        </button>

        <button
          type="button"
          className={`mt-loan-calc__choice-card${startMode === 'monthly' ? ' is-active' : ''}`}
          onClick={() => setStartMode('monthly')}
        >
          <span className="mt-loan-calc__choice-icon">
            <CurrencyDollar size={18} weight="regular" aria-hidden />
          </span>
          <span className="mt-loan-calc__choice-title">Start with monthly budget</span>
          <span className="mt-loan-calc__choice-copy">
            Your monthly payment helps estimate a vehicle budget.
          </span>
        </button>
      </div>

      <div className="mt-loan-calc__budget-panel">
        {startMode === 'price' ? (
          <>
            <TextField
              fullWidth
              label="Vehicle price target"
              value={String(priceValue)}
              inputMode="numeric"
              onChange={(event) => setVehiclePrice(event.target.value.replace(/[^0-9]/g, ''))}
              helperText="We’ll use this price as your budget target throughout the experience."
            />
            <div className="mt-loan-calc__slider-block">
              <input
                type="range"
                min="5000"
                max="120000"
                step="500"
                value={priceValue}
                onChange={(event) => setVehiclePrice(event.target.value)}
                className="mt-loan-calc__slider"
              />
              <div className="mt-loan-calc__slider-scale">
                <span>$5,000</span>
                <span>$120,000</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label="Monthly payment target"
              value={String(monthlyBudgetValue)}
              inputMode="numeric"
              onChange={(event) => setMonthlyBudget(event.target.value.replace(/[^0-9]/g, ''))}
              helperText="Your monthly payment helps estimate a vehicle budget."
            />
            <div className="mt-loan-calc__slider-block">
              <input
                type="range"
                min="150"
                max="1800"
                step="10"
                value={monthlyBudgetValue}
                onChange={(event) => setMonthlyBudget(event.target.value)}
                className="mt-loan-calc__slider"
              />
              <div className="mt-loan-calc__slider-scale">
                <span>$150/mo</span>
                <span>$1,800/mo</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );

  const renderLoanTermsStep = () => (
    <div className="mt-loan-calc__step-stack mt-loan-calc__step-stack--loan">
      <div className="mt-loan-calc__loan-control">
        <div className="mt-loan-calc__control-head">
          <FieldLabelWithInfo>Down payment</FieldLabelWithInfo>
          <strong>{formatCurrency(downPaymentValue)}</strong>
        </div>
        <TextField
          fullWidth
          value={String(downPaymentValue)}
          inputMode="numeric"
          icon={<CurrencyDollar size={16} weight="bold" aria-hidden />}
          iconPosition="left"
          onChange={(event) => setDownPayment(event.target.value.replace(/[^0-9]/g, ''))}
          helperText={`${formatCurrency(downPaymentValue)} down upfront.`}
        />
        <input
          type="range"
          min="0"
          max="25000"
          step="500"
          value={downPaymentValue}
          onChange={(event) => setDownPayment(event.target.value)}
          className="mt-loan-calc__slider"
        />
        <div className="mt-loan-calc__slider-scale">
          <span>$0</span>
          <span>$25,000</span>
        </div>
      </div>

      <div className="mt-loan-calc__loan-control">
        <div className="mt-loan-calc__control-head">
          <FieldLabelWithInfo>Interest rate (APR)</FieldLabelWithInfo>
          <strong>{aprValue.toFixed(1)}%</strong>
        </div>
        <TextField
          fullWidth
          value={aprValue.toFixed(1)}
          inputMode="decimal"
          onChange={(event) => setApr(event.target.value.replace(/[^0-9.]/g, ''))}
          helperText={`Planning range only. Current estimate uses ${aprValue.toFixed(1)}% APR.`}
        />
        <input
          type="range"
          min="0"
          max="20"
          step="0.1"
          value={aprValue}
          onChange={(event) => setApr(event.target.value)}
          className="mt-loan-calc__slider"
        />
        <div className="mt-loan-calc__slider-scale">
          <span>0%</span>
          <span>20%</span>
        </div>
      </div>

      <div className="mt-loan-calc__loan-control">
        <div className="mt-loan-calc__control-head">
          <FieldLabelWithInfo>Loan term</FieldLabelWithInfo>
        </div>
        <div className="mt-loan-calc__term-row mt-loan-calc__term-row--wide">
          {[12, 24, 36, 48, 60, 72, 84].map((term) => (
            <button
              key={term}
              type="button"
              className={`mt-loan-calc__term-pill${loanTerm === term ? ' is-active' : ''}`}
              onClick={() => setLoanTerm(term)}
            >
              {formatTermLabel(term)}
            </button>
          ))}
        </div>
        {startMode === 'monthly' && (
          <p className="mt-loan-calc__mode-note">
            Because your monthly budget stays fixed, a lower APR can increase the vehicle price your budget supports instead of lowering the payment.
          </p>
        )}
        {loanTerm >= 72 && (
          <p className="mt-loan-calc__warning-note">
            Longer loans can lower the payment, but they usually increase total interest and negative-equity risk.
          </p>
        )}
      </div>
    </div>
  );

  const renderVehicleStep = () => (
    <div className="mt-loan-calc__step-stack mt-loan-calc__step-stack--vehicle">
      <div className="mt-loan-calc__vehicle-path-grid">
        <button
          type="button"
          className={`mt-loan-calc__vehicle-path-card${vehiclePathMode === 'known' ? ' is-active' : ''}`}
          onClick={() => setVehiclePathMode('known')}
        >
          <span className="mt-loan-calc__choice-icon">
            <MagnifyingGlass size={18} weight="regular" aria-hidden />
          </span>
          <span className="mt-loan-calc__choice-title">I Have a Vehicle in Mind</span>
          <span className="mt-loan-calc__choice-copy">Choose a year, make, and model to anchor the estimate.</span>
        </button>

        <button
          type="button"
          className={`mt-loan-calc__vehicle-path-card${vehiclePathMode === 'browsing' ? ' is-active' : ''}`}
          onClick={() => setVehiclePathMode('browsing')}
        >
          <span className="mt-loan-calc__choice-icon">
            <CarProfile size={18} weight="regular" aria-hidden />
          </span>
          <span className="mt-loan-calc__choice-title">I Have a Preferred Vehicle Type</span>
          <span className="mt-loan-calc__choice-copy">Pick a category now and we’ll keep the estimate grounded in that inventory universe.</span>
        </button>
      </div>

      <div className="mt-loan-calc__vehicle-condition-section">
        <FieldLabelWithInfo>New or used</FieldLabelWithInfo>
        <div className="mt-loan-calc__condition-toggle mt-loan-calc__condition-toggle--split">
          {(['new', 'used'] as VehicleCondition[]).map((option) => (
            <button
              key={option}
              type="button"
              className={`mt-loan-calc__condition-chip${condition === option ? ' is-active' : ''}`}
              onClick={() => setCondition(option)}
            >
              {option === 'new' ? 'New car' : 'Used car'}
            </button>
          ))}
        </div>
      </div>

      {vehiclePathMode === 'known' ? (
        <div className="mt-loan-calc__vehicle-known-layout">
          <div className="mt-loan-calc__search-wrap" ref={searchMenuRef}>
            <TextField
              fullWidth
              label={<FieldLabelWithInfo>My next vehicle</FieldLabelWithInfo>}
              value={vehicleSearch}
              placeholder="Start typing year, make, or model"
              onFocus={() => setShowSearchResults(searchResults.length > 0)}
              onChange={(event) => {
                setVehicleSearch(event.target.value);
                setShowSearchResults(true);
                setActiveSearchIndex(0);
              }}
              onKeyDown={(event) => {
                if (!showSearchResults || searchResults.length === 0) return;

                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  setActiveSearchIndex((current) => Math.min(current + 1, searchResults.length - 1));
                }

                if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  setActiveSearchIndex((current) => Math.max(current - 1, 0));
                }

                if (event.key === 'Enter') {
                  event.preventDefault();
                  const nextVehicle = searchResults[activeSearchIndex];
                  if (nextVehicle) applySearchResult(nextVehicle);
                }
              }}
            />

            {showSearchResults && searchResults.length > 0 && (
              <div className="mt-loan-calc__search-results" role="listbox">
                {searchResults.map((vehicle, index) => (
                  <button
                    key={vehicle.slug}
                    type="button"
                    className={`mt-loan-calc__search-result${index === activeSearchIndex ? ' is-active' : ''}`}
                    onMouseEnter={() => setActiveSearchIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => applySearchResult(vehicle)}
                  >
                    <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong>
                    <span>{vehicle.bodyStyle} · {vehicle.priceRange}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            className="mt-loan-calc__selected-vehicle mt-loan-calc__selected-vehicle--compact"
            to={selectedVehiclePath}
            aria-label={selectedVehicle ? `View ${selectedVehicleLabel}` : 'View vehicles'}
            onClick={handleSelectedVehicleLinkClick}
          >
            {selectedVehicle?.image ? (
              <div className="mt-loan-calc__selected-vehicle-media" aria-hidden="true">
                <img
                  className="mt-loan-calc__selected-vehicle-image"
                  src={selectedVehicle.image}
                  alt=""
                />
              </div>
            ) : (
              <span className="mt-loan-calc__selected-vehicle-fallback" aria-hidden="true">
                Image unavailable
              </span>
            )}
            <div className="mt-loan-calc__selected-vehicle-copy">
              <span className="mt-loan-calc__review-label">
                {condition === 'new' ? 'Selected vehicle' : 'Used-vehicle context'}
              </span>
              <h2>{selectedVehicle ? selectedVehicleLabel : 'Choose a vehicle'}</h2>
            </div>
            <div className="mt-loan-calc__selected-vehicle-status">
              {selectedVehicle ? (
                <>
                  <span>Starting at</span>
                  <strong>{formatCurrency(selectedVehicle.priceMin)}</strong>
                </>
              ) : (
                <strong>Not selected</strong>
              )}
            </div>
          </Link>
        </div>
      ) : (
        <div className="mt-loan-calc__browse-layout">
          <div className="mt-loan-calc__body-style-carousel">
            <button
              type="button"
              className="mt-loan-calc__body-style-nav mt-loan-calc__body-style-nav--previous"
              aria-label="Previous body styles"
              onClick={() => scrollBodyStyleCarousel(-1)}
            >
              <CaretLeft size={18} weight="bold" aria-hidden />
            </button>
            <div className="mt-loan-calc__body-style-grid" ref={bodyStyleCarouselRef} role="list" aria-label="Vehicle body styles">
              {browsableBodyStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  className={`mt-loan-calc__body-style-tile${browsedBodyStyle === style ? ' is-active' : ''}`}
                  aria-pressed={browsedBodyStyle === style}
                  onClick={() => setBrowsedBodyStyle(style)}
                >
                  <img
                    className="mt-loan-calc__body-style-icon"
                    src={bodyStyleMap[style].iconSrc}
                    alt=""
                    aria-hidden="true"
                  />
                  <strong>{bodyStyleMap[style].label}</strong>
                  <span>{bodyStyleMap[style].description}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-loan-calc__body-style-nav mt-loan-calc__body-style-nav--next"
              aria-label="Next body styles"
              onClick={() => scrollBodyStyleCarousel(1)}
            >
              <CaretRight size={18} weight="bold" aria-hidden />
            </button>
          </div>

          <div className="mt-loan-calc__browse-results">
            <div className="mt-loan-calc__browse-results-head">
              <strong>Best {browsedBodyStyle.toLowerCase()} picks around your budget</strong>
              <span>{selectedBrowseVehicles.length} shown</span>
            </div>
            <div className="mt-loan-calc__browse-results-list">
              {selectedBrowseVehicles.map(({ vehicle, isInRange, estimatedMonthly }) => (
                <button
                  key={vehicle.slug}
                  type="button"
                  className="mt-loan-calc__browse-result-card"
                  onClick={() => {
                    setVehiclePathMode('known');
                    applySearchResult(vehicle);
                  }}
                >
                  <div className="mt-loan-calc__browse-result-copy">
                    <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong>
                    <span>Starts at {formatCurrency(vehicle.priceMin)} · {formatCurrency(estimatedMonthly)}/mo est.</span>
                  </div>
                  <span className={`mt-loan-calc__fit-badge${isInRange ? ' is-fit' : ''}`}>
                    {isInRange ? 'In range' : 'Near range'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTradeStep = () => (
    <div className="mt-loan-calc__step-stack mt-loan-calc__trade-layout">
      <div className="mt-loan-calc__field-grid mt-loan-calc__field-grid--two">
        <TextField
          fullWidth
          label={<FieldLabelWithInfo>Trade-in value</FieldLabelWithInfo>}
          value={tradeInValue}
          inputMode="numeric"
          icon={<CurrencyDollar size={16} weight="bold" aria-hidden />}
          iconPosition="left"
          onChange={(event) => setTradeInValue(event.target.value.replace(/[^0-9]/g, ''))}
        />
        <TextField
          fullWidth
          label={<FieldLabelWithInfo>Amount owed on trade</FieldLabelWithInfo>}
          value={amountOwed}
          inputMode="numeric"
          icon={<CurrencyDollar size={16} weight="bold" aria-hidden />}
          iconPosition="left"
          onChange={(event) => setAmountOwed(event.target.value.replace(/[^0-9]/g, ''))}
        />
      </div>

      <button
        type="button"
        className="mt-loan-calc__inline-link"
        onClick={() => navigate('/rate-your-car')}
      >
        Want a trade-in estimate?
      </button>

      <div className="mt-loan-calc__field-grid mt-loan-calc__field-grid--three">
        <SelectField label={<FieldLabelWithInfo>Your state</FieldLabelWithInfo>} value={selectedState} onChange={setSelectedState} options={stateOptions} />
        <TextField
          fullWidth
          label={<FieldLabelWithInfo>Sales tax (%)</FieldLabelWithInfo>}
          value={salesTaxPercent}
          inputMode="decimal"
          onChange={(event) => setSalesTaxPercent(event.target.value.replace(/[^0-9.]/g, ''))}
        />
        <TextField
          fullWidth
          label={<FieldLabelWithInfo>Registration & dealer fees</FieldLabelWithInfo>}
          value={fees}
          inputMode="numeric"
          icon={<CurrencyDollar size={16} weight="bold" aria-hidden />}
          iconPosition="left"
          onChange={(event) => setFees(event.target.value.replace(/[^0-9]/g, ''))}
        />
      </div>

      <p className="mt-loan-calc__fee-note">
        {feeGuidanceCopy[selectedState]}
      </p>

      {netTradeIn > 0 && (
        <p className="mt-loan-calc__status-note is-positive">
          <CheckCircle size={18} weight="fill" aria-hidden />
          <span><strong>{formatCurrency(netTradeIn)} in trade equity</strong> lowers the amount you need to finance.</span>
        </p>
      )}

      {derived.negativeEquity > 0 && (
        <p className="mt-loan-calc__status-note is-warning">
          <WarningCircle size={18} weight="fill" aria-hidden />
          <span><strong>{formatCurrency(derived.negativeEquity)} in negative equity</strong> is being rolled into the estimate.</span>
        </p>
      )}

      <label className="mt-loan-calc__toggle mt-loan-calc__toggle--card">
        <input
          type="checkbox"
          checked={includeFeesInLoan}
          onChange={(event) => setIncludeFeesInLoan(event.target.checked)}
        />
        <span className="mt-loan-calc__toggle-track" />
        <span className="mt-loan-calc__toggle-copy">
          Include taxes and fees in the loan
          <small>
            {includeFeesInLoan
              ? 'Roll estimated sales tax, registration, and dealer fees into the financed amount.'
              : 'Pay estimated sales tax, registration, and dealer fees upfront at signing.'}
          </small>
        </span>
      </label>
    </div>
  );

  const renderReviewStep = () => (
    <div className="mt-loan-calc__step-stack mt-loan-calc__step-stack--review">
      <section className="mt-loan-calc__estimate-hero" aria-labelledby="estimate-payment-title">
        <button type="button" className="mt-loan-calc__estimate-save" aria-label="Save this estimate">
          <BookmarkSimple size={18} weight="bold" aria-hidden />
        </button>
        <span className="mt-loan-calc__review-label" id="estimate-payment-title">Estimated monthly payment</span>
        <div className="mt-loan-calc__estimate-amount">
          {formatCurrency(derived.monthlyPayment)}
          <small>/mo</small>
        </div>
        <p>
          Based on a {formatCurrency(derived.targetVehiclePrice)} target vehicle price,
          {' '}{loanTerm} months, and {aprValue.toFixed(1)}% APR.
        </p>
        <Button
          color="primary"
          size="large"
          onClick={handleContinue}
          icon={<ArrowRight size={18} weight="bold" aria-hidden />}
          iconPosition="right"
        >
          See cars in your budget
        </Button>
      </section>

      <section className="mt-loan-calc__estimate-panel">
        <div className="mt-loan-calc__breakdown-head">
          <div>
            <h2 className="mt-loan-calc__breakdown-title">Your personalized cost breakdown</h2>
          </div>
        </div>

        <div className="mt-loan-calc__amount-financed">
          <span className="mt-loan-calc__review-label">Amount financed</span>
          <strong>{formatCurrency(derived.financedPrincipal)}</strong>
          <p>
            {formatCurrency(derived.targetVehiclePrice)} target price -
            {' '}{formatCurrency(downPaymentValue)} cash down -
            {' '}{formatCurrency(Math.max(netTradeIn, 0))} trade value +
            {' '}{formatCurrency(derived.taxesAndFees)} taxes &amp; fees
          </p>
        </div>

        <div className="mt-loan-calc__estimate-row-group">
          <dl className="mt-loan-calc__breakdown-list mt-loan-calc__breakdown-list--estimate">
            <div><dt>Vehicle target price <Info size={14} weight="regular" aria-hidden /></dt><dd>{formatCurrency(derived.targetVehiclePrice)}</dd></div>
            <div className="is-positive"><dt>Down payment <Info size={14} weight="regular" aria-hidden /></dt><dd>{formatCurrency(downPaymentValue)}</dd></div>
          </dl>

          <div className={`mt-loan-calc__estimate-accordion mt-loan-calc__estimate-accordion--row${openEstimateAccordions.totalInterest ? ' is-open' : ''}`}>
            <button
              type="button"
              className="mt-loan-calc__estimate-accordion-summary"
              aria-expanded={openEstimateAccordions.totalInterest}
              onClick={() => toggleEstimateAccordion('totalInterest')}
            >
              <span className="mt-loan-calc__accordion-label">Total interest paid <Info size={14} weight="regular" aria-hidden /></span>
              <span className="mt-loan-calc__accordion-value is-alert">{formatCurrency(derived.totalInterestPaid)}</span>
              <CaretDown size={18} weight="bold" aria-hidden />
            </button>
            {openEstimateAccordions.totalInterest && (
              <div className="mt-loan-calc__estimate-accordion-detail">
                <dl className="mt-loan-calc__estimate-sublist">
                  <div><dt>Amount financed</dt><dd>{formatCurrency(derived.financedPrincipal)}</dd></div>
                  <div><dt>Total loan payments</dt><dd>{formatCurrency(derived.totalLoanPayments)}</dd></div>
                  <div><dt>Rate &amp; term</dt><dd>{aprValue.toFixed(1)}% APR · {loanTerm} mo</dd></div>
                </dl>
                <div className="mt-loan-calc__amortization">
                  <h3>Year-by-year amortization</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortizationRows.map((row) => (
                        <tr key={row.year}>
                          <td>{row.year}</td>
                          <td>{formatCurrency(row.principal)}</td>
                          <td>{formatCurrency(row.interest)}</td>
                          <td>{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <dl className="mt-loan-calc__breakdown-list mt-loan-calc__breakdown-list--estimate">
            <div><dt>Rate &amp; term</dt><dd>{aprValue.toFixed(1)}% APR · {loanTerm} mo</dd></div>
          </dl>
        </div>

        <div className="mt-loan-calc__estimate-accordion-list">
          <div className={`mt-loan-calc__estimate-accordion mt-loan-calc__estimate-accordion--row${openEstimateAccordions.netTrade ? ' is-open' : ''}`}>
            <button
              type="button"
              className="mt-loan-calc__estimate-accordion-summary"
              aria-expanded={openEstimateAccordions.netTrade}
              onClick={() => toggleEstimateAccordion('netTrade')}
            >
              <span className="mt-loan-calc__accordion-label">Net trade value <Info size={14} weight="regular" aria-hidden /></span>
              <span className="mt-loan-calc__accordion-value">{formatCurrency(netTradeIn)}</span>
              <CaretDown size={18} weight="bold" aria-hidden />
            </button>
            {openEstimateAccordions.netTrade && (
              <dl className="mt-loan-calc__estimate-accordion-detail mt-loan-calc__estimate-sublist">
                <div><dt>Trade-in value</dt><dd>{formatCurrency(tradeInValueNumber)}</dd></div>
                <div><dt>Amount owed on trade</dt><dd>{formatCurrency(amountOwedNumber)}</dd></div>
              </dl>
            )}
          </div>

          <div className={`mt-loan-calc__estimate-accordion mt-loan-calc__estimate-accordion--row${openEstimateAccordions.taxesFees ? ' is-open' : ''}`}>
            <button
              type="button"
              className="mt-loan-calc__estimate-accordion-summary"
              aria-expanded={openEstimateAccordions.taxesFees}
              onClick={() => toggleEstimateAccordion('taxesFees')}
            >
              <span className="mt-loan-calc__accordion-label">Estimated taxes &amp; fees <Info size={14} weight="regular" aria-hidden /></span>
              <span className="mt-loan-calc__accordion-value is-alert">{formatCurrency(derived.taxesAndFees)}</span>
              <CaretDown size={18} weight="bold" aria-hidden />
            </button>
            {openEstimateAccordions.taxesFees && (
              <dl className="mt-loan-calc__estimate-accordion-detail mt-loan-calc__estimate-sublist">
                <div><dt>Sales tax</dt><dd>{formatCurrency(derived.taxes)}</dd></div>
                <div><dt>Dealer &amp; registration fee</dt><dd>{formatCurrency(feesValue)}</dd></div>
              </dl>
            )}
          </div>
        </div>

        <dl className="mt-loan-calc__breakdown-list mt-loan-calc__breakdown-list--estimate">
          <div><dt>Total loan payments over {loanTerm} months <Info size={14} weight="regular" aria-hidden /></dt><dd>{formatCurrency(derived.totalLoanPayments)}</dd></div>
          <div><dt>Monthly payment <Info size={14} weight="regular" aria-hidden /></dt><dd>{formatCurrency(derived.monthlyPayment)}/mo</dd></div>
          <div className="is-strong"><dt>Estimated total paid <Info size={14} weight="regular" aria-hidden /></dt><dd>{formatCurrency(derived.totalPaid)}</dd></div>
        </dl>
      </section>

      <section className="mt-loan-calc__estimate-panel mt-loan-calc__for-sale-panel">
        <div className="mt-loan-calc__for-sale-head">
          <div>
            <h2 className="mt-loan-calc__breakdown-title">For sale near you</h2>
            <p>Explore vehicles close to this budget and payment target.</p>
          </div>
          <Button color="neutral" variant="outline" onClick={() => navigate('/vehicles')}>
            Browse all
          </Button>
        </div>
        <div className="mt-loan-calc__nearby-grid">
          {reviewVehicleCards.map(({ vehicle, estimatedMonthly }) => (
            <button
              key={vehicle.slug}
              type="button"
              className="mt-loan-calc__nearby-card"
              onClick={() => navigate(`/vehicles/${vehicle.slug}`)}
            >
              {vehicle.image ? (
                <img src={vehicle.image} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
              ) : (
                <span className="mt-loan-calc__nearby-image-fallback">Image unavailable</span>
              )}
              <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong>
              <span>{formatCurrency(vehicle.priceMin)}</span>
              <small>{formatCurrency(estimatedMonthly)}/mo est.</small>
            </button>
          ))}
        </div>
      </section>

    </div>
  );

  return (
    <div className="mt-loan-calc">
      <Section className="mt-loan-calc__hero" fullWidth padding="none" as="section">
        <div className="mt-loan-calc__hero-inner">
          <span className="mt-loan-calc__hero-kicker">MotorTrend payment planner</span>
          <h1>See what your monthly budget can really buy.</h1>
          <p>
            Keep the structure of the full loan-planning wizard, but tuned to the MotorTrend app’s sharper,
            more editorial visual system.
          </p>
        </div>
      </Section>

      <Section className="mt-loan-calc__shell-wrap" fullWidth padding="none" as="section">
        <CardShell
          hasHover={false}
          padding="none"
          noGap
          className="mt-loan-calc__shell"
          style={{
            background: 'var(--color-neutrals-8, #FCFCFD)',
            borderRadius: '16px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.24)',
            overflow: 'visible',
          }}
        >
          <div className="mt-loan-calc__shell-top" ref={shellTopRef}>
            <ol className="mt-loan-calc__steps" aria-label="Calculator steps">
              {steps.map((step, index) => (
                <li
                  key={step.label}
                  className={`mt-loan-calc__step-dot${index === stepIndex ? ' is-active' : index < stepIndex ? ' is-complete' : ''}`}
                >
                  <button type="button" className="mt-loan-calc__step-button" onClick={() => goToStep(index)}>
                    <span className="mt-loan-calc__step-number">
                      {index < stepIndex ? <Check size={16} weight="bold" aria-hidden /> : index + 1}
                    </span>
                    <span className="mt-loan-calc__step-name">{step.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className={`mt-loan-calc__shell-body${stepIndex === 4 ? ' mt-loan-calc__shell-body--review' : ''}`}>
            <div className="mt-loan-calc__main">
              <div className="mt-loan-calc__step-header">
                <span className="mt-loan-calc__step-kicker">
                  Step {stepIndex + 1} of {steps.length}
                  {currentStep.optional ? <span className="mt-loan-calc__step-kicker-muted"> · Optional</span> : null}
                </span>
                <h1 className="mt-loan-calc__step-title">{currentStep.title}</h1>
                <p className="mt-loan-calc__step-copy">{currentStep.copy}</p>
              </div>

              {stepIndex === 0 && renderBudgetStep()}
              {stepIndex === 1 && renderLoanTermsStep()}
              {stepIndex === 2 && renderVehicleStep()}
              {stepIndex === 3 && renderTradeStep()}
              {stepIndex === 4 && renderReviewStep()}

              <div className="mt-loan-calc__actions">
                <button type="button" className="mt-loan-calc__back-link" onClick={handleBack} disabled={stepIndex === 0}>
                  <ArrowLeft size={18} weight="bold" aria-hidden />
                  Back
                </button>

                <div className="mt-loan-calc__actions-right">
                  {stepIndex < steps.length - 1 && (
                    <span className="mt-loan-calc__next-cue">
                      {stepIndex === 2 && currentStep.optional
                        ? 'Skip this if you want to stay broad and refine the vehicle later.'
                        : 'One step closer to your real-world payment.'}
                    </span>
                  )}
                  {stepIndex === 2 && currentStep.optional && (
                    <button type="button" className="mt-loan-calc__skip-link" onClick={() => goToStep(stepIndex + 1)}>
                      <SkipForward size={18} weight="bold" aria-hidden />
                      Skip this step
                    </button>
                  )}
                  {stepIndex === 4 && (
                    <button type="button" className="mt-loan-calc__skip-link" onClick={() => goToStep(0)}>
                      Start over
                    </button>
                  )}
                  <Button
                    color="primary"
                    size="large"
                    onClick={handleContinue}
                    icon={<ArrowRight size={18} weight="bold" aria-hidden />}
                    iconPosition="right"
                  >
                    {stepIndex === steps.length - 1 ? 'See cars in your budget' : 'Continue'}
                  </Button>
                </div>
              </div>
            </div>

            {stepIndex !== 4 && (
            <aside className="mt-loan-calc__sidebar">
              <CardShell
                hasHover={false}
                padding="lg"
                className="mt-loan-calc__summary-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.76)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  position: 'sticky',
                  top: '104px',
                }}
              >
                <span className="mt-loan-calc__summary-kicker">Estimated monthly payment</span>
                <div className="mt-loan-calc__summary-amount">
                  {formatCurrency(derived.monthlyPayment)}
                  <small>/mo</small>
                </div>
                <p className="mt-loan-calc__summary-copy">{sidebarCopy}</p>

                <dl className="mt-loan-calc__summary-list">
                  <div>
                    <dt>Target vehicle price</dt>
                    <dd>{formatCurrency(derived.targetVehiclePrice)}</dd>
                  </div>
                  <div>
                    <dt>Down payment</dt>
                    <dd>{formatCurrency(downPaymentValue)}</dd>
                  </div>
                  <div>
                    <dt>Rate &amp; term</dt>
                    <dd>{aprValue.toFixed(1)}% APR · {loanTerm} mo</dd>
                  </div>
                  <div>
                    <dt>Vehicle context</dt>
                    <dd>{vehiclePathMode === 'known' ? selectedVehicle?.make ?? 'Vehicle' : browsedBodyStyle}</dd>
                  </div>
                  <div>
                    <dt>Net trade-in value</dt>
                    <dd>{formatCurrency(netTradeIn)}</dd>
                  </div>
                  <div>
                    <dt>Taxes &amp; fees</dt>
                    <dd>{formatCurrency(derived.taxesAndFees)}</dd>
                  </div>
                  <div>
                    <dt>Total interest paid</dt>
                    <dd>{formatCurrency(derived.totalInterestPaid)}</dd>
                  </div>
                  <div className="is-strong">
                    <dt>Estimated total paid</dt>
                    <dd>{formatCurrency(derived.totalPaid)}</dd>
                  </div>
                </dl>
              </CardShell>
            </aside>
            )}
          </div>
        </CardShell>
      </Section>
    </div>
  );
};

export default AutoLoanCalculator;
