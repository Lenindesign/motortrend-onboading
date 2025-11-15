# Cursor Design System Rules
**MotorTrend Onboarding Project**  
**Last Updated:** November 9, 2025

This document defines the design system rules that Cursor must follow when generating or modifying code for this project. These rules ensure consistency, maintainability, and adherence to the established design system.

---

## 🎨 1. COLOR SYSTEM

### **ALWAYS USE CSS VARIABLES - NEVER HARDCODE COLORS**

#### Neutrals Palette
```css
/* ✅ CORRECT */
background-color: var(--color-neutrals-1);  /* #141416 - Headers, footers */
background-color: var(--color-neutrals-2);  /* #23262F - Dark backgrounds */
background-color: var(--color-neutrals-3);  /* #353945 - Buttons, borders */
color: var(--color-neutrals-4);             /* #6E7481 - Secondary text */
color: var(--color-neutrals-5);             /* #B1B5C3 - Tertiary text */
border-color: var(--color-neutrals-6);      /* #E6E8EC - Borders */
background-color: var(--color-neutrals-7);  /* #F4F5F6 - Backgrounds */
color: var(--color-neutrals-8);            /* #FCFCFD - Text on dark */

/* ❌ WRONG */
background-color: #141416;
color: #23262F;
```

#### Primary Colors
```css
/* ✅ CORRECT */
background-color: var(--color-primary-1);  /* #E90C17 - MotorTrend Red */
color: var(--color-primary-1);

/* ❌ WRONG */
background-color: #E90C17;
color: red;
```

#### Semantic Colors
```css
/* ✅ CORRECT */
color: var(--color-blue);      /* #186CEA */
color: var(--color-white);     /* #FFFFFF */
color: var(--color-black);     /* #000000 */

/* ❌ WRONG */
color: #186CEA;
color: white;
```

### **Color Usage Guidelines:**
- **Headers/Footers:** Use `--color-neutrals-1`
- **Dark Backgrounds:** Use `--color-neutrals-2`
- **Buttons/Borders:** Use `--color-neutrals-3`
- **Secondary Text:** Use `--color-neutrals-4`
- **Tertiary Text/Placeholders:** Use `--color-neutrals-5`
- **Borders:** Use `--color-neutrals-6`
- **Light Backgrounds:** Use `--color-neutrals-7`
- **Text on Dark/Input Backgrounds:** Use `--color-neutrals-8`
- **Primary Actions:** Use `--color-primary-1`

---

## 📝 2. TYPOGRAPHY SYSTEM

### **ALWAYS USE CSS VARIABLES FOR FONTS**

#### Font Families
```css
/* ✅ CORRECT */
font-family: var(--font-heading);  /* Poppins - for headings */
font-family: var(--font-body);     /* Geist - for body text */

/* ❌ WRONG */
font-family: 'Poppins', sans-serif;
font-family: Arial, sans-serif;
```

#### Font Weights
```css
/* ✅ CORRECT */
font-weight: var(--font-weight-regular);  /* 400 */
font-weight: var(--font-weight-medium);   /* 600 */
font-weight: var(--font-weight-bold);      /* 600 */

/* ❌ WRONG */
font-weight: 400;
font-weight: bold;
```

### **Typography Classes - Use Predefined Styles**

```css
/* ✅ CORRECT - Use these classes */
.text-hero { }        /* 96px, Poppins, Bold */
.text-h5 { }          /* 24px, Poppins, Bold */
.text-subtitle1 { }   /* 18px, Poppins, Bold */
.text-body2 { }       /* 18px, Geist, Regular */
.text-body3 { }       /* 16px, Geist, Regular */
.text-button1 { }     /* 16px, Poppins, Bold */
.text-caption1 { }    /* 14px, Geist, Regular */
.text-caption2 { }    /* 12px, Geist, Regular */
```

### **Typography Guidelines:**
- **Headings (h1-h6):** Always use `var(--font-heading)` (Poppins)
- **Body Text:** Always use `var(--font-body)` (Geist)
- **Buttons:** Use `var(--font-heading)` with `var(--font-weight-bold)`
- **Never hardcode font sizes** - use predefined classes or CSS variables
- **Line heights:** Use the predefined line heights from typography tokens

---

## 📏 3. SPACING SYSTEM

### **ALWAYS USE SPACING VARIABLES - 8px BASE SYSTEM**

```css
/* ✅ CORRECT */
padding: var(--spacing-1);   /* 8px */
padding: var(--spacing-2);   /* 16px */
padding: var(--spacing-3);   /* 24px */
padding: var(--spacing-4);   /* 32px */
padding: var(--spacing-5);   /* 40px */
padding: var(--spacing-6);   /* 48px */

margin: var(--spacing-2);
gap: var(--spacing-2);

/* ❌ WRONG */
padding: 8px;
padding: 16px;
margin: 20px;
gap: 10px;
```

### **Section Spacing**
```css
/* ✅ CORRECT */
margin-bottom: var(--section-spacing-vertical);  /* 32px between sections */
padding: 0 var(--section-spacing-horizontal);   /* 24px horizontal padding */

/* ❌ WRONG */
margin-bottom: 32px;
padding: 0 24px;
```

### **Spacing Guidelines:**
- **Always use 8px increments** (8, 16, 24, 32, 40, 48)
- **Never use arbitrary values** like 10px, 15px, 20px
- **Between sections:** Use `var(--section-spacing-vertical)` (32px)
- **Horizontal padding:** Use `var(--section-spacing-horizontal)` (24px)

---

## 🎭 4. EFFECTS SYSTEM

### **Border Radius**
```css
/* ✅ CORRECT */
border-radius: var(--border-radius-sm);    /* 4px */
border-radius: var(--border-radius-md);    /* 8px */
border-radius: var(--border-radius-lg);    /* 16px */
border-radius: var(--border-radius-full);  /* 100px */
border-radius: var(--border-radius-circle); /* 400px */

/* ❌ WRONG */
border-radius: 4px;
border-radius: 8px;
border-radius: 50%;
```

### **Shadows**
```css
/* ✅ CORRECT */
box-shadow: var(--shadow-depth-5);  /* 0px 4px 20px 0px rgba(20, 20, 22, 0.06) */

/* ❌ WRONG */
box-shadow: 0px 4px 20px 0px rgba(20, 20, 22, 0.06);
```

### **Transitions**
```css
/* ✅ CORRECT */
transition: all var(--transition-fast);    /* 150ms ease-in-out */
transition: all var(--transition-normal);  /* 250ms ease-in-out */
transition: all var(--transition-slow);    /* 350ms ease-in-out */

/* ❌ WRONG */
transition: all 0.2s ease;
transition: all 150ms;
```

### **Border Weights**
```css
/* ✅ CORRECT */
border-width: 1px;  /* thin */
border-width: 2px;  /* medium */
border-width: 4px;  /* thick */

/* Use consistent border weights */
```

---

## 📐 5. LAYOUT SYSTEM

### **Container Max Width**
```css
/* ✅ CORRECT */
max-width: var(--max-width-container);  /* 1280px */
max-width: var(--max-width-content);    /* 1280px */

/* Use .container class for standard containers */
.container {
  max-width: var(--max-width-container);
  margin: 0 auto;
  padding: 0 var(--section-spacing-horizontal);
}
```

### **Layout Guidelines:**
- **Standard container width:** 1280px max-width
- **Always center containers:** `margin: 0 auto`
- **Use Container component** for consistent max-width
- **Maintain 32px vertical spacing** between sections
- **Use 24px horizontal padding** for containers

---

## 🎯 6. BUTTON SYSTEM (CTA)

### **ALWAYS USE CTA CLASSES - NEVER CREATE CUSTOM BUTTONS**

```css
/* ✅ CORRECT */
<button class="cta cta--primary cta--default">Click Me</button>
<button class="cta cta--secondary cta--large">Click Me</button>
<button class="cta cta--ghost cta--small">Click Me</button>

/* ❌ WRONG */
<button style="background: red; padding: 10px;">Click Me</button>
```

### **CTA Sizes**
- `cta--small`: 28px height, 12px font
- `cta--default`: 36px height, 14px font
- `cta--large`: 44px height, 16px font

### **CTA Variants**
- `cta--primary`: MotorTrend Red background
- `cta--secondary`: Dark gray background
- `cta--neutral`: Light gray background
- `cta--success`: Green background
- `cta--warning`: Orange background
- `cta--ghost`: Transparent with red text
- `cta--outline`: Transparent with red border

### **CTA States**
- `:disabled`: 50% opacity, no cursor
- `:hover`: Slight transform and shadow increase
- `cta--full-width`: 100% width

### **Button Guidelines:**
- **Always use CTA classes** - never create custom button styles
- **Use appropriate size** for context (small/default/large)
- **Use appropriate variant** for action type (primary/secondary/ghost)
- **Always include hover states** (handled by CTA classes)
- **Disable state:** Use `:disabled` attribute, not custom classes

---

## 📱 7. RESPONSIVE DESIGN

### **Breakpoints**
```css
/* ✅ CORRECT */
/* Mobile-first approach */
@media (max-width: 768px) {
  /* Mobile styles */
}

@media (min-width: 769px) and (max-width: 1024px) {
  /* Tablet styles */
}

@media (min-width: 1025px) {
  /* Desktop styles */
}
```

### **Responsive Guidelines:**
- **Mobile-first:** Always start with mobile styles, then add desktop
- **Breakpoint 768px:** Mobile/Tablet breakpoint
- **Breakpoint 1024px:** Tablet/Desktop breakpoint
- **Navigation:** Hide on mobile/tablet (< 768px), show on desktop
- **Grid layouts:** Single column on mobile, multi-column on desktop
- **Typography:** Scale down on mobile (use responsive classes)
- **Touch targets:** Minimum 44px height on mobile

### **Mobile-Specific Rules:**
- **Navigation menu:** Hidden on mobile, use hamburger menu if needed
- **Search bar:** Always accessible
- **User menu:** Always visible
- **Cards:** Single column layout
- **Forms:** Full width inputs
- **Buttons:** Full width on mobile for primary actions

---

## 🧩 8. COMPONENT PATTERNS

### **Card Components**
```css
/* ✅ CORRECT - Use standardized card classes */
.card {
  background: var(--color-neutrals-8);
  border: 1px solid var(--color-neutrals-6);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-3);
  box-shadow: var(--shadow-depth-5);
}
```

### **Form Components**
```css
/* ✅ CORRECT - Use TextField component */
<TextField
  label="Label"
  type="text"
  placeholder="Placeholder"
  value={value}
  onChange={handleChange}
  fullWidth
  required
/>
```

### **Component Guidelines:**
- **Use existing components:** TextField, Button, Card, etc.
- **Don't create duplicate components** - check if one exists first
- **Follow component API:** Use props as defined in component
- **Maintain consistency:** Use same patterns across similar components

---

## 🎨 9. VISUAL LANGUAGE

### **Consistency Rules:**
- **Headlines:** Always have icons and "View All" ghost buttons
- **Card layouts:** 3-column grid on desktop, single column on mobile
- **Hover effects:** Subtle transform and shadow increase
- **Transitions:** Always use transition variables (fast/normal/slow)
- **Aspect ratios:** 16:9 for media content
- **Image borders:** 1px solid with appropriate border radius

### **Design Patterns:**
- **Navigation:** Dropdown menus with smooth animations
- **Search:** Always accessible in header
- **User menu:** Avatar with notification badge when applicable
- **Progress indicators:** Show step numbers (e.g., "STEP 1/4")
- **Ratings:** Star-based system with decimal values
- **Bookmarks:** Icon button with "Save" text

---

## ⚡ 10. PERFORMANCE & UX

### **Performance Rules:**
- **Use React Query** for data fetching
- **Implement loading states** for async operations
- **Use efficient search algorithms** with fallbacks
- **Lazy load images** below the fold
- **Code splitting:** Use dynamic imports for large components

### **UX Rules:**
- **Loading states:** Show spinners or skeletons during loading
- **Error handling:** Display user-friendly error messages
- **Form validation:** Disable submit until required fields filled
- **Feedback:** Provide visual feedback for all user actions
- **Accessibility:** Proper ARIA labels, keyboard navigation

---

## ♿ 11. ACCESSIBILITY

### **Accessibility Rules:**
- **Semantic HTML:** Use proper heading hierarchy (h1-h6)
- **ARIA labels:** Add labels to all interactive elements
- **Keyboard navigation:** Ensure all interactive elements are keyboard accessible
- **Focus states:** Visible focus indicators
- **Color contrast:** Ensure WCAG AA compliance (4.5:1 for text)
- **Alt text:** Always include alt text for images
- **Form labels:** Always associate labels with inputs

---

## 🔧 12. CODE STANDARDS

### **TypeScript**
- **Always use TypeScript** for type safety
- **Define interfaces** for all props
- **Use proper types** - avoid `any`
- **Export types** from component files

### **React Best Practices**
- **Functional components** only
- **Hooks:** Use appropriate React hooks
- **Props:** Type all props with interfaces
- **State management:** Use React hooks, Context API, or React Query
- **Cleanup:** Proper cleanup in useEffect

### **Naming Conventions**
- **Components:** PascalCase (e.g., `OnboardingStep1`)
- **Files:** Match component name (e.g., `OnboardingStep1.tsx`)
- **CSS classes:** kebab-case (e.g., `onboarding-card`)
- **Variables:** camelCase (e.g., `selectedUserType`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_WIDTH`)

### **File Structure**
```
src/
  components/
    ComponentName/
      ComponentName.tsx
      ComponentName.css
      index.ts
  pages/
    PageName/
      PageName.tsx
      PageName.css
      index.ts
  design-system/
    tokens/
      colors.ts
      typography.ts
      spacing.ts
      effects.ts
    components/
      Button.tsx
      TextField.tsx
```

---

## 🚫 13. ANTI-PATTERNS (NEVER DO THIS)

### **❌ NEVER:**
1. **Hardcode colors** - Always use CSS variables
2. **Hardcode spacing** - Always use spacing variables
3. **Create custom buttons** - Always use CTA classes
4. **Use arbitrary values** - Use design tokens
5. **Skip responsive design** - Always make mobile-first
6. **Ignore accessibility** - Always include ARIA labels
7. **Create duplicate components** - Check if component exists
8. **Use inline styles** - Use CSS classes
9. **Mix design systems** - Stick to this design system only
10. **Ignore TypeScript** - Always type everything

---

## ✅ 14. CHECKLIST FOR CODE GENERATION

Before generating or modifying code, ensure:

- [ ] All colors use CSS variables (`var(--color-*)`)
- [ ] All spacing uses spacing variables (`var(--spacing-*)`)
- [ ] All typography uses font variables (`var(--font-*)`)
- [ ] All buttons use CTA classes
- [ ] All components are TypeScript typed
- [ ] Responsive design implemented (mobile-first)
- [ ] Accessibility features included (ARIA labels, semantic HTML)
- [ ] Transitions use transition variables
- [ ] Border radius uses radius variables
- [ ] Container max-width uses container variable
- [ ] Section spacing uses spacing variables
- [ ] No hardcoded values (colors, spacing, fonts)
- [ ] Proper component structure followed
- [ ] Loading and error states handled
- [ ] Form validation implemented

---

## 📚 15. REFERENCE FILES

When in doubt, reference these files:
- **Colors:** `src/design-system/tokens/colors.ts`
- **Typography:** `src/design-system/tokens/typography.ts`
- **Spacing:** `src/design-system/tokens/spacing.ts`
- **Effects:** `src/design-system/tokens/effects.ts`
- **Global CSS:** `src/design-system/global.css`
- **Components:** `src/design-system/components/`

---

## 🎯 SUMMARY

**Core Principles:**
1. **Always use CSS variables** - Never hardcode design tokens
2. **Mobile-first responsive design** - Start with mobile, enhance for desktop
3. **Use existing components** - Don't recreate what exists
4. **TypeScript everything** - Type safety is mandatory
5. **Accessibility first** - ARIA labels, semantic HTML, keyboard navigation
6. **Consistent spacing** - 8px base system, use variables
7. **Standardized buttons** - Always use CTA classes
8. **Performance conscious** - Loading states, error handling, code splitting

**Remember:** When in doubt, check existing components and design tokens. Consistency is key!

---

## 📚 Related Documentation

- **[FIGMA_INTEGRATION.md](./FIGMA_INTEGRATION.md)** - Figma integration guide
- **[CTA_STANDARDIZATION.md](./CTA_STANDARDIZATION.md)** - CTA/Button system documentation
- **[DESIGN_TOKEN_QUICK_REFERENCE.md](./DESIGN_TOKEN_QUICK_REFERENCE.md)** - Quick reference for all tokens
- **[DESIGN_SYSTEM_ENHANCEMENTS.md](./DESIGN_SYSTEM_ENHANCEMENTS.md)** - Enhancement recommendations
- **[DESIGN_SYSTEM_SUMMARY.md](./DESIGN_SYSTEM_SUMMARY.md)** - Executive summary

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Maintained By:** Design System Team



