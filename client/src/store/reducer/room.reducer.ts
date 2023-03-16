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
    currentRoom: {
        title: 'Lớp Toán 10A1',
        type: 'room',
        member: [
            '123',
            '234',
            '345'
        ],
        ownerId: '123456',
        roomId: '12333456'
    } as room,
    listRoom: [
        {
            title: 'Lớp Văn 10A1',
            type: 'room',
            roomId: '123456',
            timestamp: 1678987228
        },
        {
            title: 'Lớp Toán 10A1',
            type: 'room',
            roomId: '123456',
            timestamp: 1678987227
        },
        {
            title: 'Lớp Anh 10A1',
            type: 'room',
            roomId: '123456',
            timestamp: 1678987226
        },
        {
            title: 'Lớp Lịch sử 10A1',
            type: 'room',
            roomId: '123456',
            timestamp: 1678987225
        },
        {
            title: 'Cristiano Ronaldo',
            type: 'user',
            roomId: '123456',
            timestamp: 1678987224
        },
        {
            title: 'Lionel Message',
            type: 'user',
            roomId: '123456',
            timestamp: 1678987128
        },
        {
            title: 'Bruno Fernandes',
            type: 'user',
            roomId: '123456',
            timestamp: 1678981228
        },
        {
            title: 'Marcus Rashford',
            type: 'user',
            roomId: '123456',
            timestamp: 1678984328
        },
        {
            title: 'Masson Greenwood',
            type: 'user',
            roomId: '123456',
            timestamp: 1678967228
        },
        {
            title: 'Lớp Văn 10A1',
            type: 'room',
            roomId: '123456',
            timestamp: 1678981128
        },
        {
            title: 'Lớp Toán 10A1',
            type: 'room',
            roomId: '123456',
            timestamp: 1678988828
        },
        {
            title: 'Lớp Anh 10A1',
            type: 'room',
            roomId: '123456',
            timestamp: 1678987998
        },
        {
            title: 'Lớp Lịch sử 10A1',
            type: 'room',
            roomId: '123456',
            timestamp: 1678997228
        },
        {
            title: 'Cristiano Ronaldo',
            type: 'user',
            roomId: '123456',
            timestamp: 1678933228
        },
        {
            title: 'Lionel Message',
            type: 'user',
            roomId: '123456',
            timestamp: 1678987448
        },
        {
            title: 'Bruno Fernandes',
            type: 'user',
            roomId: '123456',
            timestamp: 1678981118
        },
        {
            title: 'Marcus Rashford',
            type: 'user',
            roomId: '123456',
            timestamp: 1678923428
        },
        {
            title: 'Masson Greenwood',
            type: 'user',
            roomId: '123456',
            timestamp: 1678456228
        },
        {
            title: 'Lớp Văn 10A1',
            type: 'room',
            roomId: '123456',
            timestamp: 1678678228
        },
        {
            title: 'Lớp Toán 10A1',
            type: 'room',
            roomId: '123456',
            timestamp: 167899998
        },
        {
            title: 'Lớp Anh 10A1',
            type: 'room',
            roomId: '123456',
            timestamp: 1678345228
        },
        {
            title: 'Lớp Lịch sử 10A1',
            type: 'room',
            roomId: '123456',
            timestamp: 1678856228
        },
        {
            title: 'Cristiano Ronaldo',
            type: 'user',
            roomId: '123456',
            timestamp: 16789823428
        },
        {
            title: 'Lionel Message',
            type: 'user',
            roomId: '123456',
            timestamp: 1678931228
        },
        {
            title: 'Bruno Fernandes',
            type: 'user',
            roomId: '123456',
            timestamp: 1678087228
        },
        {
            title: 'Marcus Rashford',
            type: 'user',
            roomId: '123456',
            timestamp: 1678980328
        },
        {
            title: 'Masson Greenwood',
            type: 'user',
            roomId: '123456',
            timestamp: 1678900228
        },
    ] as room[]
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
