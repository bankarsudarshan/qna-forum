const express = require("express");
const router = express.Router();

const { categoryControllerGETAll } = require("../../controllers/category-controllers");

// GET: /api/v1/categories
router.get("/", categoryControllerGETAll);

module.exports = router;
