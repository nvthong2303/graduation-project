import express from 'express';
import mongoose from 'mongoose';
import routes from "./frameworks/webserver/routes";
import serverConfig from './frameworks/webserver/server.js';
import expressConfig from './frameworks/webserver/express.js';
import config from './config/config.js';
import mongoDbConnection from './frameworks/database/mongoDB/connection';
// middlewares
import errorHandlingMiddleware from "./frameworks/webserver/middlewares/errorHandlingMiddleware";
import cors  from 'cors';

const app = express();
const server = require('http').createServer(app)

// express.js configuration (middlewares etc. )
expressConfig(app);

// server configuration (middlewares etc)
serverConfig(app, mongoose, server, config).startServer()

// db configuration and connection create
mongoDbConnection(mongoose, config, {
    autoIndex: false,
    useNewUrlParser: true,
    keepAlive: 120,
    connectTimeoutMS: 1000,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).connectToMongo();

// enabling CORS for some specific origins only.
let corsOptions = {
    // origin : ['http://localhost:3000', 'http://localhost:3003'],
}

app.use(cors(corsOptions))
// api check server
app.get('/test', (req, res) =>{
    res.send({
        message: "hello world"
    });
});

routes(app, express);

// error handling middleware
app.use(errorHandlingMiddleware);

// expose app
export default app;
