import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import '../styles/Modal.css';

const Modal = ({ children, onClose }) => {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const portalRoot = document.getElementById('portal');
    if (!portalRoot) return null;

    return createPortal(
        <div className="modal" role="dialog" aria-modal="true">
            <div className="modal__overlay" onClick={onClose} />
            <div className="modal__content">
                <button
                    type="button"
                    className="modal__close"
                    onClick={onClose}
                    aria-label="Close details"
                >
                    ×
                </button>
                {children}
            </div>
        </div>,
        portalRoot,
    );
};

export default Modal;
