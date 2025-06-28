const express = require('express');
const path = require('path');
const basicAuth = require('express-basic-auth');

const app = express();
const port = 3000;

// स्टैटिक फाइलें सर्व करने के लिए
app.use(express.static(path.join(__dirname, 'public')));
app.use('/tools', express.static(path.join(__dirname, 'tools')));

// JSON डेटा को पढ़ने के लिए Middleware
app.use(express.json());

// पासवर्ड सुरक्षा
const adminAuth = basicAuth({
    users: { 'admin': 'password123' }, // अपना पासवर्ड यहाँ बदलें
    challenge: true
});

// --- Routes ---

// एडमिन पेज का रास्ता
app.get('/admin', adminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// API का रास्ता
app.get('/api/data', (req, res) => {
    try {
        const data = require('./tools-data.json');
        res.status(200).json(data);
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ error: "Could not load tool data." });
    }
});

// लोकल डेवलपमेंट के लिए सर्वर चलाना
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`✅ Local server running at http://localhost:${port}`);
    });
}

// Vercel के लिए ऐप को एक्सपोर्ट करना
module.exports = app;