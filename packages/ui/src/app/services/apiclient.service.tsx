import axiosInstance from "../api/axiosInstance";

class ApiClient {
    static async get<T>(url: string, params?: any): Promise<T> {
        const response = await axiosInstance.get(url, { params });
        return response.data;
    }

    static async post<T>(url: string, data: any, config?: any): Promise<T> {
        const response = await axiosInstance.post(url, data, config);
        return response.data;
    }

    static async delete<T>(url: string, params?: any): Promise<T> {
        const response = await axiosInstance.delete(url, { params });
        return response.data;
    }
}

export default ApiClient;
