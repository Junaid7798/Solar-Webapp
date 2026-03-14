/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { LandingPage } from './pages/LandingPage';
import { AdminApp } from './admin/AdminApp';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
