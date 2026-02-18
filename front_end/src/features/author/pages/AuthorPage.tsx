import React, { useEffect, useState, useCallback, useMemo } from "react";
import MainLayout from "../../../shared/layouts/MainLayout";
import type { Author, AuthorFormData } from "../../../types/author";
import { authorService } from "../authorService";
import type { SearchParams } from "../../../types/role";
import AuthorModal from "../components/AuthorModal";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import DataTable from "../../../shared/components/DataTable";
import "./AuthorPage.css";
import AuthorPageFilter from "../components/AuthorPageFilter";
import CustomButton from "../../../shared/components/Button/CustomButton";

const AuthorPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [sortModel, setSortModel] = useState<{
    field: string;
    sort: "asc" | "desc";
  } | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});

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
        offset: paginationModel.page * paginationModel.pageSize,
        limit: paginationModel.pageSize,
        order: sortModel ? [[sortModel.field, sortModel.sort]] : [],
        ...filters,
      } as SearchParams);

      setAuthors(res.rows);
      setTotalCount(res.count);
    } catch (error) {
      console.error("Error loading authors:", error);
    } finally {
      setLoading(false);
    }
  }, [paginationModel, sortModel, filters]);

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

    await authorService.deleteAuthor(authorId);
    await loadAuthors();
  }, [loadAuthors]);

  const handleSaveAuthor = useCallback(async (authorData: AuthorFormData) => {
    try {
      if (modalMode === "add") {
        await authorService.createAuthor(authorData);
      } else if (selectedAuthor) {
        await authorService.updateAuthor(selectedAuthor._id, authorData);
      }

      setIsModalOpen(false);
      await loadAuthors();
    } catch (error) {
      console.error("Error saving author:", error);
    }
  }, [modalMode, selectedAuthor, loadAuthors]);

  const columns = useMemo(() => [
    { field: "name", headerName: "Author Name", flex: 1 },
    { field: "bio", headerName: "Bio", flex: 2 },
    {
      field: "birthDate",
      headerName: "Birth Date",
      flex: 1,
      valueFormatter: (params: string) =>
        new Date(params).toLocaleDateString(),
    },
  ], []);

  return (
    <MainLayout>
        <div className="page-header">
          <div className="header-right">
            <CustomButton 
              variant="outlined"
              onClick={handleAddAuthor}
              label="Add Authors"
              className="add-button"
              disabled={loading}
              startIcon={<AddIcon />}
            />

            <CustomButton 
              variant="outlined"
              onClick={() => setIsFilterOpen(true)}
              label="Filter"
              className="filter-button"
              disabled={loading}
              startIcon={<FilterListIcon />}
            />
            
          </div>
        </div>
      <div className="main-page">

        {/* Data Table */}
        <DataTable
          rows={authors}
          rowCount={totalCount}
          paginationModel={paginationModel}
          onPaginationChange={setPaginationModel}
          loading={loading}
          onEdit={handleEditAuthor}
          onDelete={(row) => handleDeleteAuthor(row._id)}
          onSortModelChange={(model) => {
            if (model.length > 0) {
              setSortModel({
                field: model[0].field,
                sort: model[0].sort as "asc" | "desc",
              });
            } else {
              setSortModel(null);
            }
          }}
          columns={columns}
        />

        {/* Filter Drawer */}

        <AuthorPageFilter
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          filters={filters}
          setFilters={setFilters}
          setPaginationModel={setPaginationModel}
          loadAuthors={loadAuthors}
        />

        {/* Modal */}
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
