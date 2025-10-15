import React from 'react';

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="error-container">
      <i className="fa-solid fa-exclamation-triangle error-icon"></i>
      <p className="error">{error}</p>
    </div>
  );
};
