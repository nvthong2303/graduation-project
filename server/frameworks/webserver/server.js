export default function serverConfig(app, mongoose, serverInit, config) {
    function startServer() {
        app.listen(config.port, config.ip, () => {
            console.log('express server listening on %d, in %s mode', config.port, app.get('env'))
        });
    }

    return {
        startServer
    }
}