import React from 'react';
import { useFileUpload } from '../../hooks/useFileUpload';

interface FileUploadProps {
  selectedFile: File | null;
  error: string | null;
  isDragOver: boolean;
  handleFileSelect: (file: File | null) => void;
  clearFile: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  placeholder: string;
  icon: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  selectedFile,
  error,
  isDragOver,
  handleFileSelect,
  clearFile,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  placeholder,
  icon,
}) => {
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-dropzone ${isDragOver ? 'drag-over' : ''} ${error ? 'error' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onClick={() => document.getElementById('file-input')?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            document.getElementById('file-input')?.click();
          }
        }}
        aria-label="File upload area"
      >
        <input
          id="file-input"
          type="file"
          onChange={handleFileInputChange}
          className="file-input"
          aria-hidden="true"
        />
        
        {selectedFile ? (
          <div className="file-upload-selected">
            <div className="file-info">
              <i className={`fa-solid ${icon} file-icon`}></i>
              <div className="file-details">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">{formatFileSize(selectedFile.size)}</span>
              </div>
            </div>
            <button
              type="button"
              className="remove-file-btn"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              aria-label="Remove file"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        ) : (
          <div className="file-upload-placeholder">
            <i className={`fa-solid ${icon} upload-icon`}></i>
            <p className="upload-text">{placeholder}</p>
            <p className="upload-hint">Click to browse or drag and drop</p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="file-upload-error" role="alert">
          <i className="fa-solid fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
