import React, { useState, useEffect } from "react";
import type { Author, AuthorFormData } from "../../types/author";
import { authorService } from "../../services/authorService";
import "./AuthorModal.css";
import type { SearchParams } from "../../types/role";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import CustomButton from "../common/Button/CustomButton";
import CancelButton from "../common/Button/CancleButton";
import IconButtons from "../common/Button/IconButtons";

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (authorData: AuthorFormData) => void;
  author?: Author | null;
  mode: "add" | "edit";
}

const AuthorModal: React.FC<AuthorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  author,
  mode,
}) => {
  const [formData, setFormData] = useState<AuthorFormData>({
    name: "",
    bio: "",
    birthDate: "",
  });
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAuthors();
      if (mode === "edit" && author) {
        setFormData({
          name: author.name,
          bio: author.bio,
          birthDate: author.birthDate,
        });
      } else {
        setFormData({
          name: "",
          bio: "",
          birthDate: new Date(),
        });
      }
    }
  }, [isOpen, mode, author]);

  const loadAuthors = async () => {
    try {
      const authors = await authorService.searchAuthors({
        limit: 100,
        offset: 0,
      } as SearchParams);
      setAuthors(authors);
    } catch (error) {
      console.error("Error loading authors:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving author:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mode === "add" ? "Add New Author" : "Edit Author"}</h2>
          <IconButtons
            onClick={onClose}
            label={<ClearRoundedIcon />}
            ariaLabel="Close"
            disabled={loading}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="author-form"
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Author Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="isbn">Birth Date *</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={loading}
              rows={4}
              placeholder="Optional author bio"
            />
          </div>

          <div className="form-actions">
            <CancelButton
              onClick={onClose}
              disabled={loading}
            />
            <CustomButton
              variant="contained"
              onClick={handleSubmit}
              label={
                loading
                  ? "Saving..."
                  : mode === "add"
                  ? "Add Author"
                  : "Update Author"
              }
              className="action-button"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthorModal;
