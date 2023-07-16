import {
    createRoom as _createRoom,
    findByProperty,
    findById,
    updateLastMessage,
    getAdminRoomById,
    UseCaseAddMember,
    UseCaseRemoveMember,
    deleteById,
    UseCaseUpdateRoomById,
    createChatUserById,
    UseCaseOutRoom
} from "../../applications/use_case/roomChat_usecase";


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
        params.skip = params.page ? parseInt(params.page, 10) : 1;
        params.limit = params.perPage ? parseInt(params.perPage, 10) : 20;

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
            members: [...req.body.members, req.user.email],
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
              if (!room.members.includes(req.user.email)) {
                  throw new Error('You are not in this class')
              }
              return res.json(room)
          })
          .catch((err) => next(err))
    }

    const fetchRoomByMember = (req, res, next) => {
        const params = {
            members: {
                $in: [req.user.email]
            },
            title: new RegExp(req.query.title, 'i'),
        }
        if (req.query.isSearch) {
            params.type = {
                $ne: 'chat'
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

    const createChatUserToUser = (req, res, next) => {
        createChatUserById(req.user.id, req.body.userId, dbRepository, _userDbRepository)
            .then((room) => {
                return res.json({
                    data: room
                })
            })
            .catch((err) => {
                console.log(err)
                return next(err)
            })
    }

    const fetchRoomByEmail = (req, res, next) => {
        const params = {
            members: { $all: [req.params.email, req.user.email] },
            type: "chat"
        }

        findByProperty(params, dbRepository)
            .then((rooms) => {
                if (rooms.length > 0) {
                    return res.json({
                        data: rooms[0]
                    })
                } else {
                    return res.json({
                        message: 'Not found this conversation'
                    });
                }
            })
            .catch((error) => next(error))
    }

    const updateRoom = (req, res, next) => {
        const updateRoom = {
            title: req.body.title,
            description: req.body.description,
            avatar: req.body.avatar
        }
        UseCaseUpdateRoomById(req.params.id, updateRoom, req.user.email, dbRepository)
            .then(() => {
                return res.json({
                    message: 'Update success'
                })
            })
            .catch((err) => next(err))
    }

    const addMember = (req, res, next) => {
        UseCaseAddMember(req.params.id, req.body.members, req.user.email, dbRepository)
            .then(() => {
                return res.json({
                    message: 'Add members success'
                })
            })
            .catch((err) => next(err))
    }

    const deleteMember = (req, res, next) => {
        UseCaseRemoveMember(req.params.id, req.body.members, req.user.email, dbRepository)
            .then(() => {
                return res.json({
                    message: 'Remove members success'
                })
            })
            .catch((err) => next(err))
    }

    const outRoom = (req, res, next) => {
        UseCaseOutRoom(req.params.id, req.user.email, dbRepository)
            .then(() => {
                return res.json({
                    message: 'Out room success'
                })
            })
            .catch((err) => next(err))
    }

    return {
        fetchRoomByProperty,
        createRoom,
        fetchRoomById,
        fetchRoomByMember,
        deleteRoom,
        createChatUserToUser,
        fetchRoomByEmail,
        updateRoom,
        addMember,
        deleteMember,
        outRoom
    }
}
