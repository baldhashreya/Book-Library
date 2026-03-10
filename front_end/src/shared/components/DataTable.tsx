import {
  DataGrid,
  GridActionsCellItem,
  type GridSortModel,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface DataTableProps {
  rows: any[];
  columns: any[];
  paginationModel: { page: number; pageSize: number };
  onPaginationChange: (model: { page: number; pageSize: number }) => void;
  sortModel?: any[][];
  onSortModelChange?: (model: any) => void;
  rowCount: number;
  onEdit: (row: any) => void;
  onDelete: (row: any) => void;
  loading: boolean;
  checkboxSelection?: boolean;
  disableMultipleRowSelection?: boolean;
  onRowSelect?: (ids: string[]) => void;
  onSortModelChange?: (model: GridSortModel) => void;
  onFilterModelChange?: (model: any) => void;
}

export default function DataTable({
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
  onSortModelChange,
  onFilterModelChange
}: DataTableProps) {
  const actionColumn = {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 120,
    getActions: (params: any) => [
      <GridActionsCellItem
        icon={<EditIcon color="primary" />}
        label="Edit"
        onClick={() => onEdit(params.row)}
        color="primary"
      />,
      <GridActionsCellItem
        icon={<DeleteIcon color="error" />}
        label="Delete"
        onClick={() => onDelete(params.row)}
        color="error"
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
        sortingMode="server"
        filterMode="server"
        onFilterModelChange={onFilterModelChange}
        onSortModelChange={onSortModelChange}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        sortingMode={sortModel && onSortModelChange ? "server" : "client"}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
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
