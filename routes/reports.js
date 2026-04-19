const express = require("express");
const router = express.Router();
const { getSystemReportData } = require("../controllers/reports");

router.get("/", getSystemReportData);

module.exports = router;
