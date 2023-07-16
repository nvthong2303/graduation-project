export default function roomChatDbRepository(repository) {
    const createRoom = (params) => repository.createRoom(params);
    const findByProperty = (params) => repository.findByProperty(params);
    const findById = (id) => repository.findById(id);
    const getAdminRoomById = (id) => repository.getAdminRoomById(id);
    const deleteById = (id) => repository.deleteById(id);
    const updateById = (id, room) => repository.updateRoomById(id, room);
    const addMembers = (id, members) => repository.addMemberById(id, members);
    const deleteMembers = (id, members) => repository.removeMembersById(id, members);

    const getMembersRoomById = (id) => repository.getMembersRoomById(id)

    return {
        createRoom,
        findByProperty,
        findById,
        getAdminRoomById,
        deleteById,
        updateById,
        addMembers,
        deleteMembers,
        getMembersRoomById
    }
}