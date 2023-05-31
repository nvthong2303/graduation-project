import axios, {AxiosRequestConfig} from 'axios';
import {endpointVersion, serverUrl} from "../utils/config";
import {message} from "../store/reducer/messge.reducer";

export const GetListMessageByRoomIdApi = async (id: string, token: string, skip: number, limit: number) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/message?room=${id}&skip=${skip}&limit=${limit}`,
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    };
    let response = await axios(configs);
    return response;
}

export const SendMessage = async (message: message, token: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/message`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        data: message
    };

    let response = await axios(configs);
    return response;
}