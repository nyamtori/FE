import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Setting from '../src/pages/setting';
import Main from './pages/myref/main';
import './App.css';
import GlobalStyle from './styles/globalstyle';

function App() {
  return (
    <BrowserRouter>
    <GlobalStyle />
      <Routes>
        <Route path="/" element={<Setting />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;