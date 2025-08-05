import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import DiscoveryPage from './pages/DiscoveryPage';
import CollectionPage from './pages/CollectionPage';
import './App.css';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header with Navigation */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">⚡</div>
                <h1 className="text-xl font-bold text-gray-800">PokéNest</h1>
              </div>
              
              <nav className="flex space-x-1">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  🔍 Discovery
                </NavLink>
                <NavLink
                  to="/collection"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  📚 Collection
                </NavLink>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<DiscoveryPage />} />
            <Route path="/collection" element={<CollectionPage />} />
          </Routes>
        </main>
        
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
