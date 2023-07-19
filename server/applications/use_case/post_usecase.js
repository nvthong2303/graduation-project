import post from '../../src/entities/post'

function UseCaseFetchPostByProperties(
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

function UseCaseCreatePost(
    title,
    content,
    author,
    categories,
    attachments,
    postRepository
) {
    const newPost = new post(
        title,
        content,
        author,
        categories,
        attachments
    )
    return postRepository.createPost(newPost)
}

const UseCaseDeletePostById = (id, postRepository) => {
    return postRepository.deletePostById(id)
}

const UseCaseFindPostById = (id, postRepository) => {
    return postRepository.findPostById(id)
}

const UseCaseLikePost = (id, user, postRepository) => {
    return postRepository.likePost(id, user)
}

const UseCaseUnLikePost = (id, user, postRepository) => {
    return postRepository.unLikePost(id, user)
}

const UseCaseUpdatePost = (id, newPost, postRepository) => {
    return postRepository.updatePost(id, newPost)
}

const UseCaseCountPost = (properties, postRepository) => {
    const _properties = {
        keyword: properties.keyword,
        author: properties.author,
        categories: properties.categories
    } = properties;
    return postRepository.countPost(_properties)
}

const UseCaseCommentPost = (id, comment, postRepository) => {
    return postRepository.commentPost(id, comment)
}

const UseCaseGetCategory = (postRepository) => {
    return postRepository.aggregateCategoryRepo();
}

export {
    UseCaseFetchPostByProperties,
    UseCaseCreatePost,
    UseCaseDeletePostById,
    UseCaseFindPostById,
    UseCaseLikePost,
    UseCaseUnLikePost,
    UseCaseUpdatePost,
    UseCaseCountPost,
    UseCaseCommentPost,
    UseCaseGetCategory
}
