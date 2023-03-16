import { combineReducers } from 'redux';
import { userReducer } from "./user.reducer";
import { roomReducer } from "./room.reducer";
import {messageReducer} from "./messge.reducer";

const rootReducer = combineReducers({
    userReducer,
    roomReducer,
    messageReducer
})

export default rootReducer;



