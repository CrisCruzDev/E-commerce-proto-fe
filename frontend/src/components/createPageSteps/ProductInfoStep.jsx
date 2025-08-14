import { useEffect, useRef, useState } from 'react'

export const ProductInfoStep = ({
  formData,
  onFormChange,
  onNext,
  validationErrors,
  isSubmitting,
}) => {
  const [imageFile, setImageFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef(null)

  useEffect(() => {
    if (formData.image && typeof formData.image === 'string') {
      setImageFile(formData.image)
    }
  }, [formData.image])

  const handleFile = (file) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setImageFile(reader.result)
      onFormChange({ image: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFile(file)
    } else {
      // --- FIX: If drop is invalid/cleared, ensure imageUrl is an empty string ---
      setImageFile(null)
      onFormChange({ image: '' })
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    onFormChange({ [name]: value })
  }

  const clearImage = () => {
    setImageFile(null)
    onFormChange({ image: '' })
  }

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
                  `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id='file-input'
              type='file'
              className='hidden'
              onChange={handleFileChange}
              accept='image/*'
              ref={fileInputRef}
            />
            {formData.image ? (
              <img
                src={formData.image}
                alt='Product Preview'
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
            {formData.image && (
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation()
                  clearImage()
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
          htmlFor='imageUrl'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Image URL
        </label>
        <input
          type='text'
          id='imageUrl'
          name='imageUrl'
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
            className='mt-1 block w-full border border-gray-300 py-2 px-3 focus:outline-2 focus:outline-violet-500 sm:text-sm'
            placeholder='A detailed description of the product...'
            value={formData.description || ''}
            onChange={handleInputChange}
          >
            <p className='whitespace-pre-line'></p>
          </textarea>
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
  )
}
