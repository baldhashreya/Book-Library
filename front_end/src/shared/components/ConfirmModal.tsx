import React from "react";
import ModalHeader from "./ModalHeader";
import FormAction from "./FormAction";
import "./ConfirmModal.css";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <ModalHeader title={title} onClose={onCancel} disabled={loading} />
        
        <form onSubmit={(e) => { e.preventDefault(); onConfirm(); }}>
          <div className="confirm-modal-body">
            <p className="confirm-modal-subtitle">{message}</p>
          </div>

          <FormAction
            loading={loading}
            onClose={onCancel}
            label={confirmLabel}
          />
        </form>
      </div>
    </div>
  );
};

export default ConfirmModal;
