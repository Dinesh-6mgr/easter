import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Timeline from './pages/Timeline';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import LanguagePicker from './components/common/LanguagePicker';

function App() {
  return (
    <Router>
      <LanguagePicker />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <Navbar />
        <main className="flex-grow container-custom py-8 pt-24">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/game" element={<Game />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#363636', color: '#fff' },
            success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
            error: { duration: 4000, iconTheme: { primary: '#EF4444', secondary: '#fff' } }
          }}
        />
      </div>
    </Router>
  );
}

export default App;
