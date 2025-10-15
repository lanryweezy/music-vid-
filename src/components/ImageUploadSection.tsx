import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, FileUpload } from './ui';

const ImageUploadSection: React.FC = () => {
  const { sourceImageFile, setSourceImageFile } = useAppContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (sourceImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(sourceImageFile);
    } else {
      setPreviewUrl(null);
    }
  }, [sourceImageFile]);

  const handleImageUpload = (file: File | null) => {
    setSourceImageFile(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
            2
          </span>
          Add Your Image (Optional)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Image File (Optional)</Label>
          <FileUpload
            accept="image/*"
            onFileSelect={handleImageUpload}
            selectedFile={sourceImageFile}
            placeholder="Drop your image here or click to browse"
            icon="fa-image"
            maxSize={50}
          />
        </div>
        {previewUrl && (
          <div className="image-preview-container">
            <div className="image-preview-header">
              <h4 className="image-preview-title">Image Preview</h4>
            </div>
            <div className="image-preview-wrapper">
              <img src={previewUrl} alt="Image Preview" className="image-preview" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadSection;
