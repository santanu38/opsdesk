import { axiosClient } from "./axiosClient";
import { store } from "../store/store";
import {
    refreshAccessToken,
    logout,
} from "../store/authSlice";

axiosClient.interceptors.request.use((config) => {
    const isAuthEndpoint =
        config.url?.includes("auth/login") ||
        config.url?.includes("auth/refresh");

    if (!isAuthEndpoint) {
        const accessToken = store.getState().auth.accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }

    return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newAccessToken) {
    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];
}

axiosClient.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve) => {
                    refreshSubscribers.push((newAccessToken) => {
                        originalRequest.headers.Authorization =
                            `Bearer ${newAccessToken}`;

                        resolve(axiosClient(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                const resultAction =
                    await store.dispatch(refreshAccessToken());

                if (refreshAccessToken.fulfilled.match(resultAction)) {
                    // payload is already the token string
                    const newAccessToken = resultAction.payload;

                    isRefreshing = false;

                    onRefreshed(newAccessToken);

                    originalRequest.headers.Authorization =
                        `Bearer ${newAccessToken}`;

                    return axiosClient(originalRequest);
                }

                throw new Error("Refresh failed");
            } catch (refreshError) {
                isRefreshing = false;

                store.dispatch(logout());

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);