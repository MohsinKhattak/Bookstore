import { ReactNode } from "react";
import CloseIcon from "../assets/svgs/close";

interface ModalProps {
    show: boolean
    onClose: () => void
    title: string
    SubmitText: string
    children: ReactNode
    onSubmit: () => void

}


export default function Modal({ show, onClose, title, SubmitText, children, onSubmit }: ModalProps) {

    if (!show) return null
    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header d-flex ailgn-items-center justify-content-between">
                        <h5 className="modal-title">{title}</h5>
                        <span className="cursor-pointer" onClick={onClose}>
                            <CloseIcon fill="black" size="20" />
                        </span>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer  ">
                        <button type="button" className="btn btn-success w-25" onClick={onSubmit}>{SubmitText}</button>

                    </div>
                </div>
            </div>
        </div>
    );
}
