import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing image');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plant Disease Detection</h1>
        <div className="upload-section">
          <input
            type="file"
            onChange={handleFileSelect}
            accept="image/*"
          />
          <button onClick={handleUpload} disabled={loading}>
            {loading ? 'Processing...' : 'Detect Disease'}
          </button>
        </div>
        {result && (
          <div className="result-section">
            <h2>Detection Result:</h2>
            <img 
              src={`data:image/jpeg;base64,${result.image}`} 
              alt="Detection Result" 
            />
            <div className="predictions">
              <h3>Detected Diseases:</h3>
              <pre>{JSON.stringify(result.predictions, null, 2)}</pre>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;