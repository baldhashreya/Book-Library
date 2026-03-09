import React, { useEffect, useState, useCallback, useMemo } from "react";
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

  const loadAuthors = useCallback(async () => {
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
  }, [paginationModel.page, paginationModel.pageSize]);

  useEffect(() => {
    loadAuthors();
  }, [loadAuthors]);

  const handleAddAuthor = useCallback(() => {
    setModalMode("add");
    setSelectedAuthor(null);
    setIsModalOpen(true);
  }, []);

  const handleEditAuthor = useCallback((author: Author) => {
    setModalMode("edit");
    setSelectedAuthor(author);
    setIsModalOpen(true);
  }, []);

  const handleDeleteAuthor = useCallback(async (authorId: string) => {
    if (!window.confirm("Are you sure you want to delete this author?")) return;

    try {
      await authorService.deleteAuthor(authorId);
      loadAuthors();
    } catch (error) {
      console.error("Error deleting author:", error);
    }
  }, [loadAuthors]);

  const handleSaveAuthor = useCallback(async (authorData: AuthorFormData) => {
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
  }, [modalMode, selectedAuthor, loadAuthors]);

  const columns = useMemo(() => [
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
      valueFormatter: (params: any) => new Date(params).toLocaleDateString(),
    },
  ], []);

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
          onDelete={useCallback((row: any) => handleDeleteAuthor(row._id), [handleDeleteAuthor])}
          columns={columns}
        />

        <AuthorModal
          isOpen={isModalOpen}
          onClose={useCallback(() => setIsModalOpen(false), [])}
          onSave={handleSaveAuthor}
          author={selectedAuthor}
          mode={modalMode}
        />
      </div>
    </MainLayout>
  );
};

export default AuthorPage;
