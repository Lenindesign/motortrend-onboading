# Design Token Quick Reference
**MotorTrend Onboarding Project**  
**Updated:** December 2024

A quick reference guide for all available design tokens in the system.

---

## 🎨 Colors

### Neutrals
```css
--color-neutrals-1    /* #141416 - Headers, footers */
--color-neutrals-2    /* #23262F - Dark backgrounds */
--color-neutrals-3    /* #353945 - Buttons, borders */
--color-neutrals-4    /* #6E7481 - Secondary text */
--color-neutrals-5    /* #B1B5C3 - Tertiary text, placeholders */
--color-neutrals-6    /* #E6E8EC - Borders */
--color-neutrals-7    /* #F4F5F6 - Light backgrounds */
--color-neutrals-8    /* #FCFCFD - Text on dark, input backgrounds */
--color-neutrals-2-5  /* #282a30 - Extended neutral */
--color-neutrals-3-5  /* #374151 - Extended neutral */
```

### Primary
```css
--color-primary-1     /* #E90C17 - MotorTrend Red */
--color-primary-2     /* #E90C17 - MotorTrend Red */
```

### Semantic Status Colors
```css
/* Success */
--color-semantic-success        /* #34A853 */
--color-semantic-success-light  /* #E8F5E9 */
--color-semantic-success-dark   /* #2E7D32 */

/* Warning */
--color-semantic-warning        /* #F59E0B */
--color-semantic-warning-light  /* #FFF3E0 */
--color-semantic-warning-dark   /* #D97706 */

/* Error */
--color-semantic-error          /* #EA4335 */
--color-semantic-error-light    /* #FFEBEE */
--color-semantic-error-dark     /* #C62828 */

/* Info */
--color-semantic-info           /* #186CEA */
--color-semantic-info-light     /* #E3F2FD */
--color-semantic-info-dark      /* #1976D2 */
```

### Rating Colors
```css
--color-rating-motortrend  /* #FFB74D - MotorTrend rating */
--color-rating-community   /* #33CCFF - Community rating */
--color-rating-staff       /* #FFB74D - Staff rating */
```

### State Colors
```css
--color-hover-overlay        /* rgba(0, 0, 0, 0.1) */
--color-hover-overlay-dark   /* rgba(0, 0, 0, 0.2) */
--color-active-overlay       /* rgba(0, 0, 0, 0.15) */
--color-disabled-bg          /* var(--color-neutrals-3) */
--color-disabled-text        /* var(--color-neutrals-5) */
--color-disabled-opacity     /* 0.5 */
```

### Overlay Colors
```css
--color-overlay-light   /* rgba(0, 0, 0, 0.5) */
--color-overlay-medium  /* rgba(0, 0, 0, 0.7) */
--color-overlay-dark    /* rgba(0, 0, 0, 0.9) */
```

### Gradient Overlay
```css
--color-gradient-overlay-start  /* rgba(0, 0, 0, 0.9) */
--color-gradient-overlay-mid   /* rgba(0, 0, 0, 0.7) */
--color-gradient-overlay-end   /* rgba(0, 0, 0, 0) */
```

### Basic Colors
```css
--color-blue    /* #186CEA */
--color-white   /* #FFFFFF */
--color-black   /* #000000 */
```

---

## 📏 Spacing

### Base Spacing (8px system)
```css
--spacing-0  /* 0px */
--spacing-1  /* 8px */
--spacing-2  /* 16px */
--spacing-3  /* 24px */
--spacing-4  /* 32px */
--spacing-5  /* 40px */
--spacing-6  /* 48px */
```

### Component Padding
```css
--spacing-component-xs   /* 4px */
--spacing-component-sm   /* 8px */
--spacing-component-md   /* 12px */
--spacing-component-lg   /* 16px */
--spacing-component-xl   /* 24px */
--spacing-component-xxl  /* 32px */
```

### Component Gap
```css
--spacing-gap-xs   /* 4px */
--spacing-gap-sm   /* 8px */
--spacing-gap-md   /* 12px */
--spacing-gap-lg   /* 16px */
--spacing-gap-xl   /* 24px */
--spacing-gap-xxl  /* 32px */
```

### Button Padding
```css
--spacing-button-xs  /* 6px 12px */
--spacing-button-sm  /* 8px 16px */
--spacing-button-md   /* 12px 24px */
--spacing-button-lg   /* 16px 32px */
```

### Card Padding
```css
--spacing-card-xs  /* 8px */
--spacing-card-sm  /* 12px */
--spacing-card-md  /* 16px */
--spacing-card-lg  /* 24px */
--spacing-card-xl  /* 32px */
```

### Modal Spacing
```css
--spacing-modal-xs  /* 16px */
--spacing-modal-sm  /* 20px */
--spacing-modal-md  /* 24px */
--spacing-modal-lg  /* 32px */
--spacing-modal-xl  /* 40px */
```

### Grid Spacing
```css
--spacing-grid-xs   /* 8px */
--spacing-grid-sm   /* 12px */
--spacing-grid-md   /* 16px */
--spacing-grid-lg   /* 24px */
--spacing-grid-xl   /* 32px */
--spacing-grid-xxl  /* 48px */
```

### Section Spacing
```css
--section-spacing-vertical    /* 32px */
--section-spacing-horizontal  /* 24px */
```

---

## 🎭 Effects

### Border Radius
```css
--border-radius-sm     /* 4px */
--border-radius-md     /* 8px */
--border-radius-lg     /* 16px */
--border-radius-full   /* 100px */
--border-radius-circle /* 400px */
```

### Shadows - Depth System
```css
--shadow-depth-0  /* none */
--shadow-depth-1  /* Subtle elevation */
--shadow-depth-2  /* Low elevation */
--shadow-depth-3  /* Medium elevation */
--shadow-depth-4  /* High elevation */
--shadow-depth-5  /* Standard elevation */
--shadow-depth-6  /* Very high elevation */
--shadow-depth-7  /* Highest elevation */
```

### Component Shadows
```css
--shadow-card           /* Card default shadow */
--shadow-card-hover     /* Card hover shadow */
--shadow-button         /* Button default shadow */
--shadow-button-hover   /* Button hover shadow */
--shadow-button-primary /* Primary button shadow */
--shadow-modal          /* Modal shadow */
--shadow-modal-lg       /* Large modal shadow */
--shadow-dropdown       /* Dropdown shadow */
```

### Text Shadows
```css
--shadow-text-sm  /* Small text shadow */
--shadow-text-md  /* Medium text shadow */
--shadow-text-lg  /* Large text shadow */
```

### Transitions
```css
--transition-fast    /* 150ms ease-in-out */
--transition-normal  /* 250ms ease-in-out */
--transition-slow    /* 350ms ease-in-out */
```

---

## 📐 Layout

### Max Width
```css
--max-width-container  /* 1280px */
--max-width-content    /* 1280px */
```

---

## 💡 Usage Examples

### Card Component
```css
.card {
  background: var(--color-neutrals-8);
  border: 1px solid var(--color-neutrals-6);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-card-md);
  box-shadow: var(--shadow-card);
  transition: all var(--transition-fast);
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
}
```

### Button Component
```css
.button {
  padding: var(--spacing-button-sm);
  background: var(--color-primary-1);
  color: var(--color-white);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-button-primary);
  transition: all var(--transition-fast);
}

.button:hover {
  box-shadow: var(--shadow-button-hover);
}
```

### Modal Component
```css
.modal-overlay {
  background-color: var(--color-overlay-medium);
}

.modal-content {
  background: var(--color-neutrals-8);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-modal-md);
  box-shadow: var(--shadow-modal);
}
```

### Success Message
```css
.success-message {
  background: var(--color-semantic-success-light);
  color: var(--color-semantic-success-dark);
  border: 1px solid var(--color-semantic-success);
  padding: var(--spacing-component-md);
  border-radius: var(--border-radius-sm);
}
```

### Grid Layout
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-grid-lg);
}
```

---

## ✅ Best Practices

1. **Always use CSS variables** - Never hardcode colors or spacing
2. **Use semantic tokens** - Prefer `--color-semantic-success` over `#34A853`
3. **Follow 8px system** - Use spacing tokens aligned with 8px base
4. **Use component-specific tokens** - Prefer `--spacing-card-md` over `--spacing-2` for cards
5. **Consistent shadows** - Use shadow depth system for elevation
6. **State colors** - Use state tokens for hover/active/disabled states

---

## 📚 Related Documentation

- **[CURSOR_DESIGN_SYSTEM_RULES.md](./CURSOR_DESIGN_SYSTEM_RULES.md)** - Design system rules and usage guidelines
- **[DESIGN_SYSTEM_ENHANCEMENTS.md](./DESIGN_SYSTEM_ENHANCEMENTS.md)** - Full enhancement recommendations
- **[DESIGN_SYSTEM_SUMMARY.md](./DESIGN_SYSTEM_SUMMARY.md)** - Executive summary of enhancements
- **[CTA_STANDARDIZATION.md](./CTA_STANDARDIZATION.md)** - CTA/Button system documentation
- **[FIGMA_INTEGRATION.md](./FIGMA_INTEGRATION.md)** - Figma integration guide
- `src/design-system/tokens/` - TypeScript token definitions

