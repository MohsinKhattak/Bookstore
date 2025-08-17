interface TextAreaProps {
    placeholder?: string;
    rows: number
    value: string | ""
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    name?: string

}

export default function Textarea({ placeholder = "", value, rows, onChange, name }: TextAreaProps) {


    return (
        <textarea
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="form-control mb-3 p-2 border rounded shadow-sm"
            name={name}
        />

    );
}
