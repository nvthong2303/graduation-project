import userController from "../../../adapters/controllers/user.controller";
import userDbRepository from '../../../applications/repositories/userDbRepository';
import userDbRepositoryMongoDb from '../../database/mongoDB/repositories/user.repositoryMongoDB';
import authServiceInterface from '../../../applications/services/authService';
import authServiceImpl from '../../services/auth.services';
import authMiddleware from '../middlewares/authMiddleware';

export default function userRouter(express) {
    const router = express.Router();

    // load controller with dependencies
    const controller = userController(
        userDbRepository,
        userDbRepositoryMongoDb,
        authServiceInterface,
        authServiceImpl
    );

    // GET endpoints
    router.route('/:id').get(authMiddleware, controller.fetchUserById);
    router.route('/').get(authMiddleware, controller.fetchUsersByProperty);

    // POST endpoints
    router.route('/register').post(controller.register);
    router.route('/login').post(controller.loginUser);

    return router;
}






