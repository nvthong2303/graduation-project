import {
    createRoom as _createRoom,
    findByProperty,
    findById,
    updateLastMessage,
    getAdminRoomById,
    addMember,
    removeMember,
    deleteById,
    updateTitle
} from "../../applications/use_case/roomChat/roomChat";
import {
    findByProperty as findUser
} from "../../applications/use_case/user/user"


export default function roomController(
    roomDbRepository,
    roomDbRepositoryImpl,
    userDbRepository,
    userDbRepositoryImpl
) {
    const dbRepository = roomDbRepository(roomDbRepositoryImpl())
    const _userDbRepository = userDbRepository(userDbRepositoryImpl())

    const fetchRoomByProperty = (req, res, next) => {
        const params = {}
        const response = {}

        // Dynamically created query params based on endpoint params
        for (const key in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, key)) {
                params[key] = req.query[key]
            }
        }

        // predefined query params (apart from dynamically) for pagination
        params.page = params.page ? parseInt(params.page, 10) : 1;
        params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;

        findByProperty(params, dbRepository)
            .then((rooms) => {
                response.rooms = rooms;
                return res.json(response);
            })
            .catch((error) => next(error))
    }

    const createRoom = (req, res, next) => {
        const newRoom = {
            title: req.body.title,
            members: req.body.members,
            avatar: req.body.avatar ?? 'none',
            admin: req.user.email,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastMessage: `Room created`,
            description: req.body.description,
            lastSender: req.user.email
        }
        _createRoom(newRoom, dbRepository)
            .then((room) => {
                console.log(room)
                return res.json({ message: 'hello world' });
            })
            .catch((err) => {
                next(err)
            })
    }

    return {
        fetchRoomByProperty,
        createRoom
    }
}