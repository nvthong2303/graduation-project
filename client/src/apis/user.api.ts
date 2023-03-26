import axios, {AxiosRequestConfig} from 'axios';
import {endpointVersion, serverUrl} from "../utils/config";

export const RegisterApi = async (body: any) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/users/register`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body
    };

    let response = await axios(configs);
    return response;
}

export const LoginApi = async (body: any) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/users/login`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body
    };

    let response = await axios(configs);
    return response;
}



