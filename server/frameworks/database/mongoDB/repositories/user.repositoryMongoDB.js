import UserModel from '../models/user.model';

// move it to a proper place
function omit(obj, ...props) {
    const result = { ...obj };
    props.forEach((prop) => delete result[prop]);
    return result;
}

export default function userRepositoryMongoDB() {
    const findUserByProperty = (params) => {
        const { username } = omit(params, 'page', 'perPage')
        return UserModel.find({ username: new RegExp(username, 'i') })
            .skip(params.perPage * params.page - params.perPage)
            .limit(params.perPage)
    };

    const countAll = (params) => UserModel.countDocuments(omit(params, 'page', 'perPage'));

    const findById = (id) => UserModel.findById(id).select('-password');

    const add = (userEntity) => {
        const newUser = new UserModel({
            username: userEntity.getUserName(),
            password: userEntity.getPassword(),
            email: userEntity.getEmail(),
            role: userEntity.getRole(),
            createdAt: new Date()
        });

        return newUser.save();
    };

    return {
        findUserByProperty,
        countAll,
        findById,
        add
    };
}
