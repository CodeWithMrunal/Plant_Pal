import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Paper, Button, Select, MenuItem, Typography } from '@mui/material';
import './App.css';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4CAF50',
      light: '#81C784',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(37, 40, 54, 0.9)',
    },
  },
  typography: {
    h2: {
      fontSize: '3.5rem',
      fontWeight: 700,
      marginBottom: '2rem',
    },
    h4: {
      fontSize: '2.5rem',
      fontWeight: 600,
      marginBottom: '1.5rem',
    },
    h6: {
      fontSize: '1.2rem',
      fontWeight: 600,
      color: '#81C784',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '30px',
          padding: '12px 24px',
          textTransform: 'none',
          fontSize: '1.1rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <div className="App">
        <Container maxWidth="lg" className="main-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" className="app-title">
              🌿 Plant Disease Detection
            </Typography>

            <Paper elevation={3} className="upload-container">
              <Typography variant="h5" gutterBottom>
                Upload Plant Image
              </Typography>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="file-input-wrapper"
              >
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="file-input"
                  id="file-input"
                />
                <label htmlFor="file-input" className="file-input-label">
                  <span>Choose File</span>
                  {selectedFile && <span className="file-name">{selectedFile.name}</span>}
                </label>
              </motion.div>
              <Button 
                variant="contained"
                onClick={handleUpload}
                disabled={loading}
                className="upload-button"
                startIcon={loading ? <span className="loading-spinner"></span> : null}
              >
                {loading ? 'Analyzing Plant...' : 'Detect Disease'}
              </Button>
            </Paper>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="result-container"
              >
                <Typography variant="h4">Detection Result</Typography>
                <div className="result-image-container">
                  <img 
                    src={`data:image/jpeg;base64,${result.image}`} 
                    alt="Detection Result" 
                    className="result-image"
                  />
                </div>

                <div className="predictions-container">
                  <Typography variant="h5">Detected Diseases:</Typography>
                  {result.predictions.map((pred, index) => (
                    <Paper 
                      key={index}
                      className="prediction-card"
                      elevation={2}
                    >
                      <Typography variant="h6">{pred.class}</Typography>
                      <Typography variant="body1">
                        Confidence: {(pred.confidence * 100).toFixed(2)}%
                      </Typography>
                    </Paper>
                  ))}
                </div>

                <div className="translation-section">
                  <Select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="language-select"
                  >
                    {languages.map(lang => (
                      <MenuItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </MenuItem>
                    ))}
                  </Select>

                  <Button
                    variant="contained"
                    onClick={handleTranslate}
                    disabled={translating}
                    className="translate-button"
                  >
                    {translating ? 'Translating...' : `Get Information in ${languages.find(l => l.code === selectedLanguage).name}`}
                  </Button>
                </div>

                {translatedData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="translated-container"
                  >
                    <Paper elevation={3} className="info-paper">
                      <div className="info-header">
                        <Typography variant="h5">
                          Disease Information
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={handleTextToSpeech}
                          disabled={isPlaying}
                          startIcon={<span>🔊</span>}
                        >
                          {isPlaying ? 'Playing...' : 'Listen'}
                        </Button>
                      </div>
                      
                      <div className="info-content">
                        <Typography variant="h6">Disease Name:</Typography>
                        <Typography>{translatedData.name}</Typography>
                        
                        <Typography variant="h6">Description:</Typography>
                        <Typography>{translatedData.description}</Typography>
                        
                        <Typography variant="h6">Cure:</Typography>
                        <Typography>{translatedData.cure}</Typography>
                      </div>
                    </Paper>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </Container>
      </div>
    </ThemeProvider>
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