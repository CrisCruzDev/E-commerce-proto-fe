import { useEffect, useRef, useState } from 'react';
import { uploadToCloudinary } from '../../services/uploadService';
import imageCompression from 'browser-image-compression';

export const ProductInfoStep = ({
  formData,
  onFormChange,
  onNext,
  validationErrors,
  isSubmitting,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileUpload = async file => {
    setError(null);
    setIsUploading(true);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setIsUploading(false);
      return setError('Only image files are allowed.');
    }

    // Validate file size BEFORE compression
    if (file.size > 8 * 1024 * 1024) {
      setIsUploading(false);
      return setError('Image is too large. Max allowed is 8MB.');
    }

    try {
      // Compress the file before upload
      const compressed = await imageCompression(file, {
        maxSizeMB: 1, // target 1MB
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      });

      // Upload to Cloudinary via backend
      const { url, publicId } = await uploadToCloudinary(compressed);

      // Update form data (single source of truth)
      onFormChange({ image: url, imagePublicId: publicId });

      // Reset input value (so the same file can be selected again)
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (err) {
      console.error('Image upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    file ? handleFileUpload(file) : clearImage();
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    file ? handleFileUpload(file) : clearImage();
  };

  const clearImage = () => {
    onFormChange({ image: '', imagePublicId: '' });

    // Reset input value (so the same file can be selected again)
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    onFormChange({ [name]: value });
  };

  return (
    <>
      <h1 className='text-3xl font-medium mb-8'>Product Information</h1>
      <div className='flex flex-col space-y-6'>
        <label
          htmlFor='image-upload'
          className='block text-sm font-normal mb-2'
        >
          Image
        </label>

        {/* Dropzone */}
        <div className='flex items-center justify-center'>
          <div
            className={`relative w-full sm:w-3/4 aspect-video border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-100 duration-100
                  ${
                    isDragging
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  } 
                  ${
                    validationErrors.image ? 'border-red-300 bg-red-100/30' : ''
                  }
                  ${isUploading ? 'pointer-events-none opacity-70' : ''}
                  `}
            onDragOver={!isUploading ? handleDragOver : undefined}
            onDragLeave={!isUploading ? handleDragLeave : undefined}
            onDrop={!isUploading ? handleDrop : undefined}
            onClick={
              !isUploading ? () => fileInputRef.current.click() : undefined
            }
          >
            <input
              id='file-input'
              type='file'
              className='hidden'
              onChange={handleFileChange}
              accept='image/*'
              ref={fileInputRef}
            />
            {/* Image preview */}
            {isUploading ? (
              <div className='absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm'>
                <div className='animate-spin h-10 w-10 border-4 border-gray-300 border-t-red-500 rounded-full'></div>
              </div>
            ) : formData.image ? (
              <img
                src={formData.image}
                alt='Preview'
                className='max-h-full max-w-full object-contain p-4'
              />
            ) : (
              <div className='text-gray-500 text-center'>
                <p className='text-4xl text-gray-400'>+</p>
                <p className='mt-2 text-sm'>
                  Drag & drop an image here, or click to select
                </p>
              </div>
            )}
            {(error || validationErrors.image) && (
              <p className='mt-2 text-sm text-red-600 text-center'>
                {error || validationErrors.image}
              </p>
            )}

            {formData.image && (
              <button
                type='button'
                onClick={e => {
                  e.stopPropagation();
                  clearImage();
                }}
                className='absolute top-2 right-2 p-1 bg-red-500 text-white hover:bg-red-600 text-xs cursor-pointer'
              >
                &times;
              </button>
            )}
          </div>
        </div>
        {validationErrors.image && ( // Error message for image
          <p className='mt-1 text-sm text-red-600'>{validationErrors.image}</p>
        )}
      </div>

      {/* Image URL Input */}
      <div>
        <label
          htmlFor='image'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Image URL
        </label>
        <input
          type='text'
          id='image'
          name='image'
          className={`mt-1 block w-full border border-gray-300 py-2 px-3 focus:outline-2 focus:outline-violet-500 sm:text-sm
            ${
              validationErrors.image
                ? 'border-red-300 bg-red-100/30'
                : 'border-gray-300'
            }`}
          placeholder='e.g., https://example.com/product-image.jpg'
          value={formData.image}
          onChange={handleInputChange}
        />
        {validationErrors.image && (
          <p className='mt-1 text-sm text-red-600'>{validationErrors.image}</p>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Name Input */}
        <div>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            className={`mt-1 block w-full border border-gray-300 py-2 px-3 focus:outline-2 focus:outline-violet-500 sm:text-sm
            ${
              validationErrors.name
                ? 'border-red-300 bg-red-100/30'
                : 'border-gray-300'
            }`}
            placeholder='Product Name'
            value={formData.name || ''}
            onChange={handleInputChange}
            required
          />
          {validationErrors.name && ( // Error message for name
            <p className='mt-1 text-sm text-red-600'>{validationErrors.name}</p>
          )}
        </div>

        {/* Brand */}
        <div>
          <label
            htmlFor='brand'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Brand
          </label>
          <input
            type='text'
            id='brand'
            name='brand'
            className={`mt-1 block w-full border border-gray-300 py-2 px-3 focus:outline-2 focus:outline-violet-500 sm:text-sm ${
              validationErrors.brand ? 'border-red-300 bg-red-100/30' : ''
            }`}
            placeholder='e.g. Apple'
            value={formData.brand || ''}
            onChange={handleInputChange}
          />
          {validationErrors.brand && ( // Error message for brand
            <p className='mt-1 text-sm text-red-600'>
              {validationErrors.brand}
            </p>
          )}
        </div>

        {/* Description Textarea */}
        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Description
          </label>
          <textarea
            id='description'
            name='description'
            rows='4'
            className='whitespace-pre-line mt-1 block w-full border border-gray-300 py-2 px-3 focus:outline-2 focus:outline-violet-500 sm:text-sm'
            placeholder='A detailed description of the product...'
            value={formData.description || ''}
            onChange={handleInputChange}
          ></textarea>
        </div>

        {/* Category Input */}
        <div>
          <label
            htmlFor='category'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Category
          </label>
          <input
            type='text'
            id='category'
            name='category'
            className='mt-1 block w-full border border-gray-300 py-2 px-3 focus:outline-2 focus:outline-violet-500 sm:text-sm'
            placeholder='e.g., Electronics, Apparel'
            value={formData.category || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Inventory/Stock count */}
        <div>
          <label
            htmlFor='stock'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Stock/Inventory
          </label>
          <input
            type='number'
            id='stock'
            name='stock'
            className={`mt-1 block w-full border border-gray-300 py-2 px-3 focus:outline-2 focus:outline-violet-500 sm:text-sm ${
              validationErrors.stock ? 'border-red-300 bg-red-100/30' : ''
            }`}
            placeholder='e.g., 100'
            value={formData.stock || ''}
            onChange={handleInputChange}
          />
          {validationErrors.stock && (
            <p className='mt-1 text-sm text-red-600'>
              {validationErrors.stock}
            </p>
          )}
        </div>

        {/* next button */}
        <div className='flex justify-end mt-8'>
          <button
            type='button'
            onClick={onNext}
            className='cursor-pointer text-gray-700 hover:text-black'
            disabled={isSubmitting}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};
