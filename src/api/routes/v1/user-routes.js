const { Router } = require('express');
const { AuthMiddleware } = require('../../middlewares');
const { UserControllers } = require('../../controllers');

const router = Router();

router.get("/active-categories",
    AuthMiddleware.isAuthenticated,
    UserControllers.getUsersActiveCategories,
);

router.get("/unanswered-from-active-categories",
    AuthMiddleware.isAuthenticated,
    UserControllers.getUnansweredFromActiveCategories,
)


module.exports = router;
