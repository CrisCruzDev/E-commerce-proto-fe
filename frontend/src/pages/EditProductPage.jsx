// EditProductPage.jsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../api/productApi';
import CreatePage from './CreatePage';
import { useProductStore } from '../store/product';
import { useEffect } from 'react';

const EditProductPage = () => {
  const { id } = useParams();
  const clearProductToEdit = useProductStore(s => s.clearProductToEdit);
  const setProductToEdit = useProductStore(s => s.setProductToEdit);

  const { data: product, isLoading } = useQuery({
    queryKey: ['getProductById', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    // 💡 ensures the store is updated as soon as data arrives
    select: data => {
      setProductToEdit(data);
      return data;
    },
  });

  useEffect(() => {
    return () => clearProductToEdit();
  }, [clearProductToEdit]);

  if (isLoading) return <p>Loading...</p>;

  return <CreatePage isEditMode />;
};

export default EditProductPage;
