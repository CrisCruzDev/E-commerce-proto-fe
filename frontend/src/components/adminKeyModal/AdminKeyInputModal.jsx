import toast from 'react-hot-toast';
import { useVerifyAdminKey } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/auth';
import { useState } from 'react';

const AdminKeyInputModal = ({ isOpen, onClose }) => {
  const user = useAuthStore(s => s.user);
  const verifyMutation = useVerifyAdminKey();

  const [keyInput, setKeyInput] = useState('');

  if (!isOpen) return null;

  const handleVerify = () => {
    if (!keyInput.trim()) {
      toast.error('Please enter the admin key.');
      return;
    }
    verifyMutation.mutate(
      { email: user.email, adminKey: keyInput },
      {
        onSuccess: () => {
          toast.success('Admin key verified! You are now an admin.');
          onClose();
        },
        onError: err => {
          toast.error(
            err?.response?.data?.message || 'Invalid admin key. Try again.'
          );
        },
      }
    );
  };

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg'>
        <h2 className='text-xl font-semibold mb-3'>Enter Admin Key</h2>

        <p className='text-gray-600'>An admin verification key was sent to:</p>

        <p className='font-medium mt-1 mb-4'>{user?.email}</p>

        <p className='text-gray-500 text-sm mb-4'>
          Enter the key below to become an admin.
        </p>

        {/* Input */}
        <input
          type='text'
          value={keyInput}
          onChange={e => setKeyInput(e.target.value)}
          placeholder='Enter admin key'
          className='w-full border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-black'
        />

        {/* Buttons */}
        <div className='flex justify-end gap-3 mt-6'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-500 hover:text-gray-700 cursor-pointer'
          >
            Cancel
          </button>

          <button
            onClick={handleVerify}
            disabled={verifyMutation.isPending}
            className='px-4 py-2 bg-black text-white rounded hover:bg-black/80 disabled:bg-gray-400 cursor-pointer'
          >
            {verifyMutation.isPending ? 'Verifying...' : 'Verify Key'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminKeyInputModal;
