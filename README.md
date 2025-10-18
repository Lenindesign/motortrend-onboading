# MotorTrend Onboarding Application

A modern, fully responsive onboarding application built with React, TypeScript, and Vite, directly integrated from Figma designs.

## ✨ Features

- 🎨 **Complete Figma Integration** - Design system extracted and implemented from Figma
- 🔐 **Social Authentication** - Google, Facebook, and Apple sign-in
- 📱 **Fully Responsive** - Mobile-first design with tablet and desktop support
- ♿ **Accessible** - WCAG compliant with semantic HTML and ARIA labels
- 🎯 **Type-Safe** - Built with TypeScript for reliability
- ⚡ **Fast** - Powered by Vite for instant HMR and optimized builds
- 🎨 **Design System** - Comprehensive tokens, components, and patterns

## 🚀 Quick Start

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

The application will be available at `http://localhost:5173`

## 📖 Documentation

- **[Figma Integration Guide](./FIGMA_INTEGRATION.md)** - Complete guide to the Figma integration, design system, and components

## 🏗️ Architecture

### Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS Variables** - Design tokens
- **Figma MCP** - Design integration

### Key Features

1. **Design System**
   - Color tokens (Neutrals, Primary, Semantic)
   - Typography system (Gilroy + Geist)
   - Spacing scale (8px system)
   - Reusable components (Button, TextField)

2. **Components**
   - Global Header with navigation
   - Global Footer with newsletter
   - Sign In page with social auth
   - Mobile-responsive layouts

3. **Pages**
   - Sign In / Sign Up flow
   - Onboarding experience (coming soon)

## 🎨 Design System

The application uses a comprehensive design system extracted from Figma:

- **Colors**: 8-level neutral palette + brand colors
- **Typography**: Gilroy (headings) + Geist (body)
- **Spacing**: Consistent 8px-based spacing scale
- **Components**: Button, TextField, Header, Footer
- **Layout**: 1040px max-width containers

See [FIGMA_INTEGRATION.md](./FIGMA_INTEGRATION.md) for detailed documentation.

## 📱 Responsive Design

The application is built mobile-first and adapts to all screen sizes:

- **Mobile** (<768px): Stacked layouts, simplified navigation
- **Tablet** (768px-1024px): Transitional layouts
- **Desktop** (>1024px): Full-featured layouts

## 🔐 Authentication

The Sign In page supports:
- Email and password authentication
- Google Sign-In
- Facebook Login
- Apple Sign-In
- Password visibility toggle
- Forgot password flow
- Sign up link

## 🛠️ Development

### Project Structure

```
src/
├── design-system/     # Design tokens and base components
├── components/        # Page-level components
├── pages/             # Page components
├── assets/            # Images, icons, and static files
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is proprietary software developed for MotorTrend/Hearst.

## 🤝 Contributing

This is an internal project. Please follow the established design system and code standards when making changes.

## 📞 Support

For issues or questions about:
- Design system: See [FIGMA_INTEGRATION.md](./FIGMA_INTEGRATION.md)
- Figma files: Contact the design team
- Technical issues: Contact the development team

---

**Built with ❤️ for MotorTrend**
