// src/pages/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../ProductApis';

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams(); // Get product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>

      <h3>Variants</h3>
      <div className='variants'>
        {product.variants.map((variant, index) => (
          <div key={index} className='variant'>
            <p>Color: {variant.color}</p>
            <p>Size: {variant.size}</p>
            <p>Stock: {variant.stock}</p>
            <button onClick={() => addToCart({ ...product, variant })}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
