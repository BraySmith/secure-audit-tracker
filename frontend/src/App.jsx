import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AuthPage from './pages/AuthPage';
import DashPage from './pages/Dashboard';
import AdminLogs from './pages/AdminLogs';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashPage />} />
        <Route path="/admin" element={<AdminLogs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
