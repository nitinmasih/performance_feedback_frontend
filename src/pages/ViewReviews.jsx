import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/viewReview.css";
import Button from "../components/Button";
import Loader from "../components/Loader";
import moment from 'moment';

// Access the environment variable
const URL = process.env.REACT_APP_BACKEND_URL;

const ViewReviews = () => {
  const { id } = useParams();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${URL}/api/v1/reviews/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setDetails(data);
        setShowDelete(data.length > 0); // Show delete button only if there are reviews
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const deleteAllFeedbacks = async () => {
    try {
      const response = await fetch(`${URL}/api/v1/reviews/feedback/All`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      alert("All Feedbacks deleted");
      setDetails([]);
      setShowDelete(false); // Hide delete button after deletion
    } catch (error) {
      console.error('Error deleting feedbacks:', error);
    }
  };

  return (
    <div className='view-reviews'>
      <h1>Review Details</h1>

      {details.length > 0 && (
        <>
          <p>User Name :</p>
          <span style={{ marginLeft: "10px" }}>{details[0].receiver.name}</span>
        </>
      )}

      <div className='review-container'>
        {details.length > 0 ? (
          details.map((detail) => (
            <div key={detail._id} className='review-item'>
              <p><strong>Giver:</strong> {detail.giver.name} ({detail.giver.email})</p>
              <p><strong>Feedback:</strong> {detail.message}</p>
              <p><strong>Rating:</strong> {detail.rating}</p>
              <p><strong>Date:</strong> {moment(detail.createdAt).format('DD/MM/YYYY HH:mm:ss')}</p>
            </div>
          ))
        ) : (
          <p>No reviews found</p>
        )}
      </div>

      {showDelete && details.length > 0 && (
        <Button onClick={deleteAllFeedbacks} className={"reviews-delete"} text={"Delete All"} />
      )}
    </div>
  );
};

export default ViewReviews;
