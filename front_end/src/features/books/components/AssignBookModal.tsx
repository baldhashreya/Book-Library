import React, { useState, useEffect } from "react";
import { userService } from "../../users/userService";
import type { User } from "../../../types/user";
import type { Book } from "../../../types/book";
import { TextField, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./AssignBookModal.css";
import FormAction from "../../../shared/components/FormAction";
import ModalHeader from "../../../shared/components/ModalHeader";

interface AssignBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { userId: string; returnDate: string }) => void; // UPDATED
  book: Book | null;
}

const AssignBookModal: React.FC<AssignBookModalProps> = ({
  isOpen,
  onClose,
  onSave,
  book,
}) => {
  const [users, setUsers] = useState<User[]>([]);

  const validationSchema = Yup.object().shape({
    userId: Yup.string().required("User is required"),
    returnDate: Yup.date().required("Return Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      userId: "",
      returnDate: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSave({
        userId: values.userId,
        returnDate: values.returnDate,
      });
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, book]);

  const loadUsers = async () => {
    const data = await userService.getUsers({});
    setUsers(data);
  };

  const customInputStyles = {
    "& .MuiOutlinedInput-root": {
      height: "40px",
      padding: "0 10px",
    },
    "& .MuiInputBase-input": {
      padding: "8px 14px",
      fontSize: "14px",
    },
    "& .MuiInputLabel-outlined": {
      transform: "translate(14px, 10px) scale(1)",
    },
    "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
      transform: "translate(14px, -6px) scale(0.75)",
    },
    "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
      transform: "translate(14px, 10px) scale(1)",
    },
    "& + .MuiPopover-root .MuiMenu-paper .MuiMenuItem-root": {
      fontSize: "14px",
    },
  };

  if (!isOpen) return null;

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content assign-book-model">
        <ModalHeader
          title={`${book?.title}`}
          onClose={onClose}
        />

        <form
          className="assign-book-form"
          onSubmit={formik.handleSubmit}
        >
          <TextField
            select
            fullWidth
            label="Select User"
            name="userId"
            value={formik.values.userId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.userId && Boolean(formik.errors.userId)}
            helperText={(formik.touched.userId && formik.errors.userId) || ""}
            sx={{ marginBottom: "20px", ...customInputStyles }}
          >
            <MenuItem
              value=""
              disabled
              sx={{ fontSize: "14px" }}
            >
              <em>-- Select User --</em>
            </MenuItem>
            {users.map((u: any) => (
              <MenuItem
                key={u._id}
                value={u._id}
                sx={{ fontSize: "14px" }}
              >
                {u.userName ? u.userName : u.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="date"
            fullWidth
            label="Return Date"
            name="returnDate"
            value={formik.values.returnDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.returnDate && Boolean(formik.errors.returnDate)}
            helperText={(formik.touched.returnDate && formik.errors.returnDate) || ""}
            InputLabelProps={{ shrink: true }}
            slotProps={{ htmlInput: { min: getTomorrowDate() } }}
            sx={{ marginBottom: "20px", ...customInputStyles }}
          />

          <FormAction
            loading={false}
            onClose={onClose}
            label="Assign"
          />
        </form>
      </div>
    </div>
  );
};

export default AssignBookModal;
