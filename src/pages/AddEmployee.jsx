import React, { useState, useRef } from 'react';
import Button from '../components/Button';
import "../styles/addEmployee.css";
import { useNavigate } from 'react-router-dom';

// Access the environment variable
const URL = process.env.REACT_APP_BACKEND_URL;

const AddEmployee = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [position, setPosition] = useState('');

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const roleRef = useRef();
  const positionRef = useRef(); 
  const submitRef = useRef();

  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role || !position) { 
      alert('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch(`${URL}/api/v1/employees/add_employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          position,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Employee added:', data);

  
      alert("Employee Created");
      setName('');
      setEmail('');
      setPassword('');
      setRole('');
      setPosition('');
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef === submitRef) {
        onHandleSubmit(e); 
      } else {
        nextRef.current.focus(); 
      }
    }
  };

  const previous = () => {
    navigate("/admin");
  };

  return (
    <div className='add-employee'>
      <h1>Employee Registration</h1>
      <form onSubmit={onHandleSubmit}>
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
          required
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
        />
        <input
          type="text"
          placeholder='Position'
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          autoComplete="off"
          required
          ref={positionRef} 
          onKeyDown={(e) => handleKeyDown(e, submitRef)}
        />
        <Button className="submit-btn" type="submit" text="Submit" ref={submitRef} />
        <Button className="prev-btn" onClick={previous} text="Back" />
      </form>
    </div>
  );
};

export default AddEmployee;
