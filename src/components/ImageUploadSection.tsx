import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSourceImageFile(event.target.files[0]);
    } else {
      setSourceImageFile(null);
    }
  };

  const clearImage = () => {
    setSourceImageFile(null);
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
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="image-upload">Image File</Label>
          <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        {previewUrl && (
          <div className="relative">
            <img src={previewUrl} alt="Image Preview" className="rounded-md" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={clearImage}
            >
              <i className="fa-solid fa-xmark"></i>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadSection;
