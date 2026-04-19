const express = require("express");
const router = express.Router();
const { getAllUsers,createUser, updateUser, deleteUser } = require("../controllers/users");

router.post("/", createUser);
router.get("/", getAllUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
