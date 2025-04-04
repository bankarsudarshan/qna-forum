const { Router } = require('express');
const questionRoutes = require('./question-routes');
const categoryRoutes = require('./category-routes');

const router = Router();

router.use("/questions", questionRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;