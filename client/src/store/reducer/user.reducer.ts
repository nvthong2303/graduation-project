import * as types from '../../constants/action';
import _ from 'lodash';
import {LOGOUT_SUCCESS} from "../../constants/action";

const initialState = {
    userInfo: {
        email: '' as string || null,
        token: '' as string || null,
        fullName: '' as string || null,
        userId: '' as string || null,
        role: '' as string || null
    }
}

export const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_INFO_USER_SUCCESS: {
            let { data } = action.payload;
            let newState = _.cloneDeep(state);
            newState.userInfo = {
                email: action.payload.data.user.email,
                token: action.payload.data.token,
                fullName: action.payload.data.user.username,
                userId: action.payload.data.user._id,
                role: action.payload.data.user.role,
            };
            return newState;
        }

        case types.LOGOUT_SUCCESS: {
            let newState = _.cloneDeep(state);
            newState.userInfo = {
                email: null,
                token: null,
                fullName: null,
                userId: null,
                role: null,
            };
            return newState;
        }
        default:
            return state;
    }
};
