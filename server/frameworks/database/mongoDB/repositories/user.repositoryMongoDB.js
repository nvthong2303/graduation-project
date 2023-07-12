import UserModel from '../models/user.model';

// move it to a proper place
function omit(obj, ...props) {
    const result = { ...obj };
    props.forEach((prop) => delete result[prop]);
    return result;
}

export default function userRepositoryMongoDB() {
    const findUserByProperty = (params) => {
        console.log(params)
        const { email, username } = omit(params, 'page', 'perPage')
        if (email) {
            return UserModel
                .find({ email: new RegExp(email, 'i') })
        } else {
            return UserModel
                .find({ username: new RegExp(username, 'i') })
                .select({ password: 0 })
        }
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
