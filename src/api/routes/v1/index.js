const { Router } = require('express');
const questionRoutes = require('./question-routes');

const router = Router();

router.use("/questions", questionRoutes);

module.exports = router;