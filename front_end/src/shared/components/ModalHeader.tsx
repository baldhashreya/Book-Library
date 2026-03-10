import React from "react";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import IconButtons from "./Button/IconButtons";
import "./ModalHeader.css";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  disabled?: boolean;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose, disabled }) => {
  return (
    <div className="modal-header">
      <h2>{title}</h2>
      <IconButtons
        onClick={onClose}
        label={<ClearRoundedIcon />}
        ariaLabel="Close"
        disabled={disabled}
      />
    </div>
  );
};

export default ModalHeader;
