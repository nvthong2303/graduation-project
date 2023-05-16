import room from '../../../src/entities/roomChat';

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
    getAdminRoomById
}