import React from 'react';

const Alert = ({ message, type }) => {
  if (!message) return null;

  const alertClass = `alert alert-${type}`;

  return (
    <div className={alertClass}>
      {message}
    </div>
  );
};

export default Alert;