import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Role, RoleFormData, RolePermission } from "../../../types/role";
import { roleService, availablePermissions } from "../roleService";
import FormAction from "../../../shared/components/FormAction";
import ModalHeader from "../../../shared/components/ModalHeader";
import { TextField } from "@mui/material";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: RoleFormData) => void;
  role?: Role | null;
  mode: "add" | "edit";
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Role name is required")
    .max(50, "Role name must be at most 50 characters"),
  permissions: Yup.array()
    .of(Yup.string())
    .min(1, "At least one permission is required")
    .required("Permissions are required"),
  description: Yup.string()
    .required("Description is required")
    .max(200, "Description must be at most 200 characters"),
});

const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  role,
  mode,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      permissions: [] as RolePermission[],
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      setLoading(true);
      setError("");

      try {
        const exists = await (roleService as any).getRoles(
          { name: values.name.trim() as any },
          mode === "edit" ? role?._id : undefined
        );

        if (exists) {
          setFieldError("name", "A role with this name already exists");
          setLoading(false);
          return;
        }

        await onSave(values as RoleFormData);
        onClose();
      } catch (error) {
        console.error("Error saving role:", error);
        setError("An error occurred while saving the role");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      setError("");
      if (mode === "edit" && role) {
        formik.setValues({
          name: role.name,
          permissions: [...role.permissions],
          description: role.description,
        });
      } else {
        formik.setValues({
          name: "",
          permissions: [],
          description: "",
        });
        formik.setTouched({});
        formik.setErrors({});
      }
    }
  }, [isOpen, mode, role]);

  const handlePermissionChange = (
    permission: RolePermission,
    checked: boolean,
  ) => {
    formik.setFieldValue(
      "permissions",
      checked ?
        [...formik.values.permissions, permission]
      : formik.values.permissions.filter((p) => p !== permission),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    formik.setFieldValue(
      "permissions",
      checked ? availablePermissions.map((p) => p.value) : [],
    );
  };

  if (!isOpen) return null;

  const allSelected =
    formik.values.permissions.length === availablePermissions.length;

  return (
    <div className="modal-overlay">
      <div className="modal-content role-modal">
        <ModalHeader
          title={mode === "add" ? "Add New Role" : "Edit Role"}
          onClose={onClose}
        />

        <form
          onSubmit={formik.handleSubmit}
          className="role-form"
        >
          {error && <div className="error-message">{error}</div>}

          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Role Name *"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              placeholder="Enter role name"
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={(formik.touched.name && formik.errors.name) || `${formik.values.name.length}/50`}
              slotProps={{ htmlInput: { maxLength: 50 }, formHelperText: { sx: { display: 'flex', justifyContent: 'space-between' } } }}
            />
          </div>

          <div className="form-group">
            <label>Permissions *</label>
            <div className="permissions-section">
              <div className="permissions-header">
                <span>Select permissions for this role</span>
                <label className="select-all">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  Select All
                </label>
              </div>

              <div className="permissions-grid">
                {availablePermissions.map((permission) => (
                  <label
                    key={permission.value}
                    className="permission-item"
                  >
                    <input
                      type="checkbox"
                      name="permissions"
                      value={permission.value}
                      checked={formik.values.permissions.includes(permission.value)}
                      onChange={(e) =>
                        handlePermissionChange(
                          permission.value,
                          e.target.checked,
                        )
                      }
                      onBlur={formik.handleBlur}
                      disabled={loading}
                    />
                    <span className="permission-label">{permission.label}</span>
                  </label>
                ))}
              </div>
              
              {formik.touched.permissions && formik.errors.permissions && (
                <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px', marginLeft: '4px' }}>
                  {typeof formik.errors.permissions === 'string' ? formik.errors.permissions : "Invalid permissions"}
                </div>
              )}

              <div className="selected-count">
                {formik.values.permissions.length} of {availablePermissions.length}{" "}
                permissions selected
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "2rem" }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              id="description"
              name="description"
              label="Description *"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              placeholder="Enter role description"
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={(formik.touched.description && formik.errors.description) || `${formik.values.description.length}/200`}
              slotProps={{ htmlInput: { maxLength: 200 }, formHelperText: { sx: { display: 'flex', justifyContent: 'space-between' } } }}
            />
          </div>

          <FormAction
            loading={loading}
            onClose={onClose}
            label={
              loading ? "Saving..."
              : mode === "add" ?
                "Add Role"
              : "Update Role"
            }
          />
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
