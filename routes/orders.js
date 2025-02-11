const router = require('express').Router();
const pool = require('../config/db');
const { auth, adminAuth } = require('../middleware/auth');

// Get all orders (Admin only)
router.get('/admin', adminAuth, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT o.*, 
            u.email as user_email,
            u.first_name,
            u.last_name,
            COUNT(*) OVER() as total_count
            FROM orders o
            JOIN users u ON o.user_id = u.id
        `;
        const queryParams = [];
        
        if (status) {
            query += ' WHERE o.status = $1';
            queryParams.push(status);
        }

        query += ` ORDER BY o.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limit, offset);

        const orders = await pool.query(query, queryParams);

        const total = orders.rows.length > 0 ? parseInt(orders.rows[0].total_count) : 0;

        res.json({
            orders: orders.rows.map(order => {
                const { total_count, ...orderData } = order;
                return orderData;
            }),
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
    try {
        const orders = await pool.query(
            `SELECT o.*, 
            json_agg(
                json_build_object(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'quantity', oi.quantity,
                    'price_at_time', oi.price_at_time,
                    'product_name', p.name,
                    'product_image', p.image_url
                )
            ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC`,
            [req.user.id]
        );

        res.json(orders.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const order = await pool.query(
            `SELECT o.*, 
            json_agg(
                json_build_object(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'quantity', oi.quantity,
                    'price_at_time', oi.price_at_time,
                    'product_name', p.name,
                    'product_image', p.image_url
                )
            ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.id = $1 AND (o.user_id = $2 OR $3 = true)
            GROUP BY o.id`,
            [id, req.user.id, req.user.is_admin]
        );

        if (order.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create order
router.post('/', auth, async (req, res) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const { shipping_address } = req.body;

        // Get cart items
        const cartItems = await client.query(
            `SELECT ci.*, p.price, p.stock_quantity
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = $1`,
            [req.user.id]
        );

        if (cartItems.rows.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Calculate total amount and check stock
        let totalAmount = 0;
        for (const item of cartItems.rows) {
            if (item.stock_quantity < item.quantity) {
                await client.query('ROLLBACK');
                return res.status(400).json({ 
                    error: `Not enough stock available for product ID: ${item.product_id}` 
                });
            }
            totalAmount += item.price * item.quantity;
        }

        // Create order
        const order = await client.query(
            'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, totalAmount, shipping_address]
        );

        // Create order items and update product stock
        for (const item of cartItems.rows) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
                [order.rows[0].id, item.product_id, item.quantity, item.price]
            );

            await client.query(
                'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
                [item.quantity, item.product_id]
            );
        }

        // Clear cart
        await client.query(
            'DELETE FROM cart_items WHERE user_id = $1',
            [req.user.id]
        );

        await client.query('COMMIT');

        // Get complete order details
        const completeOrder = await client.query(
            `SELECT o.*, 
            json_agg(
                json_build_object(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'quantity', oi.quantity,
                    'price_at_time', oi.price_at_time,
                    'product_name', p.name,
                    'product_image', p.image_url
                )
            ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.id = $1
            GROUP BY o.id`,
            [order.rows[0].id]
        );

        res.status(201).json(completeOrder.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
});

// Update order status (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const updatedOrder = await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (updatedOrder.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(updatedOrder.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 