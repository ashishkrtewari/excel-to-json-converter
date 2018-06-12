import React, { Component } from 'react';
import logo from './logo.svg';
import UploadForm from './components/upload-form.js';
import './App.css';

class App extends Component {
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Excel to JSON Convertor</h1>
        </header>
        <p className="App-intro">
          To get started, Upload an xlsx file || Enter url for a google sheet and submit.
        </p>        
        <UploadForm />
        {/* <handleUpload /> */}
      </div>
    );
  }
}

export default App;
