import React from 'react';
import './App.css';
import {CssBaseline} from "@mui/material";
import Routes from "../routes/routes";

function App() {
  return (
      <div className="App">
        <CssBaseline />
        <Routes />
      </div>
  );
}

export default App;
