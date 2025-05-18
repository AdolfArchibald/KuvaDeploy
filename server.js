const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables
require('dotenv').config();

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        console.log(`Serving file: ${path}`);
    }
}));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            console.error(`Error serving index.html: ${err}`);
            res.status(500).send('Server error');
        }
    });
});

// Hardcoded list of valid referral codes (simulating DB)
const validReferralCodes = ['KUVA2025', 'REF123', 'WELCOME10'];

// Route to handle contact form submission
app.post('/contact', async (req, res) => {
    const { name, surname, email, product, message, referral } = req.body;

    // Validate required fields
    if (!name || !surname || !email || !product) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Validate referral code if provided
    if (referral && !validReferralCodes.includes(referral)) {
        return res.status(400).json({ error: 'Invalid referral code' });
    }

    // Configure Nodemailer for Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission from ${name} ${surname}`,
        text: `
            Name: ${name} ${surname}
            Email: ${email}
            Product: ${product}
            Message: ${message}
            Referral Code: ${referral || 'None'}
        `,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name} ${surname}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Product:</strong> ${product}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Referral Code:</strong> ${referral || 'None'}</p>
        `
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(`Error sending email: ${error}`);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Handle 404 errors
app.use((req, res) => {
    console.error(`404: Resource not found: ${req.url}`);
    res.status(404).send('Not Found');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});