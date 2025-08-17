
interface ButtonProps {
    title: string;
    background: string;
    type: "submit" | "reset" | "button" | undefined
    onClick?: () => void

}

export default function Button({ title, type, background, onClick }: ButtonProps) {


    return (
        <button
            type={type}
            onClick={onClick}
            className={`form-control mb-3 p-2 border rounded flex-grow-1  shadow-sm btn btn-${background}`}

        >  <span >{title}</span></button>

    );
}
