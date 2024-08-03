import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/viewReview.css";

// Access the environment variable
const URL = process.env.REACT_APP_BACKEND_URL;

const ViewReviews = () => {
  const { id } = useParams();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${URL}/api/v1/feedback/reviews/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className='view-reviews'>
      <h1>Review Details</h1>
      {details.length > 0 && (
        <div>
          <p>User Name :</p>
          <span>{details[0].receiver.name}</span>
        </div>
      )}
      <div className='review-container'>
        {details.length > 0 ? (
          details.map((detail) => (
            <div key={detail._id} className='review-item'>
              <p><strong>Giver:</strong> {detail.giver.name} ({detail.giver.email})</p>
              <p><strong>Feedback:</strong> {detail.message}</p>
              <p><strong>Rating:</strong> {detail.rating}</p>
              <p><strong>Date:</strong> {new Date(detail.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No reviews found</p>
        )}
      </div>
    </div>
  );
};

export default ViewReviews;
