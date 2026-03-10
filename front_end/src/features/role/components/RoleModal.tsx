import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Role, RoleFormData, RolePermission } from "../../../types/role";
import { roleService, availablePermissions } from "../roleService";
import CancelButton from "../../../shared/components/Button/CancleButton";
import CustomButton from "../../../shared/components/Button/CustomButton";
import ModalHeader from "../../../shared/components/ModalHeader";

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

          <div className="form-group">
            <label htmlFor="name">Role Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              placeholder="Enter role name"
              maxLength={50}
              className={formik.touched.name && formik.errors.name ? "input-error" : ""}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.name}</div>
            )}
            <div className="char-count">{formik.values.name.length}/50</div>
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

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              rows={3}
              placeholder="Enter role description"
              maxLength={200}
              className={formik.touched.description && formik.errors.description ? "input-error" : ""}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.description}</div>
            )}
            <div className="char-count">{formik.values.description.length}/200</div>
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
