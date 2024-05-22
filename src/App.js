// App.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom'; // Importez Routes et Route sans Router
import IndexPages from './components/Home/indexPages';
import DicteeComposant from './components/Home/DicteeComposant';
import EmailConfirmation from './components/redirection/EmailConfirmation';

import './App.css';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <Routes>
            <Route path="/" element={isAuthenticated ? <DicteeComposant /> : <IndexPages />} />
            <Route path="/confirm/:token" element={<EmailConfirmation />} />
          </Routes>
        </div>
      </header>
    </div>
  );
}

export default App;















