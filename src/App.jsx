import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Startseite from './views/startseite.jsx';
import Projekte from './views/projekte.jsx';
import Datenbank from './views/datenbank.jsx';
import NotFound from './views/not-found.jsx';
import Tool from './views/tool.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startseite />} />
        <Route path="/projekte" element={<Projekte />} />
        <Route path="/datenbank" element={<Datenbank />} />
        <Route path="/tool" element={<Tool />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
