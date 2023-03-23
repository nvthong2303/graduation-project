import authServiceImpl from '../../services/auth.services';
import authServiceInterface from '../../../applications/services/authService';

export default function authMiddleware(req, res, next) {
    // get token from header
    const token = req.header('Authorization');
    const authService = authServiceInterface(authServiceImpl());

    if (!token) {
        throw new Error('No access token');
    }

    if (token.split(' ')[0] !== 'Bearer') {
        throw new Error('Invalid access token format');
    }

    try {
        const decoded = authService.verify(token.split(' ')[1]);
        req.user = decoded.user;
        next();
    } catch (e) {
        throw new Error('Token is not valid');
    }
}