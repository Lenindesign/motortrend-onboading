# GitHub Configuration

This directory contains GitHub-specific configuration files.

---

## Pull Request Template

**File:** `PULL_REQUEST_TEMPLATE.md`

Automatically populates when creating a new pull request with:

### Design System Compliance Checklist

**Required for all UI components:**

1. ✅ **ModalShell** - All modals use `<ModalShell>` instead of custom overlays
2. ✅ **CardShell** - All cards use `<CardShell>` for consistent styling
3. ✅ **Badge** - All status indicators use `<Badge>` component
4. ✅ **Tooltip** - All help text uses `<Tooltip>` component

**Required for all CSS/styles:**

1. ✅ **No hardcoded colors** - Use `var(--color-*)` tokens
2. ✅ **No hardcoded spacing** - Use `var(--spacing-*)` tokens
3. ✅ **No hardcoded shadows** - Use `var(--shadow-*)` tokens
4. ✅ **No hardcoded fonts** - Use `var(--font-*)` tokens
5. ✅ **No inline styles** - Prefer CSS classes

### Testing Checklist

- Local testing
- Production build testing
- Mobile viewport testing
- Keyboard navigation testing
- Screen reader testing (if applicable)
- No console errors
- ESLint passes
- Design token linter passes

### Documentation Links

The template includes quick links to:
- [Atom Composition Guide](/docs/ATOM_COMPOSITION_GUIDE.md)
- [Atoms Quick Reference](/docs/ATOMS_QUICK_REFERENCE.md)
- [Token Governance](/docs/TOKEN_GOVERNANCE.md)
- [ModalShell README](/src/components/atoms/ModalShell/README.md)
- [Global Tokens](/src/design-system/global.css)

---

## Usage

### For Contributors

When you create a new pull request on GitHub, the template will automatically populate. Simply:

1. Fill in the description
2. Check the type of change
3. **Complete the Design System Compliance Checklist**
4. Complete the Testing Checklist
5. Add screenshots/videos if applicable
6. Submit for review

### For Reviewers

Use the "Reviewer Checklist" section to ensure:
- Code follows atomic design principles
- All required atoms are used correctly
- Design tokens are used consistently
- Component hierarchy is clear
- Documentation is updated
- Tests pass
- No accessibility issues

---

## Enforcement

The PR template checklist is enforced by:

1. **Pre-commit hooks** - Block commits with violations
2. **Code review** - Reviewers check compliance
3. **Automated linting** - ESLint and CSS linter

See [Token Governance](/docs/TOKEN_GOVERNANCE.md) for details.

---

## Related Files

- `/CONTRIBUTING.md` - Comprehensive contributing guide
- `/docs/TOKEN_GOVERNANCE.md` - Design token enforcement
- `/docs/ATOM_COMPOSITION_GUIDE.md` - How to use atoms
- `/.husky/pre-commit` - Pre-commit hook
- `/scripts/lint-css-tokens.js` - CSS token linter

---

## Future Additions

Potential GitHub configurations to add:

- **Issue templates** - For bugs, features, and design system proposals
- **GitHub Actions workflows** - CI/CD with automated linting
- **CODEOWNERS** - Automatic reviewer assignment
- **Branch protection rules** - Require checks to pass before merging

