export default function connection(mongoose, config, options) {
    function connectToMongo() {
        mongoose
            .connect(config.mongo.uri, options)
            .then(
                () => {},
                (err) => {
                    console.log('mongoDB error', err)
                }
            )
            .catch((err) => {
                console.log('ERR :', err)
            });
    }

    // mongoose.connection.on('connected', () => {
    //     console.info('Connected to MongoDB')
    // });
    //
    // mongoose.connection.on('reconnected', () => {
    //     console.info('MongoDB reconnected')
    // });
    //
    // mongoose.connection.on('error', (error) => {
    //     console.error(`Error in MongoDB connection: ${error}`)
    // })
    //
    // mongoose.connection.on('disconnected', () => {
    //     console.error(`MongoDB disconnected !!! Reconnected in ${options.reconnectInterval / 1000} s....`);
    //     setTimeout(() => connectToMongo(), options.reconnectInterval)
    // })

    return {
        connectToMongo
    }
}
