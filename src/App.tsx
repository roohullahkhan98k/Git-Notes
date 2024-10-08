import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import LandingPage from './pages/landingpage/LandingPage';
import DetailPage from './pages/DetailPage/DetailPage';
import './App.css';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { getAuth } from 'firebase/auth';
import firebase from '../firebase';
import { Provider } from 'react-redux'; 
import store from './Redux/store'; 
import CreateGist from './components/CreateGist/CreateGist';
import StarredGist from './pages/StarredGist/StarredGist'
import ProfilePage from './pages/Profilepage/ProfilePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000,
      retry: 3,
      refetchOnWindowFocus: false,
     refetchInterval: 10 * 1000, 
      refetchIntervalInBackground: true, 
    },
  },
  
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const auth = getAuth(firebase);

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}> 
        <Router>
          <Header onSearch={handleSearch} />
          <Routes>
            <Route path="/" element={<LandingPage searchQuery={searchQuery} />} />
            <Route path="/details/:gistId" element={<DetailPage />} /> 
            <Route path="/create-gist" element={<CreateGist />} />
            <Route path="/starred-gist" element={<StarredGist />} />
            <Route path="/profile" element={<ProfilePage/>} />
          </Routes>
        </Router>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;