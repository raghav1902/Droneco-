import React, { useState, useEffect } from 'react';
import { showToast } from '../../../utils/toast.js';
import API from '../../../api/api.js';
import { changePasswordSchema, settingsSchema, validateForm, createUserSchema, editUserSchema } from '../../../utils/validators.js';
import { ROLE_OPTIONS } from '../../../utils/roles.js';
import { useAuth } from '../../../context/AuthContext.jsx';

import {
  Building2, Wallet, Receipt, Users, Shield,
  Database, ScrollText, Info, Save, Upload,
  Download, Plus, Edit2, Trash2, Key, Settings,
} from 'lucide-react';

// --- Sub-components for each Settings Section ---

const InstituteSettings = ({ settings, setSettings, onSave }) => {
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(s => ({ ...s, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fade-in">
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Institute Settings</h3>
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Institute Name <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input type="text" className="form-input" value={settings.name || ''} onChange={e => setSettings(s => ({ ...s, name: e.target.value }))} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Logo Upload <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {settings.logo ? <img src={settings.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No Logo</span>}
              </div>
              <label className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <Upload size={16} /> Choose Image
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
              </label>
            </div>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Address <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <textarea className="form-textarea" rows="2" value={settings.address || ''} onChange={e => setSettings(s => ({ ...s, address: e.target.value }))}></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Contact Number <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input type="text" className="form-input" value={settings.contact || ''} onChange={e => setSettings(s => ({ ...s, contact: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Email <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input type="email" className="form-input" value={settings.email || ''} onChange={e => setSettings(s => ({ ...s, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Website <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input type="url" className="form-input" value={settings.website || ''} onChange={e => setSettings(s => ({ ...s, website: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Time Zone <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <select className="form-select" value={settings.timezone || ''} onChange={e => setSettings(s => ({ ...s, timezone: e.target.value }))}>
              <option value="UTC (GMT+0)">UTC (GMT+0)</option>
              <option value="EST (GMT-5)">EST (GMT-5)</option>
              <option value="IST (GMT+5:30)">IST (GMT+5:30)</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Currency <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <select className="form-select" style={{ maxWidth: '200px' }} value={settings.currency || ''} onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))}>
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => onSave({ institute: settings })}>
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  );
};



const ReceiptSettings = ({ settings, setSettings, onSave }) => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Receipt Settings</h3>
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Receipt Header <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
          <textarea className="form-textarea" rows="2" value={settings.header || ''} onChange={e => setSettings(s => ({ ...s, header: e.target.value }))}></textarea>
        </div>
        <div className="form-group">
          <label className="form-label">Footer Message <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
          <textarea className="form-textarea" rows="2" value={settings.footerMessage || ''} onChange={e => setSettings(s => ({ ...s, footerMessage: e.target.value }))}></textarea>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Receipt Prefix <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input type="text" className="form-input" value={settings.prefix || ''} onChange={e => setSettings(s => ({ ...s, prefix: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Auto Receipt Numbering <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="auto_num" checked={settings.autoNumbering === true} onChange={() => setSettings(s => ({ ...s, autoNumbering: true }))} /> On</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="auto_num" checked={settings.autoNumbering === false} onChange={() => setSettings(s => ({ ...s, autoNumbering: false }))} /> Off</label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Show Logo on Receipt <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="show_logo" checked={settings.showLogo === true} onChange={() => setSettings(s => ({ ...s, showLogo: true }))} /> Yes</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="show_logo" checked={settings.showLogo === false} onChange={() => setSettings(s => ({ ...s, showLogo: false }))} /> No</label>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => onSave({ receipt: settings })}>
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  </div>
);

const FormConfigSettings = ({ settings, setSettings, onSave }) => {
  const [newCustomField, setNewCustomField] = useState({ id: '', label: '', type: 'text', options: '', required: false, step: 'Personal' });

  const handleToggleField = (field, key) => {
    setSettings(s => ({
      ...s,
      [field]: { ...s[field], [key]: !s[field]?.[key] }
    }));
  };

  const handleAddCustomField = () => {
    if (!newCustomField.label) return showToast('Label is required', 'error');
    const id = newCustomField.label.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const optionsArray = newCustomField.options ? newCustomField.options.split(',').map(o => o.trim()) : [];
    
    setSettings(s => ({
      ...s,
      customFields: [...(s.customFields || []), { ...newCustomField, id, options: optionsArray }]
    }));
    
    setNewCustomField({ id: '', label: '', type: 'text', options: '', required: false, step: 'Personal' });
    showToast('Custom field added locally. Remember to save changes.', 'success');
  };

  const handleRemoveCustomField = (index) => {
    setSettings(s => ({
      ...s,
      customFields: s.customFields.filter((_, i) => i !== index)
    }));
  };

  const StandardFieldRow = ({ label, fieldKey }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontWeight: 500 }}>{label}</span>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={settings[fieldKey]?.visible !== false} onChange={() => handleToggleField(fieldKey, 'visible')} /> Visible
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={settings[fieldKey]?.required !== false} onChange={() => handleToggleField(fieldKey, 'required')} disabled={settings[fieldKey]?.visible === false} /> Required
        </label>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Dynamic Form Configuration</h3>
      
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Standard Fields</h4>
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <StandardFieldRow label="Guardian Details (Student Form)" fieldKey="guardian" />
          <StandardFieldRow label="Address Details" fieldKey="address" />
          <StandardFieldRow label="Photo & Signature" fieldKey="media" />
          <StandardFieldRow label="Category" fieldKey="category" />
          <StandardFieldRow label="Blood Group" fieldKey="blood_group" />
          <StandardFieldRow label="Religion" fieldKey="religion" />
          <StandardFieldRow label="Marital Status" fieldKey="marital_status" />
          <StandardFieldRow label="Identification Marks" fieldKey="identification_marks" />
          <StandardFieldRow label="Disability Details" fieldKey="disability" />
          <StandardFieldRow label="Previous Qualification" fieldKey="qualification" />
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Add Custom Field</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Field Label <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input type="text" className="form-input" value={newCustomField.label} onChange={e => setNewCustomField({ ...newCustomField, label: e.target.value })} placeholder="e.g. T-Shirt Size" />
          </div>
          <div className="form-group">
            <label className="form-label">Field Type <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <select className="form-select" value={newCustomField.type} onChange={e => setNewCustomField({ ...newCustomField, type: e.target.value })}>
              <option value="text">Text Input</option>
              <option value="number">Number Input</option>
              <option value="date">Date Picker</option>
              <option value="dropdown">Dropdown Options</option>
            </select>
          </div>
          {newCustomField.type === 'dropdown' && (
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Dropdown Options (Comma separated) <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
              <input type="text" className="form-input" value={newCustomField.options} onChange={e => setNewCustomField({ ...newCustomField, options: e.target.value })} placeholder="Small, Medium, Large" />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Display Step <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <select className="form-select" value={newCustomField.step} onChange={e => setNewCustomField({ ...newCustomField, step: e.target.value })}>
              <option value="Personal">Personal Details</option>
              <option value="Academic">Academic Details</option>
              <option value="Course">Course Details</option>
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={newCustomField.required} onChange={e => setNewCustomField({ ...newCustomField, required: e.target.checked })} /> Is Required?
            </label>
          </div>
        </div>
        <button className="btn btn-secondary" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleAddCustomField}>
          <Plus size={16} /> Add Custom Field
        </button>
      </div>

      {(settings.customFields?.length > 0) && (
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Configured Custom Fields</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.5rem' }}>Label</th>
                <th style={{ padding: '0.5rem' }}>Type</th>
                <th style={{ padding: '0.5rem' }}>Step</th>
                <th style={{ padding: '0.5rem' }}>Required</th>
                <th style={{ padding: '0.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.customFields.map((field, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.5rem' }}>{field.label}</td>
                  <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>{field.type}</td>
                  <td style={{ padding: '0.5rem' }}>{field.step}</td>
                  <td style={{ padding: '0.5rem' }}>{field.required ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem', color: 'var(--danger)' }} onClick={() => handleRemoveCustomField(index)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => onSave({ formConfig: settings })}>
        <Save size={16} /> Save Configuration
      </button>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [formData, setFormData] = useState({ name: '', email: '', roleName: 'Receptionist', password: '', status: 'active' });
  const [resetPassword, setResetPassword] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/users?page=${page}&limit=10`);
      if (res.data.success) {
        setUsers(res.data.data.map(u => ({ ...u, id: u._id || u.id })));
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleOpenCreate = () => {
    setFormData({ name: '', email: '', roleName: 'Receptionist', password: '', status: 'active' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setFormData({ 
      name: user.name, 
      email: user.email, 
      roleName: user.role?.name || user.role || 'Receptionist', 
      status: user.status 
    });
    setSelectedUser(user);
    setIsEditing(true);
    setShowModal(true);
  };

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});
    
    // Validate
    const validation = validateForm(isEditing ? editUserSchema : createUserSchema, formData);
    if (!validation.success) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditing) {
        const res = await API.put(`/users/${selectedUser.id}`, formData);
        if (res.data.success) {
          showToast('User updated successfully', 'success');
          setShowModal(false);
          fetchUsers();
        }
      } else {
        const res = await API.post('/auth/register', formData);
        if (res.data.success) {
          showToast('User created successfully', 'success');
          setShowModal(false);
          fetchUsers();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save user', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        const res = await API.delete(`/users/${user.id}`);
        if (res.data.success) {
          showToast('User deleted successfully', 'success');
          fetchUsers();
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to delete user', 'error');
      }
    }
  };

  const handleOpenReset = (user) => {
    setSelectedUser(user);
    setResetPassword('');
    setShowResetModal(true);
  };

  const handleSaveReset = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/users/${selectedUser.id}/reset-password`, { newPassword: resetPassword });
      if (res.data.success) {
        showToast('Password reset successfully', 'success');
        setShowResetModal(false);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reset password', 'error');
    }
  };

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>User Management</h3>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleOpenCreate}>
          <Plus size={16} /> Create User
        </button>
      </div>
      
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading users...</div>
      ) : (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Name</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Email</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Role</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{user.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', padding: '0.2rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>{user.role?.name || user.role}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>{user.status}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }} title="Reset Password" onClick={() => handleOpenReset(user)}><Key size={14} /></button>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }} onClick={() => handleOpenEdit(user)}><Edit2 size={14} /></button>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--danger)' }} onClick={() => handleDelete(user)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', padding: '1rem', borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
              <span style={{ display: 'flex', alignItems: 'center' }}>Page {page} of {totalPages}</span>
              <button className="btn btn-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </div>
      )}

      {/* User Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>{isEditing ? 'Edit User' : 'Create User'}</h4>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" value={formData.name} onChange={e => { setFormData({...formData, name: e.target.value}); setFormErrors({...formErrors, name: null}) }} />
                {formErrors.name && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{formErrors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={formData.email} onChange={e => { setFormData({...formData, email: e.target.value}); setFormErrors({...formErrors, email: null}) }} disabled={isEditing} />
                {formErrors.email && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{formErrors.email}</span>}
              </div>
              {!isEditing && (
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-input" value={formData.password} onChange={e => { setFormData({...formData, password: e.target.value}); setFormErrors({...formErrors, password: null}) }} />
                  {formErrors.password && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{formErrors.password}</span>}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={formData.roleName} onChange={e => { setFormData({...formData, roleName: e.target.value}); setFormErrors({...formErrors, roleName: null}) }}>
                  {ROLE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {formErrors.roleName && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{formErrors.roleName}</span>}
              </div>
              {isEditing && (
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={formData.status} onChange={e => { setFormData({...formData, status: e.target.value}); setFormErrors({...formErrors, status: null}) }}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {formErrors.status && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{formErrors.status}</span>}
                </div>
              )}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Reset Password for {selectedUser?.name}</h4>
            <form onSubmit={handleSaveReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input required type="password" className="form-input" value={resetPassword} onChange={e => setResetPassword(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Reset</button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowResetModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const validation = validateForm(changePasswordSchema, { currentPassword, newPassword });
    if (!validation.success) {
      const msgs = Object.values(validation.errors).join(', ');
      return showToast(msgs, 'error');
    }
    if (newPassword !== confirmPassword) {
      return showToast('New passwords do not match', 'error');
    }

    setLoading(true);
    try {
      const response = await API.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      if (response.data.success) {
        showToast('Password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(response.data.message || 'Update failed', 'error');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Security</h3>
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Change Password</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', maxWidth: '400px' }}>
          <div className="form-group">
            <label className="form-label">Current Password <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input type="password" className="form-input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">New Password <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input type="password" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password <span style={{ color: "var(--text-muted)", fontSize: "0.85em", fontWeight: "normal" }}>(Optional)</span></label>
            <input type="password" className="form-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={handleUpdatePassword} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>


    </div>
  );
};



const AuditLogs = () => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Audit Logs</h3>
    <div className="glass-card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Timestamp</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>User</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Action</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Details</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id: 1, time: '2026-07-03 10:45 AM', user: 'Admin User', action: 'Login', details: 'Successful login', ip: '192.168.1.1' },
            { id: 3, time: '2026-07-03 11:20 AM', user: 'Sarah Jenkins', action: 'Collect Fee', details: 'Collected ₹1500 from STU-089', ip: '192.168.1.4' },
          ].map(log => (
            <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
              <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{log.time}</td>
              <td style={{ padding: '1rem', fontWeight: 500 }}>{log.user}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ fontSize: '0.85rem', padding: '0.2rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>{log.action}</span>
              </td>
              <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{log.details}</td>
              <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{log.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const About = ({ settings, setSettings, onSave }) => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>About System</h3>
    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'var(--accent-glow)', color: 'var(--accent-hex)', marginBottom: '1.5rem' }}>
        <Building2 size={48} />
      </div>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Institute Management System</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Version {settings.version || '1.0.0'} (Build {settings.build || '20260703'})</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', textAlign: 'left', background: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div className="form-group">
           <label className="form-label">Developer</label>
           <input type="text" className="form-input" value={settings.developer || ''} onChange={e => setSettings(s => ({...s, developer: e.target.value}))} />
        </div>
        <div className="form-group">
           <label className="form-label">Support Contact</label>
           <input type="text" className="form-input" value={settings.supportEmail || ''} onChange={e => setSettings(s => ({...s, supportEmail: e.target.value}))} />
        </div>
        <div className="form-group">
           <label className="form-label">Version</label>
           <input type="text" className="form-input" value={settings.version || ''} onChange={e => setSettings(s => ({...s, version: e.target.value}))} />
        </div>
        <div className="form-group">
           <label className="form-label">Build</label>
           <input type="text" className="form-input" value={settings.build || ''} onChange={e => setSettings(s => ({...s, build: e.target.value}))} />
        </div>
        <div className="form-group">
           <label className="form-label">License</label>
           <input type="text" className="form-input" value={settings.license || ''} onChange={e => setSettings(s => ({...s, license: e.target.value}))} />
        </div>
      </div>
      <button className="btn btn-primary" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }} onClick={() => onSave({ about: settings })}>
          <Save size={16} /> Save Changes
      </button>
    </div>
  </div>
);

// --- Main AdminSettings Wrapper ---

const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState('institute');

  const [instituteSettings, setInstituteSettings] = useState({});
  const [aboutSettings, setAboutSettings] = useState({});
  const [receiptSettings, setReceiptSettings] = useState({});
  const [formConfigSettings, setFormConfigSettings] = useState({});
  const [loadingSettings, setLoadingSettings] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await API.get('/settings');
      if (response.data.success && response.data.data) {
        setInstituteSettings(response.data.data.institute || {
          name: 'Droneco',
          address: 'B-120 Sector 88 Noida UP IN 201305',
          contact: '+91 931 900 7542',
          email: 'info@godroneco.com'
        });
        setAboutSettings(response.data.data.about || {
          developer: 'Droneco',
          supportEmail: 'info@godroneco.com',
          version: '1.0.0',
          build: '20260703',
          license: 'Commercial - Single Institute'
        });
        setReceiptSettings(response.data.data.receipt || {});
        setFormConfigSettings(response.data.data.formConfig || {});
      }
    } catch (error) {
      console.error('Error loading settings', error);
      showToast('Failed to load settings', 'error');
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (payload) => {
    const validation = validateForm(settingsSchema, payload);
    if (!validation.success) {
      const msgs = Object.values(validation.errors).join(', ');
      return showToast(msgs, 'error');
    }

    try {
      const response = await API.put('/settings', payload);
      if (response.data.success) {
        showToast('Settings saved successfully', 'success');
      } else {
        showToast(response.data.message || 'Failed to save settings', 'error');
      }
    } catch (error) {
      console.error('Error saving settings', error);
      showToast('Error saving settings', 'error');
    }
  };

  const { user } = useAuth();

  const menuItems = [
    { id: 'institute', label: 'Institute Settings', icon: Building2 },

    { id: 'receipt', label: 'Receipt Settings', icon: Receipt },
    { id: 'form', label: 'Form Config', icon: Settings },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },

    { id: 'audit', label: 'Audit Logs', icon: ScrollText },
    { id: 'about', label: 'About', icon: Info },
  ].filter(item => {
    if (item.id === 'users' && user?.role !== 'Admin') return false;
    return true;
  });

  const renderSection = () => {
    if (loadingSettings && ['institute', 'fee', 'receipt'].includes(activeSection)) {
      return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading settings...</div>;
    }

    switch (activeSection) {
      case 'institute': return <InstituteSettings settings={instituteSettings} setSettings={setInstituteSettings} onSave={handleSaveSettings} />;

      case 'receipt': return <ReceiptSettings settings={receiptSettings} setSettings={setReceiptSettings} onSave={handleSaveSettings} />;
      case 'form': return <FormConfigSettings settings={formConfigSettings} setSettings={setFormConfigSettings} onSave={handleSaveSettings} />;
      case 'users': return <UserManagement />;
      case 'security': return <SecuritySettings />;

      case 'audit': return <AuditLogs />;
      case 'about': return <About settings={aboutSettings} setSettings={setAboutSettings} onSave={handleSaveSettings} />;
      default: return <InstituteSettings settings={instituteSettings} setSettings={setInstituteSettings} onSave={handleSaveSettings} />;
    }
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', minHeight: 'calc(100vh - 100px)' }}>
      {/* Settings Navigation */}
      <div style={{ width: '250px', flexShrink: 0 }}>
        <div className="glass-card" style={{ padding: '1rem', position: 'sticky', top: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>Settings Menu</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`btn ${activeSection === item.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  justifyContent: 'flex-start',
                  padding: '0.75rem 1rem',
                  borderColor: 'transparent',
                  background: activeSection === item.id ? 'var(--accent-hex)' : 'transparent',
                  color: activeSection === item.id ? '#fff' : 'var(--text-main)',
                  boxShadow: 'none'
                }}
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon size={18} style={{ marginRight: '0.5rem' }} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Content area */}
      <div style={{ flex: 1, paddingBottom: '2rem' }}>
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminSettings;
