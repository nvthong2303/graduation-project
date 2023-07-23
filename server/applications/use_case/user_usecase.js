import user from '../../src/entities/user';

function UseCaseAddUser(
    username,
    password,
    email,
    role,
    createdAt,
    userRepository,
    authService
) {
    if (!username || !password || !email) {
        throw new Error('username, password and email cannot be empty')
    }

    const newUser = user(
        username,
        authService.encryptPassword(password),
        email,
        role,
        createdAt
    );

    return userRepository.findUserByPropertyRepo({ username })
        .then((userWithUserName) => {
            if (userWithUserName.length) {
                throw new Error(`User with username: ${username} already exist`);
            }
            return userRepository.findUserByPropertyRepo({ email });
    })
        .then((userWithEmail) => {
            if (userWithEmail.length) {
                throw new Error(`User with email: ${email} already exist`);
            }
            return userRepository.addRepo(newUser)
        })
}

function UseCaseChangePassword(password, email, authService, userRepository) {
    if (password.length < 6) {
        throw new Error('Password cannot be shorter than 6 characters')
    }

    const hashPw = authService.encryptPassword(password)

    return userRepository.findUserByEmailRepo(email)
        .then((user) => {
            return userRepository.changePasswordRepo(email, hashPw)
        })
}

function UseCaseCountAll(params, userRepository) {
    return userRepository.countAllRepo(params)
}

function UseCaseFindById(id, userRepository) {
    return userRepository.findByIdRepo(id)
}

function UseCaseFindUserByProperty(params, userRepository) {
    return userRepository.findUserByPropertyRepo(params)
}

function UseCaseLogin(email, password, userRepository, authService) {
    if (!email || !password) {
        const error = new Error('email and password fields cannot be empty');
        error.statusCode = 401;
        throw error;
    }
    return userRepository.findUserByEmailRepo(email)
        .then((user) => {
            if(!user) {
                const error = new Error('Invalid email or password');
                error.statusCode = 401;
                throw error;
            }

            const isMatch = authService.compare(password, user.password);
            if (!isMatch) {
                const error = new Error('Invalid email or password');
                error.statusCode = 401;
                throw error;
            }
            const payload = {
                user: {
                    id: user.id,
                    email: user.email
                }
            }
            const token = authService.generateToken(payload)
          return { token, user }
        })
}

const UseCaseGetListUserByEmails = (emails, userRepository) => {
    return userRepository.getListUserByEmailsRepo(emails)
}

const UseCaseForgetPassword = (email, userRepository, authService, mailService) => {
    const newPassword = makePassword(7)
    const newHashPw = authService.encryptPassword(newPassword)

    return userRepository.findUserByEmailRepo(email)
        .then((user) => {
            console.log(email, newHashPw, newPassword)
            return userRepository.changePasswordRepo(email, newHashPw)
        })
        .then(() => {
            console.log(mailService)
            return mailService.sendMailForgetPassword(newPassword, email)
        })
}

export {
    UseCaseAddUser,
    UseCaseCountAll,
    UseCaseFindById,
    UseCaseFindUserByProperty,
    UseCaseLogin,
    UseCaseGetListUserByEmails,
    UseCaseChangePassword,
    UseCaseForgetPassword,
}


function makePassword(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}