import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to fetch product details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await api.post('/cart', { product_id: id, quantity });
      navigate('/cart');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item to cart');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading product details...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (!product) {
    return <div style={styles.error}>Product not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.productContainer}>
        <div style={styles.imageContainer}>
          <img
            src={product.image_url || 'https://via.placeholder.com/400'}
            alt={product.name}
            style={styles.image}
          />
        </div>
        <div style={styles.details}>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.price}>${product.price.toFixed(2)}</p>
          <p style={styles.description}>{product.description}</p>
          
          <div style={styles.stockInfo}>
            <p>Stock: {product.stock_quantity} units</p>
          </div>

          <div style={styles.addToCart}>
            <div style={styles.quantityControl}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={styles.quantityButton}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span style={styles.quantity}>{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                style={styles.quantityButton}
                disabled={quantity >= product.stock_quantity}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              style={styles.addToCartButton}
              disabled={product.stock_quantity === 0}
            >
              {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {product.reviews && product.reviews.length > 0 && (
            <div style={styles.reviews}>
              <h3 style={styles.reviewsTitle}>Customer Reviews</h3>
              <div style={styles.reviewStats}>
                <p>Average Rating: {product.average_rating.toFixed(1)} / 5</p>
                <p>({product.review_count} reviews)</p>
              </div>
              <div style={styles.reviewsList}>
                {product.reviews.map((review) => (
                  <div key={review.id} style={styles.review}>
                    <div style={styles.reviewHeader}>
                      <span style={styles.reviewAuthor}>
                        {review.first_name} {review.last_name}
                      </span>
                      <span style={styles.reviewRating}>
                        {review.rating} / 5
                      </span>
                    </div>
                    <p style={styles.reviewComment}>{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  productContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  name: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '0.5rem',
  },
  price: {
    fontSize: '1.5rem',
    color: '#007bff',
    fontWeight: 'bold',
  },
  description: {
    color: '#666',
    lineHeight: '1.6',
  },
  stockInfo: {
    color: '#666',
    marginTop: '1rem',
  },
  addToCart: {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  quantityButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    ':disabled': {
      backgroundColor: '#eee',
      cursor: 'not-allowed',
    },
  },
  quantity: {
    fontSize: '1.1rem',
    minWidth: '40px',
    textAlign: 'center',
  },
  addToCartButton: {
    padding: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#0056b3',
    },
    ':disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
  },
  reviews: {
    marginTop: '3rem',
  },
  reviewsTitle: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '1rem',
  },
  reviewStats: {
    display: 'flex',
    gap: '1rem',
    color: '#666',
    marginBottom: '1rem',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  review: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  reviewAuthor: {
    fontWeight: 'bold',
  },
  reviewRating: {
    color: '#007bff',
  },
  reviewComment: {
    color: '#666',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    color: '#dc3545',
  },
};

export default ProductDetails; 