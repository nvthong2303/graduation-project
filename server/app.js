import express from 'express';
import mongoose from 'mongoose';
import routes from "./frameworks/webserver/routes";
import serverConfig from './frameworks/webserver/server.js';
import expressConfig from './frameworks/webserver/express.js';
import config from './config/config.js';
import mongoDbConnection from './frameworks/database/mongoDB/connection';
// middlewares
import errorHandlingMiddleware from "./frameworks/webserver/middlewares/errorHandlingMiddleware";
import cors from 'cors';

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


// Add headers before the routes are defined
// app.use((req, res, next) => {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });
app.use(cors({ origin: '*' }));

// enabling CORS for some specific origins only.
const corsOptions = {
    // origin : ['http://localhost:3000', 'http://localhost:3003'],
}

// app.use(cors())
// api check server
app.get('/test', (req, res) => {
    res.send({
        message: "hello world"
    });
});

routes(app, express);

// error handling middleware
app.use(errorHandlingMiddleware);


// expose app
export default app;
