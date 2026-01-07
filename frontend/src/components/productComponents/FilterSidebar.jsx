import { X } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../../data/constants';

const FilterSidebar = ({
  availableBrands, // 🟢 Passed from parent (derived from DB)
  filters,
  setFilters,
  clearFilters,
  isOpen,
  onClose,
}) => {
  const handleCategoryChange = category => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? 'All' : category,
      page: 1,
    }));
  };

  const handleBrandChange = brand => {
    setFilters(prev => ({
      ...prev,
      brand: prev.brand === brand ? 'All' : brand,
      page: 1,
    }));
  };

  return (
    <>
      {/* 1. Mobile Overlay (Backdrop) */}
      <div
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 2. Sidebar / Drawer Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[70] w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out font-mono
          md:relative md:translate-x-0 md:z-0 md:w-64 md:shadow-none md:bg-transparent
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header - Fixed at top for Mobile */}
        <div className='flex justify-between items-center p-6 border-b border-gray-100 md:p-0 md:mb-8 md:pb-2 md:border-gray-200'>
          <h3 className='font-bebas text-3xl md:text-2xl tracking-wide'>
            Filters
          </h3>
          <div className='flex items-center gap-4'>
            <button
              onClick={clearFilters}
              className='text-xs text-red-500 hover:text-red-700 underline cursor-pointer'
            >
              Reset
            </button>
            {/* Close Button Only on Mobile */}
            <button onClick={onClose} className='md:hidden p-1'>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* --- SCROLLABLE CONTENT AREA --- */}
        <div className='overflow-y-auto h-[calc(100vh-160px)] md:h-auto p-6 md:p-0 space-y-8 custom-scrollbar'>
          {/* CATEGORIES */}
          <div className='space-y-6'>
            {PRODUCT_CATEGORIES.map(cat => (
              <div key={cat.name}>
                <p className='font-bold text-[10px] text-gray-400 mb-3 uppercase tracking-[0.2em]'>
                  {cat.name}
                </p>
                <div className='flex flex-col gap-2.5 pl-1'>
                  {cat.subcategories.map(sub => (
                    <label
                      key={sub}
                      className='flex items-center gap-3 cursor-pointer group'
                    >
                      <input
                        type='checkbox'
                        checked={filters.category === sub}
                        onChange={() => handleCategoryChange(sub)}
                        className='appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-black checked:border-black transition-all cursor-pointer'
                      />
                      <span
                        className={`text-sm transition-colors ${
                          filters.category === sub
                            ? 'font-bold text-black'
                            : 'text-gray-500 group-hover:text-black'
                        }`}
                      >
                        {sub}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* BRANDS */}
          <div>
            <h3 className='font-bold text-[10px] text-gray-400 mb-4 uppercase tracking-[0.2em]'>
              Brands
            </h3>
            <div className='max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-2.5 pl-1'>
              {availableBrands.length > 0 ? (
                availableBrands.map((brand, index) => (
                  <label
                    key={`${brand}-${index}`}
                    className='flex items-center gap-3 cursor-pointer group'
                  >
                    <input
                      type='checkbox'
                      checked={filters.brand === brand}
                      onChange={() => handleBrandChange(brand)}
                      className='appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-black checked:border-black transition-all cursor-pointer'
                    />
                    <span
                      className={`text-sm transition-colors ${
                        filters.brand === brand
                          ? 'font-bold text-black'
                          : 'text-gray-500 group-hover:text-black'
                      }`}
                    >
                      {brand}
                    </span>
                  </label>
                ))
              ) : (
                <p className='text-xs text-gray-400 italic'>
                  No brands available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile-Only Apply Button at Bottom */}
        <div className='absolute bottom-0 left-0 w-full p-6 bg-white border-t border-gray-100 md:hidden'>
          <button
            onClick={onClose}
            className='w-full bg-black text-white font-mono text-lg py-3 active:scale-[0.98] transition-transform rounded-sm'
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
