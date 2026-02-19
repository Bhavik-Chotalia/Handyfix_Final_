# HandyFix User-Only Platform - Testing Checklist

## Executive Summary
This document provides a comprehensive testing checklist for the transformation of HandyFix from a dual-role marketplace to a user-only service booking platform with Indian Rupee pricing.

---

## 1. Authentication & Authorization Testing

### User Registration
- [ ] User can register with email, password, name, and phone
- [ ] Registration does NOT show provider role option
- [ ] All registered users get 'user' role in database
- [ ] Duplicate email registration shows error
- [ ] Password validation works (minimum requirements)
- [ ] Phone number validation works
- [ ] User receives confirmation email/SMS
- [ ] User can login immediately after registration

### User Login
- [ ] Existing users can login with correct credentials
- [ ] Login fails with incorrect password
- [ ] Login fails with non-existent email
- [ ] Session persists after browser refresh
- [ ] User data loads correctly after login
- [ ] Token is stored in localStorage
- [ ] Remember me functionality works (if enabled)
- [ ] Logout clears session and tokens

### Protected Routes
- [ ] `/my-bookings` redirects to login if not authenticated
- [ ] `/saved-services` redirects to login if not authenticated
- [ ] `/payments` redirects to login if not authenticated
- [ ] `/settings` redirects to login if not authenticated
- [ ] `/user/profile` redirects to login if not authenticated
- [ ] Authenticated users can access all protected routes
- [ ] Invalid tokens show auth error

---

## 2. Currency & Pricing Testing

### Price Display
- [ ] All prices show `₹` symbol, not `$`
- [ ] Prices are formatted with commas (₹6,750 not ₹6750)
- [ ] Service card prices display correctly
- [ ] Booking detail prices display correctly
- [ ] Payment history prices display correctly

### Price Conversions
- [ ] Emergency Plumbing Repair: ₹6,750 ✓
- [ ] Electrical Panel Upgrade: ₹13,500 ✓
- [ ] Custom Furniture Building: ₹18,000 ✓
- [ ] Interior Painting: ₹10,800 ✓
- [ ] Deep Home Cleaning: ₹7,650 ✓
- [ ] AC Installation & Repair: ₹8,550 ✓
- [ ] Water Heater Installation: ₹16,200 ✓
- [ ] Smart Home Wiring: ₹22,500 ✓

### Price Filters
- [ ] "Under ₹4,500" filter works correctly
- [ ] "₹4,500 - ₹9,000" filter works correctly
- [ ] "₹9,000+" filter works correctly
- [ ] Multiple filters can be combined
- [ ] "Clear All" button resets filters
- [ ] Price ranges exclude boundaries correctly

### Payment Processing
- [ ] Payment amounts show in INR
- [ ] Payment methods accept INR amounts
- [ ] Transaction history shows INR values
- [ ] Refunds calculated in INR

---

## 3. Removed Features Testing

### Provider Features Not Accessible
- [ ] `/provider` route shows 404
- [ ] `/provider-setup` route shows 404
- [ ] `/provider-setup` route shows 404
- [ ] `/provider/job/:id` route shows 404
- [ ] `/providers` route shows 404
- [ ] Provider navigation links don't exist in header
- [ ] "Join as Provider" button does NOT appear on homepage
- [ ] No provider signup option available

### Admin Features Not Accessible
- [ ] `/admin` route shows 404
- [ ] `/admin/dashboard` route shows 404
- [ ] Admin navigation links don't exist in header
- [ ] Admin profile menu option not visible
- [ ] No admin users can be created

### Homepage Updates
- [ ] "Featured Service Providers" section replaced with "Why Choose Us"
- [ ] Provider cards removed from homepage
- [ ] "Join as Provider" CTA removed from homepage
- [ ] "Find More Providers" button removed
- [ ] Only "Browse Services" CTA visible in main CTA section
- [ ] No provider-related images or text on homepage

### Navigation Updates
- [ ] Header shows only user navigation options
- [ ] User logged in sees: Dashboard, Services, Settings
- [ ] User not logged in sees: Home, Services, About, Contact
- [ ] No "Find Providers" link in navigation
- [ ] Profile dropdown shows only user options
- [ ] Settings link navigates to profile settings page

---

## 4. New User Features Testing

### My Bookings Page (`/my-bookings`)
- [ ] Page loads successfully when authenticated
- [ ] All user's bookings display with correct information
- [ ] Filter tabs show: All, Upcoming, Completed, Cancelled
- [ ] Filter counts are accurate
- [ ] Upcoming bookings show "Reschedule" and "Cancel" buttons
- [ ] Completed bookings show "Rate & Review" button (if not reviewed)
- [ ] Cancelled bookings show only "Invoice" and "Contact"
- [ ] "Download Invoice" button works
- [ ] "Contact Provider" navigates or opens chat
- [ ] Booking status badges show correct colors
- [ ] Date and time display correctly
- [ ] Price shows in INR with proper formatting
- [ ] Empty state shows when no bookings exist
- [ ] "Browse Services" button navigates to services page

### Saved Services Page (`/saved-services`)
- [ ] Page loads successfully when authenticated
- [ ] Saved services display as cards in grid
- [ ] Heart icon indicates saved status
- [ ] Service details show correctly (price, rating, duration)
- [ ] "Book Now" button navigates to services page
- [ ] Remove button removes from saved list
- [ ] Remove shows confirmation toast
- [ ] Prices display in INR
- [ ] Saved date displays under each service
- [ ] Empty state shows when no saved services
- [ ] "Browse Services" button in empty state works

### Payment History Page (`/payments`)
- [ ] Page loads successfully when authenticated
- [ ] Summary cards show: Total Spent, Completed, Pending
- [ ] Summary values are accurate
- [ ] Search functionality works for service names
- [ ] Search functionality works for transaction IDs
- [ ] Status filter shows: All, Completed, Pending, Failed
- [ ] Transaction table displays all required columns
- [ ] Download Receipt button works
- [ ] Retry button shows for failed payments
- [ ] Status badges show correct colors
- [ ] Amounts display in INR
- [ ] Date formats are consistent
- [ ] Empty state shows when no transactions found

### Profile Settings Page (`/settings`)
- [ ] Page loads successfully when authenticated
- [ ] Sidebar tabs are clickable
- [ ] Active tab is highlighted
- [ ] Tab content changes when clicked

#### Personal Info Tab
- [ ] Profile picture displays
- [ ] Avatar upload works
- [ ] Camera icon shows on hover
- [ ] File input accepts image files
- [ ] Image preview updates after upload
- [ ] Full name field editable
- [ ] Email field is read-only
- [ ] Phone field editable
- [ ] Bio field editable with character limit
- [ ] Save button works
- [ ] Toast shows success message

#### Addresses Tab
- [ ] Existing addresses display
- [ ] "Add New Address" button works
- [ ] New address form appears
- [ ] Address fields: label, street, city, state, zipCode
- [ ] Default address checkbox works
- [ ] Only one default address can be set
- [ ] Remove button removes address
- [ ] Cannot remove all addresses
- [ ] Save button works
- [ ] Toast shows success message

#### Notifications Tab
- [ ] Email Notifications toggle works
- [ ] SMS Notifications toggle works
- [ ] Push Notifications toggle works
- [ ] Booking Updates toggle works
- [ ] Promotions toggle works
- [ ] Toggles save state
- [ ] Toast shows success message

#### Privacy Tab
- [ ] Profile Visibility radio buttons work
- [ ] Options: Private, Friends Only, Public
- [ ] Share Data toggle works
- [ ] Allow Analytics toggle works
- [ ] Selections save correctly
- [ ] Toast shows success message

#### Security Tab
- [ ] Change Password button visible
- [ ] Enable 2FA button visible
- [ ] View All Sessions button visible
- [ ] Feature coming soon message shows appropriately

#### Help & Support Tab
- [ ] FAQ items display
- [ ] FAQs are readable
- [ ] Contact information shows
- [ ] Support hours display
- [ ] Chat with Support button works

---

## 5. Homepage & Public Pages Testing

### Homepage (`/`)
- [ ] No provider-related content
- [ ] Search bar shows service + location
- [ ] Categories display correctly
- [ ] Why Choose Us section displays (not Featured Providers)
- [ ] Testimonials section works
- [ ] CTA buttons work correctly
- [ ] No "Join as Provider" option visible
- [ ] Stats display correctly

### Services Page (`/services`)
- [ ] Services display with INR prices
- [ ] Category filters work
- [ ] Price range filters work with INR values
- [ ] Search functionality works
- [ ] Sort options work
- [ ] Service cards show all information
- [ ] "Book Now" button visible
- [ ] Empty state shows when no results
- [ ] Mobile filters work on smaller screens

### About & Contact Pages
- [ ] Pages load correctly
- [ ] No provider references
- [ ] Content is appropriate for user-only platform
- [ ] Contact form works (if applicable)

---

## 6. Header & Navigation Testing

### Header Logo & Branding
- [ ] Logo displays correctly
- [ ] HandyFix text displays
- [ ] Logo links to home page
- [ ] Logo hover effect works

### Navigation Links (Public)
- [ ] Home link works
- [ ] Services link works
- [ ] About link works
- [ ] Contact link works

### Emergency Button
- [ ] Button displays in header
- [ ] Button navigates to emergency page
- [ ] Text displays clearly

### Theme Toggle
- [ ] Sun/Moon icon displays
- [ ] Click toggles between light/dark mode
- [ ] Theme persists on page refresh

### Notifications (When Logged In)
- [ ] Bell icon displays
- [ ] Notification badge shows count
- [ ] Notification dropdown opens on click
- [ ] Notifications display with messages and times
- [ ] "View all notifications" link works
- [ ] Dropdown closes when clicking outside

### User Menu (When Logged In)
- [ ] User avatar/initials display
- [ ] User name displays in dropdown
- [ ] User email displays in dropdown
- [ ] User role badge shows "user"
- [ ] Dashboard link visible for users
- [ ] Dashboard link works
- [ ] "My Profile" link visible
- [ ] "My Profile" link works
- [ ] Settings link visible for users
- [ ] Settings link works
- [ ] Theme toggle in dropdown works
- [ ] Logout button visible
- [ ] Logout clears session and redirects

### Mobile Menu
- [ ] Menu hamburger displays on mobile
- [ ] Mobile menu opens on click
- [ ] Mobile menu closes on click
- [ ] Menu items display correctly
- [ ] Menu items navigate correctly
- [ ] Menu closes after navigation

---

## 7. Data Validation Testing

### User Model
- [ ] New users have all required fields
- [ ] Role is always 'user' for new signups
- [ ] Addresses array can be populated
- [ ] Payment methods can be added
- [ ] Notification preferences save correctly
- [ ] Privacy settings save correctly
- [ ] Total bookings count increments
- [ ] Total spent amount updates correctly

### Booking Model
- [ ] Bookings reference correct userId (not providerId)
- [ ] Booking date format is correct
- [ ] Booking time format is correct
- [ ] Price is stored in INR
- [ ] Status values are from allowed enum
- [ ] Payment status values are correct
- [ ] Rating field allows 1-5 values
- [ ] Review field allows empty or text

---

## 8. API Testing

### Authentication Endpoints
```
POST /api/auth/signup
- Should NOT accept service_provider role
- Should force user role
- Should return JWT token
- Should create user in database
```

```
POST /api/auth/login
- Should authenticate users only
- Should return correct user data
- Should return JWT token
```

```
GET /api/auth/verify
- Should verify valid tokens
- Should return user data
- Should reject invalid tokens
```

### Profile Endpoints
```
GET /api/profile/me
- Should return user with all fields
- Should include addresses array
- Should include payment methods
- Should include notification preferences
```

```
PUT /api/profile/settings
- Should update personal info
- Should update bio
- Should update notification preferences
- Should update privacy settings
```

```
POST /api/profile/addresses
- Should add new address to user
- Should validate address fields
- Should handle default address logic
```

```
PUT /api/profile/addresses/:id
- Should update existing address
- Should handle default address logic
```

```
DELETE /api/profile/addresses/:id
- Should delete address
- Should prevent deleting only address
```

### Booking Endpoints
```
POST /api/bookings/request
- Should create booking with INR price
- Should reference userId not providerId
- Should set initial status to 'pending'
- Should set payment status to 'unpaid'
```

```
GET /api/bookings/my-jobs
- Should return user's bookings only
- Should return Booking model data
- Should filter by status if provided
```

```
PUT /api/bookings/:id
- Should update booking status
- Should update booking only if user owns it
```

```
POST /api/bookings/:id/review
- Should add rating and review
- Should validate rating 1-5
```

### Removed Endpoints (Should Return 404)
```
All /api/providers/* routes
All /api/admin/* routes
All provider-setup routes
GET /api/providers
```

---

## 9. Database Testing

### User Collection
```javascript
// Verify new user has all fields
db.users.findOne({ email: "test@example.com" })

// Should have:
{
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  avatar: String,
  role: "user",  // ALWAYS "user", never "service_provider"
  bio: String,
  addresses: Array,
  paymentMethods: Array,
  notificationPreferences: Object,
  privacySettings: Object,
  totalBookings: Number,
  totalSpent: Number,
  isVerified: Boolean,
  isBlocked: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Collection
```javascript
// Verify booking has correct structure
db.bookings.findOne({ _id: ObjectId(...) })

// Should have:
{
  userId: ObjectId,  // NOT providerId
  serviceId: String,
  serviceName: String,
  price: Number,  // Should be INR value
  status: String, // pending, confirmed, in_progress, completed, cancelled
  paymentStatus: String,  // unpaid, paid, refunded
  bookingDate: Date,
  bookingTime: String,
  location: String,
  rating: Number or null,
  review: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Removed Collections
- [ ] `providers` collection should be empty or deleted
- [ ] No provider-related documents in user collection
- [ ] No service_provider roles in user collection

---

## 10. Performance Testing

### Page Load Times
- [ ] Homepage loads in < 2 seconds
- [ ] Services page loads in < 2 seconds
- [ ] Profile settings loads in < 1.5 seconds
- [ ] Bookings page loads in < 1.5 seconds
- [ ] No console errors
- [ ] No unhandled promise rejections

### API Response Times
- [ ] GET /api/profile/me responds in < 500ms
- [ ] GET /api/bookings/my-jobs responds in < 500ms
- [ ] POST /api/bookings/request responds in < 1000ms
- [ ] PUT endpoints respond in < 500ms

### Database Queries
- [ ] User lookups use indexed fields
- [ ] Booking queries use userId index
- [ ] No N+1 query problems

---

## 11. Browser Compatibility Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Firefox Mobile
- [ ] Samsung Internet

### Responsive Design
- [ ] Layout works on 320px width
- [ ] Layout works on 768px width
- [ ] Layout works on 1024px width
- [ ] Layout works on 1440px width
- [ ] Touch interactions work on mobile
- [ ] Forms are mobile-friendly

---

## 12. Security Testing

### Authentication Security
- [ ] Passwords are hashed
- [ ] Tokens expire after set time
- [ ] CSRF protection in place
- [ ] SQL injection prevention
- [ ] XSS prevention

### Data Protection
- [ ] User data not exposed in URLs
- [ ] Payment info not logged
- [ ] Sensitive data encrypted in transit
- [ ] HTTPS enforced

### Authorization
- [ ] Users cannot access other users' data
- [ ] Users cannot modify other users' bookings
- [ ] Users cannot delete other users' addresses

---

## 13. Accessibility Testing

### WCAG Compliance
- [ ] Proper heading hierarchy (H1, H2, H3)
- [ ] Color contrast meets AA standard
- [ ] Form labels present and associated
- [ ] Error messages clear and linked to fields
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus indicators visible

### Screen Reader Testing
- [ ] Page structure makes sense
- [ ] Form fields are properly labeled
- [ ] Buttons have descriptive text
- [ ] Images have alt text
- [ ] Links have descriptive text

---

## 14. Regression Testing

### Existing Features Should Still Work
- [ ] User can still browse services
- [ ] User can search services
- [ ] User can view service details
- [ ] User can login/logout
- [ ] User can view profile
- [ ] Theme toggle works
- [ ] Notifications work
- [ ] Emergency button works

---

## 15. Edge Cases & Error Handling

### Network Errors
- [ ] Offline mode shows appropriate message
- [ ] Network timeout shows error
- [ ] Retry functionality works

### Validation Errors
- [ ] Empty form fields show validation
- [ ] Invalid email shows error
- [ ] Password too short shows error
- [ ] Required fields enforced

### User Errors
- [ ] Duplicate email in signup shows error
- [ ] Wrong password shows error
- [ ] Booking already cancelled shows error
- [ ] Invalid address shows error

### Server Errors
- [ ] 500 errors show friendly message
- [ ] 404 errors show correct page
- [ ] 403 errors show access denied
- [ ] Token expiry shows reauth prompt

---

## 16. Test Results Summary

### Critical Issues (Must Fix)
- [ ] Issue: _________________
- [ ] Issue: _________________
- [ ] Issue: _________________

### Major Issues (Should Fix)
- [ ] Issue: _________________
- [ ] Issue: _________________

### Minor Issues (Nice to Fix)
- [ ] Issue: _________________
- [ ] Issue: _________________

### All Tests Passing
- [ ] Date: __________
- [ ] Tester: __________
- [ ] Sign-off: __________

---

## 17. Sign-Off

- **Tested By:** ________________________
- **Date:** ________________________
- **Status:** ☐ Pass ☐ Fail ☐ Conditional Pass
- **Notes:** _______________________________

---

## 18. Next Steps

1. Address critical issues before production
2. Deploy to staging environment
3. Perform final regression testing
4. Deploy to production
5. Monitor for errors post-deployment
6. Collect user feedback

---

**Testing Checklist Version:** 1.0
**Last Updated:** February 2024
