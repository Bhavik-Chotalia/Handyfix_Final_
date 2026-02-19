# HandyFix - Complete Testing Guide

## 📋 Current Status

✅ **Frontend**: Running on http://localhost:8080 (Auth page visible)  
✅ **Backend Server**: Running on http://localhost:3000  
⏳ **MongoDB**: Waiting for connection - needs to be configured

---

## 🚀 CRITICAL SETUP STEPS (Must Do First)

### Step 1: Set Up MongoDB

You have TWO options:

#### **Option A: MongoDB Atlas (Cloud - Recommended for Testing)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/handyfix`
4. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/handyfix
   ```
5. Restart backend: Kill the process and run `npm run start-server` again

#### **Option B: Local MongoDB**
```bash
# Install MongoDB if not installed:
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install mongodb
# Windows: Download from mongodb.com

# Start MongoDB:
mongod
```

### Step 2: Verify Backend Connected to Database
```bash
curl http://localhost:3000/api/health
# Should return: {"status":"Server is running"}
```

### Step 3: Seed Sample Data
```bash
npm run seed-db
# Creates 5 services and 8+ vendors
```

---

## 🧪 COMPREHENSIVE TEST CASES

Once MongoDB is running and data is seeded, follow these test cases:

### **Test Case 1: Signup Flow**
**Objective**: Create new user and verify data is stored in MongoDB

**Steps**:
1. Go to http://localhost:8080/auth
2. Click "Sign Up" tab
3. Fill form:
   - Name: `Test User 1`
   - Email: `testuser1@example.com`
   - Phone: `555-1001`
   - Password: `TestPassword123!`
4. Click "Sign Up" button

**Expected Result**:
- ✅ Form submits without error
- ✅ JWT token is generated and stored in localStorage
- ✅ Redirected to home page
- ✅ Welcome message shows "Test User 1"
- ✅ User data saved in MongoDB

**How to verify in MongoDB**:
```javascript
db.users.findOne({email: "testuser1@example.com"})
// Should return user object with hashed password
```

---

### **Test Case 2: Login Flow**
**Objective**: Verify existing user can login with correct credentials

**Steps**:
1. On home page, click "Logout"
2. You're on login page
3. Enter credentials:
   - Email: `testuser1@example.com`
   - Password: `TestPassword123!`
4. Click "Login"

**Expected Result**:
- ✅ Login succeeds
- ✅ Redirected to home page
- ✅ Shows "Welcome, Test User 1"
- ✅ JWT token stored in localStorage

**Negative Test** (Wrong password):
- Enter correct email but wrong password
- ✅ Should show error: "Invalid credentials"

---

### **Test Case 3: View Services on Home Page**
**Objective**: Verify all services are displayed

**Steps**:
1. After login, you're on home page
2. Look for "Our Services" section

**Expected Result**:
- ✅ Shows 5 service cards:
  - 🔧 Plumbing
  - ⚡ Electrical
  - 🪵 Carpentry
  - 🧹 Cleaning
  - 🎨 Painting
- ✅ Each card has name, description, and "View Vendors" button
- ✅ All cards are clickable

---

### **Test Case 4: Filter Vendors by Service**
**Objective**: Verify vendors for selected service are displayed

**Steps**:
1. Click "View Vendors" on "Plumbing" service
2. Look at vendors list

**Expected Result**:
- ✅ Page shows "Plumbing" as title
- ✅ Shows 2 plumbing vendors:
  - John Plumber (Rating: 4.8, Price: $75/hr)
  - Mike's Plumbing (Rating: 4.6, Price: $65/hr)
- ✅ Shows vendor address, availability status
- ✅ Each vendor has "View Details" button

**Test with other services**:
- Click "Back to Services"
- Try "Electrical" (should show 2 vendors)
- Try "Cleaning" (should show 2 vendors)

---

### **Test Case 5: View Vendor Details**
**Objective**: Verify detailed vendor information is displayed

**Steps**:
1. From vendor list, click "View Details" on any vendor
2. Scroll down to see all details

**Expected Result**:
- ✅ Shows vendor photo/avatar area
- ✅ Shows vendor name and service name
- ✅ Shows "About" description
- ✅ Shows "Details" section:
  - Email address
  - Phone number
  - Full address with city and zip
- ✅ Right sidebar shows:
  - Rating (⭐ with number)
  - Price per hour ($)
  - Availability status
- ✅ "Book Now" button is enabled (if available) or disabled (if busy)

---

### **Test Case 6: Book a Vendor (Date & Time Selection)**
**Objective**: Create booking with price calculation

**Steps**:
1. On vendor details page, click "Book Now"
2. Fill booking form:
   - Service: (auto-filled)
   - Booking Date: Select a future date (e.g., tomorrow)
   - Start Time: 09:00
   - End Time: 11:00
   - Notes: "Please bring own tools"
3. Click "Confirm Booking"

**Expected Result**:
- ✅ Form validates all required fields
- ✅ Price calculation shows:
  - Price per Hour: (vendor's rate)
  - Total Price: (hourly rate × hours) = (rate × 2) for 2-hour booking
  - Example: $75/hr × 2 hours = $150
- ✅ Success message: "Booking created successfully!"
- ✅ Redirected to "My Bookings" page
- ✅ Booking is stored in MongoDB

**Verify price calculation**:
- Try different time ranges:
  - 09:00 to 10:00 = 1 hour = $75
  - 09:00 to 12:00 = 3 hours = $225
  - 08:00 to 17:00 = 9 hours = $675

---

### **Test Case 7: View My Bookings**
**Objective**: Verify all user bookings are displayed correctly

**Steps**:
1. You're redirected to "My Bookings" after booking
2. (Or) Click "My Bookings" button on home page

**Expected Result**:
- ✅ Shows booking card with:
  - Vendor name
  - Service name
  - Date (formatted: "Month Day, Year")
  - Time range (e.g., "09:00 - 11:00")
  - Vendor contact phone
  - Status badge: "Pending" (yellow)
  - Total Price: $150 (or calculated amount)
- ✅ Shows buttons:
  - "View Vendor" - links to vendor details
  - "Cancel" - allows cancellation
- ✅ All past bookings are visible

---

### **Test Case 8: Cancel Booking**
**Objective**: Verify booking can be cancelled and status updates

**Steps**:
1. On "My Bookings" page
2. Click "Cancel" button on any pending booking
3. Confirm cancellation in popup

**Expected Result**:
- ✅ Shows confirmation dialog: "Are you sure you want to cancel this booking?"
- ✅ After confirmation, booking status changes to "Cancelled"
- ✅ Status badge turns red
- ✅ "Cancel" button disappears
- ✅ Booking is still visible but marked as cancelled
- ✅ Database is updated

---

### **Test Case 9: Multiple Bookings**
**Objective**: Verify user can make multiple bookings

**Steps**:
1. From home page, click "Browse Services"
2. Click "View Vendors" on different service
3. Make second booking with different vendor
4. Go to "My Bookings"

**Expected Result**:
- ✅ Shows multiple booking cards
- ✅ Each booking shows correct vendor and service
- ✅ Each has correct dates, times, and prices
- ✅ All bookings are independent

---

### **Test Case 10: Session Persistence**
**Objective**: Verify user stays logged in after page refresh

**Steps**:
1. On home page after login
2. Refresh the page (F5 or Cmd+R)
3. Wait for page to load

**Expected Result**:
- ✅ Page reloads without returning to login
- ✅ User remains authenticated
- ✅ Welcome message still shows user name
- ✅ Can still access all pages

---

### **Test Case 11: New User Signup**
**Objective**: Test multiple user signups

**Steps**:
1. Logout current user
2. Sign up as new user:
   - Name: `Test User 2`
   - Email: `testuser2@example.com`
   - Phone: `555-1002`
   - Password: `DifferentPassword123!`

**Expected Result**:
- ✅ New user is created separately
- ✅ New user has empty bookings list
- ✅ Previous user's bookings are not visible to new user

---

### **Test Case 12: Error Handling**
**Objective**: Verify proper error messages

**Test Signup with duplicate email**:
- Try to signup with existing email
- ✅ Should show: "User already exists"

**Test Login with wrong password**:
- Try to login with correct email but wrong password
- ✅ Should show: "Invalid credentials"

**Test missing required fields**:
- Try to submit form without filling all fields
- ✅ Should show validation errors

**Test booking without selecting date**:
- Try to confirm booking without selecting date
- ✅ Should show: "Please select a booking date"

---

## 📊 TEST EXECUTION CHECKLIST

Use this checklist to track all tests:

```
[ ] Test 1: Signup Flow - Create new user
[ ] Test 2: Login Flow - Existing user login
[ ] Test 3: View Services - See all 5 services
[ ] Test 4: Filter Vendors - Select by service
[ ] Test 5: Vendor Details - View full profile
[ ] Test 6: Create Booking - Date, time, price calculation
[ ] Test 7: View Bookings - See all user bookings
[ ] Test 8: Cancel Booking - Update status
[ ] Test 9: Multiple Bookings - Create and manage multiple
[ ] Test 10: Session Persistence - Refresh page
[ ] Test 11: New User - Different user signup
[ ] Test 12: Error Handling - Invalid inputs
```

---

## 🔍 API ENDPOINT TESTS

If you want to test APIs directly:

### **Test Signup**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-0000",
    "password": "password123"
  }'
```

**Expected Response**:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### **Test Get Services**
```bash
curl http://localhost:3000/api/services
```

**Expected**: Array of 5 services

### **Test Get Vendors by Service**
```bash
curl http://localhost:3000/api/vendors/by-service/{serviceId}
```

**Expected**: Array of vendors for that service

### **Test Create Booking** (Requires token)
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "vendorId": "507f1f77bcf86cd799439011",
    "serviceId": "507f1f77bcf86cd799439012",
    "bookingDate": "2025-03-15",
    "startTime": "09:00",
    "endTime": "11:00"
  }'
```

---

## ✅ SUCCESS CRITERIA

All tests pass when:
- ✅ User can signup and data is saved
- ✅ User can login with correct credentials
- ✅ All 5 services are displayed
- ✅ Vendors filter by service correctly
- ✅ Vendor details show all information
- ✅ Booking creates with correct price calculation
- ✅ My Bookings shows all user bookings
- ✅ Bookings can be cancelled
- ✅ Session persists on page refresh
- ✅ Error messages are clear
- ✅ Multiple users can use system independently

---

## 🐛 TROUBLESHOOTING

**Backend not responding**:
- Check MongoDB is running
- Restart backend: `npm run start-server`

**Database not seeded**:
- Run: `npm run seed-db`
- Check MongoDB connection

**Login failing**:
- Verify email is correct
- Check that user was created during signup

**Price calculation wrong**:
- Check vendor hourly rate
- Verify time calculation formula: (endTime - startTime) × pricePerHour

---

**Ready to test? Follow the Critical Setup Steps above first!**
