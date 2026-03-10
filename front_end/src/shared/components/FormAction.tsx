import "../styles/model.css";
import CancelButton from "./Button/CancelButton";
import CustomButton from "./Button/CustomButton";

interface Props {
    onClose: any;
    loading?: boolean;
    label: string;
}
export default function FormAction({ onClose, loading, label }: Props){
    return (
        <div className="form-actions">
            <CancelButton
              onClick={onClose}
              disabled={loading}
            />
            <CustomButton
              variant="contained"
              type="submit"
              label={
                loading ? "Saving..."
                : label
              }
              className="action-button"
              disabled={loading}
            />
          </div>
    )
}