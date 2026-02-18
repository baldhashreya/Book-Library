import {
  Drawer,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./BookPageFilter.css"
import AppTextField from "../../../shared/components/AppTextField";
import CustomButton from "../../../shared/components/Button/CustomButton";

interface BookPageFilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  filters: any;
  setFilters: (filters: any) => void;
  setPaginationModel: (model: { page: number; pageSize: number }) => void;
  loadBooks: () => void;
}

export default function BookPageFilter({
  isFilterOpen,
  setIsFilterOpen,
  filters,
  setFilters,
  setPaginationModel,
  loadBooks,
}: BookPageFilterProps) {
  return (
    <Drawer
      anchor="left"
      open={isFilterOpen}
      onClose={() => setIsFilterOpen(false)}
    >
      <div
        className="main-block"
      >
        <div
          className="header-block"
        >
          <h3>Filters</h3>
          <IconButton
            size="small"
            onClick={() => setIsFilterOpen(false)}
            sx={{
              borderRadius: "6px",
              "&:hover": {
                backgroundColor: "#f4f4f4",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        <Divider />
        <div
          className="content-block"
        >
            <AppTextField
            label="Book Name"
            placeholder="Enter book name"
            value={filters.title || ""}
            onChange={(e) =>
              setFilters({ ...filters, title: e.target.value })
            }
            fullWidth
          />

          <AppTextField
            label="Author Name"
            placeholder="Enter author name"
            value={filters.author || ""}
            onChange={(e) =>
              setFilters({ ...filters, author: e.target.value })
            }
            fullWidth
          />
        </div>

        <div
          className="footer-block"
        >
          <CustomButton 
            variant="outlined"
            onClick={() => {
              setPaginationModel((p) => ({ ...p, page: 0 }));
              setIsFilterOpen(false);
            }}
            label="Apply Filters"
            fullWidth
            className="apply-filters-button"
          />

          <CustomButton 
            variant="outlined"
            onClick={() => {
              setFilters({});
              setPaginationModel((p) => ({ ...p, page: 0 }));
              setIsFilterOpen(false);
            }}
            label="Clear"
            fullWidth
            className="clear-filters-button"
          />
        </div>
      </div>
    </Drawer>
  );
}
