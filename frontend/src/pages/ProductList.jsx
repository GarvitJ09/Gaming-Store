// src/pages/ProductList.js
import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../ProductApis'; // Import the API function
import { Link } from 'react-router-dom'; // For navigation

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await getAllProducts();
        setProducts(productData); // Store product data
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []); // Run the effect only once, when the component mounts

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <h1>Products</h1>
      <div className='product-list'>
        {products.map((product) => (
          <div key={product._id} className='product-card'>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <Link to={`/product/${product._id}`}>
              <button>View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
