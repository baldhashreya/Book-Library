import { useState, useEffect } from "react";
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
  setPaginationModel: (model: any) => void;
}

export default function AuthorPageFilter({
  isFilterOpen,
  setIsFilterOpen,
  filters,
  setFilters,
  setPaginationModel,
}: AuthorPageFilterProps) {
  const [internalFilters, setInternalFilters] = useState(filters);

  useEffect(() => {
    if (isFilterOpen) {
      setInternalFilters(filters);
    }
  }, [isFilterOpen, filters]);

  const handleApply = () => {
    setFilters(internalFilters);
    setPaginationModel((p: any) => ({ ...p, page: 0 }));
    setIsFilterOpen(false);
  };

  const handleClear = () => {
    const cleared = {};
    setInternalFilters(cleared);
    setFilters(cleared);
    setPaginationModel((p: any) => ({ ...p, page: 0 }));
    setIsFilterOpen(false);
  };

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
            value={internalFilters.name || ""}
            onChange={(e) =>
              setInternalFilters({ ...internalFilters, name: e.target.value })
            }
            fullWidth
          />


          < AppTextField 
            label="Bio"
            value={internalFilters.bio || ""}
            onChange={(e) =>
              setInternalFilters({ ...internalFilters, bio: e.target.value })
            }
            fullWidth
          />

          <AppTextField
            label="Birth Date From"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={internalFilters.start_birth_date || ""}
            onChange={(e) =>
              setInternalFilters({
                ...internalFilters,
                start_birth_date: e.target.value,
              })
            }
            fullWidth
          />
          <AppTextField
            label="Birth Date To"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={internalFilters.end_birth_date || ""}
            onChange={(e) =>
              setInternalFilters({
                ...internalFilters,
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
            onClick={handleApply}
            label="Apply Filters"
            fullWidth
            className="apply-filters-button"
          />

          <CustomButton 
            variant="outlined"
            onClick={handleClear}
            label="Clear"
            fullWidth
            className="clear-filters-button"
          />
        </div>
      </div>
    </Drawer>
  );
}
