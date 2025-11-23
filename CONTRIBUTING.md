# Contributing to MotorTrend Onboarding

Thank you for contributing! This guide will help you follow our design system principles and maintain code quality.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Design System Principles](#design-system-principles)
3. [Atom Composition Rules](#atom-composition-rules)
4. [Design Token Usage](#design-token-usage)
5. [Component Development](#component-development)
6. [Code Quality](#code-quality)
7. [Pull Request Process](#pull-request-process)
8. [Resources](#resources)

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Familiarity with React, TypeScript, and CSS

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd motortrend-onboarding

# Install dependencies (includes husky git hooks)
npm install

# Start development server
npm run dev

# Run linters
npm run lint:all
```

---

## Design System Principles

We follow **Atomic Design** principles with strict token governance:

### Atomic Hierarchy

```
Atoms → Molecules → Organisms → Templates → Pages
```

- **Atoms**: Basic building blocks (Button, Icon, Badge, Tooltip, ModalShell, CardShell)
- **Molecules**: Simple combinations of atoms (HorizontalCard, VerticalCard, VehicleCard)
- **Organisms**: Complex UI sections (VehiclesSection, NewsSection, GlobalHeader)
- **Templates**: Page layouts
- **Pages**: Complete views

### Key Principles

1. ✅ **Compose, don't recreate** - Use existing atoms instead of building custom implementations
2. ✅ **Tokens over hardcoded values** - Always use design tokens for colors, spacing, shadows, etc.
3. ✅ **Single responsibility** - Each component should do one thing well
4. ✅ **Reusability** - Build components that can be used across multiple contexts

---

## Atom Composition Rules

### 🚨 REQUIRED: Use These Atoms

#### 1. ModalShell - For All Modals and Drawers

**❌ DON'T:**
```tsx
// Custom overlay implementation
<div className="modal-overlay" onClick={onClose}>
  <div className="modal-content">
    {/* content */}
  </div>
</div>
```

**✅ DO:**
```tsx
import ModalShell from '../atoms/ModalShell';

<ModalShell isOpen={isOpen} onClose={onClose} maxWidth="600px">
  <div className="modal-content">
    {/* content */}
  </div>
</ModalShell>
```

**Benefits:**
- ✅ Consistent overlay and positioning
- ✅ Automatic escape key handling
- ✅ Body scroll locking
- ✅ Click-outside-to-close
- ✅ Accessibility built-in

**Documentation:** [ModalShell README](/src/components/atoms/ModalShell/README.md)

---

#### 2. CardShell - For All Card Components

**❌ DON'T:**
```tsx
// Custom card wrapper
<div className="custom-card">
  {/* content */}
</div>
```

```css
.custom-card {
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

**✅ DO:**
```tsx
import CardShell from '../atoms/CardShell';

<CardShell hasHover={true} padding="md">
  {/* content */}
</CardShell>
```

**Benefits:**
- ✅ Consistent padding, shadows, and border-radius
- ✅ Standardized hover states
- ✅ No duplicate CSS
- ✅ Easy to maintain

**Documentation:** [Atom Composition Guide - CardShell](/docs/ATOM_COMPOSITION_GUIDE.md#cardshell-atom)

---

#### 3. Badge - For All Status Indicators

**❌ DON'T:**
```tsx
// Custom badge implementation
<span className="custom-badge">New</span>
```

```css
.custom-badge {
  padding: 4px 8px;
  background: #FFB74D;
  border-radius: 4px;
  font-size: 12px;
}
```

**✅ DO:**
```tsx
import Badge from '../atoms/Badge';

<Badge variant="new">New</Badge>
<Badge variant="premium">Premium</Badge>
<Badge variant="verified">Verified</Badge>
```

**Benefits:**
- ✅ Consistent variants and colors
- ✅ Uniform sizing and spacing
- ✅ Semantic meaning
- ✅ Easy to update globally

**Documentation:** [Atom Composition Guide - Badge](/docs/ATOM_COMPOSITION_GUIDE.md#badge-atom)

---

#### 4. Tooltip - For All Help Text

**❌ DON'T:**
```tsx
// Custom tooltip implementation
<div className="custom-tooltip-wrapper">
  <Icon name="help" />
  <div className="custom-tooltip">Help text</div>
</div>
```

**✅ DO:**
```tsx
import Tooltip from '../atoms/Tooltip';

<Tooltip content="Help text" position="top">
  <Icon name="help" />
</Tooltip>
```

**Benefits:**
- ✅ Consistent positioning and styling
- ✅ Automatic show/hide behavior
- ✅ Accessibility support
- ✅ Mobile-friendly

**Documentation:** [Atom Composition Guide - Tooltip](/docs/ATOM_COMPOSITION_GUIDE.md#tooltip-atom)

---

## Design Token Usage

### 🚨 REQUIRED: Use Design Tokens

All CSS must use design tokens. **No hardcoded values allowed.**

### Colors

**❌ DON'T:**
```css
.button {
  background-color: #E90C17;
  color: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
```

**✅ DO:**
```css
.button {
  background-color: var(--color-primary-1);
  color: var(--color-white);
  border: 1px solid var(--color-border-light);
}
```

**Available tokens:**
- `--color-neutrals-1` through `--color-neutrals-8`
- `--color-primary-1`, `--color-primary-2`
- `--color-semantic-success`, `--color-semantic-warning`, `--color-semantic-error`
- `--color-overlay-light`, `--color-overlay-medium`, `--color-overlay-dark`

---

### Spacing

**❌ DON'T:**
```css
.card {
  padding: 24px;
  margin: 16px;
  gap: 8px;
}
```

**✅ DO:**
```css
.card {
  padding: var(--spacing-3);
  margin: var(--spacing-2);
  gap: var(--spacing-1);
}
```

**Available tokens:**
- `--spacing-0` (0px) through `--spacing-6` (48px)
- `--spacing-component-xs` through `--spacing-component-xxl`
- `--spacing-gap-xs` through `--spacing-gap-md`

---

### Shadows

**❌ DON'T:**
```css
.modal {
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.4);
}
```

**✅ DO:**
```css
.modal {
  box-shadow: var(--shadow-modal);
}
```

**Available tokens:**
- `--shadow-card`, `--shadow-card-hover`
- `--shadow-modal`
- `--shadow-text-dark`, `--shadow-text-medium`, `--shadow-text-light`

---

### Typography

**❌ DON'T:**
```css
.heading {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}
```

**✅ DO:**
```css
.heading {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-bold);
}
```

**Available tokens:**
- `--font-heading`, `--font-body`
- `--font-weight-regular`, `--font-weight-medium`, `--font-weight-bold`

---

### Border Radius

**❌ DON'T:**
```css
.card {
  border-radius: 8px;
}
```

**✅ DO:**
```css
.card {
  border-radius: var(--border-radius-md);
}
```

**Available tokens:**
- `--border-radius-sm` (4px)
- `--border-radius-md` (8px)
- `--border-radius-lg` (12px)
- `--border-radius-xl` (24px)

---

### Transitions

**❌ DON'T:**
```css
.button {
  transition: all 0.2s ease;
}
```

**✅ DO:**
```css
.button {
  transition: all var(--transition-fast);
}
```

**Available tokens:**
- `--transition-fast` (0.2s)
- `--transition-medium` (0.3s)
- `--transition-slow` (0.4s)

---

## Component Development

### Creating a New Component

1. **Determine atomic level** - Is it an atom, molecule, or organism?
2. **Check for existing atoms** - Can you compose existing atoms?
3. **Use design tokens** - No hardcoded values
4. **Create component files**:

```
src/components/YourComponent/
├── YourComponent.tsx
├── YourComponent.css
└── index.ts
```

### Component Template

```tsx
// YourComponent.tsx
import React from 'react';
import './YourComponent.css';

export interface YourComponentProps {
  // Props here
}

export const YourComponent: React.FC<YourComponentProps> = ({
  // Destructure props
}) => {
  return (
    <div className="your-component">
      {/* Component content */}
    </div>
  );
};

export default YourComponent;
```

```css
/* YourComponent.css */
.your-component {
  padding: var(--spacing-3);
  background-color: var(--color-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-card);
}

.your-component:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
  transition: all var(--transition-fast);
}
```

```ts
// index.ts
export { YourComponent } from './YourComponent';
export type { YourComponentProps } from './YourComponent';
```

---

### Composing Atoms Example

```tsx
import React from 'react';
import ModalShell from '../atoms/ModalShell';
import CardShell from '../atoms/CardShell';
import Badge from '../atoms/Badge';
import Tooltip from '../atoms/Tooltip';
import './VehicleSelector.css';

export const VehicleSelector: React.FC<Props> = ({ isOpen, onClose, vehicles }) => {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <div className="vehicle-selector">
        <h2>Select a Vehicle</h2>
        
        {vehicles.map(vehicle => (
          <CardShell key={vehicle.id} hasHover={true} padding="md">
            <div className="vehicle-option">
              <img src={vehicle.image} alt={vehicle.name} />
              <div className="vehicle-info">
                <h4>{vehicle.name}</h4>
                <div className="vehicle-badges">
                  {vehicle.isNew && <Badge variant="new">New</Badge>}
                  {vehicle.isPremium && <Badge variant="premium">Premium</Badge>}
                  {vehicle.isVerified && (
                    <Tooltip content="Expert verified">
                      <Badge variant="verified">Verified</Badge>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </CardShell>
        ))}
      </div>
    </ModalShell>
  );
};
```

---

## Code Quality

### Pre-commit Checks

Before every commit, these checks run automatically:

1. **CSS Token Linter** - Scans for hardcoded values
2. **ESLint** - Checks TypeScript/React code quality

If violations are found, the commit is blocked.

### Manual Checks

```bash
# Run all linters
npm run lint:all

# Check CSS tokens only
npm run lint:css

# Run ESLint only
npm run lint

# Build for production
npm run build
```

### Common Violations

**CSS Token Violations:**
```
❌ Line 12: background-color: #E90C17
💡 Use a color token like var(--color-primary-1)

❌ Line 15: padding: 24px
💡 Use a spacing token like var(--spacing-3)
```

**ESLint Violations:**
```
❌ Hardcoded color in inline style
💡 Use a CSS class with design tokens instead
```

---

## Pull Request Process

### 1. Before Creating PR

- [ ] Run `npm run lint:all` - No violations
- [ ] Run `npm run build` - Build succeeds
- [ ] Test locally in dev and production builds
- [ ] Test responsive design (mobile viewport)
- [ ] Test keyboard navigation
- [ ] Review the [PR template checklist](.github/PULL_REQUEST_TEMPLATE.md)

### 2. Create PR

- Use the PR template (auto-populated)
- Fill out all required sections
- Check all applicable items in the Design System Compliance checklist
- Add screenshots/videos if UI changes
- Link related issues

### 3. Required Checklist Items

**Atom Composition:**
- [ ] ModalShell for all modals
- [ ] CardShell for all cards
- [ ] Badge for all status indicators
- [ ] Tooltip for all help text

**Design Tokens:**
- [ ] No hardcoded colors
- [ ] No hardcoded spacing
- [ ] No hardcoded shadows
- [ ] No hardcoded fonts
- [ ] No inline styles

**Testing:**
- [ ] Tested locally
- [ ] No console errors
- [ ] Pre-commit hook passed

### 4. Review Process

Reviewers will check:
- Atomic design principles followed
- Design tokens used consistently
- Component hierarchy is clear
- Documentation is updated
- Tests pass
- No accessibility issues

---

## Resources

### Documentation

- 📖 [Atom Composition Guide](/docs/ATOM_COMPOSITION_GUIDE.md) - Complete guide with examples
- ⚡ [Atoms Quick Reference](/docs/ATOMS_QUICK_REFERENCE.md) - One-page cheat sheet
- 🔒 [Token Governance](/docs/TOKEN_GOVERNANCE.md) - Design token rules and enforcement
- 🎭 [ModalShell README](/src/components/atoms/ModalShell/README.md) - Detailed modal docs

### Design System

- 🎨 [Global Tokens](/src/design-system/global.css) - All available design tokens
- 📊 [Atomic Design Audit](/documentation/atomic-design-audit) - Component inventory

### Tools

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:css     # Check design token usage
npm run lint:all     # Run all linters
```

---

## Questions?

- Review the [Atom Composition Guide](/docs/ATOM_COMPOSITION_GUIDE.md)
- Check the [Token Governance](/docs/TOKEN_GOVERNANCE.md) documentation
- Look at existing components for examples
- Ask in PR comments or team discussions

---

## Summary

✅ **Always use atoms** - ModalShell, CardShell, Badge, Tooltip  
✅ **Always use tokens** - Colors, spacing, shadows, fonts  
✅ **Always test** - Locally, responsively, accessibly  
✅ **Always document** - Clear props, examples, usage  

**Thank you for contributing to a consistent, maintainable design system!** 🎉


