import {
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
} from "../../applications/use_case/post_usecase";
import helmet from "helmet";

export default function postController(
    postDbRepository,
    postDbRepositoryImp
) {
    const dbRepository = postDbRepository(postDbRepositoryImp());

    const ControllerFetchPostByProperties = (req, res, next) => {
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

        UseCaseFetchPostByProperties(params, dbRepository)
            .then((posts) => {
                response.data = posts
                return UseCaseCountPost(params, dbRepository)
            })
            .then((total) => {
                response.total = total;
                response.skip = params.skip;
                response.limit = params.limit;
                return res.json(response)
            })
            .catch((error) => next(error));
    }

    const ControllerCreatePost = (req, res, next) => {
        const { title, content, categories  } = req.body;
        const author = req.user.email;
        const attachments = []

        UseCaseCreatePost(title, content, author, categories, attachments, dbRepository)
            .then((post) => {
                return res.json(post)
            })
            .catch((error) => next(error));
    }

    const ControllerDeletePost = (req, res, next) => {
        const id = req.params.id
        UseCaseFindPostById(id, dbRepository)
            .then((post) => {
                if (post.author === req.user.email) {
                    return UseCaseDeletePostById(id, dbRepository)
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
    const ControllerLikePost = (req, res, next) => {
        const id = req.params.id
        UseCaseFindPostById(id, dbRepository)
            .then((post) => {
                if (post.like.includes(req.user.email)) {
                    UseCaseUnLikePost(id, req.user.email, dbRepository)
                        .then(() => {
                            return res.json({
                                message: 'unLiked'
                            })
                        })
                        .catch((e) => next(e))
                } else {
                    UseCaseLikePost(id, req.user.email, dbRepository)
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
    const ControllerUpdatePost = (req, res, next) => {
        const id = req.params.id
        UseCaseFindPostById(id, dbRepository)
            .then(post => {
                if (post.author === req.user.email) {
                    const update = {
                        content: req.body.content,
                        categories: req.body.categories
                    }
                    UseCaseUpdatePost(id, update,dbRepository)
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

    const ControllerCommentPost = (req, res, next) => {
        const id = req.params.id;
        const comment = {
            content: req.body.content,
            author: req.user.email,
            createdAt: Date.now()
        }
        UseCaseCommentPost(id, comment, dbRepository)
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
        ControllerFetchPostByProperties,
        ControllerCreatePost,
        ControllerDeletePost,
        ControllerLikePost,
        ControllerUpdatePost,
        ControllerCommentPost,
        ControllerGetCategory
    }
}
