import express from 'express';
import mongoose from 'mongoose';
import redis from 'redis';
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
    // useCreateIndex: true,
    useNewUrlParser: true,
    // autoReconnect: true,
    // reconnectTries: Number.MAX_VALUE,
    // reconnectInterval: 10000,
    keepAlive: 120,
    connectTimeoutMS: 1000
}).connectToMongo();

// error handling middleware
app.use(errorHandlingMiddleware);

// expose app
export default app;