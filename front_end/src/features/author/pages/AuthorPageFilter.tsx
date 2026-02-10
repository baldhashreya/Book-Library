import { Drawer, TextField, Button } from "@mui/material";
import "./AuthorPage.css";

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
        style={{
          width: 320,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h3>Filters</h3>

        <TextField
          label="Author Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          fullWidth
        />

        <TextField
          label="Bio"
          value={filters.bio}
          onChange={(e) => setFilters({ ...filters, bio: e.target.value })}
          fullWidth
        />

        <TextField
          label="Birth Date From"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.start_birth_date}
          onChange={(e) =>
            setFilters({
              ...filters,
              start_birth_date: e.target.value,
            })
          }
        />

        <TextField
          label="Birth Date To"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.end_birth_date}
          onChange={(e) =>
            setFilters({
              ...filters,
              end_birth_date: e.target.value,
            })
          }
        />

        <Button
          variant="contained"
          onClick={() => {
            setPaginationModel((p) => ({ ...p, page: 0 }));
            setIsFilterOpen(false);
            loadAuthors();
          }}
        >
          Apply Filters
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            setFilters({});
            setPaginationModel((p) => ({ ...p, page: 0 }));
            setIsFilterOpen(false);
            loadAuthors();
          }}
        >
          Clear
        </Button>
      </div>
    </Drawer>
  );
}
