const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true },
    supplierName: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        total: { type: Number, required: true, min: 0 },
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
