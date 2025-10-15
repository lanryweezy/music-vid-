import React, { useEffect, useState } from 'react';

interface StatusNotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  className?: string;
}

const StatusNotification: React.FC<StatusNotificationProps> = ({
  type,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Wait for animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-exclamation-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'info':
      default:
        return 'fa-info-circle';
    }
  };

  return (
    <div className={`status-notification ${type} ${isVisible ? 'visible' : 'hidden'} ${className}`}>
      <div className="status-content">
        <div className="status-icon">
          <i className={`fa-solid ${getIcon()}`}></i>
        </div>
        <div className="status-message">
          <p>{message}</p>
        </div>
        {onClose && (
          <button
            type="button"
            className="status-close"
            onClick={handleClose}
            aria-label="Close notification"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default StatusNotification;
