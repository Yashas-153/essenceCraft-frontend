# Code Flow Diagram & Examples

## User Journey - Step by Step

### 1. User Logs In
```javascript
// In Login Component
// After successful login
localStorage.setItem('token', response.access_token);
localStorage.setItem('user', JSON.stringify(response.user));

// Navigate to home or products
navigate('/');
```

### 2. User Adds Items to Cart
```javascript
// In ProductCard or ProductDetails
const { addItem } = useCart();

await addItem(productId, quantity);
// Item is added to cart (local or backend depending on auth)
```

### 3. User Clicks "Go to Cart" (Logged In)
```javascript
// In any navigation button
const { isAuthenticated } = useAuth();
const navigate = useNavigate();

const handleCartClick = () => {
  if (isAuthenticated) {
    navigate('/cart?loggedin=true'); // ✨ Key: Add query param
  } else {
    navigate('/cart');
  }
};
```

### 4. Cart Page Loads
```javascript
// In /src/pages/cart.jsx
const [searchParams] = useSearchParams();
const isLoggedIn = searchParams.get('loggedin') === 'true' && isAuthenticated;

useEffect(() => {
  if (isLoggedIn) {
    address.fetchAddresses(); // Load addresses from backend
  }
}, [isLoggedIn]);

// Render address section
{isLoggedIn && (
  <AddressSection>
    {addresses.map(addr => <AddressCard key={addr.id} {...addr} />)}
    <AddNewAddressButton onClick={() => setShowAddressModal(true)} />
  </AddressSection>
)}
```

### 5. User Adds New Address (Modal)
```javascript
// User clicks "Add New Address"
setShowAddressModal(true);

// AddressModal opens (bottom sheet on mobile)
// User fills form:
// - Street Address
// - City
// - State
// - Postal Code
// - Country

// User clicks "Add Address"
// Form validates:
if (!validate()) return; // Show errors

// API Call
await address.createAddress({
  street_address: '123 Main St',
  city: 'New York',
  state: 'NY',
  postal_code: '10001',
  country: 'India',
  address_type: 'shipping'
});

// Success
onAddressAdded(); // Refresh addresses list
setShowAddressModal(false); // Close modal
showToast('Address added successfully');

// New address appears in cart immediately
```

### 6. User Clicks "Proceed to Checkout"
```javascript
// In CartSummary.jsx
const handleCheckout = () => {
  // Validation
  if (!isAuthenticated) {
    navigate('/login');
    return;
  }
  if (!userDetails?.email) {
    navigate('/login');
    return;
  }
  if (cartTotals.itemCount === 0) {
    showToast('Cart is empty');
    return;
  }

  // Navigate to checkout
  navigate('/checkout');
};
```

### 7. Checkout Page Loads
```javascript
// In /src/pages/checkout.jsx
useEffect(() => {
  // Verify authentication
  if (!isAuthenticated) {
    showToast('Authentication required');
    navigate('/login');
    return;
  }

  // Load addresses
  address.fetchAddresses();
}, []);

// Initial state
const [currentStep, setCurrentStep] = useState('address');
const [selectedAddressId, setSelectedAddressId] = useState(null);
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');

// Render Progress indicator
<CheckoutProgress currentStep={currentStep} />

// Render Step 1: Address
{currentStep === 'address' && (
  <AddressSelector
    addresses={address.addresses}
    selectedAddressId={selectedAddressId}
    onSelectAddress={setSelectedAddressId}
    onContinue={() => setCurrentStep('payment')}
  />
)}

// Render Step 2: Payment
{currentStep === 'payment' && (
  <PaymentMethod
    selectedMethod={selectedPaymentMethod}
    onSelectMethod={setSelectedPaymentMethod}
    onBack={() => setCurrentStep('address')}
    onPlaceOrder={handlePlaceOrder}
  />
)}
```

### 8. User Selects Address & Continues
```javascript
// In AddressSelector.jsx
const handleContinueToPayment = () => {
  if (!selectedAddressId) {
    showToast('Please select an address');
    return;
  }
  onContinue(); // Move to payment step
};
```

### 9. User Selects Payment Method
```javascript
// In PaymentMethod.jsx
const paymentMethods = [
  { id: 'upi', name: 'UPI', ... },
  { id: 'credit_card', name: 'Credit Card', ... },
  { id: 'debit_card', name: 'Debit Card', ... },
  { id: 'wallet', name: 'Digital Wallet', ... },
  { id: 'netbanking', name: 'Net Banking', ... }
];

// User clicks on a method
setSelectedPaymentMethod(method.id);
```

### 10. User Places Order
```javascript
// In Checkout.jsx - handlePlaceOrder()
const handlePlaceOrder = async () => {
  // Validate
  if (!selectedAddressId) {
    showToast('Select address');
    return;
  }
  if (!selectedPaymentMethod) {
    showToast('Select payment method');
    return;
  }

  try {
    // Initiate Razorpay payment
    await initiateCheckout({
      shippingAddressId: selectedAddressId,
      userDetails: {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone
      },
      paymentMethod: selectedPaymentMethod,
      
      onSuccess: (verification, order) => {
        showToast('Payment successful! 🎉');
        navigate(`/order-success/${order.id}`);
      },
      
      onFailure: (error) => {
        showToast('Payment failed: ' + error.message);
      }
    });
  } catch (error) {
    showToast('Error: ' + error.message);
  }
};
```

## API Calls Flow

### Address Loading (Cart Page)
```
GET /api/v1/users/me/addresses
Headers: Authorization: Bearer {token}

Response:
[
  {
    id: 1,
    street_address: "123 Main St",
    city: "New York",
    state: "NY",
    postal_code: "10001",
    country: "India",
    is_default: true,
    address_type: "shipping"
  },
  ...
]
```

### Create Address (Modal)
```
POST /api/v1/users/me/addresses
Headers: 
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  street_address: "456 Oak Ave",
  city: "Los Angeles",
  state: "CA",
  postal_code: "90001",
  country: "USA",
  address_type: "shipping"
}

Response:
{
  id: 2,
  street_address: "456 Oak Ave",
  city: "Los Angeles",
  state: "CA",
  postal_code: "90001",
  country: "USA",
  is_default: false,
  address_type: "shipping"
}
```

### Place Order (Checkout)
```
POST /api/v1/payments/razorpay/create-order
Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  shippingAddressId: 1,
  paymentMethod: "upi",
  userDetails: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+91XXXXXXXXXX"
  }
}

Response:
{
  razorpay_order_id: "order_xyz123",
  amount: 5000,
  currency: "INR",
  user_id: 1,
  ...
}
```

## State Management Overview

### At Cart Page
```javascript
// Cart Context
cart = { items: [...] }
cartTotals = { itemCount: 3, subtotal: 5000 }

// Address Hook
addresses = [{ id: 1, ... }, { id: 2, ... }]
defaultShippingAddress = { id: 1, is_default: true }
selectedAddressId = null

// Local State
showAddressModal = false
isLoggedIn = true
```

### At Checkout Page
```javascript
// Cart Context (same)
// Address Hook (same)

// Local State
currentStep = 'address' // or 'payment'
selectedAddressId = 1 // User selects this
selectedPaymentMethod = 'upi'
```

## Error Handling Flow

### Address Loading Error
```javascript
try {
  await address.fetchAddresses();
} catch (err) {
  showToast({
    title: 'Error',
    description: 'Failed to load addresses',
    variant: 'destructive'
  });
}
```

### Form Validation Error
```javascript
const errors = validateForm(formData);
if (Object.keys(errors).length > 0) {
  setErrors(errors);
  return; // Don't submit
}
```

### API Call Error
```javascript
try {
  await address.createAddress(data);
} catch (error) {
  // error.message comes from backend
  showToast({
    title: 'Error',
    description: error.message || 'Failed to save address'
  });
}
```

### Payment Error
```javascript
onFailure: (error) => {
  // error structure from Razorpay
  const message = error.description || error.message;
  showToast({
    title: 'Payment Failed',
    description: message
  });
}
```

## Component Props Flow

### AddressSelector Props
```javascript
<AddressSelector
  addresses={address.addresses}           // [{ id, street, city, ... }]
  selectedAddressId={selectedAddressId}   // 1 or null
  onSelectAddress={(id) => {}}            // Callback on address select
  isLoading={address.isLoading}           // Loading spinner
  onContinue={() => {}}                   // Continue to payment
/>
```

### AddressModal Props
```javascript
<AddressModal
  isOpen={showAddressModal}              // true/false
  onClose={() => {}}                     // Close modal callback
  onAddressAdded={() => {}}              // Refresh addresses
/>
```

### OrderSummary Props
```javascript
<OrderSummary
  cartTotals={{
    subtotal: 5000,
    itemCount: 3,
    items: [{ product, quantity }, ...]
  }}
  currencySymbol="₹"
  selectedAddressId={1}
  selectedAddress={{ id: 1, street, city, ... }}
/>
```

## Key Points to Remember

1. **Query Parameter:** Use `?loggedin=true` to show address section in cart
2. **Token Storage:** Token is stored with key `'token'` (not `'accessToken'`)
3. **API Base URL:** All requests to `http://localhost:8000/api/v1`
4. **Address Type:** Must be either `'shipping'` or `'billing'`
5. **Postal Code:** Indian postal codes must be exactly 6 digits
6. **Payment Methods:** UPI, Credit Card, Debit Card, Wallet, Net Banking
7. **Modal Design:** Bottom sheet on mobile, centered on desktop
8. **Progress Indicator:** Shows completion status with checkmarks

This flow ensures a smooth, robust user experience similar to Myntra!
