export default function userRepository(repository) {
    const findUserByProperty = (params) => repository.findUserByProperty(params);

    const countAll = (params) => repository.countAll(params);

    const findById = (id) => repository.findById(id);

    const add = (user) => repository.add(user);

    const deleteById = (id) => repository.deleteById(id);

    const getListUserByEmails = (emails) => repository.getListUserByProperties(emails)

    return {
        findUserByProperty,
        countAll,
        findById,
        add,
        deleteById,
        getListUserByEmails
    }
}
