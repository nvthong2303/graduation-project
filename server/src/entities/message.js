export default function message(content, sender, senderName, room) {
    return {
        getContent: () => content,
        getSender: () => sender,
        getSenderName: () => senderName,
        getRoom: () => room,
    }
}
