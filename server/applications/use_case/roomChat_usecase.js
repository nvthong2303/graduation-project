import room from '../../src/entities/roomChat';
import user from "../../src/entities/user";

function findByProperty(params, roomRepository) {
    return roomRepository.findByProperty(params)
}

function findById(id, roomRepository) {
    return roomRepository.findById(id)
}

function deleteById(email, id, roomRepository) {
    // handle check email - admin room deleted
    return roomRepository.getAdminRoomById(id)
      .then((room) => {
          if (room.admin === email) {
              return roomRepository.deleteById(id);
          } else {
            throw new Error('You dont have permission to delete this room')
          }
      })
}

function createChatUserById(creatorId, partnerId, roomRepository, userRepository) {
    let creator;
    return userRepository.findById(creatorId)
        .then((_creator) => {
            creator = _creator;
            return userRepository.findById(partnerId)
        })
        .then((partner) => {
            const _room = {
                title: `${creator.username}-${partner.username}`,
                members: [
                    creator.email,
                    partner.email,
                ],
                admin: creator.email,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastMessage: `${creator.username} start conversation`,
                description: `${creator.username}-${partner.username}`,
                lastSender: creator.email
            }
            const newRoom = room(
                _room.title,
                _room.members,
                _room.avatar,
                _room.lastMessage,
                _room.admin,
                _room.lastSender,
                _room.createdAt,
                _room.updatedAt,
                _room.description,
                'chat'
            )
            console.log(newRoom)
            return roomRepository.createRoom(newRoom)
        })
        .catch(err => {
            console.log('error when create room chat user to user', err)
            throw new Error('Not found creator')
        })
}

function createRoom(
    newRoom,
    roomRepository,
) {
    if (!newRoom.title || !newRoom.admin) {
        throw new Error('title, admin cannot be empty')
    }
    if (newRoom.members.length < 2 ) {
        throw new Error('room must be has more 2 member')
    }
    return roomRepository.findByProperty({ title: newRoom.title })
      .then((roomWithTitle) => {
          if (roomWithTitle?.length) {
              throw new Error(`Room with title: ${newRoom.title} already exist`);
          }
          const _newRoom = room(
            newRoom.title,
            newRoom.members,
            newRoom.avatar,
            newRoom.lastMessage,
            newRoom.admin,
            newRoom.lastSender,
            newRoom.createdAt,
            newRoom.updatedAt,
            newRoom.description
          )
          return roomRepository.createRoom(_newRoom)
      })
        .catch(err => {
            console.log('err repo create room', err)
        })
}

function updateLastMessage(roomId, message, sender, roomRepository) {
    return roomRepository.updateLastMessageById(roomId, message, sender);
}

function updateTitle(roomId, title, roomRepository) {
    return roomRepository.updateTitleById(roomId, title)
}

function addMember(roomId, members, roomRepository) {
    return roomRepository.addMemberById(roomId, members);
}

function removeMember(roomId, members, roomRepository) {
    return roomRepository.removeMembersById(roomId, members);
}

function getAdminRoomById(roomId, roomRepository) {
    return roomRepository.getAdminRoomById(roomId);
}


export {
    findByProperty,
    findById,
    deleteById,
    createRoom,
    updateLastMessage,
    updateTitle,
    addMember,
    removeMember,
    getAdminRoomById,
    createChatUserById
}
