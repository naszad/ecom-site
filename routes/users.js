const router = require('express').Router();
const pool = require('../config/db');
const { adminAuth } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
    try {
        const users = await pool.query(
            'SELECT id, email, first_name, last_name, is_admin, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user (admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, is_admin } = req.body;

        const updatedUser = await pool.query(
            'UPDATE users SET first_name = $1, last_name = $2, is_admin = $3 WHERE id = $4 RETURNING id, email, first_name, last_name, is_admin',
            [first_name, last_name, is_admin, id]
        );

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if trying to delete self
        if (req.user.id === parseInt(id)) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        const deletedUser = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING id',
            [id]
        );

        if (deletedUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 