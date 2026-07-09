import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Esto asegura que encuentre el contenedor correcto de StackBlitz
const rootElement = document.getElementById('root') || document.getElementById('app'); 
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);