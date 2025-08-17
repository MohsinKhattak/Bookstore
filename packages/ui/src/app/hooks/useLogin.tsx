import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginFailure, loginStart, loginSuccess } from "store/features/user/UserSlice";
import { RootState } from "store/store";
import { authService } from "services/auth.service";

export function useLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state: RootState) => state.user);

    const login = async (email: string, password: string) => {
        try {
            dispatch(loginStart());
            const response = await authService.login({ email, password });
            dispatch(loginSuccess(response?.user));
            toast.success("Logged In Successfully");
            navigate("/");
        } catch (err: any) {
            const message = err.response?.data?.message || "Login failed";
            dispatch(loginFailure(message));
            toast.error(message);
        }
    };

    return { login, isLoading, error };
}
