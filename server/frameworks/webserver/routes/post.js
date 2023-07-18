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
    router.route('/').get(authMiddleware, controller._fetchPostByProperties);
    router.route('/category').get(authMiddleware, controller.ControllerGetCategory);

    // POST create post
    router.route('/').post(authMiddleware, controller._createPost);

    // DELETE delete post
    router.route('/:id').delete(authMiddleware, controller._deletePost);

    // POST like/unLike post
    router.route('/like/:id').post(authMiddleware, controller._likePost);

    // PUT update post
    router.route('/:id').put(authMiddleware, controller._updatePost);

    // POST update post
    router.route('/comment/:id').post(authMiddleware, controller._commentPost);

    return router;
}

