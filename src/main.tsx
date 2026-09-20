import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {initializeFirebase} from './services/firebase';

// Initialize Firebase before rendering
initializeFirebase().then(() => {
  console.log('Firebase initialization attempted');
}).catch((err) => {
  console.warn('Firebase initialization failed:', err);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
