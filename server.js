const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yashagarwal0551_db_user:awCndOO6NockdNot@cluster0.tezdvrf.mongodb.net/supply-store?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schemas
const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: String,
    interest: String,
    message: String,
    submittedAt: { type: Date, default: Date.now }
});

const dealershipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    businessName: String,
    location: String,
    experience: String,
    investment: String,
    message: String,
    submittedAt: { type: Date, default: Date.now }
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);
const Dealership = mongoose.model('Dealership', dealershipSchema);

// Enhanced CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

app.options('*', cors());

app.use(express.json());
app.use(express.static('public'));

// API Routes

// Submit enquiry form
app.post('/api/submit-enquiry', async (req, res) => {
    try {
        console.log('Received enquiry:', req.body);

        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newEnquiry = await Enquiry.create({
            ...req.body,
            submittedAt: new Date()
        });

        console.log('Enquiry saved successfully:', newEnquiry._id);
        res.json({
            success: true,
            message: 'Enquiry submitted successfully. We will contact you within 24 hours.',
            id: newEnquiry._id
        });
    } catch (error) {
        console.error('Error processing enquiry:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Submit dealership application
app.post('/api/submit-dealership', async (req, res) => {
    try {
        console.log('Received dealership application:', req.body);

        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newApplication = await Dealership.create({
            ...req.body,
            submittedAt: new Date()
        });

        console.log('Dealership application saved:', newApplication._id);
        res.json({
            success: true,
            message: 'Dealership application submitted successfully. Our team will review and contact you soon.',
            id: newApplication._id
        });
    } catch (error) {
        console.error('Error processing dealership application:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Get all enquiries
app.get('/api/enquiries', async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ submittedAt: -1 });
        res.json(enquiries);
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
});

// Get all dealership applications
app.get('/api/dealerships', async (req, res) => {
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
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        endpoints: {
            health: '/api/health',
            submitEnquiry: 'POST /api/submit-enquiry',
            submitDealership: 'POST /api/submit-dealership',
            enquiries: '/api/enquiries',
            dealerships: '/api/dealerships'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.path });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║  The Supply Store Backend Running     ║
╠════════════════════════════════════════╣
║  Port: ${PORT}                           ║
║  Status: ✓ Ready                      ║
║  Database: MongoDB Atlas               ║
╠════════════════════════════════════════╣
║  Endpoints:                            ║
║  POST /api/submit-enquiry              ║
║  POST /api/submit-dealership           ║
║  GET  /api/enquiries                   ║
║  GET  /api/dealerships                 ║
║  GET  /api/health                      ║
╚════════════════════════════════════════╝
    `);
});

module.exports = app;
