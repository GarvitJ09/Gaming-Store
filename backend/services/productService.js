const Product = require('../models/Product'); // Assuming this is the correct path for your product model

// Function to update stock for a specific variant
async function updateStock(productId, variantId, additionalStock) {
  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return { message: 'Product not found' };
    }

    // Find the variant by variantId
    const variant = product.variants.find(
      (v) => v._id.toString() === variantId
    );

    if (!variant) {
      return { message: 'Variant not found' };
    }

    // Add the additional stock
    variant.stock += additionalStock;

    // Save the updated product
    await product.save();

    return { message: 'Stock updated successfully', updatedProduct: product };
  } catch (error) {
    console.error(error);
    return { message: 'Error updating stock', error };
  }
}

module.exports = { updateStock };
