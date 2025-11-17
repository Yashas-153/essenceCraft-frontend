# Toast Notification System

## Overview
This is a modern, custom toast notification system that replaces the deprecated shadcn toast. It provides lightweight, accessible notifications with multiple variants.

## Files Created

1. **`src/components/ui/toast.jsx`** - Toast component and ToastContainer
2. **`src/components/ui/use-toast.js`** - useToast hook for managing toast state

## Usage

### Basic Usage

```jsx
import { useToast } from '@/components/ui/use-toast';
import { ToastContainer } from '@/components/ui/toast';

function MyComponent() {
  const { toast, toasts, dismiss } = useToast();

  const handleClick = () => {
    toast({
      title: 'Success!',
      description: 'Your action was completed successfully.',
      variant: 'success'
    });
  };

  return (
    <>
      <button onClick={handleClick}>Show Toast</button>
      <ToastContainer toasts={toasts} onClose={dismiss} />
    </>
  );
}
```

## Toast API

### `useToast()` Hook

Returns an object with:
- **`toast(options)`** - Function to show a toast notification
- **`toasts`** - Array of active toast notifications
- **`dismiss(id)`** - Function to dismiss a specific toast
- **`dismissAll()`** - Function to dismiss all toasts

### `toast()` Options

```javascript
toast({
  title: string,           // Toast title (required)
  description: string,     // Toast description (optional)
  variant: string,         // 'default' | 'success' | 'destructive' | 'info' (default: 'default')
  duration: number         // Auto-dismiss time in ms (default: 5000)
})
```

### Variants

- **`default`** - Dark stone background (neutral)
- **`success`** - Green background (emerald) - used for successful actions
- **`destructive`** - Red background - used for errors
- **`info`** - Blue background - used for information

## Examples

### Success Toast
```jsx
toast({
  title: 'Promo code applied!',
  description: '10% discount has been applied to your order.',
  variant: 'success'
});
```

### Error Toast
```jsx
toast({
  title: 'Payment Failed',
  description: 'Please check your payment details and try again.',
  variant: 'destructive'
});
```

### Info Toast
```jsx
toast({
  title: 'Processing',
  description: 'Your order is being processed...',
  variant: 'info',
  duration: 3000
});
```

## Integration with Components

The CartSummary component has been updated to use the new toast system. The ToastContainer is rendered at the bottom-right of the screen and automatically manages toast display and dismissal.

## Styling

The toast system uses Tailwind CSS and integrates with the app's design system:
- Uses stone, emerald, red, and blue color palettes
- Responsive design with proper spacing
- Smooth animations for toast entry/exit
- Icons from lucide-react library

## Auto-Dismiss

Toasts automatically dismiss after 5 seconds (default) or the specified duration. Users can manually dismiss by clicking the X button.

## Migration Notes

If you were using the deprecated shadcn toast:

**Old:**
```jsx
import { useToast } from '@/components/ui/use-toast';
const { toast } = useToast();
```

**New:**
```jsx
import { useToast } from '@/components/ui/use-toast';
import { ToastContainer } from '@/components/ui/toast';
const { toast, toasts, dismiss } = useToast();
// Don't forget to render ToastContainer
```
