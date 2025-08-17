import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "services/auth.service";

export function useSignup() {
    const navigate = useNavigate();

    const signup = async (name: string, email: string, password: string) => {
        try {
            await authService.signup({ name, email, password });
            toast.success("User Registered Successfully");
            navigate("/login");
        } catch (err: any) {
            if (err.response?.status === 409) {
                toast.info("User With Such Email Already Exists");
            } else {
                toast.error("Signup failed. Try again.");
            }
        }
    };

    return { signup };
}
