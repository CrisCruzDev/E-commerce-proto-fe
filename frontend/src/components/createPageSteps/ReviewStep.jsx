import { AiOutlineDelete } from 'react-icons/ai'

export const ReviewStep = ({
  formData,
  onPrevious,
  isSubmitting,
  setCurrentStep,
  deleteProductMutation,
  isEditing,
}) => {
  const productId = formData._id

  const handleEditClick = (stepNumber) => {
    if (setCurrentStep) {
      setCurrentStep(stepNumber)
    }
  }
  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(productId)
    }
  }
  return (
    <div className='space-y-8'>
      <div className='flex flex-col items-center'>
        <div
          className={`w-36 h-36 md:w-48 md:h-48 flex items-center justify-center overflow-hidden ${
            formData.image ? 'bg-gray-100' : ''
          }`}
        >
          {formData.image ? (
            <img
              src={formData.image}
              alt='Product'
              className='max-w-full max-h-full object-contain'
            />
          ) : (
            <span className='text-gray-400 text-sm'>No Image</span>
          )}
        </div>
        <p className='text-lg font-bold pt-2'>{formData.name || 'N/A'}</p>
        <span className='w-full h-px mt-4 bg-gray-300'></span>
      </div>

      <div className='space-y-4 border-b border-gray-300'>
        <div className='flex items-center justify-between'>
          <h3 className='font-medium text-lg'>Product Details</h3>
          <button
            type='button'
            onClick={() => handleEditClick(1)}
            className=''
            disabled={isSubmitting}
          >
            <p className='text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer'>
              Edit
            </p>
          </button>
        </div>
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between border-gray-200 pb-2'>
            <p className='text-gray-500'>Product Name</p>
            <p className='font-medium'>{formData.name || 'N/A'}</p>
          </div>
          <div className='flex justify-between border-gray-200 pb-2'>
            <p className='text-gray-500'>Brand</p>
            <p className='font-medium'>{formData.brand || 'N/A'}</p>
          </div>
          <div className='flex justify-between border-gray-200 pb-2'>
            <p className='text-gray-500'>Category</p>
            <p className='font-medium'>{formData.category || 'N/A'}</p>
          </div>
          <div className='border-gray-200 pb-6'>
            <p className='text-gray-500 mb-1'>Product Description</p>
            <p className='text-black whitespace-pre-line'>
              {formData.description || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='font-medium text-lg'>Pricing</h3>
          <button
            type='button'
            onClick={() => handleEditClick(2)}
            className=''
            disabled={isSubmitting}
          >
            <p className='text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer'>
              Edit
            </p>
          </button>
        </div>
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between border-gray-200 pb-2'>
            <p className='text-gray-500'>Price</p>
            <p className='font-medium'>
              {formData.price ? `$${formData.price}` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8'>
        <button
          type='button'
          onClick={onPrevious}
          className='w-full sm:w-auto px-6 py-2 border border-black text-black font-medium hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer'
          disabled={isSubmitting}
        >
          Back
        </button>

        <button
          type='submit'
          className='w-full sm:w-auto px-6 py-2 bg-black/90 text-white font-medium hover:bg-black disabled:bg-gray-400 cursor-pointer'
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEditing
              ? 'Updating...'
              : 'Creating...'
            : isEditing
            ? 'Update Product'
            : 'Create Product'}
        </button>
      </div>
      {isEditing && (
        <div className='flex justify-center mt-4'>
          <button
            type='button'
            onClick={handleDeleteClick}
            className='flex items-center text-red-600 hover:text-red-700 disabled:opacity-50 cursor-pointer'
            disabled={deleteProductMutation.isPending}
          >
            {deleteProductMutation.isPending ? (
              'Deleting...'
            ) : (
              <AiOutlineDelete className='w-5 h-5 mr-1' />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
