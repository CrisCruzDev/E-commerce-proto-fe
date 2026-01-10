import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';

const getMyOrder = async () => {
  const res = await api.get('/orders/myorders');
  return res.data?.data;
};

export const useGetMyOrders = () => {
  return useQuery({
    queryKey: ['myOrders'],
    queryFn: getMyOrder,
  });
};
