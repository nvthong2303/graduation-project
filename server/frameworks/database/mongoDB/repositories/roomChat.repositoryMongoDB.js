import RoomModel from '../models/roomChat.model';

function omit(obj, ...props) {
    const result = { ...obj };
    props.forEach((prop) => delete result[prop]);
    return result;
}

export default function roomChatRepositoryMongoDB() {
    const findByProperty = (params) => {
        return RoomModel.find(omit(params, 'page', 'perPage'))
            .skip(params.perPage * params.page - params.perPage)
            .limit(params.perPage)
            .sort({updatedAt: 1});
    }

    const findById = (id) => RoomModel.findById(id);

    const createRoom = (roomChatEntities) => {
        const newRoom = new RoomModel({
            title: roomChatEntities.getTitle(),
            members: roomChatEntities.getMembers(),
            lastMessage: roomChatEntities.getLastMessage(),
            lastSender: roomChatEntities.getLastSender(),
            createdAt: roomChatEntities.getCreatedAt(),
            updatedAt: roomChatEntities.getUpdatedAt(),
            avatar: roomChatEntities.getAvatar(),
            description: roomChatEntities.getDescription(),
            admin: roomChatEntities.getAdmin()
        })

        console.log(newRoom)

        return newRoom.save();
    }

    const deleteById = (id) => RoomModel.findByIdAndDelete(id);

    const updateLastMessageById = (id, message, sender) => RoomModel.findByIdAndUpdate(id, {
        lastMessage: message,
        lastSender: sender,
        updatedAt: new Date()
    })

    const updateTitleById = (id, title) => RoomModel.findByIdAndUpdate(id, {
        title: title
    })

    const addMemberById = (id, members) => RoomModel.findByIdAndUpdate(id, {
        $push: { members: { $each: members } }
    })

    const removeMembersById = (id, members) => RoomModel.findByIdAndUpdate(id, {
        $pull: { members: { $in: members } }
    })

    const getAdminRoomById = (id) => RoomModel.findById(id).select('admin')

    return {
        findByProperty,
        findById,
        createRoom,
        deleteById,
        updateLastMessageById,
        updateTitleById,
        addMemberById,
        removeMembersById,
        getAdminRoomById
    }
}

