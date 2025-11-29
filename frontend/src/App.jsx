import { useState } from 'react';
import AccessRequestForm from './AccessRequestForm';
import RequestsList from './RequestsList';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRequestCreated = (newRequest) => {
    console.log('New request created:', newRequest);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>IAM Access Portal</h1>
        <p>Request and manage identity and access</p>
      </header>
      
      <div className="app-container">
        <div className="form-section">
          <AccessRequestForm onRequestCreated={handleRequestCreated} />
        </div>
        
        <div className="list-section">
          <RequestsList refresh={refreshKey} />
        </div>
      </div>
    </div>
  );
}

export default App;