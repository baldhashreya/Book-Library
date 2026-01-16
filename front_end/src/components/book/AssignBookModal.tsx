import React, { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import type { User } from "../../types/user";
import type { Book } from "../../types/book";
import "./AssignBookModal.css";
import CustomButton from "../common/Button/CustomButton";

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

  if (!isOpen) return null;

  return (
    <div className="assign-modal-overlay">
      <div className="assign-modal">
        <h2>Assign Book: {book?.title}</h2>

        <label>Select User</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option
            value=""
            disabled
            hidden
          >
            -- Select User --
          </option>
          {users.map((u: any) => (
            <option
              key={u._id}
              value={u._id}
            >
              {u.userName
                ? u.userName
                : (u.firstName || "") + " " + (u.lastName || "")}
            </option>
          ))}
        </select>

        <label>Return Date</label>
        <input
          type="date"
          className="return-date-input"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />

        <div className="modal-actions">
          <CustomButton
            variant="contained"
            onClick={onClose}
            label="Cancel"
            className="cancel-btn"
          />

          <CustomButton
            variant="contained"
            onClick={() =>
              onSave({
                userId: selectedUser,
                returnDate: returnDate,
              })
            }
            label="Assign"
            className="save-btn"
            disabled={!selectedUser || !returnDate}
          />
        </div>
      </div>
    </div>
  );
};

export default AssignBookModal;
