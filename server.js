const express = require('express');
const path = require('path');
const basicAuth = require('express-basic-auth');

const app = express();

// --- Middleware & Security ---
app.use(express.static(path.join(__dirname, 'public')));
app.use('/tools', express.static(path.join(__dirname, 'tools')));

const adminAuth = basicAuth({
    users: { 'admin': 'password123' }, // अपना पासवर्ड यहाँ बदलें
    challenge: true
});

// --- Routes ---
app.get('/admin', adminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/api/data', (req, res) => {
    try {
        const data = require('./tools-data.json');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Could not load tool data." });
    }
});

// Export the app for Vercel
module.-exports = app;