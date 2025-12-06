import { useEffect, useState } from 'react';
import { createProduct, deleteProduct, updateProduct } from '../api/productApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductInfoStep } from '../components/createPageSteps/ProductInfoStep';
import { PricingStep } from '../components/createPageSteps/PricingStep';
import { ReviewStep } from '../components/createPageSteps/ReviewStep';
import { FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useProductStore } from '../store/product';

const CreatePage = ({ isEditMode = false }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { productToEdit, clearProductToEdit } = useProductStore();

  const [productFormData, setProductFormData] = useState({
    name: '',
    price: '',
    image: '',
    imagePublicId: '',
    description: '',
    category: '',
    brand: '',
    stock: '',
  });

  useEffect(() => {
    if (!isEditMode) clearProductToEdit();
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode && productToEdit) {
      setProductFormData(productToEdit);
    }
  }, [isEditMode, productToEdit]);

  console.log('Loaded product from store:', productToEdit);

  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  const sidebarSteps = [
    {
      id: 1,
      name: 'Product Information',
      requiredFields: ['name', 'image', 'brand', 'stock'],
    },
    { id: 2, name: 'Pricing', requiredFields: ['price'] },
    { id: 3, name: 'Review', requiredFields: [] },
  ];

  const resetForm = () => {
    setProductFormData({
      name: '',
      price: '',
      image: '',
      description: '',
      category: '',
      brand: '',
      stock: '',
    });
    setValidationErrors({});
    setCurrentStep(1);
  };

  const createProductMutation = useMutation({
    mutationFn: async newProduct => await createProduct(newProduct),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['getProductById', data._id], data);
      queryClient.invalidateQueries(['products']);
      console.log(data.message);
      toast.success('Product created!');
      resetForm();
      navigate('/');
    },
    onError: err => {
      console.error('Error creating product:', err);
      toast.error('Create product error!');
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, product }) => {
      return await updateProduct({ id, product });
    },
    onSuccess: updatedProduct => {
      queryClient.setQueryData(
        ['getProductById', updatedProduct._id],
        updatedProduct
      );
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully!');
      navigate('/');
    },
    onError: err => {
      console.error('[Mutation Error]', err);
      toast.error('Update product error!');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async pid => {
      await deleteProduct(pid);
    },
    onSuccess: (message, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.removeQueries({ queryKey: ['getProductById', variables] });
      console.log('Product Deleted:', message);
      toast.success('Product deleted!');

      navigate('/');
    },
    onError: (err, variables) => {
      console.error('Error deleting product:', err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to delete product.';

      toast.error(`Error: ${errorMessage}`);

      if (err.response?.status === 401) {
        navigate('/');
      }
    },
  });

  const validateStep = step => {
    const errors = {};
    const currentStepConfig = sidebarSteps.find(s => s.id === step);

    if (currentStepConfig) {
      currentStepConfig.requiredFields.forEach(field => {
        const value = productFormData[field];

        if (field === 'price') {
          if (!value || parseFloat(value) === 0) {
            errors[field] = 'Price cannot be empty or zero.';
          }
        } else {
          if (!value) {
            errors[field] = 'This field is required.';
          }
        }
      });
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      toast.error('Please fill in all required fields!');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prevStep => prevStep - 1);
    setValidationErrors({});
  };

  const handleFormChange = newData => {
    setProductFormData(prevData => ({ ...prevData, ...newData }));
    if (Object.keys(newData).length === 1) {
      const fieldName = Object.keys(newData)[0];
      setValidationErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProductInfoStep
            formData={productFormData}
            onFormChange={handleFormChange}
            onNext={handleNext}
            validationErrors={validationErrors}
            isSubmitting={createProductMutation.isPending}
          />
        );
      case 2:
        return (
          <PricingStep
            formData={productFormData}
            onFormChange={handleFormChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            validationErrors={validationErrors}
            isSubmitting={createProductMutation.isPending}
          />
        );
      case 3:
        return (
          <ReviewStep
            formData={productFormData}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            setCurrentStep={setCurrentStep}
            isSubmitting={
              createProductMutation.isPending || updateProductMutation.isPending
            }
            deleteProductMutation={deleteProductMutation}
            isEditing={isEditMode}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (currentStep === 3) {
      try {
        if (validateStep(1) && validateStep(2)) {
          const newProduct = {
            ...productFormData,
            price: parseFloat(productFormData.price),
            stock: parseInt(productFormData.stock),
          };

          if (isEditMode && productToEdit?._id) {
            updateProductMutation.mutate({
              id: productToEdit._id,
              product: newProduct,
            });
          } else {
            setTimeout(() => {
              createProductMutation.mutate(newProduct);
            }, 200);
          }
        }
      } catch {
        toast.error('Validation error');
      }
      return;
    }
  };

  return (
    <div className='min-h-screen font-inter p-4 md:p-8 lg:p-12'>
      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-8'>
        {/* Sidebar */}
        <nav className='lg:w-1/5 pt-4 lg:border-r border-gray-200'>
          <ul className='flex justify-center lg:justify-start lg:flex-col gap-4'>
            {sidebarSteps.map(step => (
              <li key={step.id} className=''>
                <a
                  href='#'
                  onClick={e => {
                    e.preventDefault();
                    // Allow direct navigation to previous steps, but validate current step
                    if (step.id < currentStep) {
                      setCurrentStep(step.id);
                      setValidationErrors({}); // Clear errors when jumping back
                    } else if (step.id === currentStep) {
                      // Do nothing if clicking current step
                    } else {
                      // Prevent jumping forward without validation
                      toast.error('Please complete the current step first.');
                    }
                  }}
                  className='flex items-center gap-1'
                >
                  {/* Conditional rendering for the icon/line */}
                  {step.id < currentStep ? (
                    <FiCheck className='w-5 h-5 text-green-500' /> // Checkmark for completed steps mr-3
                  ) : (
                    <span
                      className={`w-4 h-0.5  ${
                        currentStep === step.id ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    ></span> //my-auto mr-3
                  )}
                  {/* Conditional text styling */}
                  <p
                    className={`${
                      currentStep === step.id
                        ? 'text-base font-medium text-black' // Active step
                        : step.id < currentStep
                        ? 'text-sm font-medium text-gray-600' // Completed step (black text)
                        : 'text-gray-400 text-xs' // Future step (grayed out)
                    }`}
                  >
                    {step.name}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content Area */}
        <div className='lg:w-3/4 py-3'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {renderStep()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
