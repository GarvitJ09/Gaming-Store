const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  color: { type: String, required: true }, // Variant color
  size: { type: String, required: true }, // Variant size
  stock: { type: Number, required: true, min: 0 }, // Stock for the variant
  price: { type: Number, required: true, min: 0 }, // Price for the variant
  sku: { type: String, unique: true }, // Unique identifier for the variant
  image: { type: String }, // Image URL for the variant
});

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Product title
    description: { type: String }, // Product description
    category: { type: String, required: true }, // Product category (e.g., Consoles, Accessories)
    brand: { type: String, required: true }, // Product brand (e.g., Sony, Microsoft)
    variants: [VariantSchema], // Array of product variants
    isFeatured: { type: Boolean, default: false }, // Whether the product is featured
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 }, // Average rating
      count: { type: Number, default: 0, min: 0 }, // Number of reviews
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
