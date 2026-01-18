import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
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
  checkboxSelection
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
      />,
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={() => onDelete(params.row)}
      />,
    ],
  };

  return (
    <Paper sx={{ height: 450, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={[...columns, actionColumn]}
        getRowId={(row) => row._id}
        pagination
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        rowCount={rowCount}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection={checkboxSelection}
        loading={loading}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
