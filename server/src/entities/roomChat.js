export default function roomChat(title, members, avatar, lastMessage, admin, lastSender, createdAt, updateAt, description, type) {
    return {
        getTitle: () => title,
        getMembers: () => members,
        getLastMessage: () => lastMessage,
        getLastSender: () => lastSender,
        getCreatedAt: () => createdAt,
        getUpdatedAt: () => updateAt,
        getAvatar: () => avatar,
        getAdmin: () => admin,
        getDescription: () => description,
        getType: () => type ?? 'class'
    }
}
