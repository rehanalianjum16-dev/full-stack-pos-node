const Product = require("../models/Product");
const Invoice = require("../models/invoice");

const getSystemReportData = async (req, res) => {
  try {
    // 1. Fetch all products for Complete Inventory & Low Stock Alerts
    const products = await Product.find({}).sort({ createdAt: -1 });

    // 2. Fetch Real Monthly Sales Summary from Invoices
    const salesSummaryAgg = await Invoice.aggregate([
      // 💡 Safe Match: Sirf un invoices ko process karega jin mein createdAt ek "date" hai 
      // (Is se 500 error aur crash nahi hoga)
      { $match: { createdAt: { $type: "date" } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
          revenue: { $sum: "$total_amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              { $cond: [{ $lt: ["$_id.month", 10] }, "0", ""] },
              { $toString: "$_id.month" },
            ],
          },
          totalOrders: 1,
          // Revenue ko string format (e.g. $4500) dene ke liye backend se set kar dein
          revenue: { $concat: [{ $literal: "$" }, { $toString: "$revenue" }] },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: { products, salesSummary: salesSummaryAgg },
    });
  } catch (error) {
    console.error("Reports API Error:", error);
    // 💡 Frontend ko exact error bhej rahe hain taake browser network tab mein reason dikh jaye
    res.status(500).json({ success: false, message: "Failed to fetch report data", error: error.message });
  }
};

module.exports = { getSystemReportData };
