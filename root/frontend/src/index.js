import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import { MainContextProvider } from './contexts/MainContext';

/* ce script charge l'application React dans le DOM en utilisant ReactDOM,*/
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainContextProvider>
      <App />
    </MainContextProvider>
  </React.StrictMode>
);
