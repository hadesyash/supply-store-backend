# The Supply Store - Backend System

Backend server for handling enquiry forms and dealership applications for The Supply Store paint distributor website.

## 🎨 Features

- ✅ Enquiry form submission and storage
- ✅ Dealership application form handling
- ✅ Admin dashboard to view all submissions
- ✅ Export data to CSV
- ✅ Free JSON file-based storage
- ✅ CORS-enabled for cross-origin requests

## 📁 Project Structure

```
supply-store-backend/
├── data/                    # Form submissions (auto-created)
│   ├── enquiries.json      # Customer enquiry data
│   └── dealerships.json    # Dealership application data
├── server.js               # Backend server
├── package.json            # Dependencies
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Navigate to project folder**:
```bash
cd supply-store-backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the server**:

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

4. **Server will run on**: `http://localhost:3000`

## 📋 API Endpoints

### POST `/api/submit-enquiry`
Submit a customer enquiry form

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "company": "ABC Industries",
  "interest": "Paints",
  "message": "Looking for bulk order"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Enquiry submitted successfully. We will contact you within 24 hours.",
  "id": "1234567890"
}
```

### POST `/api/submit-dealership`
Submit a dealership application

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "location": "Mumbai",
  "experience": "5 years",
  "message": "Interested in dealership"
}
```

### GET `/api/enquiries`
Get all customer enquiries

### GET `/api/dealerships`
Get all dealership applications

### GET `/api/health`
Check server status

## 🌐 Deployment Guide

### Step 1: Upload to GitHub

1. Create a new repository on GitHub (or use existing)
2. Initialize git:
```bash
git init
git add .
git commit -m "Initial commit: Backend system"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Deploy Backend to Render

1. Sign up at [render.com](https://render.com)
2. Click "New" > "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: supply-store-backend
   - **Language**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free
5. Click "Create Web Service"
6. Wait for deployment (2-3 minutes)
7. Copy your backend URL (e.g., `https://supply-store-backend.onrender.com`)

### Step 3: Update Frontend Forms

Update your HTML forms to connect to the backend.

**For Enquiry Form (index.html)**:

Find your form and add this JavaScript:

```html
<script>
document.getElementById('enquiry-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        interest: formData.get('interest'),
        message: formData.get('message'),
    };
    
    try {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        const response = await fetch('https://your-render-url.onrender.com/api/submit-enquiry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            e.target.reset();
        } else {
            alert('Error: ' + result.error);
        }
        
        submitBtn.textContent = 'Send Enquiry';
        submitBtn.disabled = false;
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting the form. Please try again.');
    }
});
</script>
```

**For Dealership Form** - use `/api/submit-dealership` endpoint instead.

### Step 4: Test Your Forms

1. Visit your website: `https://thesupplystore.co.in`
2. Fill out the enquiry form
3. Submit
4. Check if data is saved: `https://your-render-url.onrender.com/api/enquiries`

## 📊 Viewing Submissions

### Method 1: Direct API Access
```
https://your-render-url.onrender.com/api/enquiries
https://your-render-url.onrender.com/api/dealerships
```

### Method 2: Admin Dashboard
Use the included `admin.html` file for a beautiful dashboard view.

## 🔧 Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```env
PORT=3000
NODE_ENV=production
```

### CORS Settings

By default, the server allows all origins. To restrict:

```javascript
app.use(cors({
    origin: 'https://thesupplystore.co.in',  // Your domain only
    credentials: true
}));
```

## 📦 Data Management

### Backup Your Data

```bash
cp -r data/ data-backup-$(date +%Y%m%d)/
```

### Export to CSV

The admin dashboard has built-in CSV export functionality.

Or manually convert:
```javascript
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data/enquiries.json'));
const csv = data.map(row => Object.values(row).join(',')).join('\n');
fs.writeFileSync('./enquiries.csv', csv);
```

## 🐛 Troubleshooting

### Server won't start?
- Check Node.js version: `node --version` (need v14+)
- Try different port: `PORT=8080 npm start`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Forms not submitting?
1. Check server is running: Visit `/api/health` endpoint
2. Check browser console for errors (F12)
3. Verify Render URL is correct in your HTML
4. Check CORS configuration

### Can't see data?
1. Check `data/` folder exists
2. Verify JSON files are created
3. Look at server logs for errors

## 🔒 Security Notes

**For Production:**
- Add rate limiting to prevent spam
- Implement input validation and sanitization
- Add authentication for admin endpoints
- Use HTTPS (Render provides this automatically)
- Consider moving to a database for scale

## 📧 Support

For issues or questions, open an issue on GitHub.

## 📝 License

MIT License

---

**The Supply Store** - Premium Paint Solutions
