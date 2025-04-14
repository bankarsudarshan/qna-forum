const { Router } = require('express');
const { AuthMiddleware } = require('../../middlewares');
const { UserControllers } = require('../../controllers');

const router = Router();

router.get("/top-categories",
    AuthMiddleware.isAuthenticated,
    UserControllers.getUsersActiveCategories,
);


module.exports = router;
