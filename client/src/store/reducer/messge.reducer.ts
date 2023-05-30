import * as types from '../../constants/action';
import _ from 'lodash';

export interface message {
    id: string,
    content: string,
    sender: string,
    createdAt: Date,
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
                return dateB.getTime() - dateA.getTime();
            });
            newState.listMessage = _.uniqBy([...newState.listMessage, ...newListMsg], '_id');
            return newState;
        }
        default:
            return state;
    }
};