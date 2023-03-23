import UserModel from "../models/user.model";

function omit(obj, ...props) {
    const result = { ...props};
    props.forEach((prop) => delete result[prop]);
    return result
}

export default function userRepositoryMongoDB() {
    const findByProperty = (params) => UserModel.find(omit(params, 'page', 'perPage'))
        .skip(params.perPage * params.page - params.perPage)
        .limit(params.perPage);

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
        return newUser.save()
    }

    const deleteById = (id) => UserModel.findByIdAndDelete(id)

    return {
        findByProperty,
        countAll,
        findById,
        add,
        deleteById
    }
}
