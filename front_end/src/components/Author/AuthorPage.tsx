import React, { useState, useEffect } from "react";
import MainLayout from "../MainLayout";
import type { Author, AuthorFormData } from "../../types/author";
import { authorService } from "../../services/authorService";
import "./AuthorPage.css";
import type { SearchParams } from "../../types/role";
import AuthorModal from "./AuthorModal";
import CustomButton from "../common/Button/CustomButton";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButtons from "../common/Button/IconButtons";

const AuthorPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  useEffect(() => {
    loadAuthors({ limit: 10, offset: 0 });
  }, []);

  const loadAuthors = async (params: SearchParams) => {
    try {
      setLoading(true);
      const authorsData = await authorService.searchAuthors(params);
      setAuthors(authorsData);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAuthor = () => {
    setModalMode("add");
    setSelectedAuthor(null);
    setIsModalOpen(true);
  };

  const handleEditAuthor = (author: Author) => {
    setModalMode("edit");
    setSelectedAuthor(author);
    setIsModalOpen(true);
  };

  const handleDeleteAuthor = async (authorId: string) => {
    if (window.confirm("Are you sure you want to delete this Author?")) {
      try {
        await authorService.deleteAuthor(authorId);
        const updatedAuthors = await authorService.searchAuthors({
          limit: 10,
          offset: 0,
        } as SearchParams);
        setAuthors(updatedAuthors);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error deleting author:", error);
        alert("Error deleting author. Please try again.");
      }
    }
  };

  const handleSaveAuthor = async (authorData: AuthorFormData) => {
    try {
      if (modalMode === "add") {
        await authorService.createAuthor(authorData);
      } else if (modalMode === "edit" && selectedAuthor) {
        await authorService.updateAuthor(selectedAuthor._id, authorData);
      }
      const updatedAuthors = await authorService.searchAuthors({
        limit: 10,
        offset: 0,
      } as SearchParams);
      setAuthors(updatedAuthors);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving book:", error);
      throw error;
    }
  };

  const filteredAuthor = authors;

  return (
    <MainLayout>
      <div className="book-page">
        <div className="page-header">
          <div className="header-content"></div>
          <CustomButton
            variant="contained"
            onClick={handleAddAuthor}
            label="Add New Author"
            className="add-author-btn"
            startIcon={<AddIcon />}
          />
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading authors...</p>
          </div>
        ) : (
          <div className="books-table-container">
            {filteredAuthor.length === 0 ? (
              <div className="empty-state">
                <h3>No author found</h3>
                <p>
                  {"Your library is empty. Add your first book to get started."}
                </p>
              </div>
            ) : (
              <table className="books-table">
                <thead>
                  <tr>
                    <th>Author Name</th>
                    <th>Bio</th>
                    <th>Birth Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuthor.map((author) => (
                    <tr key={author._id}>
                      <td>
                        <div className="book-title">
                          <strong>{author.name}</strong>
                        </div>
                      </td>
                      <td>{author.bio}</td>
                      <td>{author.birthDate}</td>
                      <td>
                        <div className="action-buttons">
                          <IconButtons
                            onClick={() => handleEditAuthor(author)}
                            label={<ModeEditIcon />}
                            ariaLabel="edit"
                          />
                          <IconButtons
                            onClick={() => handleDeleteAuthor(author._id)}
                            label={<DeleteIcon />}
                            ariaLabel="Delete"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        <AuthorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAuthor}
          author={selectedAuthor}
          mode={modalMode}
        />
      </div>
    </MainLayout>
  );
};

export default AuthorPage;
