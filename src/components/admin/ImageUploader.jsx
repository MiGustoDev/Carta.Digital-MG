// src/components/admin/ImageUploader.jsx
import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, AlertCircle } from 'lucide-react';
import { validateImageFile } from '../../utils/validators';
import { formatFileSize } from '../../utils/helpers';

const ImageUploader = ({ currentImageUrl, onFileSelect, uploadProgress, className = '' }) => {
  const [preview, setPreview] = useState(
    currentImageUrl && currentImageUrl.startsWith('/')
      ? `${import.meta.env.BASE_URL}${currentImageUrl.slice(1)}`
      : currentImageUrl || null
  );
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const inputRef = useRef(null);

  const processFile = useCallback(
    (file) => {
      setFileError(null);
      const { valid, error } = validateImageFile(file);

      if (!valid) {
        setFileError(error);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      setFileInfo({ name: file.name, size: file.size });
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setFileInfo(null);
    setFileError(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const isUploading = uploadProgress > 0 && uploadProgress < 100;

  return (
    <div className={className}>
      {preview ? (
        <div className="relative rounded-card overflow-hidden border border-gray-200">
          <img
            src={preview}
            alt="Preview"
            className="w-full aspect-video object-cover"
          />

          {/* Upload progress overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
              <div className="w-48 bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-white text-sm font-semibold">
                Subiendo... {uploadProgress}%
              </span>
            </div>
          )}

          {/* Remove button */}
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Eliminar imagen"
            >
              <X size={14} />
            </button>
          )}

          {/* File info */}
          {fileInfo && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2">
              <p className="text-white text-xs truncate">
                {fileInfo.name} · {formatFileSize(fileInfo.size)}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`upload-zone ${dragging ? 'dragging' : ''}`}
        >
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${dragging ? 'bg-primary/10' : 'bg-background-secondary'}`}>
              {dragging ? (
                <Image size={22} className="text-primary" />
              ) : (
                <Upload size={22} className="text-text-secondary" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-text">
                {dragging ? 'Soltá la imagen' : 'Arrastrá una imagen o hacé clic'}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                JPG, PNG o WebP · máx. 5MB
              </p>
            </div>
          </div>
        </div>
      )}

      {fileError && (
        <div className="flex items-center gap-2 mt-2 text-error text-sm">
          <AlertCircle size={14} />
          <span>{fileError}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
