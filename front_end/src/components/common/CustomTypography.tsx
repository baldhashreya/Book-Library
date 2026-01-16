import { Typography } from "@mui/material";

interface props {
  variant: string;
  label: string;
  className?: string;
}

export default function CustomTypography({ variant, label, className }: props) {
  return (
    <Typography
      variant={variant}
      className={className}
    >
      {label}
    </Typography>
  );
}
