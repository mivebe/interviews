import { createPortal } from "react-dom"
import "../styles/Modal.css"

const Modal = ({ children, onClose }) => {


    return createPortal(
        <>
            <div id="modal-overlay"></div>
            <div id="modal-container">
                <div className="close-container" onClick={onClose}>
                    <div className="leftright"></div>
                    <div className="rightleft"></div>
                </div>
                {children}
            </div>
        </>,
        document.getElementById("portal")
    )
}
export default Modal