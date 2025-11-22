# Pull Request

## Description

<!-- Provide a brief description of the changes in this PR -->

## Type of Change

<!-- Check all that apply -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 Design system / UI component
- [ ] ♻️ Refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] ✅ Test update

## Design System Compliance Checklist

<!-- 
IMPORTANT: All UI components must follow atomic design principles and use design tokens.
Review the documentation before submitting:
- 📖 Atom Composition Guide: /docs/ATOM_COMPOSITION_GUIDE.md
- ⚡ Quick Reference: /docs/ATOMS_QUICK_REFERENCE.md
- 🔒 Token Governance: /docs/TOKEN_GOVERNANCE.md
-->

### Atom Composition (Required for all UI components)

- [ ] **ModalShell** - All modals and drawers use `<ModalShell>` instead of custom overlays
  - ✅ Provides consistent overlay, positioning, animations, and accessibility
  - ✅ Handles escape key, body scroll locking, and click-outside-to-close
  - 📖 [ModalShell Documentation](/src/components/atoms/ModalShell/README.md)

- [ ] **CardShell** - All card-like components use `<CardShell>` for consistent styling
  - ✅ Provides consistent padding, shadows, border-radius, and hover states
  - ✅ Eliminates duplicate card wrapper implementations
  - 📖 [Atom Composition Guide](/docs/ATOM_COMPOSITION_GUIDE.md#cardshell-atom)

- [ ] **Badge** - All status indicators, labels, and tags use `<Badge>` component
  - ✅ Provides consistent variants (new, premium, verified, info, success, warning, error)
  - ✅ Ensures uniform sizing, colors, and spacing
  - 📖 [Atom Composition Guide](/docs/ATOM_COMPOSITION_GUIDE.md#badge-atom)

- [ ] **Tooltip** - All help text and contextual information uses `<Tooltip>` component
  - ✅ Provides consistent positioning, styling, and animations
  - ✅ Ensures accessibility and mobile-friendly behavior
  - 📖 [Atom Composition Guide](/docs/ATOM_COMPOSITION_GUIDE.md#tooltip-atom)

- [ ] **N/A** - This PR does not include UI components requiring atoms

### Design Token Usage (Required for all CSS/styles)

- [ ] **No hardcoded colors** - All colors use `var(--color-*)` tokens
  - ❌ Bad: `color: #E90C17`, `background: rgba(0,0,0,0.5)`
  - ✅ Good: `color: var(--color-primary-1)`, `background: var(--color-overlay-medium)`

- [ ] **No hardcoded spacing** - All spacing uses `var(--spacing-*)` tokens
  - ❌ Bad: `padding: 24px`, `margin: 16px`, `gap: 8px`
  - ✅ Good: `padding: var(--spacing-3)`, `margin: var(--spacing-2)`, `gap: var(--spacing-1)`

- [ ] **No hardcoded shadows** - All shadows use `var(--shadow-*)` tokens
  - ❌ Bad: `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`
  - ✅ Good: `box-shadow: var(--shadow-card)`

- [ ] **No hardcoded fonts** - All typography uses `var(--font-*)` tokens
  - ❌ Bad: `font-family: 'Poppins'`, `font-weight: 600`
  - ✅ Good: `font-family: var(--font-heading)`, `font-weight: var(--font-weight-bold)`

- [ ] **No inline styles** - Prefer CSS classes over inline styles
  - ❌ Bad: `<div style={{ color: 'red', padding: '16px' }}>`
  - ✅ Good: `<div className="error-message">`

- [ ] **Pre-commit hook passed** - Design token linter found no violations
  - Run `npm run lint:all` to check manually

- [ ] **N/A** - This PR does not include CSS or style changes

## Testing Checklist

- [ ] Tested locally in development mode
- [ ] Tested in production build (`npm run build && npm run preview`)
- [ ] Tested on mobile viewport (responsive design)
- [ ] Tested with keyboard navigation (accessibility)
- [ ] Tested with screen reader (if applicable)
- [ ] No console errors or warnings
- [ ] No ESLint errors (`npm run lint`)
- [ ] No design token violations (`npm run lint:css`)

## Component Hierarchy (if applicable)

<!-- 
If adding/modifying components, describe the atomic hierarchy:
Example:
- Organism: VehiclesSection
  - Molecule: VehicleCard (composes Badge, Tooltip)
    - Atoms: Badge, Tooltip, Icon
-->

```
Your component hierarchy here
```

## Screenshots / Videos (if applicable)

<!-- Add screenshots or videos demonstrating the changes -->

### Before
<!-- Screenshot of current state (if applicable) -->

### After
<!-- Screenshot of new state -->

## Breaking Changes

<!-- If this PR includes breaking changes, describe them here and provide migration instructions -->

## Related Issues

<!-- Link to related issues using #issue_number -->

Closes #
Related to #

## Additional Notes

<!-- Any additional information that reviewers should know -->

---

## Reviewer Checklist

<!-- For reviewers - ensure all items are checked before approving -->

- [ ] Code follows atomic design principles
- [ ] All required atoms are used correctly (ModalShell, CardShell, Badge, Tooltip)
- [ ] Design tokens are used consistently (no hardcoded values)
- [ ] Component hierarchy is clear and well-structured
- [ ] Documentation is updated (if needed)
- [ ] Tests pass and coverage is adequate
- [ ] No accessibility issues introduced
- [ ] Performance impact is acceptable

---

## Quick Reference Links

📚 **Documentation:**
- [Atom Composition Guide](/docs/ATOM_COMPOSITION_GUIDE.md) - Complete guide with examples
- [Atoms Quick Reference](/docs/ATOMS_QUICK_REFERENCE.md) - One-page cheat sheet
- [Token Governance](/docs/TOKEN_GOVERNANCE.md) - Design token rules and enforcement
- [ModalShell README](/src/components/atoms/ModalShell/README.md) - Detailed modal documentation

🎨 **Design System:**
- [Global Tokens](/src/design-system/global.css) - All available design tokens
- [Atomic Design Audit](/documentation/atomic-design-audit) - Component inventory

🛠️ **Tools:**
```bash
npm run lint        # Run ESLint
npm run lint:css    # Check design token usage
npm run lint:all    # Run all linters
```

