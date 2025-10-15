import { useState, useCallback } from 'react';

interface UseFileUploadOptions {
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  onFileSelect?: (file: File | null) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const { maxSize = 50, acceptedTypes = [], onFileSelect } = options;
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = useCallback((file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Check file type
    if (acceptedTypes.length > 0) {
      const fileType = file.type;
      const isAccepted = acceptedTypes.some(type => 
        fileType.startsWith(type.replace('*', ''))
      );
      
      if (!isAccepted) {
        setError(`File type not supported. Accepted types: ${acceptedTypes.join(', ')}`);
        return false;
      }
    }

    setError(null);
    return true;
  }, [maxSize, acceptedTypes]);

  const handleFileSelect = useCallback((file: File | null) => {
    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileSelect?.(file);
    } else if (!file) {
      setSelectedFile(null);
      setError(null);
      onFileSelect?.(null);
    }
  }, [validateFile, onFileSelect]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    onFileSelect?.(null);
  }, [onFileSelect]);

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

  return {
    selectedFile,
    error,
    isDragOver,
    handleFileSelect,
    clearFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};
