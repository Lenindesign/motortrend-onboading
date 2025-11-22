# ModalShell Atom

A reusable modal wrapper component that provides standardized overlay, shadow, animations, and behavior for all modals in the application.

## Purpose

The ModalShell atom eliminates duplicate modal wrapper code by providing:
- ✅ Standardized overlay with tokenized colors (`--color-overlay-medium`, `--color-overlay-dark`)
- ✅ Consistent shadow using `--shadow-modal` token
- ✅ Escape key handling
- ✅ Body scroll lock when modal is open
- ✅ Click-outside-to-close behavior
- ✅ Smooth animations (fade-slide, slide-right)
- ✅ Responsive positioning (center, side-right)

## Usage

### Basic Example

```tsx
import { ModalShell } from '../atoms/ModalShell';

export const MyModal: React.FC<MyModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="480px"
    >
      <div className="my-modal__content">
        <h2>Modal Title</h2>
        <p>Modal content goes here</p>
        <button onClick={onClose}>Close</button>
      </div>
    </ModalShell>
  );
};
```

### Side Drawer Example

```tsx
<ModalShell
  isOpen={isOpen}
  onClose={onClose}
  position="side-right"
  animation="slide-right"
  maxWidth="400px"
>
  {/* Side drawer content */}
</ModalShell>
```

### Dark Overlay Example (for photo galleries)

```tsx
<ModalShell
  isOpen={isOpen}
  onClose={onClose}
  overlayVariant="dark"
  maxWidth="90vw"
  maxHeight="90vh"
>
  {/* Gallery content */}
</ModalShell>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Whether the modal is open |
| `onClose` | `() => void` | required | Callback when modal should close |
| `children` | `React.ReactNode` | required | Modal content |
| `maxWidth` | `string` | `'600px'` | Maximum width of the modal |
| `maxHeight` | `string` | `'90vh'` | Maximum height of the modal |
| `width` | `string` | `'100%'` | Width of the modal |
| `overlayVariant` | `'medium' \| 'dark'` | `'medium'` | Overlay opacity variant |
| `position` | `'center' \| 'side-right'` | `'center'` | Position variant for the modal |
| `closeOnOverlayClick` | `boolean` | `true` | Whether to close on overlay click |
| `closeOnEscape` | `boolean` | `true` | Whether to close on escape key |
| `className` | `string` | `''` | Custom className for the modal content |
| `animation` | `'fade-slide' \| 'slide-right'` | `'fade-slide'` | Animation variant |
| `zIndex` | `number` | `1000` | z-index for the modal |

## Design Tokens Used

- `--color-overlay-medium`: Semi-transparent overlay (rgba(0, 0, 0, 0.5))
- `--color-overlay-dark`: Dark overlay for immersive experiences (rgba(0, 0, 0, 0.95))
- `--shadow-modal`: Consistent modal elevation shadow
- `--border-radius-lg`: Standard modal border radius
- `--spacing-3`: Standard modal padding

## Benefits

### Before ModalShell
Each modal had ~40-60 lines of duplicate code:
- Overlay div with inline styles
- Click handlers for overlay and content
- Escape key event listeners
- Body scroll lock useEffect
- Animation keyframes
- z-index management

### After ModalShell
Modals are reduced to just their content:
```tsx
<ModalShell isOpen={isOpen} onClose={onClose}>
  {/* Your content */}
</ModalShell>
```

**Code Reduction:**
- SavedModal: ~40 lines removed
- ReviewSubmittedToast: ~35 lines removed
- Potential savings across all modals: ~150+ lines

## Refactored Components

✅ **SavedModal** - Now uses ModalShell  
✅ **ReviewSubmittedToast** - Now uses ModalShell

### To Be Refactored
- RatingModal
- WriteReviewModal
- PhotoGallery
- AvatarBannerModal

## Accessibility

The ModalShell automatically handles:
- `role="dialog"` and `aria-modal="true"` attributes
- Escape key to close
- Focus trap (content stops propagation)
- Body scroll lock

## Best Practices

1. **Always provide onClose**: Even if you don't want overlay click to close, provide a close button
2. **Use appropriate overlay variant**: Use `dark` for immersive experiences like galleries
3. **Match animation to position**: Use `slide-right` animation with `side-right` position
4. **Keep content semantic**: The ModalShell handles the wrapper, focus on your modal's content structure
5. **Don't nest modals**: If you need layered modals, use different z-index values

## Related Components

- **CardShell**: For card-based layouts
- **Badge**: For status indicators within modals
- **Tooltip**: For help text within modals

