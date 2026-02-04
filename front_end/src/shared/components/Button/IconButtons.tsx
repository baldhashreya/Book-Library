import IconButton from "@mui/material/IconButton";
import type React from "react";

interface Props {
  onClick: (e?: any) => void;
  label: React.ReactNode;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
}
export default function IconButtons({
  onClick,
  label,
  ariaLabel,
  disabled,
  className,
}: Props) {
  return (
    <IconButton
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {label}
    </IconButton>
  );
}
