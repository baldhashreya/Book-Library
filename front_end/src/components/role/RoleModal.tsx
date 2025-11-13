import React, { useState, useEffect } from 'react';
import type { Role, RoleFormData, RolePermission } from '../../types/role';
import { roleService, availablePermissions } from '../../services/roleService';
import './RoleModal.css';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: RoleFormData) => void;
  role?: Role | null;
  mode: 'add' | 'edit';
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, onSave, role, mode }) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    permissions: [],
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (mode === 'edit' && role) {
        setFormData({
          name: role.name,
          permissions: [...role.permissions],
          description: role.description
        });
      } else {
        setFormData({
          name: '',
          permissions: [],
          description: ''
        });
      }
    }
  }, [isOpen, mode, role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
  };

  const handlePermissionChange = (permission: RolePermission, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked ? availablePermissions.map(p => p.value) : []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name.trim()) {
        setError('Role name is required');
        return;
      }

      if (formData.permissions.length === 0) {
        setError('At least one permission is required');
        return;
      }

      const exists = await roleService.getRoles(
        { name: formData.name.trim() },
        mode === 'edit' ? role?.id : undefined
        // mode === 'edit' ? role?.id : undefined
      );
      
      
      if (exists) {
        setError('A role with this name already exists');
        return;
      }

      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving role:', error);
      setError('An error occurred while saving the role');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const allSelected = formData.permissions.length === availablePermissions.length;

  return (
    <div className="modal-overlay">
      <div className="modal-content role-modal">
        <div className="modal-header">
          <h2>{mode === 'add' ? 'Add New Role' : 'Edit Role'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="role-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Role Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter role name"
              maxLength={50}
            />
            <div className="char-count">{formData.name.length}/50</div>
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
                {availablePermissions.map(permission => (
                  <label key={permission.value} className="permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission.value)}
                      onChange={(e) => handlePermissionChange(permission.value, e.target.checked)}
                      disabled={loading}
                    />
                    <span className="permission-label">{permission.label}</span>
                  </label>
                ))}
              </div>
              
              <div className="selected-count">
                {formData.permissions.length} of {availablePermissions.length} permissions selected
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
              rows={3}
              placeholder="Enter role description"
              maxLength={200}
            />
            <div className="char-count">{formData.description.length}/200</div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (mode === 'add' ? 'Add Role' : 'Update Role')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;