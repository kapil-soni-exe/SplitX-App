import "./Model.css"

import {RiCloseCircleLine} from "@remixicon/react"
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <RiCloseCircleLine className="close-btn" onClick={onClose}/>
        {children}
      </div>
    </div>
  );
}

export default Modal
