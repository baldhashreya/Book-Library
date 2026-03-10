import React from "react";
import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";
import "../styles/AppTextField.css";

type AppTextFieldProps = TextFieldProps & {
  startIcon?: React.ReactNode;
};

const AppTextField: React.FC<AppTextFieldProps> = ({
  startIcon,
  className,
  ...props
}) => {
  return (
    <TextField
      {...props}
      variant="outlined"
      className={`app-textfield ${className || ""}`}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        ) : undefined,
        ...props.InputProps,
      }}
      error={props.error}
      helperText={props.helperText}
    />
  );
};

export default AppTextField;
