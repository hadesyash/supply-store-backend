const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Data directory
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

// Initialize data files
async function initializeDataFiles() {
    await ensureDataDir();
    
    const files = ['enquiries.json', 'dealerships.json'];
    
    for (const file of files) {
        const filePath = path.join(DATA_DIR, file);
        try {
            await fs.access(filePath);
        } catch {
            await fs.writeFile(filePath, JSON.stringify([], null, 2));
        }
    }
}

// Read data from file
async function readData(filename) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
}

// Write data to file
async function writeData(filename, data) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing to ${filename}:`, error);
        return false;
    }
}

// API Routes

// Submit enquiry form
app.post('/api/submit-enquiry', async (req, res) => {
    try {
        console.log('Received enquiry:', req.body);
        
        const enquiryData = req.body;
        
        // Validate required fields
        if (!enquiryData.name || !enquiryData.email || !enquiryData.phone) {
            console.error('Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Read existing data
        const existingData = await readData('enquiries.json');
        
        // Add new submission
        const newEnquiry = {
            id: Date.now().toString(),
            ...enquiryData,
            submittedAt: new Date().toISOString()
        };
        
        existingData.push(newEnquiry);
        
        // Save updated data
        const success = await writeData('enquiries.json', existingData);
        
        if (success) {
            console.log('Enquiry saved successfully:', newEnquiry.id);
            res.json({ 
                success: true, 
                message: 'Enquiry submitted successfully. We will contact you within 24 hours.', 
                id: newEnquiry.id 
            });
        } else {
            console.error('Failed to save enquiry');
            res.status(500).json({ error: 'Failed to save enquiry' });
        }
    } catch (error) {
        console.error('Error processing enquiry:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Submit dealership application
app.post('/api/submit-dealership', async (req, res) => {
    try {
        console.log('Received dealership application:', req.body);
        
        const dealershipData = req.body;
        
        // Validate required fields
        if (!dealershipData.name || !dealershipData.email || !dealershipData.phone) {
            console.error('Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Read existing data
        const existingData = await readData('dealerships.json');
        
        // Add new submission
        const newApplication = {
            id: Date.now().toString(),
            ...dealershipData,
            submittedAt: new Date().toISOString()
        };
        
        existingData.push(newApplication);
        
        // Save updated data
        const success = await writeData('dealerships.json', existingData);
        
        if (success) {
            console.log('Dealership application saved successfully:', newApplication.id);
            res.json({ 
                success: true, 
                message: 'Dealership application submitted successfully. Our team will review and contact you soon.', 
                id: newApplication.id 
            });
        } else {
            console.error('Failed to save dealership application');
            res.status(500).json({ error: 'Failed to save application' });
        }
    } catch (error) {
        console.error('Error processing dealership application:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Get all enquiries
app.get('/api/enquiries', async (req, res) => {
    try {
        const enquiries = await readData('enquiries.json');
        res.json(enquiries);
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
});

// Get all dealership applications
app.get('/api/dealerships', async (req, res) => {
    try {
        const dealerships = await readData('dealerships.json');
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
        service: 'The Supply Store Backend'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'The Supply Store Backend API',
        service: 'Paint Distributor Enquiry System',
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

// Initialize and start server
async function startServer() {
    await initializeDataFiles();
    
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════╗
║  The Supply Store Backend Running     ║
╠════════════════════════════════════════╣
║  Port: ${PORT}                           ║
║  Status: ✓ Ready                      ║
║  Data Directory: ./data                ║
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
}

startServer().catch(console.error);

module.exports = app;
