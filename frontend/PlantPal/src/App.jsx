import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [translatedData, setTranslatedData] = useState(null);
  const [translating, setTranslating] = useState(false);

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

  const handleTranslate = async () => {
    if (!result || !result.predictions || result.predictions.length === 0) {
      alert('No disease detection results available!');
      return;
    }

    setTranslating(true);
    try {
      const response = await axios.post('http://localhost:5000/translate', {
        diseaseName: result.predictions[0].class // Assuming first prediction is the main one
      });
      setTranslatedData(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error translating disease information');
    }
    setTranslating(false);
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
              <div className="prediction-card">
                {result.predictions.map((pred, index) => (
                  <div key={index} className="prediction-item">
                    <div className="prediction-header">
                      <span className="disease-name">{pred.class}</span>
                      <span className="confidence">
                        Confidence: {(pred.confidence * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="prediction-details">
                      <p>Location: {pred.bbox.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={handleTranslate} 
                disabled={translating}
                className="translate-button"
              >
                {translating ? 'Translating...' : 'Get Disease Information in Hindi'}
              </button>
            </div>
            {translatedData && (
              <div className="translated-info">
                <h3>Disease Information in Hindi:</h3>
                <div className="info-section">
                  <h4>Disease Name:</h4>
                  <p>{translatedData.name}</p>
                  <h4>Description:</h4>
                  <p>{translatedData.description}</p>
                  <h4>Cure:</h4>
                  <p>{translatedData.cure}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;