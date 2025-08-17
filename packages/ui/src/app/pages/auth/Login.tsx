import React, { useState } from "react";
import { useLogin } from "hooks/useLogin";
import { AuthForm } from "components/AuthForm";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading, error } = useLogin();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <AuthForm
            title="Login"
            submitLabel="Login"
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            fields={[
                { label: "Email address", type: "email", value: email, onChange: (e) => setEmail(e.target.value) },
                { label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value) }
            ]}
        />
    );
}
