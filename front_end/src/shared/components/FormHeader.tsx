import "../styles/model.css";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import IconButtons from "./Button/IconButtons";

interface props {
  header: string;
  onClose: any;
  loading?: boolean;
}
export  default function FormHeader({ header, onClose, loading }: props) {
  return (
    <div className="modal-header">
      <h2>{header}</h2>

      <IconButtons
        onClick={onClose}
        label={<ClearRoundedIcon />}
        ariaLabel="Close"
        disabled={loading}
      />
    </div>
  );
}
