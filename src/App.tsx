import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import DiscoveryPage from './pages/DiscoveryPage';
import CollectionPage from './pages/CollectionPage';
import './App.css';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center">
        <nav className="mb-4">
          <NavLink to="/" className="mx-2 text-blue-500">Discovery</NavLink>
          <NavLink to="/collection" className="mx-2 text-blue-500">Collection</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<DiscoveryPage />} />
          <Route path="/collection" element={<CollectionPage />} />
        </Routes>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
