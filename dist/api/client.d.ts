import { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { ApiModelsResponse } from '../models/types';
export interface ApiClientOptions {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
}
export declare class ApiClient {
    private axios;
    private defaultHeaders;
    /**
     * Creates a new ApiClient instance
     *
     * @param options - Configuration options for the API client
     * @param options.baseURL - Base URL for API requests (default: https://api.synthetic.new)
     * @param options.timeout - Request timeout in milliseconds (default: 30000)
     * @param options.headers - Additional headers to include in all requests
     */
    constructor(options?: ApiClientOptions);
    private setupInterceptors;
    /**
     * Sets the API key for authorization
     *
     * @param apiKey - The API key to use for authentication
     */
    setApiKey(apiKey: string): void;
    /**
     * Sets the base URL for all API requests
     *
     * @param baseURL - The new base URL to use
     */
    setBaseURL(baseURL: string): void;
    /**
     * Performs an HTTP GET request
     *
     * @template T - Type of the response data
     * @param url - The URL to request
     * @param config - Optional Axios configuration
     * @returns Promise with the Axios response
     * @throws ApiError if the request fails
     */
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    /**
     * Performs an HTTP POST request
     *
     * @template T - Type of the response data
     * @param url - The URL to request
     * @param data - Optional request body data
     * @param config - Optional Axios configuration
     * @returns Promise with the Axios response
     * @throws ApiError if the request fails
     */
    post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    /**
     * Performs an HTTP PUT request
     *
     * @template T - Type of the response data
     * @param url - The URL to request
     * @param data - Optional request body data
     * @param config - Optional Axios configuration
     * @returns Promise with the Axios response
     * @throws ApiError if the request fails
     */
    put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    /**
     * Performs an HTTP DELETE request
     *
     * @template T - Type of the response data
     * @param url - The URL to request
     * @param config - Optional Axios configuration
     * @returns Promise with the Axios response
     * @throws ApiError if the request fails
     */
    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    fetchModels(apiKey: string, modelsUrl: string): Promise<ApiModelsResponse>;
    private handleError;
    /**
     * Gets the underlying Axios instance for advanced use cases
     *
     * This method provides direct access to the configured Axios instance
     * for custom request configurations or interceptor modifications.
     *
     * @returns The Axios instance used by this client
     */
    getAxiosInstance(): AxiosInstance;
}
//# sourceMappingURL=client.d.ts.map