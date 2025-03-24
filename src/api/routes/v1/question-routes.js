const { Router } = require('express');
const { QuestionMiddlewares, MulterMiddleware, AuthMiddleware } = require('../../middlewares');
const { QuestionControllers } = require('../../controllers')

const router = Router();

router.get("/",
    QuestionControllers.questionControllerGET
);
router.post("/",
    AuthMiddleware.isAuthenticated,
    MulterMiddleware.upload.array('quesFiles', 3),
    MulterMiddleware.addUserToReqBody,
    QuestionMiddlewares.validateCreateRequest,
    QuestionControllers.questionControllerPOST
);
router.put("/",
    QuestionControllers.questionControllerUPDATE
);
router.delete("/",
    QuestionControllers.questionControllerDELETE
);

module.exports = router;
