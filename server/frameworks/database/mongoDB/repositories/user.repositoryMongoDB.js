import UserModel from '../models/user.model';

// move it to a proper place
function omit(obj, ...props) {
    const result = { ...obj };
    props.forEach((prop) => delete result[prop]);
    return result;
}

export default function userRepositoryMongoDB() {
    const findUserByProperty = (params) => {
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

    const findUserByEmail = (email) => UserModel.findOne({ email })

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

    const getListUserByProperties = async (emails) => {
        const users = await UserModel.find({
            email: {
                $in: emails
            }
        }).select({ password: 0, createdAt: 0 })
        return users
    }

    const updatePassword = async (email, password) => {
        return UserModel.findOneAndUpdate({
            email
        }, {
            password
        })
    }

    return {
        findUserByProperty,
        countAll,
        findById,
        add,
        getListUserByProperties,
        updatePassword,
        findUserByEmail
    };
}
