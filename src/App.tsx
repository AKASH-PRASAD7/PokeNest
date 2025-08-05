import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DiscoveryPage from "./pages/DiscoveryPage";
import CollectionPage from "./pages/CollectionPage";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="min-h-screen ">
        {/* Navbar  */}
        <Navbar />

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
              background: "#333",
              color: "#fff",
              borderRadius: "10px",
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
