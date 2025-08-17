interface InputBoxProps {
    placeholder?: string;
    type?: string
    value: string | ""
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;

}

export default function InputBox({ placeholder = "", type, value, onChange, name }: InputBoxProps) {


    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="form-control mb-3 p-2 border rounded shadow-sm"
            name={name}
        />

    );
}
