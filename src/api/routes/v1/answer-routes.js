const { Router } = require('express');
const { AnswerControllers, VoteControllers } = require('../../controllers');
const { AuthMiddleware, MulterMiddleware, AnswerMiddlewares } = require('../../middlewares');

const router = Router();

router.post("/",
    AuthMiddleware.isAuthenticated,
    MulterMiddleware.addFilesToReqObject,
    MulterMiddleware.addUserToReqBody,
    AnswerMiddlewares.validateCreateAnswerRequest,
    AnswerControllers.answerControllerPOST
);

router.post("/:id/vote",
    AuthMiddleware.isAuthenticated,
    VoteControllers.vote,
);



router.get("/by-question/:questionId",
    AnswerControllers.getAnswersByQuestion
);

module.exports = router;
