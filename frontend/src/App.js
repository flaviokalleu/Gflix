import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Movies from './components/MovieList';
import Login from './components/Login';
import Register from './components/Register';
import MovieInfo from './components/MovieInfo';
import SeriesDetails from './components/SeriesDetails';
import FetchSeriesFiles from './components/FetchSeriesFiles';
import EditSeries from './components/EditSeries';
import { CssBaseline, Typography } from '@mui/material';
import Navbar from './components/Navbar';
import SeriesList from './components/SeriesList';
import ImportMovies from './components/ImportMovies';
import EpisodeDetail from './components/EpisodeDetail';
import Dashboarduser from "./components/Dashboarduser"; // Ajuste o caminho se necessário
import AdminDashboard from "./components/AdminDashboard"; // Ajuste conforme necessário
function Layout({ children }) {
  const location = useLocation(); // Agora está dentro de um Router

  // Verifica se a rota atual é login ou register
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {/* Condicionalmente renderiza o Navbar se não for login ou register */}
      {!isAuthPage && <Navbar />}

      <main style={{ padding: isAuthPage ? '0' : '' }}>
        {children}
      </main>

      {/* Condicionalmente renderiza o footer se não for login ou register */}
      {!isAuthPage && (
        <footer style={{ backgroundColor: '#1E1E2F', padding: '16px', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            &copy; 2024 Your Company. All rights reserved.
          </Typography>
        </footer>
      )}
    </>
  );
}

function App() {
  const [activeComponent, setActiveComponent] = useState('movies');

  return (
    <Router>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/fetch-series" element={<FetchSeriesFiles />} />
          <Route path="/" element={<Home />} />
          <Route path="/import-movies" element={<ImportMovies />} />
          <Route path="/Dashboarduser" element={<Dashboarduser />} />
          <Route path="/dashboard" element={<Dashboard activeComponent={activeComponent} />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/edit-series/:id" element={<EditSeries />} />
          <Route path="/movie/:id" element={<MovieInfo />} />
          <Route path="/series" element={<SeriesList />} />
          <Route path="/series/:tmdb_id" element={<SeriesDetails />} />
          <Route path="/episode/:id" element={<EpisodeDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
