# Tooltip Atom

The `Tooltip` atom provides accessible, customizable tooltips with positioning options, delay control, and arrow indicators for consistent help text and contextual information across the application.

---

## Purpose

- **Contextual Help:** Provide additional information without cluttering the UI
- **Accessibility:** Built-in ARIA support and keyboard navigation
- **Consistency:** All tooltips use the same design tokens and styling
- **Flexibility:** Multiple positioning options and trigger methods
- **Performance:** Optimized with delay control and viewport awareness

---

## When to Use Tooltip

✅ **Use Tooltip when:**
- Providing additional context or explanation for UI elements
- Showing full text for truncated content
- Explaining icons or buttons
- Displaying keyboard shortcuts
- Showing detailed information on hover
- Providing help text without taking up space

❌ **Don't use Tooltip for:**
- Critical information (use visible text instead)
- Long content (use Modal or dedicated section)
- Interactive content (tooltips should be informational only)
- Mobile-first interactions (consider alternatives for touch devices)
- Error messages (use inline validation messages)

---

## Basic Usage

```tsx
import { Tooltip } from '../../components/atoms/Tooltip';

// Simple tooltip
<Tooltip content="This is helpful information">
  <button>Hover me</button>
</Tooltip>

// With custom placement
<Tooltip content="Bottom tooltip" placement="bottom">
  <Icon name="info" />
</Tooltip>

// With delay
<Tooltip content="Delayed tooltip" showDelay={500}>
  <span>Hover and wait</span>
</Tooltip>

// Without arrow
<Tooltip content="No arrow" showArrow={false}>
  <Badge variant="info">Info</Badge>
</Tooltip>
```

---

## Props

### `content` (required)
- **Type:** `React.ReactNode`
- **Description:** Tooltip content (text, JSX, or components)

```tsx
// Simple text
<Tooltip content="Simple text">
  <button>Hover</button>
</Tooltip>

// Rich content
<Tooltip content={
  <div>
    <strong>Title</strong>
    <p>Description text</p>
  </div>
}>
  <Icon name="help" />
</Tooltip>
```

---

### `children` (required)
- **Type:** `React.ReactNode`
- **Description:** Element that triggers the tooltip

```tsx
<Tooltip content="Help text">
  <button>Button</button>
</Tooltip>

<Tooltip content="Icon explanation">
  <Icon name="info" size={20} />
</Tooltip>
```

---

### `placement`
- **Type:** `'top' | 'bottom' | 'left' | 'right'`
- **Default:** `'top'`
- **Description:** Tooltip position relative to trigger element

```tsx
// Top (default)
<Tooltip content="Top tooltip" placement="top">
  <button>Top</button>
</Tooltip>

// Bottom
<Tooltip content="Bottom tooltip" placement="bottom">
  <button>Bottom</button>
</Tooltip>

// Left
<Tooltip content="Left tooltip" placement="left">
  <button>Left</button>
</Tooltip>

// Right
<Tooltip content="Right tooltip" placement="right">
  <button>Right</button>
</Tooltip>
```

**Automatic Adjustment:**
- Tooltip automatically adjusts position to stay within viewport
- Maintains 8px padding from screen edges
- Repositions on scroll and resize

---

### `showDelay`
- **Type:** `number` (milliseconds)
- **Default:** `200`
- **Description:** Delay before showing tooltip

```tsx
// Instant (no delay)
<Tooltip content="Instant" showDelay={0}>
  <button>Instant</button>
</Tooltip>

// Default delay (200ms)
<Tooltip content="Default delay">
  <button>Default</button>
</Tooltip>

// Long delay (1 second)
<Tooltip content="Long delay" showDelay={1000}>
  <button>Long delay</button>
</Tooltip>
```

**Use Cases:**
- `0ms` - Instant feedback for critical info
- `200ms` (default) - Balanced for most use cases
- `500ms+` - Prevent accidental triggers

---

### `hideDelay`
- **Type:** `number` (milliseconds)
- **Default:** `0`
- **Description:** Delay before hiding tooltip

```tsx
// Instant hide (default)
<Tooltip content="Instant hide" hideDelay={0}>
  <button>Instant</button>
</Tooltip>

// Delayed hide (allows moving to tooltip)
<Tooltip content="Delayed hide" hideDelay={100}>
  <button>Delayed</button>
</Tooltip>
```

**Use Cases:**
- `0ms` (default) - Immediate hide
- `100-200ms` - Allow mouse movement to tooltip

---

### `showArrow`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Show arrow indicator pointing to trigger

```tsx
// With arrow (default)
<Tooltip content="With arrow" showArrow={true}>
  <button>Arrow</button>
</Tooltip>

// Without arrow
<Tooltip content="No arrow" showArrow={false}>
  <button>No arrow</button>
</Tooltip>
```

---

### `trigger`
- **Type:** `'hover' | 'click' | 'focus'`
- **Default:** `'hover'`
- **Description:** How tooltip is triggered

```tsx
// Hover trigger (default)
<Tooltip content="Hover to show" trigger="hover">
  <button>Hover me</button>
</Tooltip>

// Click trigger
<Tooltip content="Click to show" trigger="click">
  <button>Click me</button>
</Tooltip>

// Focus trigger (keyboard navigation)
<Tooltip content="Focus to show" trigger="focus">
  <input placeholder="Focus me" />
</Tooltip>
```

**Trigger Behaviors:**
- `hover` - Shows on mouseenter/focus, hides on mouseleave/blur
- `click` - Toggles on click, closes on click outside
- `focus` - Shows on focus, hides on blur (keyboard-friendly)

---

### `disabled`
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Disable tooltip

```tsx
<Tooltip content="This won't show" disabled={true}>
  <button>Disabled tooltip</button>
</Tooltip>
```

---

### `className`
- **Type:** `string`
- **Optional**
- **Description:** Additional CSS classes

```tsx
<Tooltip content="Custom class" className="my-custom-tooltip">
  <button>Custom</button>
</Tooltip>
```

---

### `maxWidth`
- **Type:** `string`
- **Default:** `'300px'`
- **Description:** Maximum width of tooltip

```tsx
// Default width
<Tooltip content="Default width (300px)">
  <button>Default</button>
</Tooltip>

// Custom width
<Tooltip content="Narrow tooltip" maxWidth="200px">
  <button>Narrow</button>
</Tooltip>

// Wide tooltip
<Tooltip content="Wide tooltip with lots of content" maxWidth="500px">
  <button>Wide</button>
</Tooltip>
```

---

### `aria-label`
- **Type:** `string`
- **Optional**
- **Description:** Accessible label for screen readers

```tsx
<Tooltip 
  content="Complex content" 
  aria-label="Detailed explanation of feature"
>
  <Icon name="help" />
</Tooltip>
```

---

## Common Patterns

### Pattern 1: Icon with Explanation

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
  <span>MotorTrend Rating</span>
  <Tooltip content="Our expert rating based on performance, efficiency, tech, and value">
    <Icon name="info" size={16} />
  </Tooltip>
</div>
```

---

### Pattern 2: Truncated Text

```tsx
<Tooltip content="Full vehicle name: 2025 Mercedes-Benz S-Class S 580 4MATIC Sedan">
  <div style={{ 
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap',
    maxWidth: '200px'
  }}>
    2025 Mercedes-Benz S-Class S 580 4MATIC Sedan
  </div>
</Tooltip>
```

---

### Pattern 3: Badge with Details

```tsx
<Tooltip 
  content="Verified by VIN - This user owns this vehicle"
  placement="top"
>
  <Badge variant="verified" icon={<Icon name="check" size={12} />}>
    Verified
  </Badge>
</Tooltip>
```

---

### Pattern 4: Button with Keyboard Shortcut

```tsx
<Tooltip content="Save (Ctrl+S)" placement="bottom">
  <button className="icon-button">
    <Icon name="save" />
  </button>
</Tooltip>
```

---

### Pattern 5: Rating Breakdown

```tsx
<Tooltip 
  content={
    <div>
      <div>Performance: 8.5/10</div>
      <div>Efficiency: 7.0/10</div>
      <div>Tech: 9.0/10</div>
      <div>Value: 8.0/10</div>
    </div>
  }
  placement="top"
  maxWidth="200px"
>
  <div className="rating-score">8.1</div>
</Tooltip>
```

---

### Pattern 6: Disabled State Explanation

```tsx
<Tooltip content="Complete your profile to enable this feature">
  <button disabled>
    <Icon name="lock" />
    Premium Feature
  </button>
</Tooltip>
```

---

## Accessibility Features

### Screen Reader Support
- **role="tooltip"** - Semantic HTML role
- **aria-describedby** - Links trigger to tooltip content
- **aria-label** - Optional custom label for complex content

### Keyboard Navigation
- **Tab** - Focus on trigger element
- **Enter/Space** - Activate (for click trigger)
- **Escape** - Close tooltip (for click trigger)
- **Focus** - Show tooltip (for focus trigger)

### High Contrast Mode
- Adds visible border for better visibility
- Maintains contrast ratios

### Reduced Motion
- Respects `prefers-reduced-motion`
- Disables animations when requested

---

## Design Tokens Used

### Colors
- `--color-neutrals-2` - Tooltip background
- `--color-white` - Tooltip text
- `--color-neutrals-1` - Dark mode background

### Spacing
- `--spacing-component-sm` (8px) - Vertical padding
- `--spacing-component-md` (12px) - Horizontal padding

### Typography
- `--font-body` - Font family
- `--font-weight-medium` (600) - Font weight
- 14px - Font size (13px on tablet, 12px on mobile)

### Shadows
- `--shadow-tooltip` (0 4px 12px rgba(0, 0, 0, 0.2)) - Tooltip shadow

### Border Radius
- `--border-radius-sm` (4px) - Tooltip corners

### Transitions
- `--transition-fast` (0.2s) - Show/hide animation

---

## Migration Guide

### From RatingDistributionTooltip

**Before:**
```tsx
<RatingDistributionTooltip
  distribution={distribution}
  totalReviews={totalReviews}
  isVisible={isVisible}
  triggerRef={triggerRef}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
/>
```

**After:**
```tsx
<Tooltip
  content={
    <div>
      {/* Distribution content */}
      <div>5 stars: {distribution[5]}</div>
      <div>4 stars: {distribution[4]}</div>
      {/* ... */}
    </div>
  }
  placement="top"
  showDelay={200}
  hideDelay={100}
>
  <div>{totalReviews} reviews</div>
</Tooltip>
```

**Benefits:**
- ✅ No custom positioning logic needed
- ✅ Automatic viewport detection
- ✅ Built-in accessibility
- ✅ Consistent styling

---

### From StaffRatingTooltip

**Before:**
```tsx
<StaffRatingTooltip
  overallRating={overallRating}
  scores={scores}
  isVisible={isVisible}
  triggerRef={triggerRef}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
/>
```

**After:**
```tsx
<Tooltip
  content={
    <div>
      <div>Overall: {overallRating}/10</div>
      <div>Performance: {scores.performance}/10</div>
      <div>Efficiency: {scores.efficiency}/10</div>
      <div>Tech: {scores.tech}/10</div>
      <div>Value: {scores.value}/10</div>
    </div>
  }
  placement="top"
  showDelay={200}
  hideDelay={100}
>
  <div className="rating-display">{overallRating}</div>
</Tooltip>
```

**Benefits:**
- ✅ Eliminates custom tooltip component
- ✅ Reduces code duplication
- ✅ Consistent with other tooltips

---

## Anti-Patterns

### ❌ DON'T: Use for critical information

```tsx
// Bad - critical info hidden in tooltip
<Tooltip content="This action cannot be undone">
  <button>Delete</button>
</Tooltip>
```

**Why:** Users might not see the tooltip before acting.

**Instead:** Show critical information inline.

```tsx
// Good
<div>
  <p className="warning">This action cannot be undone</p>
  <button>Delete</button>
</div>
```

---

### ❌ DON'T: Use for long content

```tsx
// Bad - too much content
<Tooltip content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...">
  <button>Read more</button>
</Tooltip>
```

**Why:** Tooltips are for brief, contextual information.

**Instead:** Use a Modal or dedicated section.

```tsx
// Good
<button onClick={() => setShowModal(true)}>
  Read more
</button>
```

---

### ❌ DON'T: Nest tooltips

```tsx
// Bad
<Tooltip content="Outer tooltip">
  <Tooltip content="Inner tooltip">
    <button>Button</button>
  </Tooltip>
</Tooltip>
```

**Why:** Creates confusion and accessibility issues.

**Instead:** Use a single tooltip with combined content.

---

### ❌ DON'T: Use for interactive content

```tsx
// Bad - interactive content in tooltip
<Tooltip content={
  <div>
    <button>Click me</button>
    <a href="#">Link</a>
  </div>
}>
  <button>Hover</button>
</Tooltip>
```

**Why:** Tooltips disappear on mouse leave, making interaction difficult.

**Instead:** Use a Popover or Dropdown component.

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Keyboard navigation
- ✅ Screen readers (NVDA, JAWS, VoiceOver)

---

## Performance

- **Lightweight:** ~2KB gzipped (TypeScript + CSS)
- **Efficient:** Uses `position: fixed` for optimal rendering
- **Optimized:** Viewport detection only when visible
- **Debounced:** Delay control prevents excessive re-renders

---

## Related Components

- **Badge** - Often wrapped with Tooltip for additional info
- **Icon** - Commonly used with Tooltip for explanations
- **Button** - Tooltips provide context for icon-only buttons
- **RatingDistributionTooltip** - Will be replaced by Tooltip atom
- **StaffRatingTooltip** - Will be replaced by Tooltip atom

---

## Testing

### Visual Testing
```tsx
// Test all placements
<Tooltip content="Top" placement="top"><button>Top</button></Tooltip>
<Tooltip content="Bottom" placement="bottom"><button>Bottom</button></Tooltip>
<Tooltip content="Left" placement="left"><button>Left</button></Tooltip>
<Tooltip content="Right" placement="right"><button>Right</button></Tooltip>

// Test arrow variants
<Tooltip content="With arrow" showArrow={true}><button>Arrow</button></Tooltip>
<Tooltip content="No arrow" showArrow={false}><button>No arrow</button></Tooltip>

// Test delays
<Tooltip content="Instant" showDelay={0}><button>Instant</button></Tooltip>
<Tooltip content="Delayed" showDelay={500}><button>Delayed</button></Tooltip>
```

### Accessibility Testing
- Test keyboard navigation (Tab, Enter, Escape)
- Test screen reader announcements
- Test focus indicators
- Test in high contrast mode

### Responsive Testing
- Test on desktop (1920px+)
- Test on tablet (768px)
- Test on mobile (480px)
- Test viewport edge cases

---

## Questions?

- Review the [Atom Composition Guide](/docs/ATOM_COMPOSITION_GUIDE.md)
- Check the [Token Governance](/docs/TOKEN_GOVERNANCE.md) documentation
- See the [Atomic Design Audit](/documentation/atomic-design-audit) page

---

**Tooltip is the foundation for consistent contextual help across the entire application!** 💬✨

