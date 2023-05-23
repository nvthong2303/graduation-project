export default function message(content, sender, room) {
    return {
        getContent: () => content,
        getSender: () => sender,
        getRoom: () => room,
    }
}