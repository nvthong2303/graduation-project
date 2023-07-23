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

export const LikePostAPI = async (id: string, token: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/post/like/${id}`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };
    let response = await axios(configs);
    return response;
}

export const CommentPostAPI = async (comment: string, id: string, token: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/post/comment/${id}`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        data: {
            content: comment
        }
    };
    let response = await axios(configs);
    return response;
}

export const DeletePostAPI = async (id: string, token: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/post/${id}`,
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    };
    let response = await axios(configs);
    return response;
}

export const CreatePostAPI = async (post: any, token: string) => {
    const data = {
        title: post.title,
        content: post.content,
        categories: post.category
    }
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/post`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        data
    };
    let response = await axios(configs);
    return response;
}

export const UpdatePostAPI = async (id: string, post: any, token: string) => {
    const data = {
        content: post.content,
        categories: post.category
    }
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/post/${id}`,
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        data
    };
    let response = await axios(configs);
    return response;
}