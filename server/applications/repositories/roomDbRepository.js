export default function roomChatDbRepository(repository) {
    const createRoom = (params) => repository.createRoom(params);

    const findByProperty = (params) => repository.findByProperty(params);

    const findById = (id) => repository.findById(id);

    const getAdminRoomById = (email, id) => repository.getAdminRoomById(email, id);

    const deleteById = (id) => repository.deleteById(id)

    return {
        createRoom,
        findByProperty,
        findById,
        getAdminRoomById,
        deleteById
    }
}