import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import "../styles/updateUser.css";

// Access the environment variable
const URL = process.env.REACT_APP_BACKEND_URL;

const UpdatePage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const roleRef = useRef();
  const submitRef = useRef();

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef === submitRef) {
        handleUpdate(e);
      } else {
        nextRef.current.focus();
      }
    }
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`${URL}/api/v1/employees/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data) {
          setEmployee(data);
          setName(data.name);
          setEmail(data.email);
          setRole(data.role);
        } else {
          console.error('Employee data is missing in the response');
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}/api/v1/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      navigate('/admin');
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className='update-page'>
      <h1>Update Employee</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder='Username'
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
          ref={nameRef}
          onKeyDown={(e) => handleKeyDown(e, emailRef)}
        />
        <input
          type="email"
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          ref={emailRef}
          onKeyDown={(e) => handleKeyDown(e, passwordRef)}
        />
        <input
          type="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          ref={passwordRef}
          onKeyDown={(e) => handleKeyDown(e, roleRef)}
        />
        <input
          type="text"
          placeholder='Role'
          value={role}
          onChange={(e) => setRole(e.target.value)}
          autoComplete="off"
          required
          ref={roleRef}
          onKeyDown={(e) => handleKeyDown(e, submitRef)}
        />
        <Button className="submit-btn" type="submit" text="Submit" ref={submitRef} />
        <Button className="prev-btn" onClick={() => navigate('/admin')} text="Back" />
      </form>
    </div>
  );
};

export default UpdatePage;
