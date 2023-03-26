import userRouter from "./user";
import roomRouter from "./room";

export default function routes(app, express) {
    app.use('/api/v1/users', userRouter(express));
    app.use('/api/v1/room', roomRouter(express));
}
