import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>Generating your amazing visuals...</p>
    </div>
  );
};
