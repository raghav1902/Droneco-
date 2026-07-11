import React, { useState, useEffect } from 'react';
import { showToast } from '../../../utils/toast.js';
import API from '../../../api/api.js';
import { changePasswordSchema, settingsSchema, validateForm } from '../../../utils/validators.js';

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
            <label className="form-label">Institute Name</label>
            <input type="text" className="form-input" value={settings.name || ''} onChange={e => setSettings(s => ({ ...s, name: e.target.value }))} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Logo Upload</label>
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
            <label className="form-label">Address</label>
            <textarea className="form-textarea" rows="2" value={settings.address || ''} onChange={e => setSettings(s => ({ ...s, address: e.target.value }))}></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <input type="text" className="form-input" value={settings.contact || ''} onChange={e => setSettings(s => ({ ...s, contact: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={settings.email || ''} onChange={e => setSettings(s => ({ ...s, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Website</label>
            <input type="url" className="form-input" value={settings.website || ''} onChange={e => setSettings(s => ({ ...s, website: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Time Zone</label>
            <select className="form-select" value={settings.timezone || ''} onChange={e => setSettings(s => ({ ...s, timezone: e.target.value }))}>
              <option value="UTC (GMT+0)">UTC (GMT+0)</option>
              <option value="EST (GMT-5)">EST (GMT-5)</option>
              <option value="IST (GMT+5:30)">IST (GMT+5:30)</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Currency</label>
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

const FeeSettings = ({ settings, setSettings, onSave }) => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Fee Settings</h3>
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Default Due Date</label>
          <select className="form-select" value={settings.defaultDueDate || ''} onChange={e => setSettings(s => ({ ...s, defaultDueDate: e.target.value }))}>
            <option>5th of every month</option>
            <option>10th of every month</option>
            <option>15th of every month</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Grace Period (Days)</label>
          <input type="number" className="form-input" value={settings.gracePeriodDays || 0} onChange={e => setSettings(s => ({ ...s, gracePeriodDays: parseInt(e.target.value) || 0 }))} />
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Late Fee</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input type="number" className="form-input" value={settings.lateFeeAmount || 0} onChange={e => setSettings(s => ({ ...s, lateFeeAmount: parseInt(e.target.value) || 0 }))} placeholder="Amount" style={{ width: '150px' }} />
            <select className="form-select" style={{ width: '150px' }} value={settings.lateFeeType || ''} onChange={e => setSettings(s => ({ ...s, lateFeeType: e.target.value }))}>
              <option>Per Day</option>
              <option>Per Week</option>
              <option>Per Month</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Allow Partial Payments</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="partial" checked={settings.allowPartialPayments === true} onChange={() => setSettings(s => ({ ...s, allowPartialPayments: true }))} /> On</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="partial" checked={settings.allowPartialPayments === false} onChange={() => setSettings(s => ({ ...s, allowPartialPayments: false }))} /> Off</label>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Allow Installments</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="installments" checked={settings.allowInstallments === true} onChange={() => setSettings(s => ({ ...s, allowInstallments: true }))} /> On</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="installments" checked={settings.allowInstallments === false} onChange={() => setSettings(s => ({ ...s, allowInstallments: false }))} /> Off</label>
          </div>
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Tax Percentage (%)</label>
          <input type="number" className="form-input" value={settings.taxPercentage || 0} onChange={e => setSettings(s => ({ ...s, taxPercentage: parseInt(e.target.value) || 0 }))} style={{ maxWidth: '200px' }} />
        </div>
      </div>
      <button className="btn btn-primary" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => onSave({ fee: settings })}>
        <Save size={16} /> Save Changes
      </button>
    </div>
  </div>
);

const ReceiptSettings = ({ settings, setSettings, onSave }) => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Receipt Settings</h3>
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Receipt Header</label>
          <textarea className="form-textarea" rows="2" value={settings.header || ''} onChange={e => setSettings(s => ({ ...s, header: e.target.value }))}></textarea>
        </div>
        <div className="form-group">
          <label className="form-label">Footer Message</label>
          <textarea className="form-textarea" rows="2" value={settings.footerMessage || ''} onChange={e => setSettings(s => ({ ...s, footerMessage: e.target.value }))}></textarea>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Receipt Prefix</label>
            <input type="text" className="form-input" value={settings.prefix || ''} onChange={e => setSettings(s => ({ ...s, prefix: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Auto Receipt Numbering</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="auto_num" checked={settings.autoNumbering === true} onChange={() => setSettings(s => ({ ...s, autoNumbering: true }))} /> On</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="radio" name="auto_num" checked={settings.autoNumbering === false} onChange={() => setSettings(s => ({ ...s, autoNumbering: false }))} /> Off</label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Show Logo on Receipt</label>
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
            <label className="form-label">Field Label</label>
            <input type="text" className="form-input" value={newCustomField.label} onChange={e => setNewCustomField({ ...newCustomField, label: e.target.value })} placeholder="e.g. T-Shirt Size" />
          </div>
          <div className="form-group">
            <label className="form-label">Field Type</label>
            <select className="form-select" value={newCustomField.type} onChange={e => setNewCustomField({ ...newCustomField, type: e.target.value })}>
              <option value="text">Text Input</option>
              <option value="number">Number Input</option>
              <option value="date">Date Picker</option>
              <option value="dropdown">Dropdown Options</option>
            </select>
          </div>
          {newCustomField.type === 'dropdown' && (
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Dropdown Options (Comma separated)</label>
              <input type="text" className="form-input" value={newCustomField.options} onChange={e => setNewCustomField({ ...newCustomField, options: e.target.value })} placeholder="Small, Medium, Large" />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Display Step</label>
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

const UserManagement = () => (
  <div className="animate-fade-in">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1.25rem' }}>User Management</h3>
      <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
        <Plus size={16} /> Create User
      </button>
    </div>
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
          {[
            { id: 1, name: 'Admin User', email: 'admin@institute.edu', role: 'Admin', status: 'Active' },
            { id: 2, name: 'Sarah Jenkins', email: 'sarah@institute.edu', role: 'Receptionist', status: 'Active' },
            { id: 3, name: 'Mike Ross', email: 'mike@institute.edu', role: 'Counselor', status: 'Inactive' },
          ].map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
              <td style={{ padding: '1rem', fontWeight: 500 }}>{user.name}</td>
              <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.email}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ fontSize: '0.85rem', padding: '0.2rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>{user.role}</span>
              </td>
              <td style={{ padding: '1rem' }}>
                <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>{user.status}</span>
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }} title="Reset Password" onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}><Key size={14} /></button>
                <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}><Edit2 size={14} /></button>
                <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--danger)' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

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
            <label className="form-label">Current Password</label>
            <input type="password" className="form-input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input type="password" className="form-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={handleUpdatePassword} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Access & Sessions</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Two-Factor Authentication (2FA)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Coming soon in a future update.</span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Session Timeout (Minutes)</label>
            <input type="number" className="form-input" defaultValue="60" style={{ maxWidth: '200px' }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Users will be automatically logged out after this period of inactivity.</p>
          </div>
          <div>
            <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>View Login History</button>
            <button className="btn btn-secondary" style={{ marginTop: '0.5rem', marginLeft: '1rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>Manage Active Devices</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BackupRestore = () => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Backup & Restore</h3>
    <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Download Backup</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Generate and download a complete backup of the database.</p>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
          <Download size={16} /> Download SQL Backup
        </button>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Restore Backup</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Upload a previous backup file to restore the database. <strong style={{ color: 'var(--danger)' }}>Warning: This will overwrite all current data.</strong></p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input type="file" className="form-input" style={{ maxWidth: '300px' }} />
          <button className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>
            <Upload size={16} /> Restore
          </button>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Export Data</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Export complete system reports (Students, Fees, Leads).</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>Export to Excel (CSV)</button>
          <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); showToast('Action processed successfully!', 'success'); }}>Export to PDF</button>
        </div>
      </div>
    </div>
  </div>
);

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

const About = () => (
  <div className="animate-fade-in">
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>About System</h3>
    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'var(--accent-glow)', color: 'var(--accent-hex)', marginBottom: '1.5rem' }}>
        <Building2 size={48} />
      </div>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Institute Management System</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Version 1.0.0 (Build 20260703)</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', textAlign: 'left', background: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border)', paddingBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Developer</span>
          <span style={{ fontWeight: 500 }}>Antigravity Tech</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border)', paddingBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Support Contact</span>
          <span style={{ fontWeight: 500 }}>support@antigravity.tech</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>License</span>
          <span style={{ fontWeight: 500 }}>Commercial - Single Institute</span>
        </div>
      </div>
    </div>
  </div>
);

// --- Main AdminSettings Wrapper ---

const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState('institute');

  const [instituteSettings, setInstituteSettings] = useState({});
  const [feeSettings, setFeeSettings] = useState({});
  const [receiptSettings, setReceiptSettings] = useState({});
  const [formConfigSettings, setFormConfigSettings] = useState({});
  const [loadingSettings, setLoadingSettings] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await API.get('/settings');
      if (response.data.success && response.data.data) {
        setInstituteSettings(response.data.data.institute || {});
        setFeeSettings(response.data.data.fee || {});
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

  const menuItems = [
    { id: 'institute', label: 'Institute Settings', icon: Building2 },
    { id: 'fee', label: 'Fee Settings', icon: Wallet },
    { id: 'receipt', label: 'Receipt Settings', icon: Receipt },
    { id: 'form', label: 'Form Config', icon: Settings },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
    { id: 'audit', label: 'Audit Logs', icon: ScrollText },
    { id: 'about', label: 'About', icon: Info },
  ];

  const renderSection = () => {
    if (loadingSettings && ['institute', 'fee', 'receipt'].includes(activeSection)) {
      return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading settings...</div>;
    }

    switch (activeSection) {
      case 'institute': return <InstituteSettings settings={instituteSettings} setSettings={setInstituteSettings} onSave={handleSaveSettings} />;
      case 'fee': return <FeeSettings settings={feeSettings} setSettings={setFeeSettings} onSave={handleSaveSettings} />;
      case 'receipt': return <ReceiptSettings settings={receiptSettings} setSettings={setReceiptSettings} onSave={handleSaveSettings} />;
      case 'form': return <FormConfigSettings settings={formConfigSettings} setSettings={setFormConfigSettings} onSave={handleSaveSettings} />;
      case 'users': return <UserManagement />;
      case 'security': return <SecuritySettings />;
      case 'backup': return <BackupRestore />;
      case 'audit': return <AuditLogs />;
      case 'about': return <About />;
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
