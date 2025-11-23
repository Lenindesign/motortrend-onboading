# MotorTrend Design System Documentation

Welcome to the MotorTrend Design System documentation. This folder contains comprehensive guides for building components using our atomic design principles.

---

## 📚 Available Documentation

### [Atom Composition Guide](./ATOM_COMPOSITION_GUIDE.md)
**Comprehensive reference for composing components**

A complete guide showing how to use ModalShell, CardShell, Badge, and Tooltip atoms in your molecules and organisms. Includes:
- Detailed usage patterns for each atom
- Advanced composition examples
- Anti-patterns to avoid
- Design token reference
- Real-world code examples

**Best for**: Developers building new components or refactoring existing ones

---

### [Atoms Quick Reference](./ATOMS_QUICK_REFERENCE.md)
**One-page cheat sheet**

A printable quick reference card with the most common props, variants, and patterns for our core atoms. Perfect for keeping handy while coding.

**Best for**: Quick lookups during development

---

## 🎯 Quick Start

### Building a New Modal?

```tsx
import { ModalShell } from '../atoms/ModalShell';

export const MyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="480px">
      {/* Your content */}
    </ModalShell>
  );
};
```

**Read more**: [Atom Composition Guide - ModalShell](./ATOM_COMPOSITION_GUIDE.md#modalshell-atom)

---

### Building a New Card?

```tsx
import { CardShell } from '../atoms/CardShell';

export const MyCard: React.FC<Props> = ({ data }) => {
  return (
    <CardShell hasHover={true} padding="md">
      {/* Your content */}
    </CardShell>
  );
};
```

**Read more**: [Atom Composition Guide - CardShell](./ATOM_COMPOSITION_GUIDE.md#cardshell-atom)

---

### Adding a Status Badge?

```tsx
import { Badge } from '../atoms/Badge';

<Badge variant="premium">Premium</Badge>
<Badge variant="new">New</Badge>
<Badge variant="verified">Verified</Badge>
```

**Read more**: [Atom Composition Guide - Badge](./ATOM_COMPOSITION_GUIDE.md#badge-atom)

---

### Adding Help Text?

```tsx
import { Tooltip } from '../atoms/Tooltip';

<Tooltip content="Helpful explanation">
  <Icon name="help" size={16} />
</Tooltip>
```

**Read more**: [Atom Composition Guide - Tooltip](./ATOM_COMPOSITION_GUIDE.md#tooltip-atom)

---

## 🎨 Design Tokens

All components should use design tokens instead of hardcoded values:

### Spacing
```css
--spacing-1: 4px
--spacing-2: 8px
--spacing-3: 16px
--spacing-4: 24px
--spacing-5: 32px
```

### Shadows
```css
--shadow-card: Standard card elevation
--shadow-card-hover: Card hover state
--shadow-modal: Modal elevation
```

### Border Radius
```css
--border-radius-sm: 4px
--border-radius-md: 8px
--border-radius-lg: 12px
--border-radius-xl: 24px
```

### Overlays
```css
--color-overlay-light: rgba(0, 0, 0, 0.3)
--color-overlay-medium: rgba(0, 0, 0, 0.5)
--color-overlay-dark: rgba(0, 0, 0, 0.95)
```

**Full token reference**: See [Atom Composition Guide - Design Token Reference](./ATOM_COMPOSITION_GUIDE.md#design-token-reference)

---

## 🚀 Component-Specific Documentation

### Atoms
- [ModalShell README](../src/components/atoms/ModalShell/README.md) - Detailed ModalShell documentation

### More Coming Soon
- CardShell README
- Badge README
- Tooltip README

---

## 📊 Live Examples

Visit the **[Atomic Design Audit Page](/documentation/atomic-design-audit)** to see:
- Live previews of all atoms
- Real component examples
- Tokenization progress
- Component composition patterns

---

## ✅ Best Practices Checklist

Before creating a new component:

- [ ] Check if ModalShell can be used instead of creating custom overlay
- [ ] Check if CardShell can be used instead of creating custom card wrapper
- [ ] Use Badge variants instead of creating custom status indicators
- [ ] Use Tooltip for help text instead of custom hover implementations
- [ ] Use design tokens for all spacing, shadows, and colors
- [ ] Review [Anti-Patterns](./ATOM_COMPOSITION_GUIDE.md#anti-patterns) section
- [ ] Check [Composition Patterns](./ATOM_COMPOSITION_GUIDE.md#composition-patterns) for similar use cases

---

## 🤝 Contributing

When adding new atoms or updating existing ones:

1. Update the relevant documentation files
2. Add examples to the Atomic Design Audit page
3. Update this README if adding new documentation
4. Ensure all design tokens are documented
5. Add anti-patterns section if applicable

---

## 📞 Getting Help

- **Questions about atoms?** Check the [Atom Composition Guide](./ATOM_COMPOSITION_GUIDE.md)
- **Need quick reference?** See [Quick Reference Card](./ATOMS_QUICK_REFERENCE.md)
- **Specific atom details?** Check component README files
- **Live examples?** Visit [Atomic Design Audit](/documentation/atomic-design-audit)

---

## 📈 Progress Tracking

Current status of atomic design implementation:

- ✅ **37 components** fully tokenized
- ✅ **ModalShell atom** created and documented
- ✅ **2 modals** refactored to use ModalShell
- ✅ **Comprehensive documentation** created
- 🔄 **4 modals** remaining to refactor
- 🔄 **Article components** to audit

**See full progress**: [Atomic Design Audit Page](/documentation/atomic-design-audit)

---

**Last Updated**: November 2025  
**Maintained By**: MotorTrend Design System Team


