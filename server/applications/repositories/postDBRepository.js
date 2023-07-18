export default function postRepository(repository) {
    const findPostByProperty = (params) => repository.findPostByProperty(params);

    const createPost = (body) => repository.createPost(body);

    const deletePostById = (id) => repository.deletePostById(id);

    const findPostById = (id) => repository.findPostById(id);

    const likePost = (id, user) => repository.likePost(id, user);

    const unLikePost = (id, user) => repository.unLikePost(id, user);

    const updatePost = (id, newPost) => repository.updatePost(id, newPost);

    const countPost = (params) => repository.countPostByProperties(params)

    const commentPost = (id, comment) => repository.commentPost(id, comment)

    const aggregateCategoryRepo = () => repository.aggregateCategory()

    return {
        findPostByProperty,
        createPost,
        deletePostById,
        findPostById,
        likePost,
        unLikePost,
        updatePost,
        countPost,
        commentPost,
        aggregateCategoryRepo
    }
}