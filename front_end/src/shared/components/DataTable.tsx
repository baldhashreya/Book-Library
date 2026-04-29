import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridSortModel,
  type GridFilterModel,
  type GridRowParams,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface DataTableProps<T extends { _id: string | number }> {
  rows: T[];
  columns: GridColDef[];
  paginationModel: { page: number; pageSize: number };
  onPaginationChange: (model: { page: number; pageSize: number }) => void;
  sortModel?: GridSortModel;
  onSortModelChange?: (model: GridSortModel) => void;
  rowCount: number;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  loading: boolean;
  checkboxSelection?: boolean;
  disableMultipleRowSelection?: boolean;
  onRowSelect?: (ids: string[]) => void;
  onFilterModelChange?: (model: GridFilterModel) => void;
}

export default function DataTable<T extends { _id: string | number }>({
  rows,
  columns,
  paginationModel,
  onPaginationChange,
  sortModel,
  onSortModelChange,
  rowCount,
  onEdit,
  onDelete,
  loading,
  checkboxSelection,
  disableMultipleRowSelection,
  onRowSelect,
  onFilterModelChange
}: DataTableProps<T>) {
  const actionColumn = {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 120,
    getActions: (params: GridRowParams<T>) => [
      <GridActionsCellItem
        icon={<EditIcon color="primary" />}
        label="Edit"
        onClick={() => onEdit(params.row)}
      />,
      <GridActionsCellItem
        icon={<DeleteIcon color="error" />}
        label="Delete"
        onClick={() => onDelete(params.row)}
      />,
    ],
  };
  return (
    <Paper sx={{ height: 430, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={[...columns, actionColumn]}
        getRowId={(row) => row._id}
        pagination
        paginationMode="server"
        filterMode="server"
        onFilterModelChange={onFilterModelChange}
        onSortModelChange={onSortModelChange}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        sortingMode={sortModel && onSortModelChange ? "server" : "client"}
        sortModel={sortModel}
        rowCount={rowCount}
        pageSizeOptions={[5, 10, 20]}
        disableColumnMenu
        loading={loading}
        sx={{ border: "none" }}
        checkboxSelection={checkboxSelection}
        disableMultipleRowSelection={disableMultipleRowSelection}
        onRowSelectionModelChange={(selectionModel) => {
          const ids =
            Array.isArray(selectionModel) ? selectionModel : selectionModel.ids;

          onRowSelect?.(Array.from(ids));
        }}
      />
    </Paper>
  );
}
