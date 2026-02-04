import React, { useEffect, useState } from "react";
import MainLayout from "../../../shared/layouts/MainLayout";
import type { Author, AuthorFormData } from "../../../types/author";
import { authorService } from "../authorService";
import type { SearchParams } from "../../../types/role";
import AuthorModal from "../components/AuthorModal";
import AddIcon from "@mui/icons-material/Add";
import DataTable from "../../../shared/components/DataTable";
import "./AuthorPage.css";
import IconButtons from "../../../shared/components/Button/IconButtons";

const AuthorPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const loadAuthors = async () => {
    try {
      setLoading(true);

      const res = await authorService.searchAuthors({
        offset: paginationModel.page,
        limit: paginationModel.pageSize,
      } as SearchParams);

      setAuthors(res.rows);
      setTotalCount(res.count);
    } catch (error) {
      console.error("Error loading authors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, [paginationModel]);

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
    if (!window.confirm("Are you sure you want to delete this author?")) return;

    try {
      await authorService.deleteAuthor(authorId);
      loadAuthors();
    } catch (error) {
      console.error("Error deleting author:", error);
    }
  };

  const handleSaveAuthor = async (authorData: AuthorFormData) => {
    try {
      if (modalMode === "add") {
        await authorService.createAuthor(authorData);
      } else if (modalMode === "edit" && selectedAuthor) {
        await authorService.updateAuthor(selectedAuthor._id, authorData);
      }

      setIsModalOpen(false);
      loadAuthors();
    } catch (error) {
      console.error("Error saving author:", error);
      throw error;
    }
  };

  return (
    <MainLayout>
      <div className="book-page">
        <div className="page-header">
          <IconButtons
            onClick={handleAddAuthor}
            label={<AddIcon />}
            ariaLabel="Add New Author"
            className="add-author-btn"
          />
        </div>

        <DataTable
          rows={authors}
          rowCount={totalCount}
          paginationModel={paginationModel}
          onPaginationChange={setPaginationModel}
          loading={loading}
          onEdit={handleEditAuthor}
          onDelete={(row) => handleDeleteAuthor(row._id)}
          columns={[
            {
              field: "name",
              headerName: "Author Name",
              flex: 1,
            },
            {
              field: "bio",
              headerName: "Bio",
              flex: 2,
            },
            {
              field: "birthDate",
              headerName: "Birth Date",
              flex: 1,
              valueFormatter: (params) => new Date(params).toLocaleDateString(),
            },
          ]}
        />

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
