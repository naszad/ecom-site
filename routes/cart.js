const router = require('express').Router();
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

// Get cart items
router.get('/', auth, async (req, res) => {
    try {
        const cartItems = await pool.query(
            `SELECT ci.*, p.name, p.price, p.image_url, 
            (p.price * ci.quantity) as total_price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = $1`,
            [req.user.id]
        );

        const cartTotal = cartItems.rows.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

        res.json({
            items: cartItems.rows,
            total: cartTotal
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add item to cart
router.post('/', auth, async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        // Check if product exists and has enough stock
        const product = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [product_id]
        );

        if (product.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.rows[0].stock_quantity < quantity) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        // Check if item already exists in cart
        const existingItem = await pool.query(
            'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
            [req.user.id, product_id]
        );

        let cartItem;
        if (existingItem.rows.length > 0) {
            // Update quantity if item exists
            const newQuantity = existingItem.rows[0].quantity + quantity;
            
            if (newQuantity > product.rows[0].stock_quantity) {
                return res.status(400).json({ error: 'Not enough stock available' });
            }

            cartItem = await pool.query(
                'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
                [newQuantity, req.user.id, product_id]
            );
        } else {
            // Add new item if it doesn't exist
            cartItem = await pool.query(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
                [req.user.id, product_id, quantity]
            );
        }

        // Get full cart item details
        const fullCartItem = await pool.query(
            `SELECT ci.*, p.name, p.price, p.image_url,
            (p.price * ci.quantity) as total_price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.id = $1`,
            [cartItem.rows[0].id]
        );

        res.json(fullCartItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update cart item quantity
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        // Check if cart item exists and belongs to user
        const cartItem = await pool.query(
            'SELECT * FROM cart_items WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );

        if (cartItem.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Check if product has enough stock
        const product = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [cartItem.rows[0].product_id]
        );

        if (product.rows[0].stock_quantity < quantity) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        // Update quantity
        const updatedItem = await pool.query(
            'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
            [quantity, id]
        );

        // Get full cart item details
        const fullCartItem = await pool.query(
            `SELECT ci.*, p.name, p.price, p.image_url,
            (p.price * ci.quantity) as total_price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.id = $1`,
            [id]
        );

        res.json(fullCartItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove item from cart
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const deletedItem = await pool.query(
            'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (deletedItem.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Clear cart
router.delete('/', auth, async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM cart_items WHERE user_id = $1',
            [req.user.id]
        );

        res.json({ message: 'Cart cleared successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 