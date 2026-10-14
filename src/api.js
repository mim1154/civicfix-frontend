import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem("refresh_token");

        const authEndpoints = [
            "/api/auth/login",
            "/api/auth/signup",
            "/api/auth/token",
            "/api/auth/refresh",
            "/api/auth/forgot-password",
            "/api/auth/reset-password",
        ];

        const isAuthEndpoint = authEndpoints.some((path) =>
            originalRequest?.url?.includes(path)
        );

        if (
            error.response?.status === 401 &&
            refreshToken &&
            originalRequest &&
            !originalRequest._retry &&
            !isAuthEndpoint
        ) {
            originalRequest._retry = true;

            try {
                const { data } = await axios.post(
                    `${api.defaults.baseURL}/api/auth/refresh`,
                    { refresh_token: refreshToken }
                );

                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);

                originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                if (window.location.pathname !== "/login") {
                    window.location.assign("/login");
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export function getApiErrorMessage(error, fallback) {
    const detail = error.response?.data?.detail;

    if (Array.isArray(detail)) {
        return detail.map((item) => item.msg).join(", ");
    }

    if (typeof detail === "string") {
        return detail;
    }

    return fallback;
}

export default api;