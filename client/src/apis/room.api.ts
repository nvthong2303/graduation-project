import axios, {AxiosRequestConfig} from 'axios';
import {endpointVersion, serverUrl} from "../utils/config";

export const GetListRoomApi = async (params: object, token: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/room`,
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        params
    };

    let response = await axios(configs);
    return response;
}

export const GetDetailRoomById = async (id: string, token: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/room/${id}`,
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };

    let response = await axios(configs);
    return response;
}

export const GetDetailChatByEmail = async (email: string, token: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/room/user/${email}`,
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };

    let response = await axios(configs);
    return response;
}
