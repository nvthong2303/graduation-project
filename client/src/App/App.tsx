import React from 'react';
import './App.css';
import {CssBaseline} from "@mui/material";
import Routes from "../routes/routes";
import { SnackbarProvider } from 'notistack';

function App() {

  return (
      <div className="App">
          <SnackbarProvider>
            <CssBaseline />
            <Routes />
          </SnackbarProvider>
      </div>
  );
}

export default App;
