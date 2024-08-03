import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import AdminView from './pages/AdminPage';
import UserView from './pages/UserView';
import ProtectedRoute from '../src/routes/protectedRoute.js';
import AddEmployee from './pages/AddEmployee';
import UpdateUser from './pages/UpdateUser';
import ReviewPage from './pages/ReviewPage';
import ViewReviews from './pages/ViewReviews';
import Login from './pages/Login'; // Import your login component
import AssignReview from './pages/AssignReview.jsx';
import Loader from './components/Loader.jsx';

const App = () => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    role: "",
  });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          isAuthenticated: true,
          role: decoded.role,
        });
      } catch (e) {
        console.error("Token decoding failed:", e);
        localStorage.removeItem('token'); // Remove invalid token
      }
    }
    setLoading(false); // Set loading to false after checking the token
  }, []);

  if (loading) {
    return <div><Loader/></div>; 
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/admin/:userId"
          element={
            <ProtectedRoute
              component={AdminView}
              isAuthenticated={user.isAuthenticated}
              userRole={user.role}
              requiredRole="admin"
            />
          }
        />
        <Route
          path="/assign-reviews/:id"
          element={
            <ProtectedRoute
              component={AssignReview}
              isAuthenticated={user.isAuthenticated}
              userRole={user.role}
              requiredRole="admin"
            />
          }
        />
        <Route
          path="/user/:userId"
          element={
            <ProtectedRoute
              component={UserView}
              isAuthenticated={user.isAuthenticated}
              userRole={user.role}
              requiredRole="user"
            />
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute
              component={AddEmployee}
              isAuthenticated={user.isAuthenticated}
              userRole={user.role}
              requiredRole="admin"
            />
          }
        />
        <Route
          path="/update/:id"
          element={
            <ProtectedRoute
              component={UpdateUser}
              isAuthenticated={user.isAuthenticated}
              userRole={user.role}
              requiredRole="admin"
            />
          }
        />
        <Route
          path="/review/:id"
          element={
            <ProtectedRoute
              component={ReviewPage}
              isAuthenticated={user.isAuthenticated}
              userRole={user.role}
              allowedRoles={['user', 'admin']}
            />
          }
        />
        <Route
          path="/view-review/:id"
          element={
            <ProtectedRoute
              component={ViewReviews}
              isAuthenticated={user.isAuthenticated}
              userRole={user.role}
              requiredRole="admin"
            />
          }
        />
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        <Route path="*" element={<Navigate to={user.isAuthenticated ? (user.role === 'admin' ? `/admin/${localStorage.getItem('userId')}` : `/user/${localStorage.getItem('userId')}`) : '/login'} />} />
      </Routes>
    </Router>
  );
};

export default App;
