import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import JourneyPage from './pages/JourneyPage';
import TeamSimulationsPage from './pages/TeamSimulationsPage';
import SimulationDetailsPage from './pages/SimulationDetailsPage';
import TeamPage from './pages/TeamPage';
import { ScrollProvider } from './contexts/ScrollContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ScrollToTop from './components/layout/ScrollToTop';

// Create router with future flags enabled
const router = {
  future: {
    v7_relativeSplatPath: true
  }
};

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow pt-16">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/simulations" element={<TeamSimulationsPage />} />
            <Route path="/simulations/:simulationId" element={<SimulationDetailsPage />} />
            <Route path="/simulations/:simulationId/:subSimulationId" element={<SimulationDetailsPage />} />
            <Route path="/simulations/:simulationId/:subSimulationId/simulate" element={<SimulationDetailsPage />} />
            <Route path="/team" element={<TeamPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router future={router.future}>
        <ScrollProvider>
          <ScrollToTop />
          <AppContent />
        </ScrollProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;