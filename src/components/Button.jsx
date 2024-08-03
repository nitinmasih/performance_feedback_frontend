
import React from 'react';

const Button = ({ className, onClick, text, type ,ref }) => {
  return (
    <button className={className} onClick={onClick} type={type} >
      {text}
    </button>
  );
};

export default Button;
