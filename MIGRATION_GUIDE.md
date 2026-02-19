# HandyFix Migration Guide: User-Only Marketplace

## Overview
This document outlines the comprehensive changes made to transform HandyFix from a dual-role marketplace (users + service providers) to a user-only service booking platform with Indian Rupee pricing.

## Key Changes

### 1. Currency Conversion (₹90 per USD)
All prices in the application have been converted from USD to Indian Rupees using the rate:
- **1 USD = ₹90**

#### Price Conversions:
- Emergency Plumbing Repair: $75 → ₹6,750
- Electrical Panel Upgrade: $150 → ₹13,500
- Custom Furniture Building: $200 → ₹18,000
- Interior Painting: $120 → ₹10,800
- Deep Home Cleaning: $85 → ₹7,650
- AC Installation & Repair: $95 → ₹8,550
- Water Heater Installation: $180 → ₹16,200
- Smart Home Wiring: $250 → ₹22,500

**Files Updated:**
- `src/pages/Services.tsx` - Price values and display formatting
- Service database records need manual update with new INR values

### 2. Removed Features

#### Removed Pages:
- `/provider` - Provider dashboard
- `/provider-setup` - Provider onboarding
- `/provider/job/:jobId` - Provider job details
- `/providers` - Find providers directory
- `/admin` & `/admin/dashboard` - Admin panel
- All admin-related routes

#### Removed Components:
- Provider navigation links in Header
- Admin navigation links in Header
- "Join as Provider" CTA on homepage
- Featured providers section on homepage
- Provider-related modals and dialogs

#### Removed Files:
- `src/pages/Provider.tsx`
- `src/pages/ProviderSetup.tsx`
- `src/pages/ProviderJobDetail.tsx`
- `src/pages/FindProviders.tsx`
- `src/pages/Admin.tsx`
- Backend provider routes and controllers
- Backend admin routes and controllers

### 3. Authentication Changes

#### Removed Roles:
- `service_provider` - No longer used
- `admin` - No longer used

#### Current Roles:
- `user` - Only valid role for regular users

#### Updated AuthContext:
- Removed `isProvider` state and methods
- Simplified `signup()` method to only accept user role
- Simplified `login()` method
- Updated context value exports

**Files Modified:**
- `src/contexts/AuthContext.tsx`
- `server/controllers/authController.js`

### 4. Database Schema Updates

#### User Model (`server/models/User.js`)
**New Fields Added:**
- `bio` - User biography
- `addresses[]` - Multiple delivery addresses
  - `label` - Address nickname (Home, Office, etc.)
  - `street` - Street address
  - `city` - City
  - `state` - State
  - `zipCode` - ZIP/Postal code
  - `isDefault` - Default address flag
- `paymentMethods[]` - Saved payment methods
  - `id` - Payment method ID
  - `type` - Type (card, upi, wallet)
  - `label` - Payment method label
  - `lastFour` - Last 4 digits
  - `isDefault` - Default payment flag
- `notificationPreferences` - Notification settings
  - `emailNotifications` - Email opt-in
  - `smsNotifications` - SMS opt-in
  - `pushNotifications` - Push notifications opt-in
  - `bookingUpdates` - Booking updates opt-in
  - `promotions` - Promotional emails opt-in
- `privacySettings` - Privacy controls
  - `profileVisibility` - Profile visibility level (private/friends/public)
  - `shareData` - Third-party data sharing opt-in
  - `allowAnalytics` - Analytics opt-in
- `totalBookings` - Total booking count
- `totalSpent` - Total spending amount

**Removed Fields:**
- Provider-specific fields

#### Booking Model (renamed from Job)
**Key Changes:**
- Model renamed from `Job` to `Booking` for clarity
- Simplified structure focused on user bookings
- Removed provider relationship references

**Fields:**
- `userId` - Reference to user making booking
- `serviceId` - Service identifier
- `serviceName` - Service name
- `serviceType` - Service category
- `description` - Booking notes
- `addressId` - Address for service
- `bookingDate` - Date of booking
- `bookingTime` - Time of booking
- `location` - Location string
- `price` - Service price in INR
- `status` - Booking status (pending/confirmed/in_progress/completed/cancelled)
- `paymentStatus` - Payment status (unpaid/paid/refunded)
- `paymentMethod` - Payment method used
- `transactionId` - Payment transaction ID
- `notes` - Additional notes
- `rating` - User rating (1-5)
- `review` - User review text
- `images[]` - Booking-related images

### 5. New User Features

#### New Pages Added:
- `src/pages/MyBookings.tsx` - View and manage bookings
- `src/pages/SavedServices.tsx` - Wishlist/favorites
- `src/pages/PaymentHistory.tsx` - Transaction history
- `src/pages/ProfileSettings.tsx` - Enhanced profile management

#### New Routes:
- `/my-bookings` - My bookings page
- `/saved-services` - Saved services page
- `/payments` - Payment history page
- `/settings` - Profile settings page

#### Profile Settings Sections:
1. **Personal Info** - Name, email, phone, avatar, bio
2. **Addresses** - Multiple address management
3. **Notifications** - Email, SMS, push notification preferences
4. **Privacy** - Profile visibility and data sharing
5. **Security** - Password management, 2FA setup
6. **Help & Support** - FAQs and support contact

### 6. Navigation Updates

#### Header Navigation Changes:
- User (after login):
  - Dashboard
  - Services
  - Settings (new)
- Removed:
  - "Find Providers" link
  - Provider dashboard link
  - Admin dashboard link

#### Profile Dropdown Updates:
- Added Settings link for users
- Removed provider and admin options
- Streamlined menu for user-only experience

### 7. Frontend Component Updates

#### Modified Files:
- `src/App.tsx` - Updated routing, removed provider and admin routes
- `src/components/layout/Header.tsx` - Removed provider/admin nav
- `src/pages/Index.tsx` - Removed "Join as Provider" CTA, updated featured section
- `src/services/Services.tsx` - INR pricing, updated filters

### 8. Backend API Updates Required

#### Routes to Remove:
- `/api/providers/*` - All provider endpoints
- `/api/admin/*` - All admin endpoints
- `/api/provider-setup` - Provider setup endpoints

#### Routes to Update:
- `/api/auth/signup` - Remove role parameter, force user role
- `/api/auth/login` - Simplify for user-only
- `/api/bookings/*` - Update to use Booking model instead of Job

#### Routes to Create:
- `PUT /api/profile/settings` - Update user settings
- `POST /api/profile/addresses` - Add address
- `PUT /api/profile/addresses/:id` - Update address
- `DELETE /api/profile/addresses/:id` - Delete address
- `PUT /api/profile/notification-preferences` - Update notifications
- `PUT /api/profile/privacy-settings` - Update privacy

### 9. Data Migration Steps

#### For Existing Deployments:

1. **Backup MongoDB Collections:**
   ```bash
   mongodump --uri="mongodb://your-connection-string"
   ```

2. **Update User Collection:**
   ```javascript
   // Add new fields to existing users
   db.users.updateMany(
     {},
     {
       $set: {
         bio: "",
         addresses: [],
         paymentMethods: [],
         notificationPreferences: {
           emailNotifications: true,
           smsNotifications: false,
           pushNotifications: true,
           bookingUpdates: true,
           promotions: false
         },
         privacySettings: {
           profileVisibility: "private",
           shareData: false,
           allowAnalytics: true
         },
         totalBookings: 0,
         totalSpent: 0
       }
     }
   );
   
   // Remove service_provider and admin users (or convert to user role)
   db.users.updateMany(
     { role: { $in: ["service_provider", "admin"] } },
     { $set: { role: "user" } }
   );
   ```

3. **Rename Job Collection to Booking:**
   ```javascript
   db.jobs.renameCollection("bookings");
   ```

4. **Update Booking Fields:**
   ```javascript
   db.bookings.updateMany(
     {},
     [
       {
         $set: {
           userId: "$customerId",
           paymentStatus: "unpaid",
           bookingDate: new Date(),
           bookingTime: "10:00 AM"
         }
       },
       { $unset: ["providerId", "images"] }
     ]
   );
   ```

5. **Convert Prices to INR (if needed):**
   ```javascript
   db.bookings.updateMany(
     {},
     [
       {
         $set: {
           price: { $multiply: ["$price", 90] }
         }
       }
     ]
   );
   ```

### 10. Testing Checklist

#### Frontend Testing:
- [ ] User registration and login work correctly
- [ ] User cannot sign up as provider
- [ ] Services page displays INR prices
- [ ] Price filters work with INR ranges
- [ ] Settings page loads all sections
- [ ] Address management works
- [ ] Notification preferences save
- [ ] Privacy settings save
- [ ] My Bookings page displays bookings
- [ ] Saved Services page works
- [ ] Payment History page displays transactions
- [ ] Header navigation shows only user options
- [ ] No provider/admin references in UI

#### Backend Testing:
- [ ] POST /api/auth/signup forces user role
- [ ] GET /api/profile/me returns updated user schema
- [ ] PUT /api/profile/settings updates all fields
- [ ] Booking creation uses INR prices
- [ ] Payment endpoints work with INR
- [ ] All provider endpoints return 404
- [ ] All admin endpoints return 404

#### Database Testing:
- [ ] User collection has all new fields
- [ ] No service_provider or admin users exist
- [ ] Booking collection exists (migrated from Job)
- [ ] All bookings have new required fields
- [ ] Prices are in INR format

### 11. Rollback Plan

If issues occur, follow these steps:

1. **Restore from backup:**
   ```bash
   mongorestore --uri="mongodb://your-connection-string" ./dump
   ```

2. **Revert code changes:**
   ```bash
   git revert <commit-hash>
   ```

3. **Re-deploy previous version:**
   ```bash
   npm run build
   npm start
   ```

### 12. Environment Variables

Ensure these are set:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=service_marketplace
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
MONGODB_URI=mongodb://localhost:27017/handyfix
```

### 13. Performance Considerations

1. **Index the new fields:**
   ```javascript
   db.users.createIndex({ "addresses.isDefault": 1 });
   db.bookings.createIndex({ userId: 1, createdAt: -1 });
   db.bookings.createIndex({ userId: 1, status: 1 });
   ```

2. **Monitor query performance** after migration

3. **Archive old provider and booking data** if needed

### 14. Support & Documentation

- Update user documentation to reflect user-only features
- Create user guides for new profile settings
- Document new API endpoints
- Update development setup guide

### 15. Timeline

**Recommended Migration Timeline:**
1. **Week 1:** Code changes and testing
2. **Week 2:** Database migration and verification
3. **Week 3:** Staging environment testing
4. **Week 4:** Production deployment

### 16. Contact & Questions

For migration support, contact the development team.

---

**Last Updated:** February 2024
**Version:** 1.0
