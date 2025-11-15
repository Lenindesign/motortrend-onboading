# Figma Design Integration Guide

## Overview

This project has been fully integrated with your Figma designs using the Figma MCP (Model Context Protocol) integration. The design system has been extracted and implemented as a complete, production-ready React application.

## 🎨 Figma Files Integrated

1. **Community Design System** (`6fmzY7f0nYYUN7ovoZRxQE`)
   - Complete design system with components, colors, typography, and layouts
   - Sign In page with social authentication
   - Global Header and Footer components
   - Button, TextField, and Icon components

2. **Untitled - Onboarding Experience** (`S1Y0UG2bPJWeUjWLmNLE3w`)
   - Linear flow for onboarding experience

## 📁 Project Structure

```
src/
├── design-system/           # Design tokens and base components
│   ├── tokens/              # Design tokens from Figma
│   │   ├── colors.ts        # Color palette (Neutrals, Primary, Semantic)
│   │   ├── typography.ts    # Font families, weights, and text styles
│   │   ├── spacing.ts       # Spacing scale and max-widths
│   │   ├── effects.ts       # Shadows, border-radius, transitions
│   │   └── index.ts         # Central token exports
│   ├── components/          # Reusable UI components
│   │   ├── Button/          # Button component with variants
│   │   ├── TextField/       # Text input component
│   │   └── index.ts         # Component exports
│   └── global.css           # Global styles and CSS variables
│
├── components/              # Page-level components
│   ├── GlobalHeader/        # Site-wide header with navigation
│   └── GlobalFooter/        # Site-wide footer with newsletter
│
├── pages/                   # Page components
│   └── SignIn/              # Sign In page with social auth
│
└── assets/                  # Figma-exported assets
    ├── images/              # Logos and images
    └── icons/               # Icon SVGs
```

## 🎯 Design System Tokens

### Colors

The color system follows the Figma design specifications:

- **Neutrals Palette** (1-8): From darkest (#141416) to lightest (#FCFCFD)
- **Primary Colors**: MotorTrend Red (#E90C17)
- **Semantic Colors**: Blue (#186CEA)
- **Social Brand Colors**: Google, Facebook, Apple

Access colors in code:
```typescript
import { colors } from './design-system/tokens';
// colors.neutrals[1], colors.primary[2], etc.
```

### Typography

Two font families are used:
- **Poppins** (bold, 600): Headings and buttons
- **Geist** (regular, 400): Body text

Text styles include:
- Hero (96px)
- H5 (24px)
- Subtitle1 (18px)
- Body2 (18px), Body3 (16px)
- Button1 (16px)
- Caption1 (14px), Caption2 (12px)

### Spacing

8px-based spacing system:
- 1: 8px
- 2: 16px
- 3: 24px
- 4: 32px
- 5: 40px
- 6: 48px

### Layout

- **Container Max-Width**: 1280px
- **Content Max-Width**: 1280px
- **Section Spacing**: 32px vertical

## 🧩 Components

### Button

Fully featured button component with:
- **Colors**: blue, red, neutrals3
- **Sizes**: default, large
- **Variants**: solid, ghost, outline
- Icon support (left/right)
- Full-width option

```tsx
import { Button } from './design-system/components';

<Button color="red" size="large" variant="solid">
  Sign In
</Button>
```

### TextField

Input component with:
- Label support
- Error/helper text
- Icon support (clickable or decorative)
- Password visibility toggle
- Full validation

```tsx
import { TextField } from './design-system/components';

<TextField
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  fullWidth
/>
```

### GlobalHeader

Site-wide header with:
- MotorTrend logo
- Navigation menu (News, Reviews, Buyer's Guide, etc.)
- Search button
- Sign In button
- Mobile responsive (hides nav on mobile)

### GlobalFooter

Comprehensive footer with:
- Logo and footer links
- Newsletter signup section
- Social media icons
- Copyright and legal information
- Report Issue button
- Mobile responsive

### SignIn Page

Complete authentication page with:
- Social login buttons (Google, Facebook, Apple)
- Email/password form
- Password visibility toggle
- Forgot password link
- Sign up link
- Fully responsive design

## 🎨 Using CSS Variables

All design tokens are available as CSS variables:

```css
.my-component {
  background-color: var(--color-neutrals-1);
  padding: var(--spacing-3);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-depth-5);
  font-family: var(--font-heading);
  transition: all var(--transition-fast);
}
```

## 📱 Responsive Design

All components follow mobile-first responsive design:

- Global Header: Navigation hidden on mobile (<768px)
- Global Footer: Stacks vertically on mobile
- Sign In Card: Full-width on mobile with adjusted padding
- Typography: Scales down on mobile (Hero: 96px → 48px)

## 🔄 Updating from Figma

To fetch the latest designs from Figma:

1. Ensure your Figma MCP integration is configured in `~/.cursor/mcp.json`
2. Use the Figma MCP tools to fetch updated data
3. The design tokens and components can be regenerated as needed

### Current Figma Configuration

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_TOKEN", "--stdio"]
    }
  }
}
```

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Design System Rules

Following the Global Windsurf Rules:

1. **Layout**: 1040px max-width containers, 32px vertical spacing
2. **Components**: Standardized cards, buttons, and form elements
3. **Mobile Optimization**: Mobile-first approach, responsive layouts
4. **Visual Language**: Consistent color tokens, typography, shadows
5. **Performance**: React Query ready, proper loading states
6. **Accessibility**: Proper contrast, keyboard navigation, semantic HTML

## 🎨 Brand Identity

The design maintains MotorTrend's brand identity:
- Signature red color (#E90C17)
- Modern, clean UI with dark mode support
- Professional automotive aesthetic
- High-quality imagery support (16:9 aspect ratio)

## 🔗 Integration Points

The application is ready for:
- Authentication integration (social + email/password)
- Newsletter subscription API
- Content management system
- Analytics tracking
- Error reporting

## 📚 Additional Resources

- Figma Community File: https://www.figma.com/design/6fmzY7f0nYYUN7ovoZRxQE/Community
- Figma Onboarding File: https://www.figma.com/design/S1Y0UG2bPJWeUjWLmNLE3w/Untitled
- Design System Documentation: See `/src/design-system/`

## 🛠️ Next Steps

1. Connect authentication APIs
2. Implement routing for additional pages
3. Add newsletter subscription functionality
4. Integrate analytics
5. Set up error monitoring
6. Add unit and integration tests
7. Implement the onboarding flow from the Untitled file

---

## 📚 Related Documentation

- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation summary and stats
- **[CURSOR_DESIGN_SYSTEM_RULES.md](./CURSOR_DESIGN_SYSTEM_RULES.md)** - Design system rules for code generation
- **[CTA_STANDARDIZATION.md](./CTA_STANDARDIZATION.md)** - CTA/Button system documentation
- **[DESIGN_TOKEN_QUICK_REFERENCE.md](./DESIGN_TOKEN_QUICK_REFERENCE.md)** - Quick reference for all design tokens

---

**Built with**: React, TypeScript, Vite
**Design Source**: Figma (via MCP Integration)
**Last Updated**: December 2024

