import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className='flex justify-center items-center gap-4 mt-12 font-bebas text-xl'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='disabled:opcaity-30 hover:text-primary transition-colors'
      >
        <ChevronLeft size={24} />
      </button>

      <div className='flex gap-2'>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-10 h-10 flex items-center justif-center border transition-all ${
              currentPage === i + 1
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-200 hover:border-black'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='disabled:opacity-30 hover:text-primary transition-colors'
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default Pagination;
