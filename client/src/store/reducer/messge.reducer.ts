import * as types from '../../constants/action';
import _ from 'lodash';

export interface message {
    _id?: string,
    content: string,
    sender: string,
    senderName: string,
    createdAt: string,
    room: string,
}

const initialState = {
    listMessage : [] as message[]
}

export const messageReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_LIST_MESSAGE_SUCCESS: {
            let { data } = action.payload;
            let newState = _.cloneDeep(state);
            const newListMsg = _.cloneDeep(data)
            data.sort(function(a: message, b: message) {
                var dateA = new Date(a.createdAt);
                var dateB = new Date(b.createdAt);
                return dateA.getTime() - dateB.getTime();
            });
            newState.listMessage = _.uniqBy([...newState.listMessage, ...newListMsg], '_id');
            return newState;
        }

        case types.SEND_MESSAGE_SUCCESS: {
            let { data } = action.payload;
            let newState = _.cloneDeep(state);
            newState.listMessage = [data, ...newState.listMessage]
            return newState
        }

        case types.RECEIVE_MESSAGE_SUCCESS: {
            let { data } = action.payload;
            let newState = _.cloneDeep(state);
            newState.listMessage =  _.uniqBy([data, ...newState.listMessage], 'createdAt');
            return newState
        }

        case types.CLEAR_LIST_MESSAGE: {
            let newState = _.cloneDeep(state);
            newState.listMessage = [];
            return newState
        }

        default:
            return state;
    }
};
