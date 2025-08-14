export const PricingStep = ({
  formData,
  onFormChange,
  onNext,
  onPrevious,
  validationErrors,
  isSubmitting,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    onFormChange({ [name]: value })
  }
  return (
    <>
      <h1 className='text-3xl font-medium mb-8'>Pricing</h1>
      <div>
        <label
          htmlFor='price'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Price
        </label>
        <input
          type='number'
          id='price'
          name='price'
          price='price'
          className={`mt-1 block w-full border border-gray-300 py-2 px-3 focus:outline-2 focus:outline-violet-500 sm:text-sm
            ${
              validationErrors.price
                ? 'border-red-400 bg-red-100/50'
                : 'border-gray-300'
            }`}
          placeholder='0'
          value={formData.price}
          onChange={handleInputChange}
          step='0.01'
          required
        />
        {validationErrors.price && (
          <p className='mt-1 text-sm text-red-600'>{validationErrors.price}</p>
        )}
      </div>
      {/* next button */}
      <div className='flex justify-end mt-8 space-x-4'>
        <button
          type='button'
          onClick={onPrevious}
          className='cursor-pointer text-gray-700 hover:text-black'
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          type='button'
          onClick={onNext}
          className='cursor-pointer text-gray-700 hover:text-black'
          disabled={isSubmitting}
        >
          Next
        </button>
      </div>
    </>
  )
}
