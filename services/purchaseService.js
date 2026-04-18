const Purchase = require("../models/purchase");
const Product = require("../models/Product");

const create = async (purchaseData) => {
    const newPurchase = new Purchase(purchaseData);
    await newPurchase.save();

    // Nayi purchase aane par Product ka stock ADD karein (+)
    if (newPurchase.items && newPurchase.items.length > 0) {
        for (const item of newPurchase.items) {
            let prodId = item.product || item.productId || item.product_id;
            if (prodId && typeof prodId === "object" && prodId._id) prodId = prodId._id;
            if (prodId) prodId = prodId.toString();

            if (prodId && /^[a-fA-F0-9]{24}$/.test(prodId)) {
                await Product.findByIdAndUpdate(prodId, {
                    $inc: { stock: Number(item.quantity), stockQuantity: Number(item.quantity) }
                });
            }
        }
    }
    return newPurchase;
};

const getAll = async () => {
    return await Purchase.find().populate("items.product", "name").sort({ createdAt: -1 });
};

const updateById = async (id, updateData) => {
    const oldPurchase = await Purchase.findById(id);
    if (!oldPurchase) {
        throw new Error("Purchase not found");
    }

    // 1. Purani purchase modify hone se pehle uska stock wapas MINUS karein (-)
    if (oldPurchase.items && oldPurchase.items.length > 0) {
        for (const item of oldPurchase.items) {
            let prodId = item.product || item.productId || item.product_id;
            if (prodId && typeof prodId === "object" && prodId._id) prodId = prodId._id;
            if (prodId) prodId = prodId.toString();
            
            if (prodId && /^[a-fA-F0-9]{24}$/.test(prodId)) {
                await Product.findByIdAndUpdate(prodId, { $inc: { stock: -Number(item.quantity), stockQuantity: -Number(item.quantity) } });
            }
        }
    }

    // 2. Purchase Update karein
    const updatedPurchase = await Purchase.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    // 3. Nayi aane wali quantities ka stock wapas ADD karein (+)
    if (updatedPurchase.items && updatedPurchase.items.length > 0) {
        for (const item of updatedPurchase.items) {
            let prodId = item.product || item.productId || item.product_id;
            if (prodId && typeof prodId === "object" && prodId._id) prodId = prodId._id;
            if (prodId) prodId = prodId.toString();

            if (prodId && /^[a-fA-F0-9]{24}$/.test(prodId)) {
                await Product.findByIdAndUpdate(prodId, { $inc: { stock: Number(item.quantity), stockQuantity: Number(item.quantity) } });
            }
        }
    }
    return updatedPurchase;
};

const deleteById = async (id) => {
    const purchaseToDelete = await Purchase.findById(id);
    if (!purchaseToDelete) {
        throw new Error("Purchase not found");
    }

    // Purchase delete hone se pehle store hua stock inventory se MINUS karein (-)
    if (purchaseToDelete.items && purchaseToDelete.items.length > 0) {
        for (const item of purchaseToDelete.items) {
            let prodId = item.product || item.productId || item.product_id;
            if (prodId && typeof prodId === "object" && prodId._id) prodId = prodId._id;
            if (prodId) prodId = prodId.toString();

            if (prodId && /^[a-fA-F0-9]{24}$/.test(prodId)) {
                await Product.findByIdAndUpdate(prodId, { $inc: { stock: -Number(item.quantity), stockQuantity: -Number(item.quantity) } });
            }
        }
    }

    await Purchase.findByIdAndDelete(id);
    return purchaseToDelete;
};

module.exports = {
    create,
    getAll,
    updateById,
    deleteById,
};
