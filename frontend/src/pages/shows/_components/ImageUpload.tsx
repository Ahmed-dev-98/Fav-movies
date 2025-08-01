import React, { useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  currentImageUrl,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError(null);
    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `posters/${timestamp}-${file.name}`;
      const storageRef = ref(storage, fileName);

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload file
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          setError("Upload failed. Please try again.");
          setUploading(false);
          setUploadProgress(0);

          // Clean up preview URL
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
          }
          setPreviewUrl(currentImageUrl || null);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onUploadComplete(downloadURL);
            setUploading(false);
            setUploadProgress(0);

            // Clean up local preview URL
            if (objectUrl) {
              URL.revokeObjectURL(objectUrl);
            }
            setPreviewUrl(downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
            setError("Failed to get image URL. Please try again.");
            setUploading(false);
            setUploadProgress(0);

            // Clean up preview URL
            if (objectUrl) {
              URL.revokeObjectURL(objectUrl);
            }
            setPreviewUrl(currentImageUrl || null);
          }
        }
      );
    } catch (error) {
      console.error("Upload error:", error);
      setError("Upload failed. Please try again.");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label>Poster Image</Label>

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Preview Area */}
      {previewUrl ? (
        <div className="relative">
          <div className="relative w-full h-[400px] border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <img src={previewUrl} alt="Preview" className="w-full h-full " />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                disabled={uploading}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={handleUploadClick}
        >
          <ImageIcon size={48} className="text-gray-400 mb-2" />
          <p className="text-gray-500 text-center">
            Click to upload poster image
            <br />
            <span className="text-sm">PNG, JPG up to 5MB</span>
          </p>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-width duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Button */}
      {!previewUrl && (
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          disabled={disabled || uploading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-shadow duration-200 "
        >
          <Upload size={16} className="mr-2" />
          {uploading ? "Uploading..." : "Choose Image"}
        </Button>
      )}

      {/* Error Message */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUpload;
