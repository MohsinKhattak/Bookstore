import React from 'react';

export interface AuthField {
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

export interface AuthFormProps {
    title: string;
    fields: AuthField[];
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    submitLabel: string;
    isLoading?: boolean;
    error?: string | null;
}
