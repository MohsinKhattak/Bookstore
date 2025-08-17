import axiosInstance from "../api/axiosInstance";

interface SignupPayload {
    email: string,
    password: string,
    name: string
}

interface LoginPayload {
    email: string,
    password: string,

}



export const authService = {
    signup: async ({ name, email, password }: SignupPayload) => {
        try {
            const response = await axiosInstance.post('/users/register', { name, email, password });
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },
    login: async ({ email, password }: LoginPayload) => {
        try {
            const response = await axiosInstance.post('/users/login', { email, password });
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },
    logout: async () => {
        try {
            const response = await axiosInstance.get('/users/logout');
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },
    autenticateMe: async () => {
        try {
            const response = await axiosInstance.get('/users/authenticate');
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },
};
