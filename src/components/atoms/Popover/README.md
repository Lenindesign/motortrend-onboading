# Popover Atom

The `Popover` atom is an interactive component used to display rich content in a floating container, triggered by user interaction (click or hover). It uses React Portals to render outside the DOM hierarchy, ensuring it isn't clipped by overflow containers.

---

## Purpose

- **Rich Content:** Unlike Tooltips which are for simple text, Popovers can contain complex HTML, forms, or data visualizations.
- **Interactive:** Users can interact with the content inside the Popover.
- **Positioning:** Automatically positions itself relative to the trigger element.
- **Portal Rendering:** Renders at the body level to avoid z-index and overflow issues.

---

## When to Use Popover

✅ **Use Popover when:**
- You need to display complex details or data visualizations on demand (e.g., Rating Distribution, Staff Rating breakdown).
- You need interactive content like small forms or menus.
- The content is too large or complex for a simple Tooltip.

❌ **Don't use Popover for:**
- Simple text labels or descriptions (use `Tooltip`).
- Critical information that should be always visible.
- Main navigation menus (use specific navigation components).

---

## Basic Usage

```tsx
import { Popover } from '../../components/atoms/Popover';

// Simple click-triggered popover
<Popover
  content={
    <div>
      <h3>Popover Title</h3>
      <p>This is some rich content.</p>
      <button>Action</button>
    </div>
  }
>
  <button>Click Me</button>
</Popover>

// Hover-triggered popover
<Popover
  trigger="hover"
  content={<div>Hover Content</div>}
>
  <span>Hover Me</span>
</Popover>

// Controlled mode
const [isOpen, setIsOpen] = useState(false);

<Popover
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  content={<div>Controlled Content</div>}
>
  <button onClick={() => setIsOpen(true)}>Open</button>
</Popover>
```

---

## Props

### `content` (required)
- **Type:** `React.ReactNode`
- **Description:** The rich content to display inside the popover.

### `children` (required)
- **Type:** `React.ReactNode`
- **Description:** The trigger element.

### `placement`
- **Type:** `'top' | 'bottom' | 'left' | 'right'`
- **Default:** `'bottom'`
- **Description:** Preferred placement relative to the trigger.

### `trigger`
- **Type:** `'click' | 'hover'`
- **Default:** `'click'`
- **Description:** Interaction that triggers the popover.

### `defaultOpen`
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Initial open state for uncontrolled mode.

### `isOpen`
- **Type:** `boolean`
- **Description:** Controlled open state.

### `onOpenChange`
- **Type:** `(isOpen: boolean) => void`
- **Description:** Callback when open state changes.

### `showArrow`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Whether to show the arrow indicator.

### `closeOnOutsideClick`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Close popover when clicking outside.

### `closeOnEsc`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Close popover when pressing Escape key.

