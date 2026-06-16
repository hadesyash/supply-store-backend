const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set. Exiting.');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schemas
const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 200 },
    email: { type: String, required: true, maxlength: 200 },
    phone: { type: String, required: true, maxlength: 20 },
    company: { type: String, maxlength: 200 },
    interest: { type: String, maxlength: 200 },
    message: { type: String, maxlength: 2000 },
    submittedAt: { type: Date, default: Date.now }
});

const dealershipSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 200 },
    email: { type: String, required: true, maxlength: 200 },
    phone: { type: String, required: true, maxlength: 20 },
    businessName: { type: String, maxlength: 200 },
    location: { type: String, maxlength: 200 },
    experience: { type: String, maxlength: 200 },
    investment: { type: String, maxlength: 200 },
    message: { type: String, maxlength: 2000 },
    submittedAt: { type: Date, default: Date.now }
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);
const Dealership = mongoose.model('Dealership', dealershipSchema);

// Security middleware
app.use(helmet());

app.use(cors({
    origin: ['https://thesupplystore.co.in', 'https://www.thesupplystore.co.in'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-api-key']
}));

app.options('*', cors());

app.use(express.json({ limit: '10kb' }));
app.use(express.static('public'));

// API key middleware for admin endpoints
function requireApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!process.env.ADMIN_API_KEY) {
        return res.status(500).json({ error: 'Server misconfigured' });
    }
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// Rate limiting
const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many submissions. Please try again later.' }
});

const readLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: { error: 'Too many requests. Please try again later.' }
});

// API Routes

// Submit enquiry form
app.post('/api/submit-enquiry', formLimiter, async (req, res) => {
    try {
        const { name, email, phone, company, interest, message } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newEnquiry = await Enquiry.create({
            name, email, phone, company, interest, message,
            submittedAt: new Date()
        });

        res.json({
            success: true,
            message: 'Enquiry submitted successfully. We will contact you within 24 hours.',
            id: newEnquiry._id
        });
    } catch (error) {
        console.error('Error processing enquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Submit dealership application
app.post('/api/submit-dealership', formLimiter, async (req, res) => {
    try {
        const { name, email, phone, businessName, location, experience, investment, message } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newApplication = await Dealership.create({
            name, email, phone, businessName, location, experience, investment, message,
            submittedAt: new Date()
        });

        res.json({
            success: true,
            message: 'Dealership application submitted successfully. Our team will review and contact you soon.',
            id: newApplication._id
        });
    } catch (error) {
        console.error('Error processing dealership application:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all enquiries
app.get('/api/enquiries', requireApiKey, readLimiter, async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ submittedAt: -1 });
        res.json(enquiries);
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
});

// Get all dealership applications
app.get('/api/dealerships', requireApiKey, readLimiter, async (req, res) => {
    try {
        const dealerships = await Dealership.find().sort({ submittedAt: -1 });
        res.json(dealerships);
    } catch (error) {
        console.error('Error fetching dealerships:', error);
        res.status(500).json({ error: 'Failed to fetch dealerships' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'The Supply Store Backend',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'The Supply Store Backend API',
        service: 'Paint Distributor Enquiry System',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`The Supply Store Backend running on port ${PORT}`);
});

module.exports = app;
