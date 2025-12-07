# Inline Styles to Tailwind CSS Migration Guide

**MotorTrend Onboarding Project**  
**Last Updated:** December 2024

This guide documents how to convert React inline styles to Tailwind CSS utility classes while maintaining the design system compliance.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [The `cn` Utility](#the-cn-utility)
4. [Migration Patterns](#migration-patterns)
5. [Color Mapping](#color-mapping)
6. [Spacing Mapping](#spacing-mapping)
7. [Typography Mapping](#typography-mapping)
8. [Interactive States](#interactive-states)
9. [Responsive Design](#responsive-design)
10. [Animations](#animations)
11. [Common Patterns](#common-patterns)
12. [Checklist](#checklist)

---

## Overview

The project currently uses inline React styles with CSS variables from the design system. This guide shows how to convert these to Tailwind CSS utility classes for:

- **Smaller bundle size** (tree-shaking unused styles)
- **Better developer experience** (IntelliSense, consistency)
- **Easier maintenance** (standard utility classes)

### Current State (Inline Styles)

```tsx
const buttonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--spacing-2, 16px)',
  backgroundColor: 'var(--color-primary-1, #E90C17)',
  color: 'var(--color-white, #FFFFFF)',
  borderRadius: 'var(--border-radius-md, 8px)',
  fontFamily: 'var(--font-heading, Poppins, sans-serif)',
  fontWeight: 600,
  transition: 'all var(--transition-fast, 150ms ease-in-out)',
};

return <button style={buttonStyle}>Click Me</button>;
```

### Target State (Tailwind Classes)

```tsx
return (
  <button className="flex items-center justify-center p-4 bg-primary-1 text-white rounded-md font-heading font-semibold transition-all duration-150">
    Click Me
  </button>
);
```

---

## Prerequisites

### 1. Install Dependencies

```bash
npm install clsx tailwind-merge
```

### 2. Verify Tailwind Setup

Ensure `src/styles/tailwind.css` is imported in `main.tsx`:

```tsx
import './styles/tailwind.css';
```

### 3. Verify `cn` Utility Exists

Check `src/utils/cn.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

---

## The `cn` Utility

The `cn` function combines `clsx` (conditional classes) with `tailwind-merge` (resolves conflicting classes).

### Basic Usage

```tsx
import { cn } from '../utils/cn';

// Simple combination
cn('px-4', 'py-2', 'bg-blue-500')
// → 'px-4 py-2 bg-blue-500'

// Conditional classes
cn('px-4', isActive && 'bg-blue-500', !isActive && 'bg-gray-500')
// → 'px-4 bg-blue-500' (when isActive is true)

// Object syntax
cn('px-4', {
  'bg-blue-500': isActive,
  'bg-gray-500': !isActive,
  'opacity-50': isDisabled,
})

// Resolving conflicts (tailwind-merge)
cn('px-2', 'px-4')
// → 'px-4' (later class wins)
```

### With Component Props

```tsx
interface ButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ className, variant = 'primary' }) => {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-semibold transition-all',
        // Variant styles
        variant === 'primary' && 'bg-primary-1 text-white hover:bg-primary-2',
        variant === 'secondary' && 'bg-neutrals-3 text-white hover:bg-neutrals-4',
        // Allow override via className prop
        className
      )}
    >
      Click Me
    </button>
  );
};
```

---

## Migration Patterns

### Pattern 1: Simple Static Styles

**Before (Inline)**
```tsx
<div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '24px',
}}>
```

**After (Tailwind)**
```tsx
<div className="flex items-center gap-4 p-6">
```

### Pattern 2: CSS Variables to Tailwind

**Before (Inline with CSS vars)**
```tsx
<div style={{
  backgroundColor: 'var(--color-neutrals-2, #23262F)',
  color: 'var(--color-neutrals-8, #FCFCFD)',
  borderRadius: 'var(--border-radius-md, 8px)',
}}>
```

**After (Tailwind with custom colors)**
```tsx
<div className="bg-neutrals-2 text-neutrals-8 rounded-md">
```

### Pattern 3: Hover/Focus States with useState

**Before (useState for hover)**
```tsx
const [isHovered, setIsHovered] = useState(false);

<button
  style={{
    backgroundColor: isHovered ? 'var(--color-primary-2)' : 'var(--color-primary-1)',
    transform: isHovered ? 'translateY(-2px)' : 'none',
  }}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
```

**After (Tailwind pseudo-classes)**
```tsx
<button className="bg-primary-1 hover:bg-primary-2 hover:-translate-y-0.5 transition-all">
```

### Pattern 4: Responsive Styles with useState

**Before (useState for mobile)**
```tsx
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

<div style={{
  flexDirection: isMobile ? 'column' : 'row',
  padding: isMobile ? '16px' : '32px',
}}>
```

**After (Tailwind responsive)**
```tsx
<div className="flex-col md:flex-row p-4 md:p-8">
```

### Pattern 5: Dynamic Values (Keep Inline)

Some values must remain inline when they're truly dynamic:

```tsx
// Dynamic width based on percentage - KEEP INLINE
<div style={{ width: `${progress}%` }}>

// Dynamic colors from data - KEEP INLINE  
<div style={{ backgroundColor: user.favoriteColor }}>

// Calculated positions - KEEP INLINE
<div style={{ transform: `translateX(${offset}px)` }}>
```

---

## Color Mapping

### Design System Colors → Tailwind Classes

| CSS Variable | Tailwind Class | Hex Value |
|--------------|----------------|-----------|
| `--color-neutrals-1` | `bg-neutrals-1`, `text-neutrals-1` | #141416 |
| `--color-neutrals-2` | `bg-neutrals-2`, `text-neutrals-2` | #23262F |
| `--color-neutrals-3` | `bg-neutrals-3`, `text-neutrals-3` | #353945 |
| `--color-neutrals-4` | `bg-neutrals-4`, `text-neutrals-4` | #6E7481 |
| `--color-neutrals-5` | `bg-neutrals-5`, `text-neutrals-5` | #B1B5C3 |
| `--color-neutrals-6` | `bg-neutrals-6`, `text-neutrals-6` | #E6E8EC |
| `--color-neutrals-7` | `bg-neutrals-7`, `text-neutrals-7` | #F4F5F6 |
| `--color-neutrals-8` | `bg-neutrals-8`, `text-neutrals-8` | #FCFCFD |
| `--color-primary-1` | `bg-primary-1`, `text-primary-1` | #E90C17 |
| `--color-primary-2` | `bg-primary-2`, `text-primary-2` | #c70a15 |
| `--color-blue` | `bg-blue`, `text-blue` | #186CEA |

### Border Colors

```tsx
// Before
style={{ borderColor: 'var(--color-neutrals-6)' }}

// After
className="border-neutrals-6"
```

---

## Spacing Mapping

### 8px Base System

| CSS Variable | Value | Tailwind |
|--------------|-------|----------|
| `--spacing-1` | 8px | `p-2`, `m-2`, `gap-2` |
| `--spacing-2` | 16px | `p-4`, `m-4`, `gap-4` |
| `--spacing-3` | 24px | `p-6`, `m-6`, `gap-6` |
| `--spacing-4` | 32px | `p-8`, `m-8`, `gap-8` |
| `--spacing-5` | 40px | `p-10`, `m-10`, `gap-10` |
| `--spacing-6` | 48px | `p-12`, `m-12`, `gap-12` |

### Common Conversions

```tsx
// Before
style={{ padding: 'var(--spacing-2, 16px)' }}
style={{ margin: 'var(--spacing-3, 24px)' }}
style={{ gap: 'var(--spacing-1, 8px)' }}

// After
className="p-4"
className="m-6"
className="gap-2"
```

---

## Typography Mapping

### Font Families

| CSS Variable | Tailwind Class |
|--------------|----------------|
| `--font-heading` | `font-heading` |
| `--font-body` | `font-body` |
| `--font-button` | `font-button` |
| `--font-caption` | `font-caption` |

### Font Sizes

| Size | Tailwind | Pixels |
|------|----------|--------|
| Hero | `text-8xl` | 96px |
| H1 | `text-6xl` | 64px |
| H2 | `text-5xl` | 48px |
| H3 | `text-4xl` | 40px |
| H4 | `text-3xl` | 32px |
| H5 | `text-2xl` | 24px |
| H6 | `text-xl` | 20px |
| Body1 | `text-xl` | 20px |
| Body2 | `text-lg` | 18px |
| Body3 | `text-base` | 16px |
| Caption1 | `text-sm` | 14px |
| Caption2 | `text-xs` | 12px |

### Font Weights

| CSS Variable | Tailwind |
|--------------|----------|
| `--font-weight-regular` (400) | `font-normal` |
| `--font-weight-medium` (500) | `font-medium` |
| `--font-weight-bold` (600) | `font-semibold` |
| 700 | `font-bold` |

### Typography Utilities (IDS)

```tsx
// Use IDS typography utilities
className="typography-h5"
className="typography-body3"
className="typography-caption1"
```

---

## Interactive States

### Hover States

```tsx
// Before (useState)
const [isHovered, setIsHovered] = useState(false);
<div
  style={{ opacity: isHovered ? 1 : 0.8 }}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>

// After (Tailwind)
<div className="opacity-80 hover:opacity-100">
```

### Focus States

```tsx
// Before
style={{ outline: isFocused ? '2px solid var(--color-primary-1)' : 'none' }}

// After
className="focus:outline-none focus:ring-2 focus:ring-primary-1"
```

### Active/Pressed States

```tsx
// Before
style={{ transform: isPressed ? 'scale(0.98)' : 'scale(1)' }}

// After
className="active:scale-[0.98]"
```

### Disabled States

```tsx
// Before
style={{ opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}

// After
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

### Group Hover (Parent-Child)

```tsx
// Before (complex useState)
const [isCardHovered, setIsCardHovered] = useState(false);
<div onMouseEnter={() => setIsCardHovered(true)}>
  <span style={{ color: isCardHovered ? 'red' : 'gray' }}>

// After (group)
<div className="group">
  <span className="text-gray-500 group-hover:text-red-500">
```

---

## Responsive Design

### Breakpoint Reference

| Breakpoint | Min Width | Prefix |
|------------|-----------|--------|
| Mobile | 0px | (none) |
| sm | 640px | `sm:` |
| md | 768px | `md:` |
| lg | 1024px | `lg:` |
| xl | 1280px | `xl:` |
| 2xl | 1536px | `2xl:` |

### Common Patterns

```tsx
// Before (useState + useEffect)
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

<div style={{
  display: isMobile ? 'block' : 'flex',
  fontSize: isMobile ? '14px' : '16px',
  padding: isMobile ? '16px' : '32px',
}}>

// After (Tailwind responsive)
<div className="block md:flex text-sm md:text-base p-4 md:p-8">
```

### Hide/Show Elements

```tsx
// Before
style={{ display: isMobile ? 'none' : 'block' }}

// After
className="hidden md:block"  // Hidden on mobile, visible on md+
className="md:hidden"        // Visible on mobile, hidden on md+
```

### Grid Columns

```tsx
// Before
style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)' }}

// After
className="grid grid-cols-1 md:grid-cols-3"
```

---

## Animations

### Transition Utilities

```tsx
// Before
style={{ transition: 'all var(--transition-fast, 150ms ease-in-out)' }}

// After
className="transition-all duration-150 ease-in-out"
```

### Transform on Hover

```tsx
// Before
style={{ transform: isHovered ? 'translateY(-4px)' : 'none' }}

// After  
className="hover:-translate-y-1 transition-transform"
```

### Keyframe Animations (Keep in CSS)

For complex keyframe animations, keep them in a CSS file and use `@keyframes`:

```css
/* In component CSS or tailwind.css */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 200ms ease-out;
}
```

```tsx
// In component
className="animate-fade-in"
```

---

## Common Patterns

### Card Component

```tsx
// Before
const cardStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-neutrals-8, #FCFCFD)',
  border: '1px solid var(--color-neutrals-6, #E6E8EC)',
  borderRadius: 'var(--border-radius-md, 8px)',
  padding: 'var(--spacing-3, 24px)',
  boxShadow: 'var(--shadow-depth-5)',
  transition: 'all var(--transition-normal, 250ms ease-in-out)',
};

// After
className={cn(
  "bg-neutrals-8 border border-neutrals-6 rounded-md p-6",
  "shadow-sm transition-all duration-250",
  "hover:shadow-md hover:-translate-y-0.5"
)}
```

### Button Component

```tsx
// Before
const buttonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '44px',
  padding: '0 24px',
  backgroundColor: isHovered ? 'var(--color-primary-2)' : 'var(--color-primary-1)',
  color: '#FFFFFF',
  borderRadius: 'var(--border-radius-md, 8px)',
  fontFamily: 'var(--font-heading)',
  fontWeight: 600,
  fontSize: '16px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 150ms ease-in-out',
};

// After
className={cn(
  "inline-flex items-center justify-center h-11 px-6",
  "bg-primary-1 hover:bg-primary-2 text-white",
  "rounded-md font-heading font-semibold text-base",
  "transition-all duration-150 cursor-pointer"
)}
```

### Input Component

```tsx
// Before
const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '48px',
  padding: '0 16px',
  backgroundColor: 'var(--color-neutrals-8)',
  border: `1px solid ${isFocused ? 'var(--color-primary-1)' : 'var(--color-neutrals-6)'}`,
  borderRadius: 'var(--border-radius-md)',
  fontFamily: 'var(--font-body)',
  fontSize: '16px',
  color: 'var(--color-neutrals-2)',
  outline: 'none',
  transition: 'border-color 150ms ease-in-out',
};

// After
className={cn(
  "w-full h-12 px-4",
  "bg-neutrals-8 border border-neutrals-6 rounded-md",
  "font-body text-base text-neutrals-2",
  "outline-none transition-colors duration-150",
  "focus:border-primary-1"
)}
```

### Badge Component

```tsx
// Before
const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '6px 12px',
  backgroundColor: variant === 'success' ? '#e7f4e7' : '#fae5e5',
  color: variant === 'success' ? '#283d32' : '#4c272e',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 500,
};

// After
className={cn(
  "inline-flex items-center px-3 py-1.5 rounded text-xs font-medium",
  variant === 'success' && "bg-success-4 text-success-1",
  variant === 'error' && "bg-error-4 text-error-1"
)}
```

---

## Migration Checklist

Use this checklist when migrating a component:

### Pre-Migration
- [ ] Identify all inline `style` props in the component
- [ ] List all `useState` hooks used for hover/focus/responsive states
- [ ] Check for `useEffect` hooks managing resize listeners
- [ ] Note any truly dynamic values that must stay inline

### Migration Steps
- [ ] Import the `cn` utility: `import { cn } from '../utils/cn';`
- [ ] Convert static styles to Tailwind classes
- [ ] Replace hover `useState` with `hover:` prefix
- [ ] Replace focus `useState` with `focus:` prefix
- [ ] Replace responsive `useState`/`useEffect` with breakpoint prefixes
- [ ] Remove unused `useState` and `useEffect` hooks
- [ ] Keep truly dynamic values as inline styles

### Post-Migration
- [ ] Test all interactive states (hover, focus, active, disabled)
- [ ] Test all breakpoints (mobile, tablet, desktop)
- [ ] Verify colors match design system
- [ ] Verify spacing matches 8px grid
- [ ] Check for any visual regressions
- [ ] Remove the old CSS file if empty

### Code Review
- [ ] No hardcoded color values (use design tokens)
- [ ] No hardcoded spacing values (use Tailwind spacing)
- [ ] Using `cn` utility for conditional classes
- [ ] Responsive classes follow mobile-first approach
- [ ] Component accepts `className` prop for customization

---

## Quick Reference Card

```
╔═══════════════════════════════════════════════════════════════╗
║                    TAILWIND QUICK REFERENCE                    ║
╠═══════════════════════════════════════════════════════════════╣
║ FLEXBOX                                                        ║
║   flex, inline-flex, flex-col, flex-row                       ║
║   items-center, items-start, items-end                        ║
║   justify-center, justify-between, justify-start              ║
║   gap-2 (8px), gap-4 (16px), gap-6 (24px)                    ║
╠═══════════════════════════════════════════════════════════════╣
║ SPACING (Tailwind unit = 4px)                                 ║
║   p-2 (8px), p-4 (16px), p-6 (24px), p-8 (32px)             ║
║   m-2, m-4, m-6, m-8                                          ║
║   px-4, py-2 (horizontal/vertical)                            ║
║   pt-4, pr-4, pb-4, pl-4 (individual sides)                  ║
╠═══════════════════════════════════════════════════════════════╣
║ COLORS                                                         ║
║   bg-neutrals-{1-8}, text-neutrals-{1-8}                      ║
║   bg-primary-1, text-primary-1                                ║
║   border-neutrals-6                                            ║
╠═══════════════════════════════════════════════════════════════╣
║ TYPOGRAPHY                                                     ║
║   font-heading, font-body                                      ║
║   text-xs (12px), text-sm (14px), text-base (16px)           ║
║   text-lg (18px), text-xl (20px), text-2xl (24px)            ║
║   font-normal (400), font-medium (500), font-semibold (600)  ║
╠═══════════════════════════════════════════════════════════════╣
║ BORDERS & RADIUS                                               ║
║   border, border-2                                             ║
║   rounded-sm (4px), rounded-md (8px), rounded-lg (16px)      ║
║   rounded-full (100px)                                         ║
╠═══════════════════════════════════════════════════════════════╣
║ STATES                                                         ║
║   hover:bg-primary-2, focus:ring-2, active:scale-95          ║
║   disabled:opacity-50, group-hover:text-white                 ║
╠═══════════════════════════════════════════════════════════════╣
║ RESPONSIVE                                                     ║
║   (mobile), sm:, md: (768px), lg: (1024px), xl: (1280px)     ║
║   Example: "flex-col md:flex-row"                             ║
╠═══════════════════════════════════════════════════════════════╣
║ TRANSITIONS                                                    ║
║   transition-all, transition-colors, transition-transform     ║
║   duration-150, duration-200, duration-300                    ║
║   ease-in-out                                                  ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Example: Full Component Migration

### Before (Inline Styles)

```tsx
import React, { useState, useEffect } from 'react';

const ExampleCard: React.FC<{ title: string }> = ({ title }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    backgroundColor: 'var(--color-neutrals-8, #FCFCFD)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-md, 8px)',
    padding: isMobile ? 'var(--spacing-2, 16px)' : 'var(--spacing-3, 24px)',
    boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.12)' : 'var(--shadow-depth-5)',
    transform: isHovered ? 'translateY(-4px)' : 'none',
    transition: 'all var(--transition-normal, 250ms ease-in-out)',
    cursor: 'pointer',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: isMobile ? '18px' : '24px',
    fontWeight: 600,
    color: 'var(--color-neutrals-2, #23262F)',
    margin: 0,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 style={titleStyle}>{title}</h3>
    </div>
  );
};
```

### After (Tailwind Classes)

```tsx
import React from 'react';
import { cn } from '../utils/cn';

interface ExampleCardProps {
  title: string;
  className?: string;
}

const ExampleCard: React.FC<ExampleCardProps> = ({ title, className }) => {
  return (
    <div
      className={cn(
        // Layout
        "flex flex-col md:flex-row",
        // Colors & borders
        "bg-neutrals-8 border border-neutrals-6 rounded-md",
        // Spacing (responsive)
        "p-4 md:p-6",
        // Shadow & hover effects
        "shadow-sm hover:shadow-lg hover:-translate-y-1",
        // Transitions
        "transition-all duration-250 cursor-pointer",
        // Allow customization
        className
      )}
    >
      <h3 className="font-heading text-lg md:text-2xl font-semibold text-neutrals-2 m-0">
        {title}
      </h3>
    </div>
  );
};

export default ExampleCard;
```

### Benefits of Migration

| Aspect | Before | After |
|--------|--------|-------|
| Lines of code | 45 | 25 |
| useState hooks | 2 | 0 |
| useEffect hooks | 1 | 0 |
| Event handlers | 2 | 0 |
| Bundle impact | Runtime styles | Static classes |
| Maintainability | Custom logic | Standard utilities |

---

## Conclusion

This migration guide provides a systematic approach to converting inline React styles to Tailwind CSS utility classes. The key benefits are:

1. **Reduced complexity** - No more useState/useEffect for visual states
2. **Better performance** - Static classes vs runtime style objects
3. **Consistency** - Standard utility classes across the codebase
4. **Developer experience** - IntelliSense, easier code review

Start with simple components and gradually work up to more complex ones. Keep truly dynamic values (percentages, calculated positions) as inline styles.

---

**Questions?** Check the [Tailwind CSS documentation](https://tailwindcss.com/docs) or the `src/styles/tailwind.css` file for available design tokens.
