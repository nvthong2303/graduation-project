import axios, {AxiosRequestConfig} from 'axios';
import {endpointVersion, serverUrl} from "../utils/config";

export const GetListCategoryApi = async (token: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/post/category`,
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    };
    let response = await axios(configs);
    return response;
}

export const GetListPostByOption = async (options: any, token: string) => {
    const params = {
        keyword: options.keyword,
        categories: options.categories,
        limit: options.limit,
        skip: options.skip
    }
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/post`,
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