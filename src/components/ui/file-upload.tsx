import React, { useRef, useState, useCallback } from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';

interface FileUploadProps {
  accept: string;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  placeholder?: string;
  icon?: string;
  maxSize?: number; // in MB
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  onFileSelect,
  selectedFile,
  placeholder = "Drop your file here or click to browse",
  icon = "fa-upload",
  maxSize = 50,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }
    setError(null);
    return true;
  }, [maxSize]);

  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  }, [validateFile, onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleRemove = useCallback(() => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
  }, [onFileSelect]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`file-upload-container ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      {!selectedFile ? (
        <Card 
          className={`file-upload-dropzone ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <CardContent className="file-upload-content">
            <div className="file-upload-icon">
              <i className={`fa-solid ${icon}`}></i>
            </div>
            <div className="file-upload-text">
              <p className="file-upload-title">{placeholder}</p>
              <p className="file-upload-subtitle">
                Supports {accept.split(',').map(type => type.trim().replace('*', '')).join(', ')} • Max {maxSize}MB
              </p>
            </div>
            <Button variant="outline" className="file-upload-button" aria-label="Browse files">
              <i className="fa-solid fa-folder-open" aria-hidden="true"></i>
              Browse Files
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="file-upload-selected">
          <CardContent className="file-selected-content">
            <div className="file-info">
              <div className="file-icon">
                <i className={`fa-solid ${accept.includes('audio') ? 'fa-music' : 'fa-image'}`}></i>
              </div>
              <div className="file-details">
                <p className="file-name">{selectedFile.name}</p>
                <p className="file-size">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              size="icon" 
              onClick={handleRemove}
              className="file-remove-button"
              aria-label={`Remove ${selectedFile.name}`}
            >
              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </Button>
          </CardContent>
        </Card>
      )}
      
      {error && (
        <div className="file-upload-error" role="alert" aria-live="polite">
          <i className="fa-solid fa-exclamation-triangle" aria-hidden="true"></i>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
