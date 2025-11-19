const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Simple session storage (use proper session management in production)
const sessions = new Map();

// Admin credentials (in production, use environment variables and hashed passwords)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123' // Change this in production!
};

// In-memory database (replace with real database in production)
let voters = [];
let stats = {
    turnout2020: 66.8,
    youthInvolvement: 50,
    totalBallots: 159,
    registeredVoters: 0,
    activeVoters: 0
};

// Data file path
const DATA_FILE = path.join(__dirname, 'data.json');

// Load data from file
async function loadData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const parsed = JSON.parse(data);
        voters = parsed.voters || [];
        stats = { ...stats, ...parsed.stats };
    } catch (error) {
        // File doesn't exist, use defaults
        console.log('No existing data file, starting fresh');
    }
}

// Save data to file
async function saveData() {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify({ voters, stats }, null, 2));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Initialize data on startup
loadData();

// API Routes

// Get voting statistics
app.get('/api/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            turnout2020: stats.turnout2020,
            youthInvolvement: stats.youthInvolvement,
            totalBallots: stats.totalBallots,
            registeredVoters: voters.length,
            activeVoters: voters.filter(v => v.status === 'active').length
        }
    });
});

// Check voter status
app.post('/api/voter/status', async (req, res) => {
    try {
        const { voterId, email, ssn } = req.body;
        
        if (!voterId && !email && !ssn) {
            return res.status(400).json({
                success: false,
                message: 'Please provide voter ID, email, or SSN'
            });
        }
        
        const voter = voters.find(v => 
            v.voterId === voterId || 
            v.email === email || 
            v.ssn === ssn
        );
        
        if (!voter) {
            return res.status(404).json({
                success: false,
                message: 'Voter not found'
            });
        }
        
        res.json({
            success: true,
            data: {
                voterId: voter.voterId,
                status: voter.status,
                registeredDate: voter.registeredDate,
                pollingPlace: voter.pollingPlace
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Register a new voter
app.post('/api/voter/register', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            dateOfBirth,
            address,
            city,
            state,
            zipCode,
            ssn
        } = req.body;
        
        // Validation
        if (!firstName || !lastName || !email || !dateOfBirth || !address || !city || !state || !zipCode) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }
        
        // Check if already registered
        const existingVoter = voters.find(v => 
            v.email === email || 
            (v.ssn && v.ssn === ssn)
        );
        
        if (existingVoter) {
            return res.status(409).json({
                success: false,
                message: 'Voter already registered'
            });
        }
        
        // Generate voter ID
        const voterId = `V${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        
        // Create voter object
        const newVoter = {
            voterId,
            firstName,
            lastName,
            email,
            phone: phone || null,
            dateOfBirth,
            address,
            city,
            state,
            zipCode,
            ssn: ssn ? ssn.replace(/-/g, '').substr(-4) : null, // Store only last 4 digits
            status: 'pending',
            registeredDate: new Date().toISOString(),
            pollingPlace: null // Would be assigned based on address
        };
        
        voters.push(newVoter);
        stats.registeredVoters = voters.length;
        
        await saveData();
        
        res.status(201).json({
            success: true,
            message: 'Registration submitted successfully',
            data: {
                voterId: newVoter.voterId,
                status: newVoter.status
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Get polling place by address
app.post('/api/polling-place', (req, res) => {
    try {
        const { address, city, state, zipCode } = req.body;
        
        if (!address || !city || !state || !zipCode) {
            return res.status(400).json({
                success: false,
                message: 'Missing address information'
            });
        }
        
        // Mock polling place lookup (in production, this would query a real database)
        const pollingPlaces = [
            {
                name: 'Community Center',
                address: '123 Main St',
                city: city,
                state: state,
                zipCode: zipCode,
                hours: '7:00 AM - 8:00 PM'
            },
            {
                name: 'City Hall',
                address: '456 Oak Ave',
                city: city,
                state: state,
                zipCode: zipCode,
                hours: '7:00 AM - 8:00 PM'
            },
            {
                name: 'Public Library',
                address: '789 Elm St',
                city: city,
                state: state,
                zipCode: zipCode,
                hours: '7:00 AM - 8:00 PM'
            }
        ];
        
        // Simple hash-based assignment
        const hash = (address + city + zipCode).split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        const pollingPlace = pollingPlaces[Math.abs(hash) % pollingPlaces.length];
        
        res.json({
            success: true,
            data: pollingPlace
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Generate session token
            const sessionToken = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sessions.set(sessionToken, {
                username: username,
                loginTime: new Date().toISOString()
            });
            
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token: sessionToken
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token && sessions.has(token)) {
            sessions.delete(token);
        }
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Middleware to check admin authentication
function requireAdmin(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !sessions.has(token)) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized. Please login as admin.'
        });
    }
    
    next();
}

// Get all voters (admin endpoint - protected)
app.get('/api/admin/voters', requireAdmin, (req, res) => {
    try {
        res.json({
            success: true,
            data: voters.map(v => ({
                voterId: v.voterId,
                firstName: v.firstName,
                lastName: v.lastName,
                email: v.email,
                phone: v.phone,
                dateOfBirth: v.dateOfBirth,
                address: v.address,
                city: v.city,
                state: v.state,
                zipCode: v.zipCode,
                status: v.status,
                registeredDate: v.registeredDate,
                pollingPlace: v.pollingPlace
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Approve voter (admin endpoint - protected)
app.post('/api/admin/voter/:voterId/approve', requireAdmin, async (req, res) => {
    try {
        const { voterId } = req.params;
        
        const voter = voters.find(v => v.voterId === voterId);
        
        if (!voter) {
            return res.status(404).json({
                success: false,
                message: 'Voter not found'
            });
        }
        
        voter.status = 'active';
        stats.activeVoters = voters.filter(v => v.status === 'active').length;
        
        await saveData();
        
        res.json({
            success: true,
            message: 'Voter approved successfully',
            data: voter
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Reject voter (admin endpoint - protected)
app.post('/api/admin/voter/:voterId/reject', requireAdmin, async (req, res) => {
    try {
        const { voterId } = req.params;
        
        const voter = voters.find(v => v.voterId === voterId);
        
        if (!voter) {
            return res.status(404).json({
                success: false,
                message: 'Voter not found'
            });
        }
        
        voter.status = 'rejected';
        stats.activeVoters = voters.filter(v => v.status === 'active').length;
        
        await saveData();
        
        res.json({
            success: true,
            message: 'Voter rejected successfully',
            data: voter
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Update voter status (admin endpoint - protected)
app.put('/api/admin/voter/:voterId/status', requireAdmin, async (req, res) => {
    try {
        const { voterId } = req.params;
        const { status } = req.body;
        
        if (!['pending', 'active', 'inactive', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        
        const voter = voters.find(v => v.voterId === voterId);
        
        if (!voter) {
            return res.status(404).json({
                success: false,
                message: 'Voter not found'
            });
        }
        
        voter.status = status;
        stats.activeVoters = voters.filter(v => v.status === 'active').length;
        
        await saveData();
        
        res.json({
            success: true,
            message: 'Voter status updated',
            data: voter
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'new.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 OurVoice server is running on http://localhost:${PORT}`);
    console.log(`📊 Registered voters: ${voters.length}`);
    console.log(`📈 Active voters: ${stats.activeVoters}`);
});

