import post from '../../src/entities/post'

function fetchPostByProperties(
    param,
    postRepository
) {
    const params = {
        keyword: param.keyword,
        categories: param.categories,
        author: param.author,
        skip: param.skip,
        limit: param.limit,
        user: param.user
    }
    return postRepository.findPostByProperty(params)
}

function createPost(
    content,
    author,
    categories,
    attachments,
    postRepository
) {
    const newPost = new post(
        content,
        author,
        categories,
        attachments
    )
    return postRepository.createPost(newPost)
}

const deletePostById = (id, postRepository) => {
    return postRepository.deletePostById(id)
}

const findPostById = (id, postRepository) => {
    return postRepository.findPostById(id)
}

const likePost = (id, user, postRepository) => {
    return postRepository.likePost(id, user)
}

const unLikePost = (id, user, postRepository) => {
    return postRepository.unLikePost(id, user)
}

const updatePost = (id, newPost, postRepository) => {
    return postRepository.updatePost(id, newPost)
}

const countPost = (properties, postRepository) => {
    const _properties = {
        keyword: properties.keyword,
        author: properties.author,
        categories: properties.categories
    } = properties;
    return postRepository.countPost(_properties)
}

const commentPost = (id, comment, postRepository) => {
    return postRepository.commentPost(id, comment)
}

export {
    fetchPostByProperties,
    createPost,
    deletePostById,
    findPostById,
    likePost,
    unLikePost,
    updatePost,
    countPost,
    commentPost
}
