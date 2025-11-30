import toast from 'react-hot-toast';
import { useRequestAdminKey } from '../../hooks/useAuth';
import { useUIStore } from '../../store/ui';
import { useAuthStore } from '../../store/auth';

const RequestAdminKeyModal = ({ isOpen, onClose }) => {
  const user = useAuthStore(s => s.user);
  const openVerifyKey = useUIStore(s => s.openVerifyKey);
  const requestAdminKey = useRequestAdminKey();

  if (!isOpen) return null;

  const handleSend = () => {
    if (!user) {
      toast.error('You must be logged in to request an admin key.');
      return;
    }

    // trigger mutation
    requestAdminKey.mutate(user.email, {
      onSuccess: () => {
        toast.success('Admin key sent to your email.');
        onClose();
        openVerifyKey();
      },
      onError: err => {
        toast.error(err?.response?.data?.message || 'Failed to send key.');
      },
    });
  };

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg'>
        <h2 className='text-xl font-semibold mb-3'>Request Admin Key</h2>
        <p className='text-gray-600'>
          We will send an admin verification key to:
        </p>

        <p className='font-medium mt-1 mb-4'>{user?.email}</p>

        <p className='text-gray-500 text-sm'>Do you want to continue?</p>

        <div className='flex justify-end gap-3 mt-6'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-500 hover:text-gray-700 cursor-pointer'
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={requestAdminKey.isPending}
            className='px-4 py-2 bg-black text-white rounded hover:bg-black/80 disabled:bg-gray-400 cursor-pointer'
          >
            {requestAdminKey.isPending ? 'Sending...' : 'Send Key'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestAdminKeyModal;
