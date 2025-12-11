import React, { useState, useEffect } from "react";
import MainLayout from "../MainLayout";
import type { Author, AuthorFormData } from "../../types/author";
import { authorService } from "../../services/authorService";
import "./AuthorPage.css";
import type { SearchParams } from "../../types/role";
import AuthorModal from "./AuthorModal";
import { ArrowDown, ArrowUp} from "lucide-react";

const AuthorPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [orderBy, setOrderBy] = useState<"name" | "bio" | "birthDate">("name");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");

  useEffect(() => {
    loadAuthors();
  }, [page, limit, orderBy, order]);

  const loadAuthors = async () => {
    try {
      setLoading(true);

      const offset = (page - 1) * limit;

      const params: SearchParams = {
        limit,
        offset,
        order: [[orderBy, order]],
      };
      console.log(params);
      const response = await authorService.searchAuthors(params);

      setAuthors(response.rows);
      setTotalCount(response.count);
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
        loadAuthors();
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
      loadAuthors();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving book:", error);
      throw error;
    }
  };
  const toggleSelectRow = (id: string) => {
    setSelectedRow((prev) => (prev === id ? null : id));
  };

  const getSortArrow = (column: string) => {
    if (orderBy !== column) return "";

    return order === "ASC" ? (
      <ArrowUp
        size={16}
        strokeWidth={2}
      />
    ) : (
      <ArrowDown
        size={16}
        strokeWidth={2}
      />
    );
  };

  // PAGINATION ACTIONS
  const totalPages = Math.ceil(totalCount / limit);

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // SORT HANDLER
  const handleSort = (column: typeof orderBy) => {
    if (orderBy === column) {
      setOrder(order === "ASC" ? "DESC" : "ASC");
    } else {
      setOrderBy(column);
      setOrder("ASC");
    }
  };

  const filteredAuthor = authors;

  return (
    <MainLayout>
      <div className="book-page">
        <div className="page-header">
          <div className="toolbar">
            <button
              className="add-book-btn"
              onClick={handleAddAuthor}
            >
              Add New Author
            </button>
            <button
              className="edit-selected-btn"
              disabled={!selectedRow}
              title="View/Edit Author"
              onClick={() => {
                const authorToEdit = authors.find((e) => e._id === selectedRow);
                if (authorToEdit) handleEditAuthor(authorToEdit);
              }}
            >
              Edit User
            </button>

            <button
              className="delete-selected-btn"
              disabled={!selectedRow}
              title="Delete Author"
              onClick={() => {
                handleDeleteAuthor(selectedRow || "");
              }}
            >
              Delete Author
            </button>
          </div>
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
                    <th>Select</th>
                    <th onClick={() => handleSort("name")}>
                      Author Name{" "}
                      <span className="sort-arrow">{getSortArrow("name")}</span>
                    </th>
                    <th onClick={() => handleSort("bio")}>
                      Bio{" "}
                      <span className="sort-arrow">{getSortArrow("bio")}</span>
                    </th>
                    <th onClick={() => handleSort("birthDate")}>
                      Birth Date{" "}
                      <span className="sort-arrow">
                        {getSortArrow("birthDate")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuthor.map((author) => (
                    <tr key={author._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRow === author._id}
                          onChange={() => toggleSelectRow(author._id)}
                        />
                      </td>
                      <td>
                        <div className="book-title">
                          <strong>{author.name}</strong>
                        </div>
                      </td>
                      <td>{author.bio}</td>
                      <td>{new Date(author.birthDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* PAGINATION */}
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={prevPage}
              >
                Previous
              </button>

              <span className="page-info">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={nextPage}
              >
                Next
              </button>

              <select
                className="limit-select"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
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
