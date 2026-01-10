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
      <div className='bg-white p-6 w-[90%] max-w-md border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fadeIn'>
        {/* Success Notice */}
        <div className='flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-5'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='w-6 h-6'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M4.5 12.75l6 6 9-13.5'
            />
          </svg>
          <p className='font-medium text-green-700'>
            Admin key sent successfully!
          </p>
        </div>

        {/* Title */}
        <p className='text-gray-600 mb-6'>
          A verification key was sent to: {user?.email}
        </p>
        <p className='text-sm mb-4 font-medium'>
          Enter the key below to confirm your admin status:
        </p>

        {/* Input */}
        <input
          type='text'
          value={keyInput}
          onChange={e => setKeyInput(e.target.value)}
          placeholder='Enter admin key'
          className='w-full border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-black/80 transition'
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
