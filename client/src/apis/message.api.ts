import axios, {AxiosRequestConfig} from 'axios';
import {endpointVersion, serverUrl} from "../utils/config";

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