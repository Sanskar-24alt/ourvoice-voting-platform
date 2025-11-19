# Quick Start Guide

## Installation & Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## What's New

### ✨ Animations
- Smooth scroll-triggered fade-in animations
- Floating icons on feature cards
- Animated statistics counter
- Hover effects on all interactive elements
- Smooth page transitions

### 🖼️ Images
- Hero section with voting-themed background
- Feature cards with relevant images
- Step-by-step guide with visual aids
- All images are responsive and optimized

### 🎨 Enhanced Design
- Modern card designs with shadows
- Improved color gradients
- Better spacing and typography
- Enhanced mobile responsiveness

### 🔧 Backend Features
- Voter registration API
- Status checking endpoint
- Polling place lookup
- Statistics API
- Data persistence (JSON file)

### 📝 Registration Form
- Click "Register Now" button in the Register section
- Fill out the modal form
- Submit to register as a voter
- Get instant feedback with Voter ID

## Testing the API

### Register a Voter
```bash
curl -X POST http://localhost:3000/api/voter/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "dateOfBirth": "1990-01-01",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }'
```

### Check Voter Status
```bash
curl -X POST http://localhost:3000/api/voter/status \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

### Get Statistics
```bash
curl http://localhost:3000/api/stats
```

## File Structure

```
├── new.html          # Main website (frontend)
├── server.js         # Backend API server
├── package.json      # Dependencies
├── data.json         # Data storage (auto-created)
├── README.md         # Full documentation
└── QUICKSTART.md     # This file
```

## Next Steps

1. Customize colors in the Tailwind config
2. Replace images with your own
3. Add a real database (MongoDB, PostgreSQL, etc.)
4. Add authentication for admin endpoints
5. Deploy to a hosting service

Enjoy your enhanced voting platform! 🗳️

