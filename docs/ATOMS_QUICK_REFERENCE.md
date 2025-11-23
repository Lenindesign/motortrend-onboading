# Atoms Quick Reference Card

A one-page reference for the most commonly used atoms in the MotorTrend design system.

---

## 🎭 ModalShell

**Purpose**: Standardized modal wrapper with overlay, shadow, and behavior

```tsx
<ModalShell isOpen={isOpen} onClose={onClose} maxWidth="480px">
  {/* Your modal content */}
</ModalShell>
```

| Common Props | Values |
|--------------|--------|
| `overlayVariant` | `'medium'` (default), `'dark'` (galleries) |
| `position` | `'center'` (default), `'side-right'` (drawers) |
| `animation` | `'fade-slide'` (default), `'slide-right'` |

**Tokens Used**: `--color-overlay-medium`, `--shadow-modal`, `--border-radius-lg`

---

## 🃏 CardShell

**Purpose**: Standardized card container with padding, radius, and shadows

```tsx
<CardShell hasHover={true} padding="md">
  {/* Your card content */}
</CardShell>
```

| Padding Sizes | Use Case |
|---------------|----------|
| `"sm"` (12px) | Compact cards, list items |
| `"md"` (16px) | Standard cards (default) |
| `"lg"` (24px) | Featured cards, hero sections |

**Tokens Used**: `--spacing-card-*`, `--border-radius-md`, `--shadow-card`, `--shadow-card-hover`

---

## 🏷️ Badge

**Purpose**: Status indicators, labels, and tags

```tsx
<Badge variant="premium">Premium</Badge>
```

| Variant | Use Case |
|---------|----------|
| `new` | New content |
| `premium` | Premium/paid content |
| `verified` | Expert verified |
| `info` | Informational |
| `warning` | Warnings |
| `error` | Errors |
| `success` | Success states |
| `category` | Categories/tags |

**Sizes**: `"sm"`, default, `"lg"`

---

## 💬 Tooltip

**Purpose**: Contextual help text on hover

```tsx
<Tooltip content="Helpful explanation">
  <Icon name="help" size={16} />
</Tooltip>
```

| Position | When to Use |
|----------|-------------|
| `top` (default) | Most cases |
| `bottom` | When near top of viewport |
| `left` | When near right edge |
| `right` | When near left edge |

**Best Practice**: Tooltip should enhance, not replace visible information

---

## 🎨 Common Composition Patterns

### Modal with Cards
```tsx
<ModalShell isOpen={isOpen} onClose={onClose}>
  {items.map(item => (
    <CardShell key={item.id} hasHover={true} padding="sm">
      <Badge variant="new">New</Badge>
      <h4>{item.title}</h4>
    </CardShell>
  ))}
</ModalShell>
```

### Card with Badge and Tooltip
```tsx
<CardShell hasHover={true} padding="md">
  <div className="card__header">
    <Badge variant="premium">Premium</Badge>
    <Tooltip content="Expert reviewed">
      <Icon name="verified" size={16} />
    </Tooltip>
  </div>
  <h3>Content Title</h3>
</CardShell>
```

### Badge with Icon
```tsx
<Badge variant="verified">
  <Icon name="check_circle" size={14} />
  <span>Verified</span>
</Badge>
```

---

## 🚫 Common Mistakes

| ❌ Don't | ✅ Do |
|---------|-------|
| Create custom overlay divs | Use `ModalShell` |
| Add padding to card content | Let `CardShell` handle padding |
| Use `!important` to override | Use variants or create new atom |
| Put critical info in tooltips | Make it visible, enhance with tooltip |
| Recreate badge styles | Use `Badge` variants |

---

## 📏 Design Token Quick Reference

### Spacing
- `--spacing-1` = 4px
- `--spacing-2` = 8px
- `--spacing-3` = 16px
- `--spacing-4` = 24px
- `--spacing-5` = 32px

### Card Padding
- `--spacing-card-sm` = 12px
- `--spacing-card-md` = 16px
- `--spacing-card-lg` = 24px

### Shadows
- `--shadow-card` - Cards
- `--shadow-card-hover` - Card hover
- `--shadow-modal` - Modals
- `--shadow-depth-1` to `--shadow-depth-5` - Various

### Border Radius
- `--border-radius-sm` = 4px
- `--border-radius-md` = 8px
- `--border-radius-lg` = 12px
- `--border-radius-xl` = 24px

### Overlays
- `--color-overlay-light` = rgba(0, 0, 0, 0.3)
- `--color-overlay-medium` = rgba(0, 0, 0, 0.5)
- `--color-overlay-dark` = rgba(0, 0, 0, 0.95)

---

## 🔗 Full Documentation

- **Comprehensive Guide**: `/docs/ATOM_COMPOSITION_GUIDE.md`
- **ModalShell Details**: `/src/components/atoms/ModalShell/README.md`
- **Live Examples**: `/documentation/atomic-design-audit`
- **Design Tokens**: `/src/styles/tokens.css`

---

**Print this page and keep it handy while developing!**


