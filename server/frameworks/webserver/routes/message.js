import messageController from "../../../adapters/controllers/message.controller";
import messageRepositoryMongoDB from "../../database/mongoDB/repositories/message.repositoryMongoDB";
import messageRepository from "../../../applications/repositories/messageDBRepository";
import authMiddleware from "../middlewares/authMiddleware";

export default function messageRouter(express) {
    const router = express.Router();

    const controller = messageController(
        messageRepository,
        messageRepositoryMongoDB
    )

    // GET endpoints
    router.route('/').get(authMiddleware, controller._fetchMessageByRoom);

    // POST endpoints
    router.route('/').post(authMiddleware, controller._sendMessage);

    return router;
}

