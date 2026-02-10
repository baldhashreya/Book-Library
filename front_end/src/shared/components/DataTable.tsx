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
    getActions: (params) => [
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Edit"
        onClick={() => onEdit(params.row)}
        color="primary"
      />,
      <GridActionsCellItem
        icon={<DeleteIcon />}
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
        rowCount={rowCount}
        pageSizeOptions={[5, 10, 20]}
        loading={loading}
        sx={{ border: 0 }}
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
