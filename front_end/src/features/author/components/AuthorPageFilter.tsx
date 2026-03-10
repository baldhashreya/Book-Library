import {
  Drawer,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./AuthorPageFilter.css"
import AppTextField from "../../../shared/components/AppTextField";
import CustomButton from "../../../shared/components/Button/CustomButton";

interface AuthorPageFilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  filters: any;
  setFilters: (filters: any) => void;
  setPaginationModel: (model: { page: number; pageSize: number }) => void;
  loadAuthors: () => void;
}

export default function AuthorPageFilter({
  isFilterOpen,
  setIsFilterOpen,
  filters,
  setFilters,
  setPaginationModel,
  loadAuthors,
}: AuthorPageFilterProps) {
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
            label="Author Name"
            placeholder="Enter author name"
            value={filters.name || ""}
            onChange={(e) =>
              setFilters({ ...filters, name: e.target.value })
            }
            fullWidth
          />


          < AppTextField 
            label="Bio"
            value={filters.bio || ""}
            onChange={(e) =>
              setFilters({ ...filters, bio: e.target.value })
            }
            fullWidth
          />

          <AppTextField
            label="Birth Date From"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.start_birth_date || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                start_birth_date: e.target.value,
              })
            }
            fullWidth
          />
          <AppTextField
            label="Birth Date To"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.end_birth_date || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                end_birth_date: e.target.value,
              })
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
