import {addUser, findById, countAll, findUserByProperty, login} from "../../applications/use_case/user_usecase";

export default function userController(
    userDbRepository,
    userDbRepositoryImpl,
    authServiceInterface,
    authServiceImpl
) {
    const dbRepository = userDbRepository(userDbRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());

    const fetchUsersByProperty = (req, res, next) => {
        const params = {};
        const response = {};

        // Dynamically created query params based on endpoint params
        for (const key in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, key)) {
                params[key] = req.query[key]
            }
        }

        // predefined query params (apart from dynamically) for pagination
        params.page = params.page ? parseInt(params.page, 10) : 1;
        params.perPage = params.perPage ? parseInt(params.perPage, 10) : 20;

        findUserByProperty(params, dbRepository)
            .then((users) => {
                response.users = users;
                return countAll(params, dbRepository);
            })
            .then((totalItems) => {
                response.totalItems = totalItems;
                response.totalPages = Math.ceil(totalItems / params.perPage);
                response.perPage = params.perPage;
                return res.json(response)
            })
            .catch((error) => next(error));
    }

    const fetchUserById = (req, res, next) => {
        findById(req.params.id, dbRepository)
            .then((user) => {
                res.json(user)
            })
            .catch((error) => next(error));
    }

    const register = (req, res, next) => {
        const { username, password, email, role, createdAt } = req.body;
        addUser(
            username,
            password,
            email,
            role,
            createdAt,
            dbRepository,
            authService
        )
            .then((user) => res.json(user))
            .catch((error) => next(error));
    };

    const loginUser = (req, res, next) => {
        const { email, password } = req.body;
        login(email, password, dbRepository, authService)
            .then((user) => res.json(user))
            .catch((err) => next(err))
    };

    return {
        fetchUsersByProperty,
        fetchUserById,
        register,
        loginUser
    }
}



