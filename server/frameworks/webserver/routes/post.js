import postController from "../../../adapters/controllers/post.controller";
import postRepositoryMongoDB from "../../database/mongoDB/repositories/post.repositoryMongoDB";
import postRepository from "../../../applications/repositories/postDBRepository";
import authMiddleware from "../middlewares/authMiddleware";

export default function postRouter(express) {
    const router = express.Router();

    const controller = postController(
        postRepository,
        postRepositoryMongoDB
    )

    // GET post by properties
    router.route('/').get(authMiddleware, controller.ControllerFetchPostByProperties);
    router.route('/category').get(authMiddleware, controller.ControllerGetCategory);

    // POST create post
    router.route('/').post(authMiddleware, controller.ControllerCreatePost);

    // DELETE delete post
    router.route('/:id').delete(authMiddleware, controller.ControllerDeletePost);

    // POST like/unLike post
    router.route('/like/:id').post(authMiddleware, controller.ControllerLikePost);

    // PUT update post
    router.route('/:id').put(authMiddleware, controller.ControllerUpdatePost);

    // POST update post
    router.route('/comment/:id').post(authMiddleware, controller.ControllerCommentPost);

    return router;
}

