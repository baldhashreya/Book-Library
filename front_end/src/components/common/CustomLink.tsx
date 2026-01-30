import { Link } from "@mui/material";

interface props {
  onClick: (e?: any) => void;
  component: string;
  variant: string;
  label: string;
  className?: string;
}
export default function CustomLink({
  onClick,
  component,
  variant,
  label,
  className,
}: props) {
  return (
    <Link
      component={component}
      variant={variant}
      onClick={onClick}
      className={className}
    >
      {label}
    </Link>
  );
}
