export default function user(username, password, email, role, createAt) {
    return {
        getUserName: () => username,
        getPassword: () => password,
        getEmail: () => email,
        getRole: () => role,
        getCreatedAt: () => createAt
    }
}