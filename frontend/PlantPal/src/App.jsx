import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // Add new state for selected language
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [translatedData, setTranslatedData] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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
        diseaseName: result.predictions[0].class,
        targetLanguage: selectedLanguage
      });
      setTranslatedData(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error translating disease information');
    }
    setTranslating(false);
  };

  const handleTextToSpeech = async () => {
    setIsPlaying(true);
    try {
      const response = await axios.post('http://localhost:5000/text-to-speech', {
        text: `${translatedData.name}. ${translatedData.description}. ${translatedData.cure}`,
        targetLanguage: selectedLanguage
      }, {
        responseType: 'blob'
      });

      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.play();
    } catch (error) {
      console.error('Error:', error);
      alert('Error converting text to speech');
      setIsPlaying(false);
    }
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
              <div className="translation-controls">
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="language-select"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={handleTranslate} 
                  disabled={translating}
                  className="translate-button"
                >
                  {translating ? 'Translating...' : `Get Disease Information in ${languages.find(l => l.code === selectedLanguage).name}`}
                </button>
              </div>
            </div>
            {translatedData && (
              <div className="translated-info">
                <div className="info-header">
                  <h3>Disease Information in Hindi:</h3>
                  <button 
                    onClick={handleTextToSpeech}
                    disabled={isPlaying}
                    className="tts-button"
                  >
                    {isPlaying ? 'Playing...' : '🔊 Listen'}
                  </button>
                </div>
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

// Language options
const languages = [
  { code: 'en-IN', name: 'English' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'bn-IN', name: 'Bengali' },
  { code: 'gu-IN', name: 'Gujarati' },
  { code: 'kn-IN', name: 'Kannada' },
  { code: 'ml-IN', name: 'Malayalam' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'od-IN', name: 'Odia' },
  { code: 'pa-IN', name: 'Punjabi' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'te-IN', name: 'Telugu' }
];