import * as types from '../../constants/action';
import _ from 'lodash';

export interface room {
    title: string,
    type: 'room' | 'user',
    roomId: string,
    ownerId: string,
    member?: any[],
    timestamp: number

}

const initialState = {
    currentRoom: null,
    listRoom: [] as room[]
}

export const roomReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_LIST_ROOM_SUCCESS: {
            let { data } = action.payload;
            let newState = _.cloneDeep(state);
            newState.listRoom = _.cloneDeep(data);
            return newState;
        }

        case types.GET_DETAIL_ROOM_SUCCESS: {
            let { data } = action.payload;
            let newState = _.cloneDeep(state);
            newState.currentRoom = _.cloneDeep(data);
            return newState;
        }

        case types.SELECT_ROOM: {
            let { data } = action.payload;
            const newState = _.cloneDeep(state)
            newState.currentRoom = _.cloneDeep(data);
            return newState;
        }
        default:
            return state;
    }
};
