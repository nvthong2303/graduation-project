import express from 'express';
import mongoose from 'mongoose';
import routes from "./frameworks/webserver/routes";
import serverConfig from './frameworks/webserver/server.js';
import expressConfig from './frameworks/webserver/express.js';
import config from './config/config.js';
import mongoDbConnection from './frameworks/database/mongoDB/connection';
// middlewares
import errorHandlingMiddleware from "./frameworks/webserver/middlewares/errorHandlingMiddleware";

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
    useCreateIndex: true
}).connectToMongo();

// error handling middleware
app.use(errorHandlingMiddleware);

routes(app, express);

// expose app
export default app;