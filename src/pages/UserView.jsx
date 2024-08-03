import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import "../styles/userView.css";
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Button from '../components/Button';

// Access the environment variable
const URL = process.env.REACT_APP_BACKEND_URL;

const UserView = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

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
    fetchData();
  }, []);

  const checkEligibilityAndNavigate = async (employeeId) => {
    try {
      const response = await fetch(`${URL}/api/v1/reviews/check-eligibility/${employeeId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check eligibility');
      }

      const data = await response.json();

      if (data.isEligible) {
        navigate(`/review/${employeeId}`, { state: { userId } });
      } else {
        alert('You are not eligible to add a review for this user.');
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='user-view'>
      <h1>Employees Details</h1>
      {loading ? (
        <Loader />
      ) : (
        <Table
          className={"user-table"}
          data={tableData || []}
          text={"Add-Review"}
          onAddReview={checkEligibilityAndNavigate}
          User={true}
        />
      )}
      <Button className={"user-logout"} text={"LOGOUT"} onClick={logout} />
    </div>
  );
};

export default UserView;
