// Capstone Project Management Portal
// Backend: Node.js (Express)
// Database: MySQL

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 5000;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'capstone_secret_key',
    resave: false,
    saveUninitialized: true
}));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'capstone_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Middleware for Checking Authentication
function isAuthenticated(req, res, next) {
    if (req.session.loggedin) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Landing Page Route
app.get('/', (req, res) => {
    res.render('landing');
});

// Home Page Route
app.get('/home', (req, res) => {
    res.render('home');
});

// Login Page Route
app.get('/login', (req, res) => {
    res.render('login');
});

// Signup Page Route
app.get('/signup', (req, res) => {
    res.render('signup');
});

// About Page Route
app.get('/about', (req, res) => {
    res.render('about');
});

// Login Handling (Updated to Use Email Instead of Username)
app.post('/auth', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.send('Please enter all fields.');
    }

    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
    db.query(query, [email, password], (err, results) => {
        if (err) {
            return res.send('Database error. Please try again.');
        }

        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.email = email;
            req.session.role = results[0].role;  // Fetching role from DB
            res.redirect(`/${results[0].role}/dashboard`);
        } else {
            res.send('Incorrect Email and/or Password!');
        }
    });
});

// Signup Handling (Now Uses Email Instead of Username)
app.post('/signup', (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.send('Please fill all fields.');
    }

    const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
    db.query(checkUserQuery, [email], (err, results) => {
        if (err) {
            return res.send('Database error. Please try again.');
        }

        if (results.length > 0) {
            res.send('Email already exists. Please use a different email.');
        } else {
            const insertUserQuery = `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`;
            db.query(insertUserQuery, [email, password, role], (err, results) => {
                if (err) {
                    res.send('Error registering user. Please try again.');
                } else {
                    res.redirect('/login');
                }
            });
        }
    });
});

// Contact Form Handling
app.post('/send-message', (req, res) => {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
        return res.send('Please fill out all fields.');
    }

    const insertMessageQuery = `INSERT INTO contact_messages (first_name, last_name, email, message) VALUES (?, ?, ?, ?)`;
    db.query(insertMessageQuery, [firstName, lastName, email, message], (err, results) => {
        if (err) {
            res.send('Error sending message. Please try again.');
        } else {
            res.redirect('/about');
        }
    });
});

// Instructor Dashboard
app.get('/instructor/dashboard', isAuthenticated, (req, res) => {
    res.render('instructor_dashboard', { email: req.session.email });
});

// Student Dashboard
app.get('/student/dashboard', isAuthenticated, (req, res) => {
    res.render('student_dashboard', { email: req.session.email });
});

// Client Dashboard
app.get('/client/dashboard', isAuthenticated, (req, res) => {
    res.render('client_dashboard', { email: req.session.email });
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
