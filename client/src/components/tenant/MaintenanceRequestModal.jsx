import React, { useState } from 'react';
import Modal from '../common/Modal';
import { maintenanceService } from '../../services/maintenanceService';
import { Wrench, Upload } from 'lucide-react';

const CATEGORIES = ['Plumbing', 'Electrical', 'Internet', 'Appliance', 'Cleaning', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const MaintenanceRequestModal = ({ isOpen, onClose, propertyId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Plumbing',
    priority: 'Medium',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('priority', formData.priority);
      if (propertyId) data.append('propertyId', propertyId);
      if (file) data.append('image', file);

      await maintenanceService.createRequest(data);
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', category: 'Plumbing', priority: 'Medium' });
    setFile(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Raise Maintenance Complaint" maxWidth="560px">
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
            }}
          >
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Issue Title</label>
          <input
            type="text"
            className="form-control"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Water heater leaking in master bath"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-control"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              {PRIORITIES.map((pri) => (
                <option key={pri} value={pri}>
                  {pri}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Detailed Description</label>
          <textarea
            className="form-control"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what happened, where the issue is located, and how urgently assistance is required..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Optional Photo Attachment</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Upload a clear photo to help the owner or technician assess the issue quickly.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
          <button type="button" onClick={handleClose} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
            <Wrench size={16} /> {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MaintenanceRequestModal;
