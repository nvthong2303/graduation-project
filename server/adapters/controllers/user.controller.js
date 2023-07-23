import {
    UseCaseAddUser,
    UseCaseFindById,
    UseCaseCountAll,
    UseCaseFindUserByProperty,
    UseCaseLogin,
    UseCaseGetListUserByEmails,
    UseCaseChangePassword,
    UseCaseForgetPassword
} from "../../applications/use_case/user_usecase";

export default function userController(
    userDbRepository,
    userDbRepositoryImpl,
    authServiceInterface,
    authServiceImpl,
    mailServiceInterface,
    mailServiceImpl
) {
    const dbRepository = userDbRepository(userDbRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
    const mailService = mailServiceInterface(mailServiceImpl());

    const ControllerFetchUsersByProperty = (req, res, next) => {
        const params = {};
        const response = {};

        // Dynamically created query params based on endpoint params
        for (const key in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, key)) {
                params[key] = req.query[key]
            }
        }

        UseCaseFindUserByProperty(params, dbRepository)
            .then((users) => {
                response.data = users.filter(el => el.email !== req.user.email);
                return res.json(response);
            })
            .catch((error) => next(error));
    }

    const ControllerFetchUserById = (req, res, next) => {
        UseCaseFindById(req.params.id, dbRepository)
            .then((user) => {
                res.json(user)
            })
            .catch((error) => next(error));
    }

    const ControllerRegister = (req, res, next) => {
        const { username, password, email, role, createdAt } = req.body;
        UseCaseAddUser(
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

    const ControllerLoginUser = (req, res, next) => {
        const { email, password } = req.body;
        UseCaseLogin(email, password, dbRepository, authService)
            .then((user) => res.json(user))
            .catch((err) => next(err))
    };

    const ControllerFetchListUserByEmails = (req, res, next) => {
        const emails = req.query.emails.split(',').filter(el => el !== req.user.email)
        UseCaseGetListUserByEmails(emails, dbRepository)
            .then((users) => {
                    return res.json({
                        users
                    })
                }
            )
            .catch((err) => next(err))
    }

    const ControllerChangePassword = (req, res, next) => {
        UseCaseChangePassword(req.body.password, req.user.email, authService, dbRepository)
            .then((u) => {
                console.log(u)
                return res.json({
                    message: 'Change password success'
                })
            })
            .catch((err) => next(err))
    }

    const ControllerResetPassword = (req, res, next) => {
        if (req.body.email) {
            UseCaseForgetPassword(req.body.email, dbRepository, authService, mailService )
                .then(() => {
                    return res.json({
                        message: 'Check your email for a new password'
                    })
                })
                .catch((err) => next(err))
        } else {
            return res.status(500).json({
                message: 'Email is require'
            })
        }
    }

    return {
        ControllerFetchUsersByProperty,
        ControllerFetchUserById,
        ControllerRegister,
        ControllerLoginUser,
        ControllerFetchListUserByEmails,
        ControllerChangePassword,
        ControllerResetPassword
    }
}



