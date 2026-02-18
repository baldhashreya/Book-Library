import Button from "@mui/material/Button";

interface CustomButtonProps {
  onClick?: (e?: any) => void;
  label: string;
  variant: "text" | "outlined" | "contained";
  className?: string;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  startIcon?: React.ReactNode;
  fullWidth?: boolean;
}

function CustomButton({
  label,
  className,
  variant,
  type,
  disabled,
  startIcon,
  onClick,
  fullWidth
}: CustomButtonProps) {
  return (
    <Button
      variant={variant}
      startIcon={startIcon}
      onClick={onClick}
      className={className}
      type={type}
      disabled={disabled}
      fullWidth={fullWidth}
    >
      {label}
    </Button>
  );
}

export default CustomButton;
