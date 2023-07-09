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
    router.route('/create').post(authMiddleware, controller.createRoom); // create new room
    router.route('/create-user').post(authMiddleware, controller.createChatUserToUser) // create chat user with user

    // GET endpoints
    router.route('/:id').get(authMiddleware, controller.fetchRoomById); // get room by roomId
    router.route('/user/:email').get(authMiddleware, controller.fetchRoomByEmail); // get room by email
    router.route('/').get(authMiddleware, controller.fetchRoomByMember); // get list room user join

    // Delete endpoints
    router.route('/:id').delete(authMiddleware, controller.deleteRoom); // delete room

    return router;
}

