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
  const [isUpdate, setIsUpdate] = useState(false);
  const [feedbackId, setFeedbackId] = useState('');
  const [noReview, setNoReview] = useState(false);

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

  useEffect(() => {
    const fetchFeedback = async () => {
      const giver = state.userId || localStorage.getItem('userId');
      try {
        const response = await fetch(`${URL}/api/v1/reviews/feedback/${receiver}/${giver}`);
        if (response.ok) {
          const feedback = await response.json();
          if (feedback) {
            setMessage(feedback.message);
            setIsUpdate(true);
            setFeedbackId(feedback._id);
          } else {
            setNoReview(true); 
          }
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedback();
  }, [receiver, state.userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const giver = state.userId || localStorage.getItem('userId');
      const response = await fetch(`${URL}/api/v1/reviews/feedback/${receiver}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const giver = state.userId || localStorage.getItem('userId');
      const response = await fetch(`${URL}/api/v1/reviews/feedback/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ feedbackId, message, receiver, giver }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      navigate('/some-path-after-success');
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const deleteFeedbackById = async (feedbackId) => {
    try {
      const response = await fetch(`${URL}/api/v1/reviews/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      alert("Feedback deleted");
      setIsUpdate(false);
      setMessage("");
      navigate('/some-path-after-success');
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  return (
    <div className='review-page'>
      <h1>{isUpdate ? 'Update Review' : 'Leave a Review'}</h1>
      <div className="user-details-form">
        <p>User Name: </p> <span>{userDetails.name}</span>
        <p id='role'>Position: </p> <span>{userDetails.position}</span>
        {noReview ? (
          <p>No review has been made yet.</p> 
        ) : (
          <form className='review-form' onSubmit={isUpdate ? handleUpdate : handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your review here"
              required
            />
            <div className='btn-container'>
              <Button type="submit" className="review-submit-btn" text={isUpdate ? "Update" : "Submit"} />
              {isUpdate && (
                <Button onClick={() => deleteFeedbackById(feedbackId)} className="review-delete-btn" text={"Delete"} />
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
