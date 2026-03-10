import Button from "@mui/material/Button";

interface CancelButtonProps {
  onClick: (e?: any) => void;
  disabled?: boolean;
}

function CancelButton({ onClick, disabled }: CancelButtonProps) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      type="button"
      disabled={disabled}
      sx={{
        textTransform: "none",
        backgroundColor: "#4b4949ff",
        color: "#fff",
        height: "40px",
        "&:hover": {
          backgroundColor: "#fff",
          color: "#4b4949ff",
          border: "1px solid #4b4949ff",
        },
      }}
    >
      Cancel
    </Button>
  );
}
export default CancelButton;
