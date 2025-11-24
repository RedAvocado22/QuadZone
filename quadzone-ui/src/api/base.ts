import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

interface RefreshResponse {
    access_token: string;
    refresh_token?: string;
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

        if (error.response?.status === 401 && originalRequest && originalRequest.url !== "/auth/refresh" && originalRequest.url !== "/auth/authenticate") {
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
                // Get refresh token from localStorage
                const refreshToken = localStorage.getItem("refresh_token");
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Call refresh endpoint with refresh token in Authorization header
                const resp = await API.post<RefreshResponse>(
                    "/auth/refresh",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`
                        }
                    }
                );

                const { access_token, refresh_token } = resp.data;

                if (!access_token) {
                    throw new Error("No access_token returned from refresh endpoint");
                }

                localStorage.setItem("access_token", access_token);
                // Update refresh token if a new one is provided
                if (refresh_token) {
                    localStorage.setItem("refresh_token", refresh_token);
                }
                API.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
                processQueue(null, access_token);

                originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
                return API(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
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
