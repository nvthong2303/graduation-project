export default function post(content, author, categories, attachments) {
    return {
        getContent: () => content,
        getAuthor: () => author,
        getAttachments: () => attachments,
        getCategories: () => categories
    }
}
