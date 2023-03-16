import * as types from '../../constants/action';
import _ from 'lodash';

interface message {
    contentMessage: string,
    senderId: string,
    timestamp: number,
    roomId: string,
}

const initialState = {
    listMessage: [
        {
            contentMessage: 'toi la thong',
            timestamp: 1,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'rat vui duoc lam quen',
            timestamp: 2,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'oh !, xin chao',
            timestamp: 4,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'toi co the giup gi duoc cho ban',
            timestamp: 5,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'ban co phai la fan bong da ko ?',
            timestamp: 6,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'toi khong, nhung toi co hieu biet ve bong da',
            timestamp: 7,
            senderId: '1234',
            roomId: '2704'
        },{
            contentMessage: 'ban can thong tin gi ?',
            timestamp: 8,
            senderId: '1234',
            roomId: '2704'
        },{
            contentMessage: 'toi da bo lo tran dau giua manchester united va arsenal, day la mot tran dau hay nhung toi da bo lo no, toi co the' +
                'xem lai o dau ? ban co the chi cho toi duoc khong ? boi vi toi la mot phan cua manchester united, toi yeu doi bong nay va toi ham mo' +
                'cau thu marcus rashford va cau thu bruno fernades, casemiro cung rat tuyet.',
            timestamp: 9,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'that xin loi, nhung toi khong co thong tin.',
            timestamp: 10,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'uhm, khoan da',
            timestamp: 11,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'sao the ??',
            timestamp: 12,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'toi nghi la toi co the chi cho ban 1 vai goi y, ban co the tim tren do',
            timestamp: 13,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'ohhh, dieu nay that tot, cam on ban rat nhieu',
            timestamp: 14,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: '....',
            timestamp: 15,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'hay truy cap thu 90p.link hoac xoilac.tv nhe',
            timestamp: 16,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'hoac binhluan.net, youtube.com, radio.org',
            timestamp: 17,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'toi la thong',
            timestamp: 18,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'rat vui duoc lam quen',
            timestamp: 19,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'oh !, xin chao',
            timestamp: 20,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'toi co the giup gi duoc cho ban',
            timestamp: 21,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'ban co phai la fan bong da ko ?',
            timestamp: 22,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'toi khong, nhung toi co hieu biet ve bong da',
            timestamp: 23,
            senderId: '1234',
            roomId: '2704'
        },{
            contentMessage: 'ban can thong tin gi ?',
            timestamp: 24,
            senderId: '1234',
            roomId: '2704'
        },{
            contentMessage: 'toi da bo lo tran dau giua manchester united va arsenal, day la mot tran dau hay nhung toi da bo lo no, toi co the' +
                'xem lai o dau ? ban co the chi cho toi duoc khong ? boi vi toi la mot phan cua manchester united, toi yeu doi bong nay va toi ham mo' +
                'cau thu marcus rashford va cau thu bruno fernades, casemiro cung rat tuyet.',
            timestamp: 25,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'that xin loi, nhung toi khong co thong tin.',
            timestamp: 26,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'uhm, khoan da',
            timestamp: 27,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'sao the ??',
            timestamp: 28,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'toi nghi la toi co the chi cho ban 1 vai goi y, ban co the tim tren do',
            timestamp: 29,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'ohhh, dieu nay that tot, cam on ban rat nhieu',
            timestamp: 31,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: '....',
            timestamp: 32,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'hay truy cap thu 90p.link hoac xoilac.tv nhe',
            timestamp: 33,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'hoac binhluan.net, youtube.com, radio.org',
            timestamp: 34,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'toi la thong',
            timestamp: 35,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'rat vui duoc lam quen',
            timestamp: 36,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'oh !, xin chao',
            timestamp: 37,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'toi co the giup gi duoc cho ban',
            timestamp: 38,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'ban co phai la fan bong da ko ?',
            timestamp: 39,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'toi khong, nhung toi co hieu biet ve bong da',
            timestamp: 40,
            senderId: '1234',
            roomId: '2704'
        },{
            contentMessage: 'ban can thong tin gi ?',
            timestamp: 41,
            senderId: '1234',
            roomId: '2704'
        },{
            contentMessage: 'toi da bo lo tran dau giua manchester united va arsenal, day la mot tran dau hay nhung toi da bo lo no, toi co the' +
                'xem lai o dau ? ban co the chi cho toi duoc khong ? boi vi toi la mot phan cua manchester united, toi yeu doi bong nay va toi ham mo' +
                'cau thu marcus rashford va cau thu bruno fernades, casemiro cung rat tuyet.',
            timestamp: 42,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'that xin loi, nhung toi khong co thong tin.',
            timestamp: 43,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'uhm, khoan da',
            timestamp: 44,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'sao the ??',
            timestamp: 45,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'toi nghi la toi co the chi cho ban 1 vai goi y, ban co the tim tren do',
            timestamp: 46,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'ohhh, dieu nay that tot, cam on ban rat nhieu',
            timestamp: 47,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: '....',
            timestamp: 48,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'hay truy cap thu 90p.link hoac xoilac.tv nhe',
            timestamp: 49,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'hoac binhluan.net, youtube.com, radio.org',
            timestamp: 50,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'toi la thong',
            timestamp: 51,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'rat vui duoc lam quen',
            timestamp: 52,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'oh !, xin chao',
            timestamp: 54,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'toi co the giup gi duoc cho ban',
            timestamp: 55,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'ban co phai la fan bong da ko ?',
            timestamp: 56,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'toi khong, nhung toi co hieu biet ve bong da',
            timestamp: 57,
            senderId: '1234',
            roomId: '2704'
        },{
            contentMessage: 'ban can thong tin gi ?',
            timestamp: 58,
            senderId: '1234',
            roomId: '2704'
        },{
            contentMessage: 'toi da bo lo tran dau giua manchester united va arsenal, day la mot tran dau hay nhung toi da bo lo no, toi co the' +
                'xem lai o dau ? ban co the chi cho toi duoc khong ? boi vi toi la mot phan cua manchester united, toi yeu doi bong nay va toi ham mo' +
                'cau thu marcus rashford va cau thu bruno fernades, casemiro cung rat tuyet.',
            timestamp: 59,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'that xin loi, nhung toi khong co thong tin.',
            timestamp: 60,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'uhm, khoan da',
            timestamp: 61,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'sao the ??',
            timestamp: 62,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: 'toi nghi la toi co the chi cho ban 1 vai goi y, ban co the tim tren do',
            timestamp: 63,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'ohhh, dieu nay that tot, cam on ban rat nhieu',
            timestamp: 64,
            senderId: '2303',
            roomId: '2704'
        },
        {
            contentMessage: '....',
            timestamp: 65,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'hay truy cap thu 90p.link hoac xoilac.tv nhe',
            timestamp: 66,
            senderId: '1234',
            roomId: '2704'
        },
        {
            contentMessage: 'hoac binhluan.net, youtube.com, radio.org',
            timestamp: 67,
            senderId: '1234',
            roomId: '2704'
        },
    ] as message[]
}

export const messageReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_LIST_MESSAGE_SUCCESS: {
            let { data } = action.payload;
            let newState = _.cloneDeep(state);
            newState.listMessage = _.cloneDeep(data);
            return newState;
        }
        default:
            return state;
    }
};
