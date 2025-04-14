const { Router } = require('express');
const questionRoutes = require('./question-routes');
const categoryRoutes = require('./category-routes');
const answerRoutes = require('./answer-routes');
const userRoutes = require('./user-routes');

const router = Router();

router.use("/questions", questionRoutes);
router.use("/categories", categoryRoutes);
router.use("/answers", answerRoutes);
router.use("/user", userRoutes);

module.exports = router;