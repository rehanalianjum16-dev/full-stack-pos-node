const express = require("express");
const router = express.Router();
const {
  createPurchase,
  getPurchases,
  updatePurchase,
  deletePurchase
} = require("../controllers/purchase");

router.get("/get", getPurchases);
router.post("/add", createPurchase);
router.put("/update/:id", updatePurchase);
router.delete("/delete/:id", deletePurchase);

module.exports = router;
