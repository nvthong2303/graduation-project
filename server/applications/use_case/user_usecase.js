import user from '../../src/entities/user';

function addUser(
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

    return userRepository.findUserByProperty({ username })
        .then((userWithUserName) => {
            if (userWithUserName.length) {
                throw new Error(`User with username: ${username} already exist`);
            }
            return userRepository.findUserByProperty({ email });
    })
        .then((userWithEmail) => {
            if (userWithEmail.length) {
                throw new Error(`User with email: ${email} already exist`);
            }
            return userRepository.add(newUser)
        })
}

function countAll(params, userRepository) {
    return userRepository.countAll(params)
}

function findById(id, userRepository) {
    return userRepository.findById(id)
}

function findUserByProperty(params, userRepository) {
    return userRepository.findUserByProperty(params)
}

function login(email, password, userRepository, authService) {
    if (!email || !password) {
        const error = new Error('email and password fields cannot be empty');
        error.statusCode = 401;
        throw error;
    }
    return userRepository.findUserByProperty({ email })
        .then((user) => {
            if(!user.length) {
                const error = new Error('Invalid email or password');
                error.statusCode = 401;
                throw error;
            }

            const isMatch = authService.compare(password, user[0].password);
            if (!isMatch) {
                const error = new Error('Invalid email or password');
                error.statusCode = 401;
                throw error;
            }
            const payload = {
                user: {
                    id: user[0].id,
                    email: user[0].email
                }
            }
            const token = authService.generateToken(payload)
          return { token, user: user[0] }
        })
}

export {
    addUser,
    countAll,
    findById,
    findUserByProperty,
    login
}