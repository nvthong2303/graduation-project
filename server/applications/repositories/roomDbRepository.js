export default function roomChatDbRepository(repository) {
    const createRoom = (params) => repository.createRoom(params);

    return {
        createRoom
    }
}