import { useState, useEffect } from 'react';
import axios from 'axios';

function RequestsList({ refresh }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestsList;