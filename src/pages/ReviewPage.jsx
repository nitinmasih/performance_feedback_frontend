import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import "../styles/reviewPage.css";
import Button from '../components/Button';

// Access the environment variable
const URL = process.env.REACT_APP_BACKEND_URL;

const ReviewPage = () => {
  const { id: receiver } = useParams();
  const location = useLocation();
  const state = location.state || {};
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const userId = state.userId || localStorage.getItem('userId');
    if (!userId) {
      console.error('Employer ID is missing');
      navigate('/unauthorized');
    }
  }, [state.userId, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${URL}/api/v1/employees/${receiver}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const details = await response.json();
        setUserDetails(details);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUser();
  }, [receiver]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const giver = state.userId || localStorage.getItem('userId');
      const response = await fetch(`${URL}/api/v1/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiver, giver, message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      navigate('/some-path-after-success');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className='review-page'>
      <h1>Leave a Review</h1>
      <div className="user-details-form">
        <p>User Name: </p> <span>{userDetails.name}</span>
        <p id='role'>Position: </p> <span>{userDetails.role}</span>
        <form className='review-form' onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your review here"
            required
          />
          <Button type="submit" className="review-submit-btn" text="Submit" />
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;
