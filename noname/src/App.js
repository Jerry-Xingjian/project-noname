import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import Home from './views/Home/Home';
import UserProfile from './views/UserProfile/UserProfile';
import EditProfile from './views/EditProfile/EditProfile';
// import { localRemove } from './utils/localStorage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/profile/:id/edit" element={<EditProfile />} />
          {/* Change the default to home/login page depends on auth status */}
          <Route
            path=""
            element={<Navigate to="/login" replace />}
          />
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
          {/* Can add an error page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
