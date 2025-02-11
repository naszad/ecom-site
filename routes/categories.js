const router = require('express').Router();
const pool = require('../config/db');
const { adminAuth } = require('../middleware/auth');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await pool.query(
            'SELECT * FROM categories ORDER BY name ASC'
        );
        res.json(categories.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single category
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const category = await pool.query(
            'SELECT * FROM categories WHERE id = $1',
            [id]
        );

        if (category.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create category (Admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const { name, description } = req.body;

        // Check if category exists
        const categoryExists = await pool.query(
            'SELECT * FROM categories WHERE name = $1',
            [name]
        );

        if (categoryExists.rows.length > 0) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        const newCategory = await pool.query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );

        res.status(201).json(newCategory.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update category (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Check if category exists
        const categoryExists = await pool.query(
            'SELECT * FROM categories WHERE id = $1',
            [id]
        );

        if (categoryExists.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check if new name conflicts with existing category
        if (name !== categoryExists.rows[0].name) {
            const nameExists = await pool.query(
                'SELECT * FROM categories WHERE name = $1 AND id != $2',
                [name, id]
            );

            if (nameExists.rows.length > 0) {
                return res.status(400).json({ error: 'Category name already exists' });
            }
        }

        const updatedCategory = await pool.query(
            'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, id]
        );

        res.json(updatedCategory.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete category (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category is being used by any products
        const products = await pool.query(
            'SELECT * FROM products WHERE category_id = $1',
            [id]
        );

        if (products.rows.length > 0) {
            return res.status(400).json({ 
                error: 'Cannot delete category that has products. Remove or reassign products first.' 
            });
        }

        const deletedCategory = await pool.query(
            'DELETE FROM categories WHERE id = $1 RETURNING *',
            [id]
        );

        if (deletedCategory.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 