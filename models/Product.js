const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      maxlength: 100,
      minlength: [2, "Product name must be at least 2 characters"],
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      default: "", // 💡 Frontend se empty string aane par error na de
    },

    category: {
      type: String,
      enum: [
        "tablets",
        "syrups",
        "injections",
        "capsules",
        "creams",
        "surgical",
        "others",
      ],
      required: [true, "Please provide a category"],
      trim: true,
    },

    // 💡 Frontend se aane wali pharmacy ki nayi fields
    packing: { type: String, default: "N/A" },
    batchNo: { type: String, default: "N/A" },
    retailPrice: { type: Number, default: 0, min: 0 },
    tradePrice: { type: Number, default: 0, min: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    stockQuantity: { type: Number, default: 0, min: 0 },
    image: { type: String, default: "" },
    expiryDate: { type: Date },

    price: {
      type: Number,
      default: 0,
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock quantity cannot be negative"],
    },

    isInStock: {
      type: Boolean,
      default: true,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, "Low stock threshold cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("save", function () {
  // 💡 Agar frontend se stockQuantity aa raha hai toh usay stock field mein bhi sync kar dein
  this.stock = this.stockQuantity || this.stock || 0;
  this.isInStock = this.stock > 0;
});

module.exports = mongoose.model("Product", productSchema);
