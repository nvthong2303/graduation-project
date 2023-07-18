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

export const CreateRoom = async (room: { title: string, description?: string, avatar: string, members: string[] }, token: string) => {
    const data = {
        title: room.title,
        description: room.description,
        members: room.members,
        avatar: room.avatar
    }
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/room/create`,
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

export const UpdateRoom = async (room: { id: string, title: string, description?: string, avatar: string }, token: string) => {
    const data = {
        title: room.title,
        description: room.description,
        avatar: room.avatar
    }
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/room/${room.id}`,
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

export const DeleteRoom = async (id: string, token: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/room/${id}`,
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    };

    let response = await axios(configs);
    return response;
}

export const AddMembersRoom = async (members: string[], roomId: string, token: string) => {
    const data = {
        members: members
    }
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/room/add-members/${roomId}`,
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

export const RemoveMembersRoom = async (members: string[], roomId: string, token: string) => {
    const data = {
        members: members
    }
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/room/delete-members/${roomId}`,
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

export const OutRoom = async (roomId: string, token: string) => {
    let configs: AxiosRequestConfig = {
        url: `${serverUrl}/${endpointVersion}/room/out/${roomId}`,
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };

    let response = await axios(configs);
    return response;
}