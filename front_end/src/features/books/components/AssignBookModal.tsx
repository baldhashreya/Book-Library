import React, { useState, useEffect } from "react";
import { userService } from "../../users/userService";
import type { User } from "../../../types/user";
import type { Book } from "../../../types/book";
import { TextField, MenuItem } from "@mui/material";
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
  const [selectedUser, setSelectedUser] = useState("");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      setSelectedUser("");
      setReturnDate("");
    }
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
    }
  };

  if (!isOpen) return null;

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      userId: selectedUser,
      returnDate: returnDate,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content assign-book-model">
        <ModalHeader title={`${book?.title}`} onClose={onClose} />

        <form className="assign-book-form" onSubmit={handleSubmit}>

        <TextField
          select
          fullWidth
          label="Select User"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          sx={{ marginBottom: "20px", ...customInputStyles }}
        >
          <MenuItem value="" disabled sx={{ fontSize: "14px" }}>
            <em>-- Select User --</em>
          </MenuItem>
          {users.map((u: any) => (
            <MenuItem key={u._id} value={u._id} sx={{ fontSize: "14px" }}>
              {u.userName ? u.userName : u.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          fullWidth
          label="Return Date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
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
