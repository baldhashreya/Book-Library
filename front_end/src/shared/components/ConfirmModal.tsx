import React from "react";
import ModalHeader from "./ModalHeader";
import CustomButton from "./Button/CustomButton";
import CancelButton from "./Button/CancleButton";
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
        
        <div className="confirm-modal-body">
          <p className="confirm-modal-subtitle">{message}</p>
        </div>

        <div className="confirm-modal-actions">
          <CancelButton onClick={onCancel} disabled={loading} />
          <CustomButton
            label={loading ? "Processing..." : confirmLabel}
            onClick={onConfirm}
            variant="contained"
            className="confirm-action-btn"
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
