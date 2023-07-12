import PostModel from '../models/post.model';
import UserModel from "../models/user.model";

// move it to a proper place
function omit(obj, ...props) {
    const result = { ...obj };
    props.forEach((prop) => delete result[prop]);
    return result;
}

export default function postRepositoryMongoDB() {
    const findPostByProperty = async (params) => {
        const { keyword, author, categories } = omit(params, 'page', 'perPage')
        const filter = {}
        if (keyword) {
            filter['content'] = new RegExp(keyword, 'i');
        }
        if (author) {
            filter['author'] = author;
        }
        if (categories) {
            filter['categories'] = categories;
        }
        const posts = await PostModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(parseInt(params.skip, 10))
            .limit(parseInt(params.limit, 10))
        const listAuthor = posts.map(el => {
            return el.author
        })
        const listCommentCreator = posts.map(el => {
            let commentCreators = []
            el.comment.map(_el => {
                commentCreators.push(_el.author)
            })
            return commentCreators
        })
        const listEmail = [...listAuthor, ...listCommentCreator].flat().filter((value, index, self) => self.indexOf(value) === index)
        const listUsers = await UserModel.find({
            email: { $in: listEmail }
        })

        const standardizedPosts = posts.map(el => {
            const authorName = listUsers.find(u => u.email === el.author).username
            const _comment = el.comment.map(cmt => {
                cmt.authorName = listUsers.find(u => u.email === cmt.author).username
                return cmt
            })
            return {
                author: el.author,
                authorName,
                countLike: el.like.length,
                comment: _comment,
                createdAt: el.createdAt,
                updatedAt: el.updatedAt,
                content: el.content,
                categories: el.categories,
                attachments: el.attachments,
                _id: el._id,
                liked: el.like.includes(params.user)
            }
        })
        console.log(standardizedPosts)
        return standardizedPosts
    };

    const createPost = (PostEntities) => {
        const newPost = new PostModel({
            content: PostEntities.getContent(),
            author: PostEntities.getAuthor(),
            categories: PostEntities.getCategories(),
            attachments: PostEntities.getAttachments()
        })

        return newPost.save();
    }

    const deletePostById = (id) => PostModel.findByIdAndDelete(id);

    const findPostById = (id) => PostModel.findById(id);

    const likePost = (id, user) => {
        return PostModel.findByIdAndUpdate(id, {
            $push: { like: user }
        })
    }

    const unLikePost = (id, user) => {
        return PostModel.findByIdAndUpdate(id, {
            $pull: { like: user }
        })
    }

    const updatePost = (id, newPost) => {
        return PostModel.findByIdAndUpdate(id, {
            content: newPost.content,
            categories: newPost.categories,
            updatedAt: Date.now()
        })
    }

    const commentPost = (id, comment) => {
        return PostModel.findByIdAndUpdate(id, {
            updatedAt: Date.now(),
            $push: { comment: comment }
        })
    }

    const countPostByProperties = (properties) => {
        const { keyword, author, categories } = omit(properties, 'page', 'perPage')
        const filter = {}
        if (keyword) {
            filter['content'] = new RegExp(keyword, 'i');
        }
        if (author) {
            filter['author'] = author;
        }
        if (categories) {
            filter['categories'] = categories;
        }
        return PostModel.countDocuments(filter)
    }

    return {
        findPostByProperty,
        createPost,
        findPostById,
        deletePostById,
        likePost,
        unLikePost,
        updatePost,
        countPostByProperties,
        commentPost
    };
}
