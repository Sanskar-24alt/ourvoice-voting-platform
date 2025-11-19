# OurVoice - Voting Platform

A modern, responsive voting platform website with animations, images, and a complete backend API.

## Features

- 🎨 **Modern UI/UX**: Beautiful, responsive design with smooth animations
- 🖼️ **Rich Images**: High-quality images from Unsplash for visual appeal
- ✨ **Animations**: Scroll-triggered animations, fade-ins, and hover effects
- 🔄 **Interactive Stats**: Animated statistics that count up on scroll
- 🎯 **Backend API**: Complete Express.js backend with voter registration and status checking
- 👤 **Admin Dashboard**: Admin login with voter approval/rejection functionality
- 📝 **Voter Registration**: Complete registration form with validation
- 🎉 **Success Notifications**: Congratulations popup after successful registration
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 🌙 **Dark Mode**: Built-in dark mode support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### Get Statistics
```
GET /api/stats
```
Returns voting statistics including turnout, youth involvement, and total ballots.

### Check Voter Status
```
POST /api/voter/status
Body: { voterId, email, or ssn }
```
Checks the registration status of a voter.

### Register Voter
```
POST /api/voter/register
Body: {
  firstName, lastName, email, phone, dateOfBirth,
  address, city, state, zipCode, ssn
}
```
Registers a new voter.

### Get Polling Place
```
POST /api/polling-place
Body: { address, city, state, zipCode }
```
Returns the polling place for a given address.

### Admin Login
```
POST /api/admin/login
Body: { username, password }
```
Login as admin to access admin dashboard.

### Get All Voters (Admin)
```
GET /api/admin/voters
Headers: { Authorization: Bearer <token> }
```
Returns all registered voters (admin only).

### Approve Voter (Admin)
```
POST /api/admin/voter/:voterId/approve
Headers: { Authorization: Bearer <token> }
```
Approves a voter registration (admin only).

### Reject Voter (Admin)
```
POST /api/admin/voter/:voterId/reject
Headers: { Authorization: Bearer <token> }
```
Rejects a voter registration (admin only).

### Health Check
```
GET /api/health
```
Returns server status.

## Project Structure

```
├── new.html          # Main HTML file with all frontend code
├── server.js         # Express.js backend server
├── package.json      # Node.js dependencies
├── data.json         # Data storage (created automatically)
└── README.md         # This file
```

## Technologies Used

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Images**: Unsplash API
- **Animations**: CSS3 Keyframes, Intersection Observer API

## Features in Detail

### Animations
- Fade-in animations on scroll
- Floating icons
- Smooth transitions
- Animated statistics counter
- Hover effects on cards

### Images
- Hero section background image
- Feature cards with relevant images
- Step-by-step guide images
- All images optimized and responsive

### Backend
- RESTful API design
- In-memory data storage (can be upgraded to database)
- Input validation
- Error handling
- CORS enabled

## Customization

### Colors
Edit the Tailwind config in `new.html` to change the color scheme:
- Primary: `#1152d4`
- Navy: `#0A2463`
- Red Accent: `#D83121`

### Images
Replace Unsplash URLs with your own images or use different Unsplash images.

### Backend
The backend uses in-memory storage. To use a database:
1. Install a database driver (e.g., `mongoose` for MongoDB, `pg` for PostgreSQL)
2. Update `server.js` to use the database instead of the in-memory array

## License

MIT License - feel free to use this project for your own purposes.

## Admin Features

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the admin password in `server.js` before deploying to production!

### Admin Dashboard
- View all registered voters
- Approve or reject voter registrations
- See voter status (pending/active/rejected)
- Refresh voter list in real-time

## GitHub Setup

This project is ready to be pushed to GitHub. Follow these steps:

1. **Create a new repository on GitHub** (don't initialize with README)

2. **Add the remote repository**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

3. **Push to GitHub**:
```bash
git branch -M main
git push -u origin main
```

Or if you prefer to use SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

