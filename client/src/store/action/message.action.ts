import * as types from '../../constants/action';

export const getListMessageReq = () => ({
    type: types.GET_LIST_MESSAGE_REQ
});

export const getListMessageSuccess = (data: Object) => ({
    type: types.GET_LIST_MESSAGE_SUCCESS,
    payload: {
        data
    }
});

export const sendMessageSuccess = (data: Object) => ({
    type: types.SEND_MESSAGE_SUCCESS,
    payload: {
        data
    }
});

export const receiveMessageSuccess = (data: Object) => ({
    type: types.RECEIVE_MESSAGE_SUCCESS,
    payload: {
        data
    }
})

export const clearListMessage = () => ({
    type: types.CLEAR_LIST_MESSAGE
});
