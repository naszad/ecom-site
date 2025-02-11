const router = require('express').Router();
const pool = require('../config/db');
const { auth, adminAuth } = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category, search, sort, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE 1=1
        `;
        const queryParams = [];
        let paramCount = 1;

        if (category) {
            query += ` AND c.id = $${paramCount}`;
            queryParams.push(category);
            paramCount++;
        }

        if (search) {
            query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
            queryParams.push(`%${search}%`);
            paramCount++;
        }

        if (sort) {
            const [field, order] = sort.split(':');
            const validFields = ['name', 'price', 'created_at'];
            const validOrders = ['asc', 'desc'];
            
            if (validFields.includes(field) && validOrders.includes(order.toLowerCase())) {
                query += ` ORDER BY p.${field} ${order}`;
            }
        } else {
            query += ' ORDER BY p.created_at DESC';
        }

        query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        queryParams.push(limit, offset);

        const products = await pool.query(query, queryParams);
        
        // Get total count for pagination
        const countQuery = `
            SELECT COUNT(*) 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE 1=1
            ${category ? ' AND c.id = $1' : ''}
            ${search ? ` AND (p.name ILIKE $${category ? 2 : 1} OR p.description ILIKE $${category ? 2 : 1})` : ''}
        `;
        
        const countQueryParams = [];
        if (category) countQueryParams.push(category);
        if (search) countQueryParams.push(`%${search}%`);
        
        const totalCount = await pool.query(countQuery, countQueryParams);
        
        res.json({
            products: products.rows,
            pagination: {
                total: parseInt(totalCount.rows[0].count),
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(parseInt(totalCount.rows[0].count) / limit)
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await pool.query(
            `SELECT p.*, c.name as category_name,
            COALESCE(
                (SELECT AVG(rating)::numeric(10,2) 
                FROM reviews 
                WHERE product_id = p.id
                ), 0
            ) as average_rating,
            COALESCE(
                (SELECT COUNT(*) 
                FROM reviews 
                WHERE product_id = p.id
                ), 0
            ) as review_count
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = $1`,
            [id]
        );

        if (product.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Get reviews for the product
        const reviews = await pool.query(
            `SELECT r.*, u.first_name, u.last_name 
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = $1
            ORDER BY r.created_at DESC`,
            [id]
        );

        res.json({
            ...product.rows[0],
            reviews: reviews.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create product (Admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const { name, description, price, stock_quantity, category_id, image_url } = req.body;

        const newProduct = await pool.query(
            'INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, description, price, stock_quantity, category_id, image_url]
        );

        res.status(201).json(newProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update product (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock_quantity, category_id, image_url } = req.body;

        const updatedProduct = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, category_id = $5, image_url = $6 WHERE id = $7 RETURNING *',
            [name, description, price, stock_quantity, category_id, image_url, id]
        );

        if (updatedProduct.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(updatedProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete product (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *',
            [id]
        );

        if (deletedProduct.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add review
router.post('/:id/reviews', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const user_id = req.user.id;

        // Check if product exists
        const product = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [id]
        );

        if (product.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if user has already reviewed this product
        const existingReview = await pool.query(
            'SELECT * FROM reviews WHERE product_id = $1 AND user_id = $2',
            [id, user_id]
        );

        if (existingReview.rows.length > 0) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }

        const newReview = await pool.query(
            'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, user_id, rating, comment]
        );

        res.status(201).json(newReview.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 