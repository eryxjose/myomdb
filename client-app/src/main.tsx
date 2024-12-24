import React from 'react';
import { createRoot } from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css'; // Importação corrigida
import './app/layout/styles.css';
import { store, StoreContext } from './app/stores/store';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <RouterProvider router={router} />
    </StoreContext.Provider>
  </React.StrictMode>,
);
