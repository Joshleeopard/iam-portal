import { useState, useEffect } from 'react';
import axios from 'axios';

function RequestsList({ refresh }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/requests');
      setRequests(response.data.requests);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch requests');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [refresh]);

  const refreshRequests = () => {
    setLoading(true);
    fetchRequests();
  };

  const handleApprove = async (requestId) => {
    setProcessingId(requestId);
    try {
      const approverName = prompt('Enter your name as approver:');
      if (!approverName) {
        setProcessingId(null);
        return;
      }

      const notes = prompt('Add approval notes (optional):');

      await axios.post(`http://localhost:5000/api/requests/${requestId}/approve`, {
        approved_by: approverName,
        notes: notes || ''
      });

      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve request');
      console.error('Error:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    setProcessingId(requestId);
    try {
      const approverName = prompt('Enter your name as approver:');
      if (!approverName) {
        setProcessingId(null);
        return;
      }

      const notes = prompt('Add rejection reason:');
      if (!notes) {
        alert('Rejection reason is required');
        setProcessingId(null);
        return;
      }

      await axios.post(`http://localhost:5000/api/requests/${requestId}/reject`, {
        approved_by: approverName,
        notes: notes
      });

      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reject request');
      console.error('Error:', err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="requests-container"><p>Loading requests...</p></div>;
  if (error) return <div className="requests-container"><div className="error">{error}</div></div>;

  return (
    <div className="requests-container">
      <div className="requests-header">
        <h2>Access Requests ({requests.length})</h2>
        <button onClick={refreshRequests}>Refresh</button>
      </div>
      
{requests.length === 0 ? (
  <div style={{
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6c757d'
  }}>
    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📋</div>
    <h3 style={{ marginBottom: '10px', color: '#495057' }}>No Access Requests Yet</h3>
    <p>Submit your first access request using the form on the left.</p>
  </div>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <h3>{request.name}</h3>
                <span className={`status status-${request.status}`}>
                  {request.status}
                </span>
              </div>
              <div className="request-details">
                <p><strong>Email:</strong> {request.email}</p>
                <p><strong>Access Type:</strong> {request.access_type}</p>
                {request.justification && (
                  <p><strong>Justification:</strong> {request.justification}</p>
                )}
                <p className="timestamp">
                  <strong>Requested:</strong> {new Date(request.created_at).toLocaleString()}
                </p>
                {request.approved_by && (
                  <p><strong>Processed by:</strong> {request.approved_by}</p>
                )}
                {request.approval_notes && (
                  <p><strong>Notes:</strong> {request.approval_notes}</p>
                )}
              </div>
              {request.status === 'pending' && (
                <div className="request-actions">
                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(request.id)}
                    disabled={processingId === request.id}
                  >
                    {processingId === request.id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleReject(request.id)}
                    disabled={processingId === request.id}
                  >
                    {processingId === request.id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestsList;