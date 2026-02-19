# HandyFix Backend Setup & Debugging Guide

## Error: "Unexpected end of JSON input"

This error occurs when the frontend cannot communicate with the backend API properly.

---

## Common Causes & Solutions

### 1. Backend Server Not Running

**Problem:** The Node.js Express backend server is not started.

**Solution:**
```bash
# Navigate to project root
cd /path/to/handyfix

# Start the backend server
npm run start-server

# Or if using Vite in another terminal:
npm run dev
```

**Expected Output:**
```
Server running on http://localhost:3000
```

---

### 2. Backend Environment Variables Missing

**Problem:** Database connection strings or JWT secret not configured.

**Solution:** Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=service_marketplace
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
MONGODB_URI=mongodb://localhost:27017/handyfix
NODE_ENV=development
```

**Then restart the backend server:**
```bash
npm run start-server
```

---

### 3. MongoDB Not Running

**Problem:** MongoDB database is not running locally.

**Solution:**

**On Windows:**
```bash
# If MongoDB is installed
mongod

# Or if installed as a service, check Services panel
```

**On Mac (with Homebrew):**
```bash
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl start mongod
```

**Verify MongoDB is running:**
```bash
mongo --eval "db.adminCommand('ping')"
```

---

### 4. MySQL Not Running

**Problem:** MySQL database is not running for SQL operations.

**Solution:**

**On Windows:**
```bash
# Start MySQL service
net start MySQL80
# or
mysqld
```

**On Mac (with Homebrew):**
```bash
brew services start mysql
```

**On Linux:**
```bash
sudo systemctl start mysql
```

**Verify MySQL is running:**
```bash
mysql -u root -p -e "SELECT 1"
```

---

### 5. CORS Issues

**Problem:** Frontend and backend on different ports/origins.

**Solution:** Check `server/server.js` has CORS enabled:

```javascript
const cors = require('cors');
app.use(cors());
```

And verify the proxy in `vite.config.ts`:

```typescript
proxy: {
  "/api": {
    target: "http://localhost:3000",
    changeOrigin: true,
  },
}
```

---

### 6. Port Already in Use

**Problem:** Port 3000 (backend) or 5173/8080 (frontend) is already in use.

**Solution:**

**Find and kill process on port 3000:**
```bash
# On Linux/Mac
lsof -i :3000
kill -9 <PID>

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Or change the backend port in `.env`:**
```env
PORT=3001
```

And update the proxy in `vite.config.ts`:
```typescript
proxy: {
  "/api": {
    target: "http://localhost:3001",
    changeOrigin: true,
  },
}
```

---

## Complete Backend Setup Checklist

### Step 1: Install Dependencies
```bash
# Install backend dependencies
npm install

# If additional backend packages needed:
npm install express cors body-parser dotenv mongoose mysql2 bcrypt jsonwebtoken
```

### Step 2: Setup Databases

**MongoDB:**
```bash
# Start MongoDB
mongod

# In another terminal, verify connection:
mongo
> use handyfix
> db.users.find()
```

**MySQL:**
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS service_marketplace;"

# Verify
mysql -u root -p -e "SHOW DATABASES;"
```

### Step 3: Configure Environment Variables

Create `.env` file:
```env
# Frontend port (if different from 5173)
VITE_API_URL=http://localhost:3000

# Backend
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/handyfix

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=service_marketplace

# JWT
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=24h
```

### Step 4: Start Both Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
# Opens on http://localhost:5173 or http://localhost:8080
```

**Terminal 2 - Backend:**
```bash
npm run start-server
# Runs on http://localhost:3000
```

### Step 5: Test Connection

**In browser console, test API:**
```javascript
// Test if backend is accessible
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'test' })
})
.then(r => r.json())
.then(d => console.log('Backend OK:', d))
.catch(e => console.error('Backend Error:', e))
```

---

## Common API Issues & Solutions

### Issue: 404 on /api/auth/signup

**Cause:** Backend route not registered

**Fix:** Check `server/server.js`:
```javascript
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
```

Check `server/routes/authRoutes.js`:
```javascript
router.post('/signup', authController.signup);
router.post('/login', authController.login);
```

Check `server/controllers/authController.js` has `exports.signup` and `exports.login`

### Issue: 500 Error on /api/auth/signup

**Cause:** Database connection error or validation error

**Solution:**
1. Check backend console for error message
2. Verify MongoDB/MySQL is running
3. Check environment variables
4. Check database credentials in `.env`

### Issue: CORS Error

**Cause:** Frontend and backend CORS mismatch

**Fix:** In `server/server.js`, update CORS:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));
```

---

## Debugging Tips

### 1. Check Backend Logs
```bash
# Add debugging to console
# In server/server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### 2. Monitor Network Requests
1. Open Browser DevTools (F12)
2. Go to Network tab
3. Try to login/signup
4. Click on the request and check:
   - Status code (should be 200)
   - Response (should be valid JSON)
   - Headers (should have Content-Type: application/json)

### 3. Check Backend Endpoints
```bash
# Test API with curl
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'
```

### 4. Enable Detailed Logging
```javascript
// In server/server.js
const morgan = require('morgan');
app.use(morgan('dev')); // Logs all requests
```

---

## Quick Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| Unexpected end of JSON input | Backend not responding | Start `npm run start-server` |
| Cannot GET /api/auth/signup | Route not found | Check authRoutes.js is registered |
| CORS error | Frontend/Backend origin mismatch | Enable CORS in server.js |
| 500 Server Error | Database error | Check MongoDB/MySQL running and credentials |
| Port already in use | Another process using port | Kill process or change PORT in .env |
| Connection refused | Backend not running | Start backend server |
| Invalid credentials | Wrong email/password | Check credentials are correct |

---

## Running Both Servers

### Method 1: Two Terminal Windows

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
npm run start-server
```

### Method 2: Using npm-run-all (Optional)

```bash
npm install -D npm-run-all

# Add to package.json scripts:
"dev:all": "npm-run-all --parallel dev start-server"

# Run with:
npm run dev:all
```

---

## Production Deployment

When deploying to production:

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure proper database URLs
4. Enable HTTPS
5. Set proper CORS origins
6. Use environment-specific configs

---

## Getting Help

If you encounter issues:

1. **Check backend console** - Backend logs show errors
2. **Check browser console** - Frontend logs show errors
3. **Check network tab** - See actual API responses
4. **Check .env file** - Verify all variables are set
5. **Verify databases** - MongoDB and MySQL are running

---

**Last Updated:** February 2024
