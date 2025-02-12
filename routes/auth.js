const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await pool.query(
            'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, is_admin',
            [email, hashedPassword, name]
        );

        // Create JWT
        const token = jwt.sign(
            { 
                id: newUser.rows[0].id,
                email: newUser.rows[0].email,
                is_admin: newUser.rows[0].is_admin
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set cookie
        setCookie(res, token);

        res.json({
            user: {
                id: newUser.rows[0].id,
                email: newUser.rows[0].email,
                name: newUser.rows[0].name,
                is_admin: newUser.rows[0].is_admin
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create JWT
        const token = jwt.sign(
            { 
                id: user.rows[0].id,
                email: user.rows[0].email,
                is_admin: user.rows[0].is_admin
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set cookie
        setCookie(res, token);

        res.json({
            user: {
                id: user.rows[0].id,
                email: user.rows[0].email,
                name: user.rows[0].name,
                is_admin: user.rows[0].is_admin
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
    });
    res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT id, email, name, is_admin FROM users WHERE id = $1',
            [req.user.id]
        );

        res.json({ user: user.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Refresh token
router.post('/refresh', auth, async (req, res) => {
    try {
        // Get current user data
        const user = await pool.query(
            'SELECT id, email, is_admin FROM users WHERE id = $1',
            [req.user.id]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Create new JWT
        const token = jwt.sign(
            { 
                id: user.rows[0].id,
                email: user.rows[0].email,
                is_admin: user.rows[0].is_admin
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set cookie with new token
        setCookie(res, token);

        res.json({ message: 'Token refreshed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update cookie settings in login and register routes
const setCookie = (res, token) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction, // Only use secure in production
        sameSite: isProduction ? 'none' : 'lax', // Use 'none' for cross-site in production
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/',
    });
};

module.exports = router; 