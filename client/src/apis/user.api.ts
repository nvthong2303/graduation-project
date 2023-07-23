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

export const GetInfoApi = async (id: string, token: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/users/${id}`,
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };

    let response = await axios(configs);
    return response;
}

export const SearchUserByUsername = async (keyword: string, token: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/users?username=${keyword}`,
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };

    let response = await axios(configs);
    return response;
}

export const GetListUserByEmails = async (emails: string, token: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/users/list?emails=${emails}`,
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };

    let response = await axios(configs);
    return response;
}

export const ForgetPasswordApi = async (email: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/users/forget-password`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            email
        }
    };

    let response = await axios(configs);
    return response;
}

export const ChangePasswordApi = async (password: string, token: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/users/password`,
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        data: {
            password
        }
    };

    let response = await axios(configs);
    return response;
}