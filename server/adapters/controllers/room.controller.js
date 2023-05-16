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
                return res.json(room);
            })
            .catch((err) => {
                console.log('err controller create room', err)
                next(err)
            })
    }

    const fetchRoomById = (req, res, next) => {
        findById(req.params.id, dbRepository)
          .then((room) => {
              res.json(room)
          })
          .catch((err) => next(err))
    }

    const fetchRoomByMember = (req, res, next) => {
        const params = {
            members: {
                $in: [req.user.email]
            }
        }
        findByProperty(params, dbRepository)
          .then((listRoom) => {
              return res.json(listRoom)
          })
          .catch((err) => next(err))
    }

    const deleteRoom = (req, res, next) => {
        deleteById(req.user.email, req.params.id, dbRepository)
          .then(() => {
              return res.json({
                  message: 'Delete success'
              })
          })
          .catch((err) => next(err))
    }

    return {
        fetchRoomByProperty,
        createRoom,
        fetchRoomById,
        fetchRoomByMember,
        deleteRoom
    }
}