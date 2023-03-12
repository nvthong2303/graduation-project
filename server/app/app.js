import express from 'express';
import routes from "routes";
// other imports

// initialize express server
const app = express();

app.use("/", routes);

export default app;