# Checkout System - Integration Guide

## Quick Start

### 1. **Logged-In User Flow**

#### Step 1: Update Navigation to Cart
When a logged-in user navigates to the cart, add the `loggedin=true` query parameter:

```javascript
// In any component
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navigate to cart
navigate('/cart?loggedin=true');
```

Or update the Navbar/navigation components to include this parameter when user is authenticated.

#### Step 2: Cart Page Experience
- User sees cart items
- **New:** Address section appears with saved addresses
- User can click "Add New Address" to open modal
- Address modal allows quick address addition without page navigation
- User clicks "Proceed to Checkout" to go to checkout page

#### Step 3: Checkout Experience
- User lands on checkout with multi-step progress indicator
- Step 1: Address Selection
  - Shows saved addresses (already loaded from cart)
  - Can select address with radio button
  - Can add new address inline or via form
  - Click "Continue to Payment"
- Step 2: Payment Method
  - Shows 5 payment options (UPI, Credit Card, Debit Card, Wallet, Net Banking)
  - Select preferred method
  - Click "Place Order"
- Order is placed and payment is processed

### 2. **Cart Page Address Section**

The address section only appears when:
```javascript
const isLoggedIn = searchParams.get('loggedin') === 'true' && isAuthenticated;
```

Features:
- Shows default address first
- "Add New Address" button (if no addresses)
- "Add Another Address" button (if addresses exist)
- Address cards show: Street, City, State, Postal Code
- Default badge for default address

### 3. **AddressModal Component**

Located at: `/src/components/checkout/AddressModal.jsx`

**Props:**
```typescript
interface AddressModalProps {
  isOpen: boolean;           // Control modal visibility
  onClose: () => void;       // Close callback
  onAddressAdded: () => void; // Callback after address creation
}
```

**Usage in Cart:**
```javascript
import AddressModal from '@/components/checkout/AddressModal';

// In component
const [showAddressModal, setShowAddressModal] = useState(false);

return (
  <>
    <AddressModal
      isOpen={showAddressModal}
      onClose={() => setShowAddressModal(false)}
      onAddressAdded={() => address.fetchAddresses()}
    />
  </>
);
```

### 4. **Checkout Page Features**

Located at: `/src/pages/checkout.jsx`

**Multi-step flow:**
1. **Address Selection** - Select or add address
2. **Payment Method** - Choose payment option
3. **Order Placement** - Submit order with Razorpay

**Key Features:**
- Auto-loads addresses on mount
- Shows progress indicator
- Sidebar order summary
- Address preview in order summary
- Payment error handling
- Success redirect to order page

### 5. **useAddress Hook Updates**

Updated to use correct API endpoints:

```javascript
import useAddress from '@/hooks/useAddress';

const address = useAddress();

// Available methods
address.fetchAddresses();           // GET /users/me/addresses
address.fetchAddressById(id);       // GET /users/me/addresses/{id}
address.createAddress(data);        // POST /users/me/addresses
address.updateAddress(id, data);    // PUT /users/me/addresses/{id}
address.deleteAddress(id);          // DELETE /users/me/addresses/{id}
address.setAsDefault(id);           // POST /users/me/addresses/{id}/set-default

// Available state
address.addresses;           // Array of addresses
address.defaultShippingAddress;
address.isLoading;
address.error;
address.selectedAddressId;
```

## Implementation Checklist

### Backend Requirements
- [ ] Verify `/users/me/addresses` endpoints are implemented
- [ ] Ensure authentication headers are properly validated
- [ ] Test address CRUD operations
- [ ] Verify Razorpay payment endpoint

### Frontend Setup
- [ ] Ensure query parameter routing is set up
- [ ] Verify localStorage token key is 'token' (not 'accessToken')
- [ ] Test address loading in cart
- [ ] Test address modal in cart
- [ ] Test checkout page flow
- [ ] Test payment method selection
- [ ] Test error handling

### UI/UX Verification
- [ ] Address section appears only for logged-in users
- [ ] Modal appears as bottom sheet on mobile
- [ ] Modal appears centered on desktop
- [ ] Form validation shows proper errors
- [ ] Toast notifications appear for success/error
- [ ] Progress indicator updates correctly
- [ ] Buttons have proper disabled states

## Styling

All components use:
- **Tailwind CSS** for styling
- **lucide-react** for icons
- **Emerald color scheme** (#047857) for primary actions
- **Stone color scheme** for neutral elements
- **Responsive design** with mobile-first approach

## Common Issues & Solutions

### Issue: Addresses not loading in cart
**Solution:** 
- Verify query parameter is `loggedin=true`
- Check that user is actually authenticated
- Check browser console for API errors
- Verify token is stored with key 'token' in localStorage

### Issue: Address modal not appearing
**Solution:**
- Ensure `showAddressModal` state is being toggled
- Check that modal component is rendered in JSX
- Verify `isOpen` prop is being passed correctly

### Issue: Form validation not working
**Solution:**
- Indian postal codes must be exactly 6 digits
- Street address minimum 5 characters
- City and State minimum 2 characters
- All fields are required

### Issue: API calls failing
**Solution:**
- Verify backend endpoints match documented API
- Check authorization header format: `Bearer {token}`
- Ensure token is valid and not expired
- Check CORS settings if calling from different domain

## Future Enhancements

- [ ] Add address search/autocomplete (Google Places API)
- [ ] Add address type selection (Home/Work/Other)
- [ ] Add edit address inline in cart
- [ ] Add address deletion in cart
- [ ] Add billing address different from shipping
- [ ] Add coupon code validation
- [ ] Add order tracking
- [ ] Add saved payment methods
- [ ] Add gift wrapping option

## Testing Commands

```bash
# Build project
npm run build

# Start development server
npm start

# Run tests (if configured)
npm test

# Check for lint errors
npm run lint
```

## File Structure

```
src/
├── pages/
│   ├── cart.jsx (Updated)
│   └── checkout.jsx (New)
├── components/
│   ├── cart/
│   │   └── CartSummary.jsx (Updated)
│   └── checkout/
│       ├── CheckoutProgress.jsx (New)
│       ├── AddressSelector.jsx (New)
│       ├── AddressForm.jsx (New)
│       ├── AddressModal.jsx (New)
│       ├── PaymentMethod.jsx (New)
│       └── OrderSummary.jsx (New)
└── hooks/
    └── useAddress.js (Updated)
```

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify backend API responses
3. Check this documentation
4. Review component comments in code
5. Check CHECKOUT_IMPLEMENTATION.md for detailed overview
