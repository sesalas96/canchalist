import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    CreateAxiosDefaults,
} from 'axios';
import logger from './logger';

const handleConsoleError = (err: AxiosError): void => {
    if (err.response) {
        switch (err.response.status) {
            case 400:
                logger.error('400 Bad request', { statusCode: 400, data: err.response.data });
                break;
            case 401:
                logger.error('401 Unauthorized', { statusCode: 401, data: err.response.data });
                break;
            case 404:
                logger.error('404 Not found', { statusCode: 404, data: err.response.data });
                break;
            case 408:
                logger.warn('408 Timeout', { statusCode: 408, data: err.response.data });
                break;
            case 500:
                logger.warn('500 Internal Server Error', {
                    statusCode: 500,
                    data: err.response.data,
                });
                break;
            default:
                logger.error(`Error ${err.response.status}`, {
                    statusCode: err.response.status,
                    data: err.response.data,
                });
        }
    } else if (err.request) {
        logger.error('Error: No response received', { request: err.request });
    } else {
        logger.error('Error: Something went wrong. Please try again', { message: err.message });
    }
};

const createAxiosInstance = (config?: CreateAxiosDefaults) => {
    const axiosInstance: AxiosInstance = axios.create(config);

    axiosInstance.interceptors.request.use(
        (requestConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
            logger.info(
                `[Axios Request] ${requestConfig.method?.toUpperCase()} - ${requestConfig.url}`,
            );
            return requestConfig;
        },
        (error: AxiosError) => {
            handleConsoleError(error);
            return Promise.reject(error);
        },
    );

    axiosInstance.interceptors.response.use(
        (response: AxiosResponse): AxiosResponse => {
            logger.info(
                `[Axios Response] Status: ${response.status} - URL: ${response.config.url}`,
            );
            return response;
        },
        (error: AxiosError) => {
            handleConsoleError(error);
            return Promise.reject(error);
        },
    );

    return axiosInstance;
};

export { createAxiosInstance };
