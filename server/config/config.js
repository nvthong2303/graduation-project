export default {
    port: process.env.PORT || 3001,
    ip: process.env.HOST || '127.0.0.1',
    mongo: {
        uri: process.env.MONGO_URL || 'mongodb://localhost:27017/graduation-project'
    },
    redis: {
        uri: process.env.REDIS_URL || 'redis://localhost:6379'
    },
    jwtSecret: process.env.JWT_SECRET || 'nvthong2303'
}