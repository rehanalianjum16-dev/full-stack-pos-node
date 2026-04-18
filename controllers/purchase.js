const purchaseService = require("../services/purchaseService");

const createPurchase = async (req, res) => {
  try {
    const newPurchase = await purchaseService.create(req.body);
    res.status(201).json({ success: true, message: "Purchase created successfully", data: newPurchase });
  } catch (error) {
    console.error("Create Purchase Error:", error.message);
    res.status(400).json({ success: false, message: error.message || "Failed to create purchase" });
  }
};

const getPurchases = async (req, res) => {
  try {
    const purchases = await purchaseService.getAll();
    res.status(200).json({ success: true, data: purchases });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch purchases", error: error.message });
  }
};

const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPurchase = await purchaseService.updateById(id, req.body);
    res.status(200).json({ success: true, message: "Purchase updated successfully", data: updatedPurchase });
  } catch (error) {
    if (error.message === "Purchase not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(400).json({ success: false, message: error.message || "Failed to update purchase" });
  }
};

const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    await purchaseService.deleteById(id);
    res.status(200).json({ success: true, message: "Purchase deleted successfully" });
  } catch (error) {
    if (error.message === "Purchase not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Failed to delete purchase", error: error.message });
  }
};

module.exports = {
  createPurchase,
  getPurchases,
  updatePurchase,
  deletePurchase
};
