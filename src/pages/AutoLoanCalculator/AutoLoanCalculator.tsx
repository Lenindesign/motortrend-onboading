import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Car,
  CarProfile,
  CaretDown,
  CaretLeft,
  CaretRight,
  CheckCircle,
  CurrencyDollar,
  Info,
  MagnifyingGlass,
  SkipForward,
  WarningCircle,
} from '@phosphor-icons/react';
import { Button, CardShell, TextField } from '../../design-system/components';
import { Tooltip } from '../../components/atoms/Tooltip';
import { trackCDPEvent } from '../../utils/cdpTracking';
import { getVehicleBySlug, searchVehicles, type Vehicle } from '../../api/vehiclesApi';
import './AutoLoanCalculator.css';

type StartMode = 'price' | 'monthly';
type VehicleCondition = 'new' | 'used';
type CalculatorStepSlug = 'loan-terms' | 'vehicle' | 'trade' | 'review';
type VehiclePathMode = 'known' | 'browsing';
type SelectedState = string;
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
    copy: 'Use this as a planning snapshot and adjust your assumptions at any time.',
  },
];

const calculatorFaqs = [
  {
    question: 'How does the MotorTrend Auto Loan Calculator work?',
    answer: 'Choose a vehicle price or monthly payment, then adjust the loan terms, vehicle, trade-in, taxes, and fees. The estimate updates as you go. It is a planning tool, not a loan approval or dealer quote.',
  },
  {
    question: 'What does estimated buying power mean?',
    answer: 'It is an approximate vehicle price supported by the payment and financing assumptions you selected. A lender’s offer, final vehicle price, taxes, fees, and trade-in can change the actual amount.',
  },
  {
    question: 'How much car can I afford based on a monthly payment?',
    answer: 'Use a payment that leaves room for insurance, fuel or charging, maintenance, registration, and other monthly expenses. Compare loan terms and total cost too, since a longer loan can lower the payment while increasing interest.',
  },
  {
    question: 'What is included in a monthly car payment?',
    answer: 'A loan payment typically covers principal and interest. Taxes, title, registration, dealer fees, and add-ons may also be included if you finance them. Insurance and running costs are usually separate.',
  },
  {
    question: 'How does APR affect my car payment?',
    answer: 'A higher APR generally raises both the monthly payment and total interest. Compare APR, term, amount financed, and total paid alongside the monthly number.',
  },
  {
    question: 'How does my credit score affect an auto loan estimate?',
    answer: 'Your credit profile can affect the APR a lender offers. This calculator uses an estimate; the rate and terms you qualify for depend on a lender’s review of your full application.',
  },
  {
    question: 'Is a longer car loan term better?',
    answer: 'A longer term can lower the monthly payment, but usually increases total interest and can leave you owing more than the vehicle is worth for longer.',
  },
  {
    question: 'How much should I put down on a car?',
    answer: 'A larger down payment reduces the amount financed and can lower interest. Choose an amount that fits your budget while leaving enough savings for other costs and emergencies.',
  },
  {
    question: 'How does a trade-in affect my car loan?',
    answer: 'Trade equity can reduce the amount you finance. If your payoff is higher than the vehicle’s trade-in value, rolling that negative equity into a new loan increases the amount borrowed.',
  },
  {
    question: 'Should I include taxes and fees in my auto loan estimate?',
    answer: 'Including estimated taxes and fees can make the payment estimate more complete. Paying them upfront keeps them out of the loan; financing them increases the amount borrowed and may increase interest.',
  },
  {
    question: 'What is an out-the-door price, and why does it matter?',
    answer: 'The out-the-door price is the total price including required taxes and fees. It helps you compare the full cost of offers and estimate how much you may need to finance.',
  },
  {
    question: 'Should I get preapproved before visiting a dealer?',
    answer: 'Preapproval can give you a useful rate and budget to compare with dealer financing. Review the APR, term, fees, and total cost of each offer before deciding.',
  },
  {
    question: 'Why do some vehicles show APR, rebate, or lease deals?',
    answer: 'Manufacturer offers can vary by vehicle, location, eligibility, and time. Confirm the current terms and qualifications with the manufacturer or participating dealer.',
  },
  {
    question: 'What should I do after reviewing my estimate?',
    answer: 'Compare total ownership costs and current financing offers. Confirm pricing, taxes, fees, and loan terms with a lender or dealer.',
  },
];

const stateOptions: SelectOption<SelectedState>[] = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'],
  ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'],
  ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'],
  ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'],
  ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'],
  ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'],
  ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'], ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'],
  ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'],
  ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
].map(([value, label]) => ({ value, label }));

// Runtime defaults and state estimates mirror the C/D calculator. Actual local
// tax, title, registration, and dealer charges vary; shoppers can edit both fields.
const stateDefaults: Record<SelectedState, { tax: number; fees: number }> = {
  AL: { tax: 2, fees: 700 }, AK: { tax: 0, fees: 700 }, AZ: { tax: 5.6, fees: 700 },
  AR: { tax: 6.5, fees: 400 }, CA: { tax: 7.25, fees: 400 }, CO: { tax: 2.9, fees: 700 },
  CT: { tax: 6.35, fees: 700 }, DE: { tax: 5.25, fees: 700 }, DC: { tax: 6, fees: 700 },
  FL: { tax: 6, fees: 1000 }, GA: { tax: 7, fees: 700 }, HI: { tax: 4, fees: 700 },
  ID: { tax: 6, fees: 700 }, IL: { tax: 6.25, fees: 400 }, IN: { tax: 7, fees: 400 },
  IA: { tax: 5, fees: 400 }, KS: { tax: 6.5, fees: 700 }, KY: { tax: 6, fees: 700 },
  LA: { tax: 5, fees: 400 }, ME: { tax: 5.5, fees: 700 }, MD: { tax: 6.5, fees: 700 },
  MA: { tax: 6.25, fees: 700 }, MI: { tax: 6, fees: 400 }, MN: { tax: 6.875, fees: 400 },
  MS: { tax: 5, fees: 700 }, MO: { tax: 4.225, fees: 400 }, MT: { tax: 0, fees: 700 },
  NE: { tax: 5.5, fees: 700 }, NV: { tax: 6.85, fees: 700 }, NH: { tax: 0, fees: 700 },
  NJ: { tax: 6.625, fees: 700 }, NM: { tax: 4, fees: 700 }, NY: { tax: 4, fees: 400 },
  NC: { tax: 3, fees: 1000 }, ND: { tax: 5, fees: 400 }, OH: { tax: 5.75, fees: 400 },
  OK: { tax: 3.25, fees: 700 }, OR: { tax: 0, fees: 400 }, PA: { tax: 6, fees: 700 },
  RI: { tax: 7, fees: 400 }, SC: { tax: 5, fees: 700 }, SD: { tax: 4, fees: 400 },
  TN: { tax: 7, fees: 700 }, TX: { tax: 6.25, fees: 400 }, UT: { tax: 4.85, fees: 700 },
  VT: { tax: 6, fees: 400 }, VA: { tax: 4.15, fees: 1000 }, WA: { tax: 7, fees: 400 },
  WV: { tax: 6, fees: 400 }, WI: { tax: 5, fees: 400 }, WY: { tax: 4, fees: 700 },
};

const bodyStyleMap: Record<BrowsableBodyStyle, { label: string; icon: string; description: string }> = {
  SUV: {
    label: 'SUV',
    icon: '/images/body-style-icons/suv.svg',
    description: 'Family haulers, adventure rigs, and compact crossovers.',
  },
  Sedan: {
    label: 'Sedan',
    icon: '/images/body-style-icons/sedan.svg',
    description: 'Efficient commuters and sharper sport sedans.',
  },
  Truck: {
    label: 'Truck',
    icon: '/images/body-style-icons/truck.svg',
    description: 'Pickups, tow rigs, and work-ready options.',
  },
  Coupe: {
    label: 'Coupe',
    icon: '/images/body-style-icons/coupe.svg',
    description: 'Two-door performance, style, and halo cars.',
  },
  Hatchback: {
    label: 'Hatchback',
    icon: '/images/body-style-icons/hatchback.svg',
    description: 'Compact, practical, and often electrified picks.',
  },
  Wagon: {
    label: 'Wagon',
    icon: '/images/body-style-icons/van.svg',
    description: 'Long-roof utility with a lower stance.',
  },
  Convertible: {
    label: 'Convertible',
    icon: '/images/body-style-icons/convertible.svg',
    description: 'Top-down weekend and premium cruising options.',
  },
};

const browsableBodyStyles = Object.keys(bodyStyleMap) as BrowsableBodyStyle[];

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return moneyFormatter.format(Math.round(value));
}

const numericInputStyle: React.CSSProperties = { fontWeight: 700 };

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

function calculateVehiclePriceFromBudget({
  principal,
  downPayment,
  downPaymentPercent,
  netTradeIn,
  taxRate,
  fees,
  includeFees,
}: {
  principal: number;
  downPayment: number;
  downPaymentPercent?: number;
  netTradeIn: number;
  taxRate: number;
  fees: number;
  includeFees: boolean;
}) {
  const positiveEquity = Math.max(netTradeIn, 0);
  const negativeEquity = Math.max(-netTradeIn, 0);
  const includedFees = includeFees ? fees : 0;
  const includedTaxRate = includeFees ? taxRate : 0;
  const equityCredit = positiveEquity * (includeFees ? 1 + taxRate : 1);

  if (downPaymentPercent !== undefined) {
    const price = (principal - includedFees - negativeEquity + equityCredit)
      / (1 - downPaymentPercent + includedTaxRate);
    return Math.max(price, 0);
  }

  const amountBeforeTax = principal + downPayment + positiveEquity - negativeEquity - includedFees;
  const priceIncludingTax = (amountBeforeTax + (includeFees ? positiveEquity * taxRate : 0))
    / (1 + includedTaxRate);
  return priceIncludingTax <= positiveEquity ? amountBeforeTax : priceIncludingTax;
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

function FieldLabelWithInfo({ children, tooltip }: { children: React.ReactNode; tooltip: string }) {
  return (
    <span className="mt-loan-calc__field-label-inline">
      {children}
      <Tooltip content={tooltip} trigger="hover" placement="top" showDelay={0}>
        <button type="button" className="mt-loan-calc__info-button" aria-label={`More about ${String(children)}`}>
          <Info size={16} weight="regular" aria-hidden />
        </button>
      </Tooltip>
    </span>
  );
}

export const AutoLoanCalculator: React.FC = () => {
  const navigate = useNavigate();
  const { stepSlug } = useParams<{ stepSlug?: CalculatorStepSlug }>();
  const [startMode, setStartMode] = useState<StartMode>('price');
  const [vehiclePrice, setVehiclePrice] = useState('30000');
  const [monthlyBudget, setMonthlyBudget] = useState('550');
  const [downPayment, setDownPayment] = useState('3000');
  const [downPaymentIsCustom, setDownPaymentIsCustom] = useState(false);
  const [apr, setApr] = useState('7.5');
  const [condition, setCondition] = useState<VehicleCondition>('new');
  const [loanTerm, setLoanTerm] = useState(60);
  const [vehiclePathMode, setVehiclePathMode] = useState<VehiclePathMode>('known');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);
  const [selectedVehicleSlug, setSelectedVehicleSlug] = useState('');
  const [browsedBodyStyle, setBrowsedBodyStyle] = useState<BrowsableBodyStyle>('SUV');
  const [tradeInValue, setTradeInValue] = useState('0');
  const [amountOwed, setAmountOwed] = useState('0');
  const [selectedState, setSelectedState] = useState<SelectedState>('VA');
  const [salesTaxPercent, setSalesTaxPercent] = useState(stateDefaults.VA.tax.toString());
  const [fees, setFees] = useState(stateDefaults.VA.fees.toString());
  const [includeFeesInLoan, setIncludeFeesInLoan] = useState(true);
  const [openEstimateAccordions, setOpenEstimateAccordions] = useState<Record<EstimateAccordionKey, boolean>>({
    totalInterest: false,
    netTrade: false,
    taxesFees: false,
  });
  const searchMenuRef = useRef<HTMLDivElement | null>(null);
  const bodyStyleCarouselRef = useRef<HTMLDivElement | null>(null);
  const shellTopRef = useRef<HTMLDivElement | null>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>('header.global-header');
    if (!header) return undefined;

    const rootStyle = document.documentElement.style;
    const previousOffset = rootStyle.getPropertyValue('--mt-loan-calc-sticky-top');
    const updateStickyOffset = () => {
      rootStyle.setProperty('--mt-loan-calc-sticky-top', `${header.getBoundingClientRect().height}px`);
    };

    updateStickyOffset();
    const resizeObserver = new ResizeObserver(updateStickyOffset);
    resizeObserver.observe(header);
    window.addEventListener('resize', updateStickyOffset);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateStickyOffset);
      if (previousOffset) {
        rootStyle.setProperty('--mt-loan-calc-sticky-top', previousOffset);
      } else {
        rootStyle.removeProperty('--mt-loan-calc-sticky-top');
      }
    };
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute('content');
    const pageDescription = 'Estimate auto loan payments, compare financing costs, and see how vehicle price, down payment, APR, term, taxes, and trade-in value affect your budget.';
    const pageMeta = description ?? document.createElement('meta');

    document.title = 'Auto Loan Calculator | MotorTrend';
    pageMeta.setAttribute('name', 'description');
    pageMeta.setAttribute('content', pageDescription);
    if (!description) document.head.appendChild(pageMeta);

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== undefined) {
        if (previousDescription === null) {
          description.removeAttribute('content');
        } else {
          description.setAttribute('content', previousDescription);
        }
      } else if (!description) {
        pageMeta.remove();
      }
    };
  }, []);

  const stepIndex = getStepIndex(stepSlug);
  const previousStepIndexRef = useRef(stepIndex);
  const currentStep = steps[stepIndex];
  const selectedVehicle = useMemo(() => {
    return selectedVehicleSlug ? getVehicleBySlug(selectedVehicleSlug) : undefined;
  }, [selectedVehicleSlug]);

  useEffect(() => {
    setSalesTaxPercent(stateDefaults[selectedState].tax.toString());
    setFees(stateDefaults[selectedState].fees.toString());
  }, [selectedState]);

  useEffect(() => {
    trackCDPEvent({
      event: 'calculator_step_viewed',
      properties: { step: stepIndex + 1, stepName: steps[stepIndex].label.toLowerCase().replaceAll(' ', '_') },
      timestamp: new Date().toISOString(),
    });
    if (stepIndex === steps.length - 1) {
      trackCDPEvent({
        event: hasCompletedRef.current ? 'calculator_estimate_adjusted' : 'calculator_completed',
        timestamp: new Date().toISOString(),
      });
      hasCompletedRef.current = true;
    }
  }, [stepIndex]);

  useEffect(() => {
    const previousStepIndex = previousStepIndexRef.current;
    previousStepIndexRef.current = stepIndex;

    if (previousStepIndex === stepIndex && stepIndex === 0) return undefined;
    if (!shellTopRef.current) return undefined;

    const frame = window.requestAnimationFrame(() => {
      if (!shellTopRef.current) return;
      const shellTop = shellTopRef.current.getBoundingClientRect().top + window.scrollY;
      const stickyHeaderHeight = document.querySelector<HTMLElement>('header.global-header')?.getBoundingClientRect().height ?? 0;
      const breathingRoom = 12;
      window.scrollTo({ top: Math.max(0, shellTop - stickyHeaderHeight - breathingRoom), behavior: 'auto' });
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
      : calculateVehiclePriceFromBudget({
          principal: calculatePrincipalFromBudget(monthlyBudgetValue, aprValue, loanTerm),
          downPayment: downPaymentIsCustom ? downPaymentValue : 0,
          downPaymentPercent: downPaymentIsCustom ? undefined : 0.1,
          netTradeIn,
          taxRate: salesTaxRate,
          fees: feesValue,
          includeFees: includeFeesInLoan,
        });

    const targetVehiclePrice = clamp(rawPrice, 5000, 120000);
    const effectiveDownPayment = startMode === 'monthly' && !downPaymentIsCustom
      ? targetVehiclePrice * 0.1
      : downPaymentValue;
    const taxes = Math.max(targetVehiclePrice - Math.max(netTradeIn, 0), 0) * salesTaxRate;
    const taxesAndFees = taxes + feesValue;
    const financedPrincipal = Math.max(
      targetVehiclePrice
        - effectiveDownPayment
        - Math.max(netTradeIn, 0)
        + (includeFeesInLoan ? taxesAndFees : 0)
        + Math.max(-netTradeIn, 0),
      0,
    );
    const monthlyPayment = calculateLoanPayment(financedPrincipal, aprValue, loanTerm);
    const totalLoanPayments = monthlyPayment * loanTerm;
    const totalInterestPaid = Math.max(totalLoanPayments - financedPrincipal, 0);
    const cashDueAtSigning = effectiveDownPayment + (includeFeesInLoan ? 0 : taxesAndFees);
    const totalPaid = totalLoanPayments + cashDueAtSigning;
    const monthlyDelta = monthlyPayment - monthlyBudgetValue;

    return {
      targetVehiclePrice,
      downPayment: effectiveDownPayment,
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
    downPaymentIsCustom,
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
  const goToStep = (nextIndex: number) => {
    navigate(getStepPath(nextIndex));
  };

  const handleContinue = () => {
    if (stepIndex >= steps.length - 1) return;
    trackCDPEvent({
      event: 'calculator_continue_selected',
      properties: { step: stepIndex + 1 },
      timestamp: new Date().toISOString(),
    });
    goToStep(stepIndex + 1);
  };

  const handleBack = () => {
    if (stepIndex === 0) return;
    goToStep(stepIndex - 1);
  };

  const applySearchResult = (vehicle: Vehicle) => {
    setSelectedVehicleSlug(vehicle.slug);
    setVehicleSearch(`${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    setShowSearchResults(false);
    trackCDPEvent({ event: 'calculator_vehicle_selected', timestamp: new Date().toISOString() });
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
          aria-pressed={startMode === 'price'}
          onClick={() => setStartMode('price')}
        >
          <span className="mt-loan-calc__choice-icon">
            <Car size={18} weight="regular" aria-hidden />
          </span>
          <span className="mt-loan-calc__choice-title">
            <span className="mt-loan-calc__choice-title-prefix">Start with</span>
            <span>vehicle price</span>
          </span>
          <span className="mt-loan-calc__choice-copy">
            We&apos;ll use this price as your target throughout the estimate.
          </span>
        </button>

        <button
          type="button"
          className={`mt-loan-calc__choice-card${startMode === 'monthly' ? ' is-active' : ''}`}
          aria-pressed={startMode === 'monthly'}
          onClick={() => setStartMode('monthly')}
        >
          <span className="mt-loan-calc__choice-icon">
            <CurrencyDollar size={18} weight="regular" aria-hidden />
          </span>
          <span className="mt-loan-calc__choice-title">
            <span className="mt-loan-calc__choice-title-prefix">Start with</span>
            <span>monthly budget</span>
          </span>
          <span className="mt-loan-calc__choice-copy">
            Your monthly payment helps estimate a vehicle budget.
          </span>
        </button>
      </div>

      {startMode === 'monthly' && derived.monthlyDelta > 0.5 && (
        <p className="mt-loan-calc__budget-limit-note" role="status">
          The lowest vehicle price this calculator supports puts the estimate {formatCurrency(derived.monthlyDelta)} per month above your target.
        </p>
      )}

      <div className="mt-loan-calc__budget-panel">
        {startMode === 'price' ? (
          <>
            <TextField
              fullWidth
              label="Vehicle price target"
              value={vehiclePrice ? formatCurrency(parseNumericInput(vehiclePrice)) : ''}
              inputStyle={numericInputStyle}
              inputMode="numeric"
              onChange={(event) => setVehiclePrice(event.target.value.replace(/\D/g, ''))}
              onBlur={() => setVehiclePrice(String(priceValue))}
              helperText="We’ll use this price as your target throughout the estimate."
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
              value={monthlyBudget}
              inputStyle={numericInputStyle}
              inputMode="numeric"
              onChange={(event) => setMonthlyBudget(event.target.value.replace(/[^0-9]/g, ''))}
              onBlur={() => setMonthlyBudget(String(monthlyBudgetValue))}
              helperText="We’ll keep this monthly target fixed as you adjust the financing terms."
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
          <FieldLabelWithInfo tooltip="Cash paid toward the vehicle price. In the monthly-budget path, the default is 10% of the supported vehicle price.">Down payment</FieldLabelWithInfo>
        </div>
        <TextField
          fullWidth
          value={downPaymentIsCustom ? downPayment : String(Math.round(derived.downPayment))}
          inputStyle={numericInputStyle}
          inputMode="numeric"
          icon={<CurrencyDollar size={16} weight="bold" aria-hidden />}
          iconPosition="left"
          onChange={(event) => {
            setDownPaymentIsCustom(true);
            setDownPayment(event.target.value.replace(/[^0-9]/g, ''));
          }}
          helperText={`${formatCurrency(derived.downPayment)} down upfront.`}
        />
        <input
          type="range"
          min="0"
          max="25000"
          step="500"
          value={Math.min(Math.round(derived.downPayment), 25000)}
          onChange={(event) => {
            setDownPaymentIsCustom(true);
            setDownPayment(event.target.value);
          }}
          className="mt-loan-calc__slider"
        />
        <div className="mt-loan-calc__slider-scale">
          <span>$0</span>
          <span>$25,000</span>
        </div>
      </div>

      <div className="mt-loan-calc__loan-control">
        <div className="mt-loan-calc__control-head">
          <FieldLabelWithInfo tooltip="Annual percentage rate used to estimate interest. Enter the rate from a lender offer when you have one.">Interest rate (APR)</FieldLabelWithInfo>
        </div>
        <TextField
          fullWidth
          value={apr}
          inputStyle={numericInputStyle}
          inputMode="decimal"
          onChange={(event) => setApr(event.target.value.replace(/[^0-9.]/g, ''))}
          onBlur={() => setApr(aprValue.toFixed(1))}
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
          <FieldLabelWithInfo tooltip="The number of months to repay the loan. Longer terms can lower the payment but increase total interest.">Loan term</FieldLabelWithInfo>
        </div>
        <div className="mt-loan-calc__term-row mt-loan-calc__term-row--wide">
          {[12, 24, 36, 48, 60, 72, 84].map((term) => (
            <button
              key={term}
              type="button"
              className={`mt-loan-calc__term-pill${loanTerm === term ? ' is-active' : ''}`}
              aria-pressed={loanTerm === term}
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
          aria-pressed={vehiclePathMode === 'known'}
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
          aria-pressed={vehiclePathMode === 'browsing'}
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
        <FieldLabelWithInfo tooltip="Choose whether your estimate is for a new or used vehicle.">New or used</FieldLabelWithInfo>
        <div className="mt-loan-calc__condition-toggle mt-loan-calc__condition-toggle--split">
          {(['new', 'used'] as VehicleCondition[]).map((option) => (
            <button
              key={option}
              type="button"
              className={`mt-loan-calc__condition-chip${condition === option ? ' is-active' : ''}`}
              aria-pressed={condition === option}
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
              label={<FieldLabelWithInfo tooltip="Search by model year, make, or model. Vehicle selection is optional and only adds context to this estimate.">My next vehicle</FieldLabelWithInfo>}
              value={vehicleSearch}
              placeholder="Start typing year, make, or model"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showSearchResults && searchResults.length > 0}
              aria-controls={showSearchResults && searchResults.length > 0 ? 'mt-loan-calc-vehicle-results' : undefined}
              aria-activedescendant={showSearchResults && searchResults.length > 0 ? `mt-loan-calc-vehicle-option-${activeSearchIndex}` : undefined}
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

                if (event.key === 'Escape') {
                  setShowSearchResults(false);
                }
              }}
            />

            {showSearchResults && searchResults.length > 0 && (
              <div id="mt-loan-calc-vehicle-results" className="mt-loan-calc__search-results" role="listbox" aria-label="Vehicle search results">
                {searchResults.map((vehicle, index) => (
                  <div
                    key={vehicle.slug}
                    id={`mt-loan-calc-vehicle-option-${index}`}
                    role="option"
                    aria-selected={index === activeSearchIndex}
                    className={`mt-loan-calc__search-result${index === activeSearchIndex ? ' is-active' : ''}`}
                    onMouseEnter={() => setActiveSearchIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => applySearchResult(vehicle)}
                  >
                    <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong>
                    <span>{vehicle.bodyStyle} · {vehicle.priceRange}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedVehicle ? (
            <Link
              className="mt-loan-calc__selected-vehicle mt-loan-calc__selected-vehicle--compact"
              to={`/vehicles/${encodeURIComponent(selectedVehicle.year)}/${encodeURIComponent(selectedVehicle.make)}/${encodeURIComponent(selectedVehicle.model.replace(/\s+/g, '-'))}`}
              aria-label={`View ${selectedVehicleLabel} vehicle details`}
              aria-live="polite"
            >
              {selectedVehicle.image ? (
                <div className="mt-loan-calc__selected-vehicle-media" aria-hidden="true">
                  <img className="mt-loan-calc__selected-vehicle-image" src={selectedVehicle.image} alt="" />
                </div>
              ) : (
                <span className="mt-loan-calc__selected-vehicle-fallback" aria-hidden="true">Image unavailable</span>
              )}
              <div className="mt-loan-calc__selected-vehicle-copy">
                <span className="mt-loan-calc__review-label">
                  {condition === 'new' ? 'Selected vehicle' : 'Used-vehicle context'}
                </span>
                <h2>{selectedVehicleLabel}</h2>
              </div>
              <div className="mt-loan-calc__selected-vehicle-status">
                <span>Starting at</span>
                <strong>{formatCurrency(selectedVehicle.priceMin)}</strong>
              </div>
            </Link>
          ) : (
            <div className="mt-loan-calc__selected-vehicle mt-loan-calc__selected-vehicle--compact" aria-live="polite">
              <span className="mt-loan-calc__selected-vehicle-fallback" aria-hidden="true">Image unavailable</span>
              <div className="mt-loan-calc__selected-vehicle-copy">
                <span className="mt-loan-calc__review-label">Vehicle context</span>
                <h2>Choose a vehicle</h2>
              </div>
              <div className="mt-loan-calc__selected-vehicle-status"><strong>Not selected</strong></div>
            </div>
          )}
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
                    src={bodyStyleMap[style].icon}
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

          <p className="mt-loan-calc__fee-note">This step is optional. Choose a vehicle type to keep your estimate focused, or skip ahead.</p>
        </div>
      )}
    </div>
  );

  const renderTradeStep = () => (
    <div className="mt-loan-calc__step-stack mt-loan-calc__trade-layout">
      <div className="mt-loan-calc__field-grid mt-loan-calc__field-grid--two">
        <TextField
          fullWidth
          label={<FieldLabelWithInfo tooltip="Estimated value of the vehicle you plan to trade in. A dealer appraisal may differ.">Trade-in value</FieldLabelWithInfo>}
          value={tradeInValue}
          inputStyle={numericInputStyle}
          inputMode="numeric"
          icon={<CurrencyDollar size={16} weight="bold" aria-hidden />}
          iconPosition="left"
          onChange={(event) => setTradeInValue(event.target.value.replace(/[^0-9]/g, ''))}
        />
        <TextField
          fullWidth
          label={<FieldLabelWithInfo tooltip="Remaining payoff on your trade-in. If this is higher than its value, the difference is negative equity.">Amount owed on trade</FieldLabelWithInfo>}
          value={amountOwed}
          inputStyle={numericInputStyle}
          inputMode="numeric"
          icon={<CurrencyDollar size={16} weight="bold" aria-hidden />}
          iconPosition="left"
          onChange={(event) => setAmountOwed(event.target.value.replace(/[^0-9]/g, ''))}
        />
      </div>

      <div className="mt-loan-calc__field-grid mt-loan-calc__field-grid--three">
        <SelectField label={<FieldLabelWithInfo tooltip="Choose the state estimate used for sales tax and the initial registration and dealer-fee estimate.">Your state</FieldLabelWithInfo>} value={selectedState} onChange={setSelectedState} options={stateOptions} />
        <TextField
          fullWidth
          label={<FieldLabelWithInfo tooltip="A state-level estimate. Local rates and vehicle tax rules can change the amount you owe.">Sales tax (%)</FieldLabelWithInfo>}
          value={salesTaxPercent}
          inputStyle={numericInputStyle}
          inputMode="decimal"
          onChange={(event) => setSalesTaxPercent(event.target.value.replace(/[^0-9.]/g, ''))}
        />
        <TextField
          fullWidth
          label={<FieldLabelWithInfo tooltip="An editable planning estimate for registration and dealer fees. Confirm the actual charges locally.">Registration & dealer fees</FieldLabelWithInfo>}
          value={fees}
          inputStyle={numericInputStyle}
          inputMode="numeric"
          icon={<CurrencyDollar size={16} weight="bold" aria-hidden />}
          iconPosition="left"
          onChange={(event) => setFees(event.target.value.replace(/[^0-9]/g, ''))}
        />
      </div>

      <p className="mt-loan-calc__fee-note">
        These are planning estimates. Local tax rules, registration costs, and dealer fees may differ; edit the values to match your situation.
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
        <span className="mt-loan-calc__review-label" id="estimate-payment-title">Estimated monthly payment</span>
        <div className="mt-loan-calc__estimate-amount">
          {formatCurrency(derived.monthlyPayment)}
          <small>/mo</small>
        </div>
        <p>
          Based on a {formatCurrency(derived.targetVehiclePrice)} target vehicle price,
          {' '}{loanTerm} months, and {aprValue.toFixed(1)}% APR.
        </p>
      </section>

      <section className="mt-loan-calc__estimate-panel">
        <div className="mt-loan-calc__breakdown-head">
          <div>
            <h2 className="mt-loan-calc__breakdown-title">Your personalized cost breakdown</h2>
          </div>
        </div>

        <div className="mt-loan-calc__estimate-accordion-list">
          <dl className="mt-loan-calc__breakdown-list mt-loan-calc__breakdown-list--estimate">
            <div><dt>Vehicle Target Price <Info size={14} weight="regular" aria-hidden /></dt><dd>{formatCurrency(derived.targetVehiclePrice)}</dd></div>
          </dl>

          <div className={`mt-loan-calc__estimate-accordion mt-loan-calc__estimate-accordion--row${openEstimateAccordions.taxesFees ? ' is-open' : ''}`}>
            <button
              type="button"
              className="mt-loan-calc__estimate-accordion-summary"
              aria-expanded={openEstimateAccordions.taxesFees}
              onClick={() => toggleEstimateAccordion('taxesFees')}
            >
              <span className="mt-loan-calc__accordion-label">Estimated Taxes &amp; Fees <Info size={14} weight="regular" aria-hidden /></span>
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

          <div className={`mt-loan-calc__estimate-accordion mt-loan-calc__estimate-accordion--row${openEstimateAccordions.netTrade ? ' is-open' : ''}`}>
            <button
              type="button"
              className="mt-loan-calc__estimate-accordion-summary"
              aria-expanded={openEstimateAccordions.netTrade}
              onClick={() => toggleEstimateAccordion('netTrade')}
            >
              <span className="mt-loan-calc__accordion-label">Net Trade Value <Info size={14} weight="regular" aria-hidden /></span>
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

          <dl className="mt-loan-calc__breakdown-list mt-loan-calc__breakdown-list--estimate">
            <div className="is-positive"><dt>Down Payment <Info size={14} weight="regular" aria-hidden /></dt><dd>{formatCurrency(derived.downPayment)}</dd></div>
          </dl>

          <div className="mt-loan-calc__amount-financed mt-loan-calc__amount-financed--row">
            <span className="mt-loan-calc__review-label">Amount Financed <Info size={14} weight="regular" aria-hidden /></span>
            <strong>{formatCurrency(derived.financedPrincipal)}</strong>
            <p>Based on vehicle price, down payment, net trade equity, and taxes and fees included in the loan · {aprValue.toFixed(1)}% APR for {loanTerm} months</p>
          </div>

          <div className={`mt-loan-calc__estimate-accordion mt-loan-calc__estimate-accordion--row${openEstimateAccordions.totalInterest ? ' is-open' : ''}`}>
            <button
              type="button"
              className="mt-loan-calc__estimate-accordion-summary"
              aria-expanded={openEstimateAccordions.totalInterest}
              onClick={() => toggleEstimateAccordion('totalInterest')}
            >
              <span className="mt-loan-calc__accordion-label">Total Interest Paid <Info size={14} weight="regular" aria-hidden /></span>
              <span className="mt-loan-calc__accordion-value is-alert">{formatCurrency(derived.totalInterestPaid)}</span>
              <CaretDown size={18} weight="bold" aria-hidden />
            </button>
            {openEstimateAccordions.totalInterest && (
              <div className="mt-loan-calc__estimate-accordion-detail">
                <dl className="mt-loan-calc__estimate-sublist">
                  <div><dt>Amount financed</dt><dd>{formatCurrency(derived.financedPrincipal)}</dd></div>
                  <div><dt>Total loan payment</dt><dd>{formatCurrency(derived.totalLoanPayments)}</dd></div>
                  <div><dt>Rate &amp; term</dt><dd>{aprValue.toFixed(1)}% APR · {loanTerm} mo</dd></div>
                </dl>
                <div className="mt-loan-calc__amortization">
                  <h3>Year-by-year amortization</h3>
                  <table>
                    <thead><tr><th>Year</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
                    <tbody>{amortizationRows.map((row) => (
                      <tr key={row.year}><td>{row.year}</td><td>{formatCurrency(row.principal)}</td><td>{formatCurrency(row.interest)}</td><td>{formatCurrency(row.balance)}</td></tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <dl className="mt-loan-calc__breakdown-list mt-loan-calc__breakdown-list--estimate">
            <div><dt>Total Loan Payment <Info size={14} weight="regular" aria-hidden /></dt><dd>{formatCurrency(derived.totalLoanPayments)}</dd></div>
            <div><dt>Monthly Payment <Info size={14} weight="regular" aria-hidden /></dt><dd>{formatCurrency(derived.monthlyPayment)}/mo</dd></div>
            <div className="is-strong"><dt>Estimated Total Paid <Info size={14} weight="regular" aria-hidden /></dt><dd>{formatCurrency(derived.totalPaid)}</dd></div>
          </dl>

        </div>
      </section>

    </div>
  );

  return (
    <div className="mt-loan-calc">
      <section className="mt-loan-calc__hero">
        <div className="mt-loan-calc__hero-inner">
          <nav className="mt-loan-calc__breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Auto Loan Calculator</span>
          </nav>
          <h1>Auto Loan Calculator</h1>
          <p>
            Estimate monthly payments, compare financing costs, and see how your loan assumptions change the total. No personal information required.
          </p>
        </div>
      </section>

      <section className="mt-loan-calc__shell-wrap">
        <CardShell
          hasHover={false}
          padding="none"
          noGap
          className="mt-loan-calc__shell"
        >
          <div className="mt-loan-calc__shell-top" ref={shellTopRef}>
            <ol className="mt-loan-calc__steps" aria-label="Calculator steps">
              {steps.map((step, index) => (
                <li
                  key={step.label}
                  className={`mt-loan-calc__step-dot${index === stepIndex ? ' is-active' : index < stepIndex ? ' is-complete' : ''}`}
                >
                  <button
                    type="button"
                    className="mt-loan-calc__step-button"
                    aria-label={`${step.label}, step ${index + 1} of ${steps.length}`}
                    aria-current={index === stepIndex ? 'step' : undefined}
                    onClick={() => goToStep(index)}
                  >
                    <span className="mt-loan-calc__step-number">
                      {index + 1}
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
                  {stepIndex < steps.length - 1 && (
                    <Button
                      color="primary"
                      size="large"
                      onClick={handleContinue}
                      icon={<ArrowRight size={18} weight="bold" aria-hidden />}
                      iconPosition="right"
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {stepIndex !== 4 && (
            <aside className="mt-loan-calc__sidebar">
              <CardShell
                hasHover={false}
                padding="lg"
                className="mt-loan-calc__summary-card"
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
                    <dd>{formatCurrency(derived.downPayment)}</dd>
                  </div>
                  <div>
                    <dt>Rate &amp; term</dt>
                    <dd>{aprValue.toFixed(1)}% APR · {loanTerm} mo</dd>
                  </div>
                  <div>
                    <dt>Vehicle context</dt>
                    <dd>{vehiclePathMode === 'known' ? selectedVehicle?.make ?? 'Not selected' : browsedBodyStyle}</dd>
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
      </section>

      <div className="mt-loan-calc__below">
        <div className="mt-loan-calc__below-inner">
        <section className="mt-loan-calc__info-section" aria-labelledby="mt-loan-calc-afford-heading">
          <div className="mt-loan-calc__section-heading">
            <span className="mt-loan-calc__section-kicker">Plan with confidence</span>
            <h2 id="mt-loan-calc-afford-heading">Understand what you can afford</h2>
            <p>Connect your monthly budget with the full cost of buying and financing a vehicle.</p>
          </div>
          <div className="mt-loan-calc__info-grid">
            <article className="mt-loan-calc__info-card">
              <span className="mt-loan-calc__info-mark"><CurrencyDollar size={20} weight="bold" aria-hidden /></span>
              <h3>Budget-first guidance</h3>
              <p>Start with a vehicle price or a monthly payment, then see how your loan assumptions change the estimate.</p>
            </article>
            <article className="mt-loan-calc__info-card">
              <span className="mt-loan-calc__info-mark"><Info size={20} weight="bold" aria-hidden /></span>
              <h3>Taxes, fees, and trade-in context</h3>
              <p>Include estimated taxes, registration, dealer fees, and trade equity for a clearer view of the amount financed.</p>
            </article>
            <article className="mt-loan-calc__info-card">
              <span className="mt-loan-calc__info-mark"><Car size={20} weight="bold" aria-hidden /></span>
              <h3>Recommendations for your budget</h3>
              <p>Use your estimate to compare financing scenarios and build a budget that fits your plans.</p>
            </article>
          </div>
        </section>

        <section className="mt-loan-calc__info-section mt-loan-calc__faq" aria-labelledby="mt-loan-calc-faq-heading">
          <div className="mt-loan-calc__section-heading">
            <span className="mt-loan-calc__section-kicker">Auto financing basics</span>
            <h2 id="mt-loan-calc-faq-heading">Frequently asked questions</h2>
          </div>
          <div className="mt-loan-calc__faq-list">
            {calculatorFaqs.map(({ question, answer }) => (
              <details key={question} className="mt-loan-calc__faq-item">
                <summary>{question}<CaretDown size={18} weight="bold" aria-hidden /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        </div>
      </div>
    </div>
  );
};

export default AutoLoanCalculator;
