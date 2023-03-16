import * as types from '../../constants/action';
import _ from 'lodash';

const initialState = {
    userInfo: {
        email: 'nvthong2303gmail.com',
        token: '1234567890',
        fullName: 'Nguyen Van Thong',
        userId: '2303'
    }
}

export const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_INFO_USER_SUCCESS: {
            let { data } = action.payload;
            let newState = _.cloneDeep(state);
            newState.userInfo = _.cloneDeep(data);
            return newState;
        }
        default:
            return state;
    }
};
