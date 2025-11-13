import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

interface RefreshResponse {
    access_token: string;
}

interface FailedRequest {
    resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void;
    reject: (error: AxiosError) => void;
    originalRequest: InternalAxiosRequestConfig;
}

export const API = axios.create({
    baseURL: "/api/v1",
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true // <-- Sends the cookie
});

API.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.originalRequest.headers["Authorization"] = `Bearer ${token}`;
            prom.resolve(API(prom.originalRequest));
        }
    });
    failedQueue = [];
};

API.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig;

        if (error.response?.status === 401 && originalRequest && originalRequest.url !== "/auth/refresh") {
            if (isRefreshing) {
                return new Promise<AxiosResponse>((resolve, reject) => {
                    failedQueue.push({
                        resolve,
                        reject,
                        originalRequest: originalRequest as InternalAxiosRequestConfig
                    });
                });
            }

            isRefreshing = true;

            try {
                const resp = await API.post<RefreshResponse>("/auth/refresh");

                const { access_token } = resp.data;

                if (!access_token) {
                    throw new Error("No access_token returned from refresh endpoint");
                }

                localStorage.setItem("access_token", access_token);
                API.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
                processQueue(null, access_token);

                originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
                return API(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("access_token");
                processQueue(refreshError as AxiosError, null);
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default API;
