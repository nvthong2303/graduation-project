import authMiddleware from "../middlewares/authMiddleware";
import roomChatRepositoryMongoDB from "../../database/mongoDB/repositories/roomChat.repositoryMongoDB";
import roomChatDbRepository from "../../../applications/repositories/roomDbRepository";
import roomController from "../../../adapters/controllers/room.controller";
import userRepository from "../../../applications/repositories/userDbRepository";
import userRepositoryMongoDB from "../../database/mongoDB/repositories/user.repositoryMongoDB";

export default function roomRouter(express) {
    const router = express.Router()

    // load controller with dependencies
    const controller = roomController(
        roomChatDbRepository,
        roomChatRepositoryMongoDB,
        userRepository,
        userRepositoryMongoDB
    )

    // POST endpoints
    router.route('/create').post(authMiddleware, controller.createRoom);

    return router;
}

