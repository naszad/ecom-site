const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Verify user still exists in database
            const user = await pool.query(
                'SELECT id, email, is_admin FROM users WHERE id = $1',
                [decoded.id]
            );

            if (user.rows.length === 0) {
                return res.status(401).json({ error: 'User no longer exists' });
            }

            req.user = {
                id: user.rows[0].id,
                email: user.rows[0].email,
                is_admin: user.rows[0].is_admin
            };
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token has expired' });
            }
            throw err;
        }
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(401).json({ error: 'Token is not valid' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Verify user still exists and is admin
            const user = await pool.query(
                'SELECT id, email, is_admin FROM users WHERE id = $1',
                [decoded.id]
            );

            if (user.rows.length === 0) {
                return res.status(401).json({ error: 'User no longer exists' });
            }

            if (!user.rows[0].is_admin) {
                return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
            }

            req.user = {
                id: user.rows[0].id,
                email: user.rows[0].email,
                is_admin: user.rows[0].is_admin
            };
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token has expired' });
            }
            throw err;
        }
    } catch (err) {
        console.error('Admin auth middleware error:', err);
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = { auth, adminAuth }; 