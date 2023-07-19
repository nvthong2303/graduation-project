export default function post(title, content, author, categories, attachments) {
    return {
        getTitle: () => title,
        getContent: () => content,
        getAuthor: () => author,
        getAttachments: () => attachments,
        getCategories: () => categories
    }
}
