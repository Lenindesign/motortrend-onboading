# Design Token Governance

This document outlines the design token governance system that ensures consistent use of design tokens throughout the codebase.

---

## Overview

The token governance system consists of three main components:

1. **ESLint Plugin** - Detects hardcoded values in TypeScript/React code
2. **CSS Linter** - Scans CSS files for hardcoded values
3. **Pre-commit Hook** - Automatically runs checks before each commit

---

## Quick Start

### Run Token Linters

```bash
# Check CSS files for hardcoded values
npm run lint:css

# Run ESLint (includes design token rules)
npm run lint

# Run both linters
npm run lint:all
```

### Install Pre-commit Hook

```bash
# Install husky and set up git hooks
npm install
npm run prepare
```

Once installed, the pre-commit hook will automatically run before every commit and prevent commits that contain design token violations.

---

## What Gets Flagged

### ❌ Hardcoded Colors

**Bad:**
```css
.button {
  background-color: #E90C17;
  color: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
```

**Good:**
```css
.button {
  background-color: var(--color-primary-1);
  color: var(--color-white);
  border: 1px solid var(--color-border-light);
}
```

---

### ❌ Hardcoded Spacing

**Bad:**
```css
.card {
  padding: 24px;
  margin: 16px;
  gap: 8px;
}
```

**Good:**
```css
.card {
  padding: var(--spacing-3);
  margin: var(--spacing-2);
  gap: var(--spacing-1);
}
```

---

### ❌ Hardcoded Shadows

**Bad:**
```css
.modal {
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.4);
}
```

**Good:**
```css
.modal {
  box-shadow: var(--shadow-modal);
}
```

---

### ❌ Hardcoded Fonts

**Bad:**
```css
.heading {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}
```

**Good:**
```css
.heading {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-bold);
}
```

---

### ❌ Hardcoded Border Radius

**Bad:**
```css
.card {
  border-radius: 8px;
}
```

**Good:**
```css
.card {
  border-radius: var(--border-radius-md);
}
```

---

### ❌ Hardcoded Transitions

**Bad:**
```css
.button {
  transition: all 0.2s ease;
}
```

**Good:**
```css
.button {
  transition: all var(--transition-fast);
}
```

---

### ❌ Inline Styles in JSX

**Bad:**
```tsx
<div style={{ color: '#E90C17', padding: '24px' }}>
  Content
</div>
```

**Good:**
```tsx
<div className="error-message">
  Content
</div>
```

```css
.error-message {
  color: var(--color-primary-1);
  padding: var(--spacing-3);
}
```

---

## Allowed Exceptions

The linter allows certain values that don't need tokens:

### ✅ Zero Values
```css
margin: 0;
padding: 0px;
```

### ✅ Percentage Values
```css
width: 100%;
width: 50%;
```

### ✅ Viewport Units
```css
height: 100vh;
width: 100vw;
```

### ✅ CSS Keywords
```css
color: inherit;
display: auto;
background: none;
border: transparent;
```

### ✅ Calc with Tokens
```css
width: calc(100% - var(--spacing-3));
```

### ✅ Dynamic Inline Styles
```tsx
// Dynamic values are allowed
<div style={{ width: `${percentage}%` }}>
```

---

## ESLint Rules

### `design-tokens/no-inline-hardcoded-styles` (error)

Flags hardcoded color and spacing values in inline styles.

**Example violations:**
```tsx
// ❌ Hardcoded color
<div style={{ backgroundColor: '#E90C17' }} />

// ❌ Hardcoded spacing
<div style={{ padding: '24px' }} />
```

**Fix:**
```tsx
// ✅ Use CSS class with tokens
<div className="error-container" />
```

---

### `design-tokens/prefer-css-classes` (warning)

Suggests using CSS classes instead of static inline styles.

**Example:**
```tsx
// ⚠️ Warning - static inline styles
<div style={{ display: 'flex', gap: '16px' }} />

// ✅ Better - CSS class with tokens
<div className="flex-container" />
```

---

## CSS Linter

The CSS linter (`scripts/lint-css-tokens.js`) scans all CSS files in the `src/` directory.

### What It Checks

- **Colors**: Hex, RGB, RGBA, HSL, HSLA
- **Spacing**: Pixel values in padding, margin, gap, positioning
- **Shadows**: Box-shadow and text-shadow
- **Fonts**: Font-family and font-weight
- **Border Radius**: Pixel values
- **Transitions**: Duration values

### Running the Linter

```bash
npm run lint:css
```

### Example Output

```
🔍 Scanning CSS files for hardcoded values...

Found 45 CSS files to check

📄 src/components/Button/Button.css
────────────────────────────────────────────────────────────────────────────────
  Line 12: background-color: #E90C17
  ❌ Use a color token like var(--color-neutrals-*) or var(--color-primary-*)
  💡 Suggested token: --color-*

  Line 15: padding: 12px 24px
  ❌ Use a spacing token like var(--spacing-1) through var(--spacing-6)
  💡 Suggested token: --spacing-*

════════════════════════════════════════════════════════════════════════════════

📊 Summary: 2 violations found in 1 files
```

---

## Pre-commit Hook

The pre-commit hook automatically runs before each commit and prevents commits with design token violations.

### Setup

```bash
# Install husky
npm install

# Initialize git hooks
npm run prepare
```

### What It Does

1. Runs CSS token linter (`npm run lint:css`)
2. Runs ESLint (`npm run lint`)
3. Blocks commit if violations are found
4. Shows clear error messages

### Example Output

```bash
git commit -m "Add new button component"

🎨 Running design token governance checks...
🔍 Scanning CSS files for hardcoded values...

📄 src/components/NewButton/NewButton.css
────────────────────────────────────────────────────────────────────────────────
  Line 5: background-color: #FF0000
  ❌ Use a color token like var(--color-neutrals-*) or var(--color-primary-*)
  💡 Suggested token: --color-*

❌ Design token violations detected. Please fix before committing.
```

### Bypassing the Hook (Not Recommended)

In rare cases where you need to bypass the hook:

```bash
git commit --no-verify -m "Emergency fix"
```

**⚠️ Warning:** Only use `--no-verify` for emergencies. All violations should be fixed before merging to main.

---

## Available Design Tokens

### Colors

```css
/* Neutrals */
--color-neutrals-1: #141416
--color-neutrals-2: #23262F
--color-neutrals-3: #353945
--color-neutrals-4: #6E7481
--color-neutrals-5: #B1B5C3
--color-neutrals-6: #E6E8EC
--color-neutrals-7: #F4F5F6
--color-neutrals-8: #FCFCFD

/* Primary */
--color-primary-1: #E90C17
--color-primary-2: #E90C17

/* Semantic */
--color-white: #FFFFFF
--color-black: #000000
--color-blue: #186CEA

/* Status */
--color-semantic-success: #34A853
--color-semantic-warning: #F59E0B
--color-semantic-error: #EA4335
--color-semantic-info: #186CEA

/* Overlays */
--color-overlay-light: rgba(0, 0, 0, 0.5)
--color-overlay-medium: rgba(0, 0, 0, 0.7)
--color-overlay-dark: rgba(0, 0, 0, 0.9)
```

### Spacing

```css
--spacing-0: 0px
--spacing-1: 8px
--spacing-2: 16px
--spacing-3: 24px
--spacing-4: 32px
--spacing-5: 40px
--spacing-6: 48px

/* Component Padding */
--spacing-component-xs: 4px
--spacing-component-sm: 8px
--spacing-component-md: 12px
--spacing-component-lg: 16px
--spacing-component-xl: 24px
--spacing-component-xxl: 32px

/* Component Gap */
--spacing-gap-xs: 4px
--spacing-gap-sm: 8px
--spacing-gap-md: 12px
```

### Typography

```css
/* Font Families */
--font-heading: 'Poppins', sans-serif
--font-body: 'Geist', system-ui, sans-serif

/* Font Weights */
--font-weight-regular: 400
--font-weight-medium: 600
--font-weight-bold: 600
```

### Shadows

```css
--shadow-card: 0 4px 12px rgba(0, 0, 0, 0.08)
--shadow-card-hover: 0 8px 24px rgba(0, 0, 0, 0.12)
--shadow-modal: 0 32px 64px rgba(0, 0, 0, 0.4)
--shadow-text-dark: 0 2px 8px rgba(0, 0, 0, 0.3)
--shadow-text-medium: 0 1px 4px rgba(0, 0, 0, 0.2)
--shadow-text-light: 0 1px 2px rgba(0, 0, 0, 0.1)
```

### Border Radius

```css
--border-radius-sm: 4px
--border-radius-md: 8px
--border-radius-lg: 12px
--border-radius-xl: 24px
```

### Transitions

```css
--transition-fast: 0.2s ease
--transition-medium: 0.3s ease
--transition-slow: 0.4s ease
```

---

## Best Practices

### 1. Always Use Tokens for Colors

```css
/* ❌ Bad */
.button {
  background: #E90C17;
}

/* ✅ Good */
.button {
  background: var(--color-primary-1);
}
```

### 2. Use Spacing Tokens for Consistency

```css
/* ❌ Bad */
.card {
  padding: 20px;
  margin: 15px;
}

/* ✅ Good */
.card {
  padding: var(--spacing-3);
  margin: var(--spacing-2);
}
```

### 3. Prefer CSS Classes Over Inline Styles

```tsx
/* ❌ Bad */
<div style={{ color: 'red', padding: '16px' }}>

/* ✅ Good */
<div className="error-message">
```

### 4. Use Token Composition

```css
/* ✅ Combine tokens for complex values */
.container {
  padding: var(--spacing-3) var(--spacing-4);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-neutrals-6);
}
```

### 5. Document New Tokens

When adding new tokens to `design-system/global.css`, update this documentation.

---

## Troubleshooting

### "Design token violations detected"

1. Run `npm run lint:css` to see all violations
2. Replace hardcoded values with appropriate tokens
3. Refer to the "Available Design Tokens" section above
4. Commit again

### "Cannot find module 'husky'"

```bash
npm install
npm run prepare
```

### ESLint Errors

```bash
# Run ESLint to see specific errors
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

---

## Contributing

### Adding New Tokens

1. Add token to `src/design-system/global.css`
2. Update this documentation
3. Update `scripts/lint-css-tokens.js` if needed
4. Test with `npm run lint:css`

### Modifying Linter Rules

1. Edit `eslint-plugin-design-tokens.js` for ESLint rules
2. Edit `scripts/lint-css-tokens.js` for CSS rules
3. Test changes thoroughly
4. Update documentation

---

## Resources

- [Design System Documentation](./README.md)
- [Atom Composition Guide](./ATOM_COMPOSITION_GUIDE.md)
- [Atoms Quick Reference](./ATOMS_QUICK_REFERENCE.md)
- [Global Tokens](../src/design-system/global.css)

---

## Summary

✅ **Automated enforcement** - Pre-commit hooks prevent violations  
✅ **Clear error messages** - Know exactly what to fix  
✅ **Comprehensive coverage** - Checks CSS and inline styles  
✅ **Easy to use** - Simple npm scripts  
✅ **Well documented** - Clear examples and guidelines  

**The token governance system ensures design consistency and maintainability across the entire codebase.**

