import { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectRoute({ children, redirectTo }: { children: JSX.Element, redirectTo: string }) {
    const { currentUser } = useSelector((state: any) => state.user);


    if (!currentUser && redirectTo !== "/login" && redirectTo !== "/signup") {
        return <Navigate to="/login" replace />;
    }

    if (currentUser && (redirectTo === "/login" || redirectTo === "/signup")) {
        return <Navigate to="/" replace />;
    }

    return children;
}
