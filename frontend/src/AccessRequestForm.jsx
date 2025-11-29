import { useState } from 'react';
import axios from 'axios';

function AccessRequestForm({ onRequestCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    access_type: '',
    justification: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/requests', formData);
      console.log('Request created:', response.data);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        access_type: '',
        justification: ''
      });
      
      // Notify parent component
      if (onRequestCreated) {
        onRequestCreated(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create request');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="form-container">
      <h2>Request Access</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="access_type">Access Type:</label>
          <select
            id="access_type"
            name="access_type"
            value={formData.access_type}
            onChange={handleChange}
            required
          >
            <option value="">Select access type...</option>
            <option value="Azure AD Group">Azure AD Group</option>
            <option value="Service Principal">Service Principal</option>
            <option value="Role Assignment">Role Assignment</option>
            <option value="Resource Access">Resource Access</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="justification">Justification:</label>
          <textarea
            id="justification"
            name="justification"
            value={formData.justification}
            onChange={handleChange}
            rows="4"
            placeholder="Why do you need this access?"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}

export default AccessRequestForm;