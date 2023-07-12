export default function serverConfig(app, mongoose, serverInit, config) {
    function startServer() {
        app.listen(config.port, config.ip, () => {
            console.log('express server is running on ', config.port)
        });
    }

    return {
        startServer
    }
}