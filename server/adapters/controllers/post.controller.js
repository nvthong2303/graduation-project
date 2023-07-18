import {
    fetchPostByProperties,
    createPost,
    deletePostById,
    findPostById,
    likePost,
    unLikePost,
    updatePost,
    countPost,
    commentPost,
    UseCaseGetCategory
} from "../../applications/use_case/post_usecase";
import helmet from "helmet";

export default function postController(
    postDbRepository,
    postDbRepositoryImp
) {
    const dbRepository = postDbRepository(postDbRepositoryImp());

    const _fetchPostByProperties = (req, res, next) => {
        const params = {};
        const response = {};

        for (const key in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, key)) {
                params[key] = req.query[key]
            }
        }

        params.skip = params.skip ? parseInt(params.skip, 10) : 0;
        params.limit = params.limit ? parseInt(params.limit, 10) : 20;
        params.user = req.user.email;

        fetchPostByProperties(params, dbRepository)
            .then((posts) => {
                response.data = posts
                return countPost(params, dbRepository)
            })
            .then((total) => {
                response.total = total;
                response.skip = params.skip;
                response.limit = params.limit;
                return res.json(response)
            })
            .catch((error) => next(error));
    }

    const _createPost = (req, res, next) => {
        const { content, categories  } = req.body;
        const author = req.user.email;
        const attachments = []

        createPost(content, author, categories, attachments, dbRepository)
            .then((message) => {
                return res.json(message)
            })
            .catch((error) => next(error));
    }

    const _deletePost = (req, res, next) => {
        const id = req.params.id
        findPostById(id, dbRepository)
            .then((post) => {
                if (post.author === req.user.email) {
                    return deletePostById(id, dbRepository)
                } else {
                    throw new Error('You not author')
                }
            })
            .then(() => {
                res.json({
                    message: "delete success"
                })
            })
            .catch((e) => next(e))
    }
    const _likePost = (req, res, next) => {
        const id = req.params.id
        findPostById(id, dbRepository)
            .then((post) => {
                if (post.like.includes(req.user.email)) {
                    unLikePost(id, req.user.email, dbRepository)
                        .then(() => {
                            return res.json({
                                message: 'unLiked'
                            })
                        })
                        .catch((e) => next(e))
                } else {
                    likePost(id, req.user.email, dbRepository)
                        .then(() => {
                            return res.json({
                                message: 'liked'
                            })
                        })
                        .catch((e) => next(e))
                }
            })
            .catch((e) => next(e))
    }
    const _updatePost = (req, res, next) => {
        const id = req.params.id
        findPostById(id, dbRepository)
            .then(post => {
                if (post.author === req.user.email) {
                    const update = {
                        content: req.body.content,
                        categories: req.body.categories
                    }
                    updatePost(id, update,dbRepository)
                        .then(() => {
                            return res.json({
                                message: 'update success'
                            })
                        })
                        .catch((e) => next(e))
                } else {
                    throw new Error('You not author')
                }
            })
            .catch((e) => next(e))
    }

    const _commentPost = (req, res, next) => {
        const id = req.params.id;
        const comment = {
            content: req.body.content,
            author: req.user.email,
            createdAt: Date.now()
        }
        commentPost(id, comment, dbRepository)
            .then(() => {
                return res.json({
                    message: 'comment success'
                })
            })
            .catch((e) => next(e))
    }

    const ControllerGetCategory = (req, res, next) => {
        UseCaseGetCategory(dbRepository)
            .then((data) => {
                return res.json({
                    data
                })
            })
            .catch((e) => next(e))
    }

    return {
        _fetchPostByProperties,
        _createPost,
        _deletePost,
        _likePost,
        _updatePost,
        _commentPost,
        ControllerGetCategory
    }
}
