import {addUser, findById, countAll, findUserByProperty, login, getListUserByEmails} from "../../applications/use_case/user_usecase";

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

        findUserByProperty(params, dbRepository)
            .then((users) => {
                response.data = users.filter(el => el.email !== req.user.email);
                return res.json(response);
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

    const fetchListUserByEmails = (req, res, next) => {
        const emails = req.query.emails.split(',').filter(el => el !== req.user.email)
        getListUserByEmails(emails, dbRepository)
            .then((users) => {
                    return res.json({
                        users
                    })
                }
            )
            .catch((err) => next(err))
    }

    return {
        fetchUsersByProperty,
        fetchUserById,
        register,
        loginUser,
        fetchListUserByEmails
    }
}



