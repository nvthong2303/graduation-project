export default function userRepository(repository) {
    const findUserByPropertyRepo = (params) => repository.findUserByProperty(params);

    const countAllRepo = (params) => repository.countAll(params);

    const findByIdRepo = (id) => repository.findById(id);

    const addRepo = (user) => repository.add(user);

    const deleteByIdRepo = (id) => repository.deleteById(id);

    const getListUserByEmailsRepo = (emails) => repository.getListUserByProperties(emails)

    const changePasswordRepo = (email, password) => repository.updatePassword(email, password)

    const findUserByEmailRepo = (email) => repository.findUserByEmail(email)

    return {
        findUserByPropertyRepo,
        countAllRepo,
        findByIdRepo,
        addRepo,
        deleteByIdRepo,
        getListUserByEmailsRepo,
        changePasswordRepo,
        findUserByEmailRepo
    }
}
