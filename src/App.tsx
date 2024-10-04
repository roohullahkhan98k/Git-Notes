import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import LandingPage from './pages/LandingPage';
import './App.css';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  const [searchQuery, setSearchQuery] = useState(''); // State to store search query

  const handleSearch = (query: string) => {
    setSearchQuery(query); // Update the search query when user types in the search bar
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Header onSearch={handleSearch} /> {/* Pass handleSearch to Header */}
        <Routes>
          <Route path="/" element={<LandingPage searchQuery={searchQuery} />} /> {/* Pass searchQuery to LandingPage */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
