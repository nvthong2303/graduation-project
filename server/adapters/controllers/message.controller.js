import {countMessageByRoom, fetchMessageByRoom, sendMessage} from "../../applications/use_case/message_usecase";

export default function messageController(
    messageDbRepository,
    messageDbRepositoryImp
) {
    const dbRepository = messageDbRepository(messageDbRepositoryImp());

    const _fetchMessageByRoom = (req, res, next) => {
        const params = {};
        const response = {};

        for (const key in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, key)) {
                params[key] = req.query[key]
            }
        }

        params.page = params.page ? parseInt(params.page, 10) : 1;
        params.perPage = params.perPage ? parseInt(params.perPage, 10) : 20;

        fetchMessageByRoom(params, dbRepository)
            .then((messages) => {
                response.messages = messages
                return countMessageByRoom(params.room, dbRepository)
            })
            .then((total) => {
                response.total = total;
                response.skip = params.skip;
                response.limit = params.limit;
                return res.json(response)
            })
            .catch((error) => next(error));
    }

    const _sendMessage = (req, res, next) => {
        const { sender, room, content, senderName } = req.body;

        sendMessage(room, sender, senderName, content, dbRepository)
            .then((message) => {
                return res.json(message)
            })
            .catch((error) => next(error));
    }

    return {
        _fetchMessageByRoom,
        _sendMessage
    }
}
