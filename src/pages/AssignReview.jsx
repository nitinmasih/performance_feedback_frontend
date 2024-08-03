import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import "../styles/assignReview.css";
import Button from "../components/Button";

// Access the environment variable
const URL = process.env.REACT_APP_BACKEND_URL;

const AssignReview = () => {
  const { id } = useParams(); // Get the user ID from URL parameters
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [closeByDate, setCloseByDate] = useState('');
  const [initiatedBy, setInitiatedBy] = useState(''); // Use userId from params if provided

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users to populate the dropdown
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${URL}/api/v1/employees`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data.employees);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions ? selectedOptions.map(option => option.value) : []);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reviewData = {
      initiatedBy,
      eligibleUsers: selectedUsers,
      closeByDate,
    };

    try {
      const response = await fetch(`${URL}/api/v1/reviews/initiate/${id}`, { // Include userId in the URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate review');
      }

      const data = await response.json();
      alert("Review Created Successfully");
      console.log('Review initiated successfully:', data);
    } catch (error) {
      console.error('Error initiating review:', error);
    }
  };

  const userOptions = users.map(user => ({
    value: user._id,
    label: user.name
  }));

  return (
    <div className="initiate-review-container">
      <h2>Initiate Review</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="initiatedBy">Initiated By</label>
          <input
            type="text"
            id="initiatedBy"
            value={initiatedBy}
            onChange={(e) => setInitiatedBy(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="eligibleUsers">Eligible Users</label>
          <Select
            id="eligibleUsers"
            isMulti
            options={userOptions}
            onChange={handleUserChange}
            required
          />
        </div>
    
        <div className="form-group">
          <label htmlFor="closeByDate">Close By Date</label>
          <input
            type="date"
            id="closeByDate"
            value={closeByDate}
            onChange={(e) => setCloseByDate(e.target.value)}
            required
          />
        </div>
         <Button type="submit" text="Initiate Review"/>
         <Button className="back-btn" text=" < Back " onClick={() => navigate("/admin")}/>
      </form>
    </div>
  );
};

export default AssignReview;
