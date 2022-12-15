import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import config from "../config";

class LocalAgentRequest {
    private _axios: AxiosInstance;
    constructor() {
        this._axios = axios.create({
            baseURL: config.api,
            headers: {
                "X-Application-Key": config.apikey
            },
        })
    }

    /**
     * 
     * @param path 
     * @param payload 
     * @param config
     * @returns 
     */
    public async post<T>(path: string, payload: T, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        return await this._axios.post(path, payload, config);
    }

    /**
     * 
     * @param path 
     * @param params 
     * @param config
     * @returns 
     */
    public async get<T>(path: string, params?: T, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        let queryString = '';
        if (params && Object.keys(params).length > 0) {
            queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        }
        return await this._axios.get(`${path}?${queryString}`, config);
    }

    /**
     * 
     * @param path 
     * @param payload 
     * @param config
     * @returns 
     */
    public async patch<T>(path: string, payload: T, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        return await this._axios.patch(path, payload, config);
    }
}

export default LocalAgentRequest