import axios, { AxiosRequestConfig } from "axios";
export const common = async () => {
    const token = ''
    let configs: AxiosRequestConfig = {
        url: `url/persons`,
        method: 'get',
        headers: {
            //   'content-type': 'application/vnd.api+json',
            Authorization: `Bearer ${token}`
        }
    };


    let response = await axios(configs);
    return response;
};
