import * as types from '../../constants/action';

export const getListRoomReq = () => ({
    type: types.GET_LIST_ROOM_REQ
});

export const getListRoomSuccess = (data: Object) => ({
    type: types.GET_LIST_ROOM_SUCCESS,
    payload: {
        data
    }
});

export const getDetailRoomReq = () => ({
    type: types.GET_DETAIL_ROOM_REQ
});

export const getDetailRoomSuccess = (data: Object) => ({
    type: types.GET_DETAIL_ROOM_SUCCESS,
    payload: {
        data
    }
});

export const selectRoom = (data: Object) => ({
    type: types.SELECT_ROOM,
    payload: {
        data
    }
});
