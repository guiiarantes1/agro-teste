import React, { useEffect } from "react";

const Toast = ({ show, message, onClose, type }) => {

    useEffect(() => {
        if (show) {
          const timer = setTimeout(() => {
            onClose();
          }, 3000);    
          return () => clearTimeout(timer);
        }
      }, [show, onClose]);

  return (
    <div
      className={`toast align-items-center text-bg-${type} border-0 ${show ? "show" : "hide"}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-bs-autohide="true"
      style={{ position: "absolute", top: "20px", right: "20px", width: "fit-content" }}
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
};

export default Toast;
