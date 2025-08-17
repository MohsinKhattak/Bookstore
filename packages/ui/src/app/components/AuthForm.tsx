import InputBox from "components/InputBox";
import { AuthFormProps } from '@bookstore/shared-types';



export function AuthForm({ title, fields, onSubmit, submitLabel, isLoading, error }: AuthFormProps) {
    return (
        <div className="container-fluid d-flex w-100 min-vh-100 justify-content-center align-items-center">
            <div className="row justify-content-center w-100">
                <div className="col-12 col-md-6 col-lg-4 p-5 rounded shadow">
                    <h2 className="text-center mb-4">{title}</h2>
                    <form onSubmit={onSubmit}>
                        {fields.map(({ label, type, value, onChange, placeholder }, index) => (
                            <div className="mb-3" key={index}>
                                <label className="form-label">{label}</label>
                                <InputBox
                                    type={type}
                                    value={value}
                                    onChange={onChange}
                                    placeholder={placeholder}
                                />
                            </div>
                        ))}
                        <button type="submit" className="btn btn-success w-100">
                            {isLoading ? "Please wait..." : submitLabel}
                        </button>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
