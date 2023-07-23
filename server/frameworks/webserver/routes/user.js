import userController from "../../../adapters/controllers/user.controller";
import userDbRepository from '../../../applications/repositories/userDbRepository';
import userDbRepositoryMongoDb from '../../database/mongoDB/repositories/user.repositoryMongoDB';
import authServiceInterface from '../../../applications/services/authService';
import authServiceImpl from '../../services/auth.services';
import authMiddleware from '../middlewares/authMiddleware';
import mailServiceInterface from '../../../applications/services/mailService';
import mailServiceImpl from '../../services/mail.service';

export default function userRouter(express) {
    const router = express.Router();

    // load controller with dependencies
    const controller = userController(
        userDbRepository,
        userDbRepositoryMongoDb,
        authServiceInterface,
        authServiceImpl,
        mailServiceInterface,
        mailServiceImpl
    );

    // GET endpoints
    router.route('/list').get(authMiddleware, controller.ControllerFetchListUserByEmails);
    router.route('/:id').get(authMiddleware, controller.ControllerFetchUserById);
    router.route('/').get(authMiddleware, controller.ControllerFetchUsersByProperty);

    // POST endpoints
    router.route('/register').post(controller.ControllerRegister); // api register
    router.route('/login').post(controller.ControllerLoginUser); // api login

    router.route('/password').put(authMiddleware, controller.ControllerChangePassword)
    router.route('/forget-password').post(controller.ControllerResetPassword)

    return router;
}






