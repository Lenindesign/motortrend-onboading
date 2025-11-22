# CardShell Atom

The `CardShell` atom provides a standardized, reusable card wrapper with consistent padding, shadows, hover states, and accessibility features. It eliminates duplicate card styling across the application and ensures design system compliance.

---

## Purpose

- **Consistency:** All cards use the same design tokens for padding, shadows, and border-radius
- **Reusability:** Single source of truth for card styling
- **Accessibility:** Built-in keyboard navigation and ARIA support
- **Maintainability:** Update all cards globally by modifying one component
- **Performance:** Optimized with CSS transitions and reduced motion support

---

## When to Use CardShell

✅ **Use CardShell when:**
- Creating any card-like UI element
- Building list items that need visual separation
- Designing content containers with consistent styling
- Creating clickable/interactive cards
- Building grid or list layouts with card items

❌ **Don't use CardShell for:**
- Full-page containers (use page-level layout components)
- Inline elements that don't need card styling
- Elements that require completely custom styling

---

## Basic Usage

```tsx
import { CardShell } from '../../components/atoms/CardShell';

// Simple card with default settings
<CardShell>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</CardShell>

// Card with hover effect
<CardShell hasHover={true}>
  <h3>Hover over me!</h3>
  <p>I'll lift up on hover</p>
</CardShell>

// Clickable card
<CardShell hasHover={true} onClick={() => console.log('Clicked!')}>
  <h3>Click me!</h3>
  <p>I'm interactive</p>
</CardShell>
```

---

## Props

### `children` (required)
- **Type:** `React.ReactNode`
- **Description:** Content to display inside the card

```tsx
<CardShell>
  <div>Any React content</div>
</CardShell>
```

---

### `padding`
- **Type:** `'none' | 'sm' | 'md' | 'lg' | 'xl'`
- **Default:** `'md'`
- **Description:** Padding size using design tokens

```tsx
// No padding
<CardShell padding="none">
  <img src="image.jpg" alt="Full bleed image" />
</CardShell>

// Small padding (16px)
<CardShell padding="sm">
  <p>Compact card</p>
</CardShell>

// Medium padding (24px) - Default
<CardShell padding="md">
  <p>Standard card</p>
</CardShell>

// Large padding (32px)
<CardShell padding="lg">
  <p>Spacious card</p>
</CardShell>

// Extra large padding (40px)
<CardShell padding="xl">
  <p>Very spacious card</p>
</CardShell>
```

**Token Mapping:**
- `none` → `0`
- `sm` → `var(--spacing-2)` (16px)
- `md` → `var(--spacing-3)` (24px)
- `lg` → `var(--spacing-4)` (32px)
- `xl` → `var(--spacing-5)` (40px)

---

### `hasHover`
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Enable hover effect (lift and enhanced shadow)

```tsx
// No hover effect
<CardShell>
  <p>Static card</p>
</CardShell>

// With hover effect
<CardShell hasHover={true}>
  <p>Lifts on hover</p>
</CardShell>
```

**Hover Behavior:**
- Lifts card by 2px (`translateY(-2px)`)
- Enhances shadow (`var(--shadow-card-hover)`)
- Smooth transition (`var(--transition-fast)`)
- Automatically disabled on mobile/touch devices

---

### `hasShadow`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Show card shadow

```tsx
// With shadow (default)
<CardShell>
  <p>Has shadow</p>
</CardShell>

// Without shadow
<CardShell hasShadow={false}>
  <p>Flat card</p>
</CardShell>
```

**Shadow Token:** `var(--shadow-card)`

---

### `borderRadius`
- **Type:** `'sm' | 'md' | 'lg' | 'xl'`
- **Default:** `'md'`
- **Description:** Border radius size

```tsx
// Small radius (4px)
<CardShell borderRadius="sm">
  <p>Subtle corners</p>
</CardShell>

// Medium radius (8px) - Default
<CardShell borderRadius="md">
  <p>Standard corners</p>
</CardShell>

// Large radius (12px)
<CardShell borderRadius="lg">
  <p>Rounded corners</p>
</CardShell>

// Extra large radius (24px)
<CardShell borderRadius="xl">
  <p>Very rounded corners</p>
</CardShell>
```

**Token Mapping:**
- `sm` → `var(--border-radius-sm)` (4px)
- `md` → `var(--border-radius-md)` (8px)
- `lg` → `var(--border-radius-lg)` (12px)
- `xl` → `var(--border-radius-xl)` (24px)

---

### `background`
- **Type:** `'white' | 'neutral-light' | 'neutral-lighter' | 'transparent'`
- **Default:** `'white'`
- **Description:** Background color variant

```tsx
// White background (default)
<CardShell background="white">
  <p>White card</p>
</CardShell>

// Light neutral background
<CardShell background="neutral-light">
  <p>Light gray card</p>
</CardShell>

// Lighter neutral background
<CardShell background="neutral-lighter">
  <p>Very light gray card</p>
</CardShell>

// Transparent background
<CardShell background="transparent" hasShadow={false}>
  <p>No background</p>
</CardShell>
```

**Token Mapping:**
- `white` → `var(--color-white)`
- `neutral-light` → `var(--color-neutrals-7)`
- `neutral-lighter` → `var(--color-neutrals-8)`
- `transparent` → `transparent`

---

### `onClick`
- **Type:** `() => void`
- **Optional**
- **Description:** Click handler (makes card interactive)

```tsx
<CardShell onClick={() => navigate('/details')}>
  <h3>Click to view details</h3>
</CardShell>
```

**Behavior:**
- Adds `cursor: pointer`
- Enables keyboard navigation (Enter/Space)
- Adds focus outline for accessibility
- Automatically sets `role="button"` if no role provided

---

### `className`
- **Type:** `string`
- **Optional**
- **Description:** Additional CSS classes

```tsx
<CardShell className="my-custom-class">
  <p>Card with custom class</p>
</CardShell>
```

---

### `role`
- **Type:** `string`
- **Optional**
- **Description:** ARIA role (auto-set to "button" if onClick provided)

```tsx
<CardShell role="article">
  <article>Article content</article>
</CardShell>
```

---

### `aria-label`
- **Type:** `string`
- **Optional**
- **Description:** Accessible label for screen readers

```tsx
<CardShell onClick={handleClick} aria-label="View vehicle details">
  <img src="car.jpg" alt="" />
  <h3>2025 BMW 3-Series</h3>
</CardShell>
```

---

### `tabIndex`
- **Type:** `number`
- **Optional**
- **Description:** Tab index for keyboard navigation (auto-set to 0 if onClick provided)

```tsx
<CardShell onClick={handleClick} tabIndex={0}>
  <p>Keyboard navigable</p>
</CardShell>
```

---

## Common Patterns

### Pattern 1: Simple Content Card

```tsx
<CardShell>
  <h3>Card Title</h3>
  <p>Card description text</p>
</CardShell>
```

---

### Pattern 2: Interactive Card with Hover

```tsx
<CardShell 
  hasHover={true} 
  onClick={() => navigate('/details')}
  aria-label="View details"
>
  <img src="image.jpg" alt="Product" />
  <h3>Product Name</h3>
  <p>$99.99</p>
</CardShell>
```

---

### Pattern 3: Image Card with No Padding

```tsx
<CardShell padding="none">
  <img 
    src="image.jpg" 
    alt="Hero" 
    style={{ width: '100%', borderRadius: 'var(--border-radius-md)' }}
  />
  <div style={{ padding: 'var(--spacing-3)' }}>
    <h3>Title</h3>
    <p>Description</p>
  </div>
</CardShell>
```

---

### Pattern 4: List Item Card

```tsx
<CardShell padding="sm" hasHover={true}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
    <Icon name="check" size={20} />
    <span>List item text</span>
  </div>
</CardShell>
```

---

### Pattern 5: Nested Cards

```tsx
<CardShell padding="lg" background="neutral-lighter">
  <h2>Parent Card</h2>
  <div style={{ display: 'grid', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-3)' }}>
    <CardShell padding="md" hasHover={true}>
      <p>Nested card 1</p>
    </CardShell>
    <CardShell padding="md" hasHover={true}>
      <p>Nested card 2</p>
    </CardShell>
  </div>
</CardShell>
```

---

### Pattern 6: Card Grid

```tsx
<div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
  gap: 'var(--spacing-3)' 
}}>
  {items.map(item => (
    <CardShell key={item.id} hasHover={true} onClick={() => handleClick(item)}>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </CardShell>
  ))}
</div>
```

---

## Accessibility Features

### Keyboard Navigation
- **Tab:** Focus on clickable cards
- **Enter/Space:** Activate card (if onClick provided)
- **Focus indicator:** Visible outline on focus

### Screen Reader Support
- **role="button":** Auto-applied for clickable cards
- **aria-label:** Descriptive label for context
- **tabIndex:** Keyboard navigation support

### Reduced Motion
- Respects `prefers-reduced-motion` media query
- Disables transitions for users who prefer reduced motion

### High Contrast Mode
- Adds border in high contrast mode for better visibility

---

## Design Tokens Used

### Colors
- `--color-white` - White background
- `--color-neutrals-7` - Light neutral background
- `--color-neutrals-8` - Lighter neutral background
- `--color-neutrals-4` - High contrast border
- `--color-primary-1` - Focus outline

### Spacing
- `--spacing-2` (16px) - Small padding
- `--spacing-3` (24px) - Medium padding
- `--spacing-4` (32px) - Large padding
- `--spacing-5` (40px) - Extra large padding

### Shadows
- `--shadow-card` - Default card shadow
- `--shadow-card-hover` - Enhanced hover shadow

### Border Radius
- `--border-radius-sm` (4px) - Small radius
- `--border-radius-md` (8px) - Medium radius
- `--border-radius-lg` (12px) - Large radius
- `--border-radius-xl` (24px) - Extra large radius

### Transitions
- `--transition-fast` (0.2s) - Hover and focus transitions

---

## Migration Guide

### Before (Custom Card Implementation)

```tsx
// Old custom card
<div className="custom-card">
  <h3>Title</h3>
  <p>Content</p>
</div>
```

```css
/* Old custom CSS */
.custom-card {
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.custom-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

### After (Using CardShell)

```tsx
// New with CardShell
<CardShell hasHover={true}>
  <h3>Title</h3>
  <p>Content</p>
</CardShell>
```

**Benefits:**
- ✅ No custom CSS needed
- ✅ Consistent with design system
- ✅ Accessibility built-in
- ✅ Responsive by default
- ✅ Easy to maintain

---

## Anti-Patterns

### ❌ DON'T: Override core styles

```tsx
// Bad - overriding padding
<CardShell padding="md" style={{ padding: '50px' }}>
  <p>Content</p>
</CardShell>
```

**Why:** Breaks consistency and defeats the purpose of the atom.

**Instead:** Use the `xl` padding prop or create a custom wrapper if truly needed.

---

### ❌ DON'T: Nest multiple CardShells without purpose

```tsx
// Bad - unnecessary nesting
<CardShell>
  <CardShell>
    <CardShell>
      <p>Content</p>
    </CardShell>
  </CardShell>
</CardShell>
```

**Why:** Creates visual confusion and unnecessary DOM depth.

**Instead:** Use a single CardShell with appropriate padding.

---

### ❌ DON'T: Use for non-card elements

```tsx
// Bad - using for inline text
<CardShell>
  <span>Just some text</span>
</CardShell>
```

**Why:** Cards are for grouped content, not inline elements.

**Instead:** Use appropriate HTML elements or atoms.

---

## Testing

### Visual Testing
```tsx
// Test all padding variants
<CardShell padding="none">No padding</CardShell>
<CardShell padding="sm">Small</CardShell>
<CardShell padding="md">Medium</CardShell>
<CardShell padding="lg">Large</CardShell>
<CardShell padding="xl">Extra large</CardShell>

// Test hover states
<CardShell hasHover={true}>Hover me</CardShell>

// Test clickable state
<CardShell onClick={() => alert('Clicked')}>Click me</CardShell>
```

### Accessibility Testing
- Test keyboard navigation (Tab, Enter, Space)
- Test screen reader announcements
- Test focus indicators
- Test in high contrast mode
- Test with reduced motion enabled

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance

- **Optimized:** Uses CSS transforms for hover (GPU-accelerated)
- **Efficient:** Minimal re-renders
- **Lightweight:** ~2KB gzipped

---

## Related Components

- **ModalShell** - For modal/overlay wrappers
- **Badge** - For status indicators inside cards
- **Tooltip** - For help text inside cards
- **Icon** - For icons inside cards

---

## Examples in Production

### Vehicle Card
```tsx
<CardShell hasHover={true} onClick={() => navigate(`/vehicle/${id}`)}>
  <img src={vehicle.image} alt={vehicle.name} />
  <h3>{vehicle.name}</h3>
  <div>
    <Badge variant="new">New</Badge>
    <span>{vehicle.price}</span>
  </div>
</CardShell>
```

### Article Card
```tsx
<CardShell hasHover={true} padding="none">
  <img src={article.image} alt={article.title} />
  <div style={{ padding: 'var(--spacing-3)' }}>
    <h3>{article.title}</h3>
    <p>{article.excerpt}</p>
  </div>
</CardShell>
```

### Profile Card
```tsx
<CardShell padding="lg">
  <img src={user.avatar} alt={user.name} />
  <h2>{user.name}</h2>
  <p>{user.bio}</p>
  <Badge variant="verified">Verified</Badge>
</CardShell>
```

---

## Questions?

- Review the [Atom Composition Guide](/docs/ATOM_COMPOSITION_GUIDE.md)
- Check the [Token Governance](/docs/TOKEN_GOVERNANCE.md) documentation
- See the [Atomic Design Audit](/documentation/atomic-design-audit) page

---

**CardShell is the foundation for consistent card styling across the entire application!** 🎨✨

