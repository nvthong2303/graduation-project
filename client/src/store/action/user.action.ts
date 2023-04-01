import * as types from '../../constants/action';

export const getInfoUserReq = () => ({
    type: types.GET_INFO_USER_REQ
});

export const getInfoUserSuccess = (data: Object) => ({
    type: types.GET_INFO_USER_SUCCESS,
    payload: {
        data
    }
});
export const logoutSuccess = () => ({
    type: types.LOGOUT_SUCCESS,
    payload: {}
});

