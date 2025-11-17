# Unified 3-Step Checkout Flow Implementation Guide

## Overview

The checkout system has been refactored into a **unified 3-step flow integrated within the cart page**. This follows the Myntra design pattern with a seamless user experience.

## Architecture

### User Flow

```
Cart Page (Not Logged In)
├── Display cart items
├── Show login/signup prompt
└── NO checkout (redirect to login first)

Cart Page (Logged In + loggedin=true)
├── CheckoutFlow Component Renders
│   ├── Step 1: Review Order (CartItems)
│   ├── Step 2: Delivery Address (AddressSelector)
│   └── Step 3: Payment Method (PaymentMethod)
├── Progress Indicator (Shows all 3 steps)
├── Sidebar (OrderSummary always visible)
└── Success redirects to /order-success/{orderId}
```

## Key Components

### 1. **CheckoutFlow.jsx** (New - Main Component)
Located at: `/src/components/checkout/CheckoutFlow.jsx`

**Responsibilities:**
- Manages all 3 checkout steps
- Handles address loading and auto-selection of default address
- Manages payment flow with Razorpay integration
- Displays progress indicator
- Shows OrderSummary sidebar

**Props:**
- `isLoggedIn` (boolean) - Whether user is logged in and checkout should show

**State Management:**
- `currentStep`: Tracks which step user is on ('cart' | 'address' | 'payment')
- `selectedAddressId`: Currently selected address
- `selectedPaymentMethod`: Currently selected payment method
- `showAddressModal`: Controls address modal visibility

**Key Features:**
- Auto-loads addresses when logged in
- Auto-selects default address if available
- Prevents step progression with validation
- Integrates with Razorpay for payment
- Passes order and verification data to success page

### 2. **Updated cart.jsx**
Located at: `/src/pages/cart.jsx`

**Logic:**
```javascript
// If logged in AND loggedin=true query param exists
if (isLoggedIn && isAuthenticated) {
  return <CheckoutFlow isLoggedIn={true} />;
}

// Otherwise show standard cart with login prompt
// No checkout flow available
```

**Key Points:**
- Remains gateway between simple cart and checkout
- Determines whether to show checkout or login prompt
- Checks both `isAuthenticated` AND `loggedin=true` query parameter
- Empty cart still shows EmptyCart component

### 3. **CheckoutProgress.jsx** (Updated)
Located at: `/src/components/checkout/CheckoutProgress.jsx`

**Changes:**
- Now shows all 3 steps instead of just 2
- Steps: Cart → Address → Payment
- Shows checkmark for completed steps
- Shows current step in green

**Visual Indicator:**
```
[✓ Cart] ────── [📍 Address] ────── [💳 Payment]
 completed        current              pending
```

### 4. **AddressSelector.jsx** (Existing)
Located at: `/src/components/checkout/AddressSelector.jsx`

**Features:**
- Displays list of saved addresses
- Radio button selection
- Shows "Default" badge on default address
- Add new address button
- Inline address form toggle
- Continue button (disabled until address selected)

### 5. **PaymentMethod.jsx** (Existing)
Located at: `/src/components/checkout/PaymentMethod.jsx`

**Features:**
- 5 payment options: UPI, Credit Card, Debit Card, Wallet, Net Banking
- Radio button selection
- Security notice and terms
- Back button to return to address step
- Place Order button with processing state

### 6. **OrderSummary.jsx** (Existing)
Located at: `/src/components/checkout/OrderSummary.jsx`

**Features:**
- Always visible sidebar (30% width on desktop)
- Shows price breakdown
- Shows selected address preview
- Sticky positioning (stays visible when scrolling)

### 7. **OrderSuccess.jsx** (New)
Located at: `/src/pages/OrderSuccess.jsx`

**Features:**
- Shows success confirmation
- Displays order number
- Shows delivery address
- Displays ordered items with images
- Shows order status tracking
- Provides support contact information
- Links to home and continue shopping

## Data Flow

### Step 1: Review Order (Cart)
```
CheckoutFlow
├── Loads cart from useCart hook
├── Displays CartItems component
└── Continue button → Move to Step 2
```

### Step 2: Delivery Address
```
CheckoutFlow
├── useAddress hook loads addresses from API
│   └── GET /users/me/addresses (requires token)
├── Auto-selects default address if available
├── AddressSelector displays:
│   ├── List of saved addresses
│   ├── Toggle to show address form
│   └── Add new address button
└── Continue button → Move to Step 3 (validation)
```

### Step 3: Payment Method
```
CheckoutFlow
├── PaymentMethod displays 5 options
├── User selects payment method
└── Place Order button → initiateCheckout()
    ├── Step 1: Load Razorpay script
    ├── Step 2: Create order (POST /orders)
    ├── Step 3: Create payment order (POST /payments/create-order)
    ├── Step 4: Open Razorpay modal
    ├── Step 5: Verify payment (POST /payments/verify)
    └── Success: Navigate to /order-success/{orderId}
```

## API Integration Points

### Token Handling
**Location:** `useRazorPayment.js`

```javascript
const getAccessToken = () => {
  const token = localStorage.getItem('token'); // IMPORTANT: Use 'token' not 'accessToken'
  if (!token) throw new Error('No access token found');
  return token;
};
```

**Important:** Token is stored as `token` key (not `accessToken`)

### Address API Endpoints
**Hook:** `useAddress.js`

```javascript
// Fetch all addresses
GET /users/me/addresses
Headers: Authorization: Bearer {token}

// Create address
POST /users/me/addresses
Headers: Authorization: Bearer {token}
Body: { street_address, city, state, postal_code, country, is_default }

// Update address
PUT /users/me/addresses/{id}
Headers: Authorization: Bearer {token}

// Delete address
DELETE /users/me/addresses/{id}
Headers: Authorization: Bearer {token}

// Set as default
PUT /users/me/addresses/{id}/set-default
Headers: Authorization: Bearer {token}
```

### Payment API Endpoints
**Hook:** `useRazorPayment.js`

```javascript
// Create order
POST /orders
Headers: Authorization: Bearer {token}
Body: { shipping_address_id, items: [] }

// Create Razorpay payment order
POST /payments/create-order
Headers: Authorization: Bearer {token}
Body: { order_id, payment_method }

// Verify payment
POST /payments/verify
Headers: Authorization: Bearer {token}
Body: {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  order_id
}
```

## Query Parameter System

### loggedin=true Parameter

**Purpose:** Signals that a logged-in user is accessing the cart and should see the checkout flow

**Set by:** Navbar.jsx when authenticated user clicks cart
```javascript
onClick={() => navigate(isAuthenticated ? '/cart?loggedin=true' : '/cart')}
```

**Used by:** cart.jsx to determine which UI to render
```javascript
const isLoggedIn = searchParams.get('loggedin') === 'true' && isAuthenticated;

if (isLoggedIn) {
  return <CheckoutFlow isLoggedIn={true} />;
}
```

**Behavior:**
- Logged-in users: `/cart` → `/cart?loggedin=true` (shows checkout)
- Non-logged-in users: `/cart` → `/cart` (shows login prompt)
- Back button preserves parameter (important for return navigation)

## Back Navigation Pattern

### Within Checkout Steps
```javascript
// Step 1 → Step 2: No back needed (direct next)
// Step 2 → Step 3: Back button
handleAddressBack = () => setCurrentStep('address')

// Step 3 → Step 2: Back button
handlePaymentBack = () => setCurrentStep('address')
```

**Important:** Back button uses `setCurrentStep()` NOT navigation. Keeps user on same page.

### From Checkout Success
```javascript
navigate('/order-success/{orderId}', {
  state: { order, verificationResult }
})

// From success page back to cart
navigate('/cart?loggedin=true') // IMPORTANT: Preserve loggedin parameter
```

## User Experience Features

### 1. Default Address Auto-Selection
```javascript
useEffect(() => {
  if (address.defaultShippingAddress && !selectedAddressId) {
    setSelectedAddressId(address.defaultShippingAddress.id);
  }
}, [address.defaultShippingAddress, selectedAddressId]);
```

**Benefit:** Logged-in users can proceed with one click if default address exists

### 2. Validation Before Step Progression
```javascript
// At address step
if (!selectedAddressId) {
  toast({ title: 'Address required', ... });
  return; // Prevent progression
}

// At payment step
if (!selectedPaymentMethod) {
  toast({ title: 'Payment method required', ... });
  return; // Prevent progression
}
```

**Benefit:** Prevents incomplete checkout attempts

### 3. Always-Visible Summary
```javascript
// OrderSummary is in separate grid column (1/3 width on desktop)
// Stays visible during all steps
// Shows:
// - Price breakdown
// - Selected address preview
// - Item count
```

**Benefit:** Users always know their order total and shipping address

### 4. Address Modal for Adding New Addresses
```javascript
<AddressModal
  isOpen={showAddressModal}
  onClose={() => setShowAddressModal(false)}
  onAddressAdded={loadAddresses}
/>
```

**Benefit:** Don't interrupt checkout flow to add address

### 5. Progress Indicator
```javascript
// Shows user progress through checkout
// Updates on each step change
// Shows checkmarks for completed steps
```

**Visual Feedback:** Users know where they are in process

## Testing Checklist

- [ ] Not logged in: Cart shows login prompt, NO checkout flow
- [ ] Logged in + loggedin=true: Cart shows CheckoutFlow with Step 1
- [ ] Step 1: Cart items display, Continue button visible
- [ ] Step 2: Addresses load, default is pre-selected
- [ ] Step 2: Cannot continue without selecting address
- [ ] Step 2: Add address button opens modal
- [ ] Step 2: Continue button moves to Step 3
- [ ] Step 3: Payment methods display
- [ ] Step 3: Back button returns to Step 2
- [ ] Step 3: Place Order initiates Razorpay payment
- [ ] Razorpay: Payment modal opens correctly
- [ ] Success: Redirects to /order-success/{orderId}
- [ ] Success: Shows order details correctly
- [ ] Sidebar: OrderSummary visible on all steps
- [ ] Back from success: Uses loggedin=true parameter

## Common Issues & Solutions

### Issue: Addresses not loading
**Check:**
1. Token is stored as 'token' not 'accessToken'
2. Backend endpoint is /users/me/addresses (not /addresses)
3. User is authenticated
4. loggedin=true parameter is present

### Issue: Default address not auto-selected
**Check:**
1. Default address has `is_default: true` from backend
2. useAddress hook correctly maps `defaultShippingAddress`
3. selectedAddressId state is being updated

### Issue: Payment not processing
**Check:**
1. Razorpay script loads (check console)
2. Backend returns correct payment order data
3. Token is valid and not expired
4. Order ID is correct

### Issue: Back button not working
**Check:**
1. Using `setCurrentStep()` not `navigate()`
2. State is being updated correctly
3. Component re-renders on state change

## Future Enhancements

1. **Payment Method Save:** Option to save card details
2. **Promo Codes:** Apply discount codes before payment
3. **Order Tracking:** Real-time order tracking
4. **Wishlist Integration:** Save items for later
5. **Gift Message:** Add gift message to order
6. **Schedule Delivery:** Choose delivery date
7. **Multiple Addresses:** Show different shipping vs billing
8. **Payment Retry:** Automatic retry for failed payments

## File Changes Summary

### Created Files
- `/src/components/checkout/CheckoutFlow.jsx` - Main checkout component
- `/src/pages/OrderSuccess.jsx` - Success page

### Modified Files
- `/src/pages/cart.jsx` - Simplified to delegate to CheckoutFlow
- `/src/components/checkout/CheckoutProgress.jsx` - Updated to show 3 steps
- `/src/App.js` - Added /order-success route

### Existing Components (Reused)
- `/src/components/checkout/AddressSelector.jsx` - No changes
- `/src/components/checkout/PaymentMethod.jsx` - No changes
- `/src/components/checkout/OrderSummary.jsx` - No changes
- `/src/components/checkout/AddressModal.jsx` - No changes
- `/src/hooks/useAddress.js` - Already updated
- `/src/hooks/useRazorPayment.js` - Already available

## Deployment Notes

1. Ensure backend endpoints are available and accessible
2. Configure Razorpay API keys in environment variables
3. Test payment flow in sandbox mode first
4. Verify token storage and retrieval
5. Test across different devices and browsers
6. Enable HTTPS for payment processing
7. Set up proper error handling and logging
