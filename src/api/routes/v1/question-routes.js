const { Router } = require('express');
const { QuestionMiddlewares, MulterMiddleware, AuthMiddleware } = require('../../middlewares');
const { QuestionControllers, VoteControllers } = require('../../controllers')

const router = Router();

router.get("/",
    QuestionControllers.questionControllerGETAll
);
router.get("/:id",
    QuestionControllers.questionControllerGET
);
router.post("/",
    AuthMiddleware.isAuthenticated,
    MulterMiddleware.addFilesToReqObject,
    MulterMiddleware.addUserToReqBody,
    QuestionMiddlewares.validateCreateRequest,
    QuestionControllers.questionControllerPOST
);
router.post("/:id/vote",
    AuthMiddleware.isAuthenticated,
    VoteControllers.vote,
);
router.put("/",
    QuestionControllers.questionControllerUPDATE
);
router.delete("/",
    QuestionControllers.questionControllerDELETE
);

router.get("/by-category/:categoryName", QuestionControllers.fetchQuestionsByCategory);


module.exports = router;
