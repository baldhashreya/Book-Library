import Button from "@mui/material/Button";

interface CustomButtonProps {
  onClick?: (e?: any) => void;
  label: string;
  variant: "text" | "outlined" | "contained";
  className?: string;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  startIcon?: React.ReactNode;
}

function CustomButton({
  label,
  className,
  variant,
  type,
  disabled,
  startIcon,
  onClick,
}: CustomButtonProps) {
  return (
    <Button
      variant={variant}
      startIcon={startIcon}
      onClick={onClick}
      className={className}
      type={type}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}

export default CustomButton;
