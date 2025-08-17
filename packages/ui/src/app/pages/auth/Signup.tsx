import React, { useState } from "react";
import { useSignup } from "hooks/useSignup";
import { AuthForm } from "components/AuthForm";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { signup } = useSignup();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return alert("Passwords do not match");
        }
        signup(name, email, password);
    };

    return (
        <AuthForm
            title="Register"
            submitLabel="Register"
            onSubmit={handleSubmit}
            fields={[
                { label: "Name", type: "text", value: name, onChange: (e) => setName(e.target.value) },
                { label: "Email address", type: "email", value: email, onChange: (e) => setEmail(e.target.value) },
                { label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value) },
                { label: "Confirm Password", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value) }
            ]}
        />
    );
}
