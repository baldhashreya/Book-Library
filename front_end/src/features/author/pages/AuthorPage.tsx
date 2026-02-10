import React, { useEffect, useState } from "react";
import MainLayout from "../../../shared/layouts/MainLayout";
import type { Author, AuthorFormData } from "../../../types/author";
import { authorService } from "../authorService";
import type { SearchParams } from "../../../types/role";
import AuthorModal from "../components/AuthorModal";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import DataTable from "../../../shared/components/DataTable";
import IconButtons from "../../../shared/components/Button/IconButtons";
import "./AuthorPage.css";
import AuthorPageFilter from "./AuthorPageFilter";

const AuthorPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ sorting
  const [sortModel, setSortModel] = useState<{
    field: string;
    sort: "asc" | "desc";
  } | null>(null);

  // ✅ drawer filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  // ✅ API call
  const loadAuthors = async () => {
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
  };

  useEffect(() => {
    loadAuthors();
  }, [paginationModel, sortModel]);

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

    await authorService.deleteAuthor(authorId);
    loadAuthors();
  };

  const handleSaveAuthor = async (authorData: AuthorFormData) => {
    if (modalMode === "add") {
      await authorService.createAuthor(authorData);
    } else if (selectedAuthor) {
      await authorService.updateAuthor(selectedAuthor._id, authorData);
    }

    setIsModalOpen(false);
    loadAuthors();
  };

  return (
    <MainLayout>
       <IconButtons
            onClick={handleAddAuthor}
            label={<AddIcon />}
            ariaLabel="Add Author"
          />
      <div className="book-page">
        <div className="page-header">
          <IconButtons
            onClick={() => setIsFilterOpen(true)}
            label={<FilterListIcon />}
            ariaLabel="Open Filters"
          />
        </div>

        {/* ✅ Data Table */}
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
          columns={[
            { field: "name", headerName: "Author Name", flex: 1 },
            { field: "bio", headerName: "Bio", flex: 2 },
            {
              field: "birthDate",
              headerName: "Birth Date",
              flex: 1,
              valueFormatter: (params) =>
                new Date(params).toLocaleDateString(),
            },
          ]}
        />

        {/* ✅ Filter Drawer */}

        <AuthorPageFilter
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          filters={filters}
          setFilters={setFilters}
          setPaginationModel={setPaginationModel}
          loadAuthors={loadAuthors}
        />

        {/* ✅ Modal */}
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
