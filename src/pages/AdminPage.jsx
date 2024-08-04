import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import "../styles/adminPage.css";
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

// Access the environment variable
const URL = process.env.REACT_APP_BACKEND_URL;

const AdminPage = () => {
  const [tableData, setTableData] = useState([]);
  const [reviewStatus, setReviewStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/api/v1/employees`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTableData(data.employees);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    const fetchReviewStatus = async () => {
      try {
        const response = await fetch(`${URL}/api/v1/reviews/status`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setReviewStatus(data.reviewStatus);

      } catch (error) {
        console.error('Error fetching review status:', error);
      }
    };

    fetchData();
    fetchReviewStatus();
  }, []);

  const deleteFn = async (id) => {
    try {
      const response = await fetch(`${URL}/api/v1/employees/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setTableData(prevData => prevData.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const onUpdate = (id) => {
    navigate(`/update/${id}`);
  };

  const onStartClick = (id) => {
    navigate(`/assign-reviews/${id}`);
  };

  const onCloseClick = async (reviewId) => {
    try {
      const response = await fetch(`${URL}/api/v1/reviews/close/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you use JWT token for auth
        }
      });

      if (!response.ok) {
        throw new Error('Failed to close review');
      }

      // Update the review status locally
      setReviewStatus(prevStatus => {
        const newStatus = { ...prevStatus };
        Object.keys(newStatus).forEach(key => {
          newStatus[key] = newStatus[key].filter(review => review._id !== reviewId);
        });
       setReviewStatus(newStatus);
      });
    } catch (error) {
      console.error('Error closing review:', error);
    }
  };

  const onViewClick = (id) => {
    navigate(`/view-review/${id}`);
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className='admin'>
      <h1>Admin Page</h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Button className="add-employee-btn" text="Add Employee" onClick={() => navigate("/register")} />
          <Table 
            className="admin-table" 
            data={tableData} 
            reviewStatus={reviewStatus}
            onDelete={deleteFn} 
            onUpdate={onUpdate} 
            onStartClick={onStartClick} 
            onCloseClick={onCloseClick}
            onViewClick={onViewClick}
            admin={true}
            text={"Start Review"}
          />
          <Button className="logout" onClick={logout} text="LOGOUT" />
        </>
      )}
    </div>
  );
};

export default AdminPage;
