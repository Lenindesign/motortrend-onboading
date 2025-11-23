# Scripts

This directory contains utility scripts for maintaining code quality and design system consistency.

---

## lint-css-tokens.js

**Purpose:** Scans all CSS files for hardcoded values that should use design tokens.

**Usage:**
```bash
npm run lint:css
```

**What it checks:**
- Hardcoded colors (hex, rgb, rgba, hsl, hsla)
- Hardcoded spacing (px values in padding, margin, gap)
- Hardcoded shadows (box-shadow, text-shadow)
- Hardcoded fonts (font-family, font-weight)
- Hardcoded border-radius
- Hardcoded transitions

**Output:**
```
🔍 Scanning CSS files for hardcoded values...

Found 45 CSS files to check

📄 src/components/Button/Button.css
────────────────────────────────────────────────────────────────────────────────
  Line 12: background-color: #E90C17
  ❌ Use a color token like var(--color-neutrals-*) or var(--color-primary-*)
  💡 Suggested token: --color-*

📊 Summary: 1 violations found in 1 files
```

**Exit codes:**
- `0` - No violations found
- `1` - Violations detected

---

## Configuration

### Allowed Exceptions

The linter allows these values without tokens:

- Zero values: `0`, `0px`, `0%`
- Percentages: `100%`, `50%`, `0%`
- Viewport units: `100vh`, `100vw`, `90vh`
- Keywords: `inherit`, `auto`, `none`, `transparent`, `currentColor`
- Calc with tokens: `calc(100% - var(--spacing-3))`
- Gradients with tokens: `linear-gradient(var(--color-primary-1), var(--color-primary-2))`

### Extending the Linter

To add new rules, edit `lint-css-tokens.js`:

```javascript
const TOKEN_RULES = {
  'your-property': {
    pattern: /your-regex/,
    token: '--your-token-*',
    message: 'Your helpful message',
  },
};
```

---

## Integration

### Pre-commit Hook

The CSS linter runs automatically before each commit via Husky:

```bash
# .husky/pre-commit
node scripts/lint-css-tokens.js
```

### CI/CD

Add to your CI pipeline:

```yaml
- name: Check design tokens
  run: npm run lint:css
```

---

## Troubleshooting

### "Cannot find module"

Make sure you're in the project root:
```bash
cd /path/to/motortrend-onboarding
npm run lint:css
```

### False Positives

If the linter flags a value that should be allowed:

1. Check if it matches an exception pattern
2. Add to `ALLOWED_EXCEPTIONS` in `lint-css-tokens.js`
3. Document the exception

### Performance

For large codebases, the linter may take a few seconds. This is normal.

---

## See Also

- [Token Governance Documentation](../docs/TOKEN_GOVERNANCE.md)
- [Design System Global Tokens](../src/design-system/global.css)
- [ESLint Plugin](../eslint-plugin-design-tokens.js)


