const { Router } = require('express');
const { TrendingController } = require('../../controllers');

const router = Router();

// GET /api/v1/trending - Fetch top 3 trending categories
router.get("/", TrendingController.fetchTrendingCategories);

module.exports = router;
