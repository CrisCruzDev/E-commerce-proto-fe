import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, Search } from 'lucide-react';

import ProductCard from '../components/productComponents/ProductCard';
import FilterSidebar from '../components/productComponents/FilterSidebar';
import Pagination from '../components/productComponents/Pagination';
import { getProducts } from '../api/productApi';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  //Lock scrolling when filter is open
  useLockBodyScroll(isFilterOpen);

  // 1. Initial State derived from URL
  const [filters, setFilters] = useState({
    search: '',
    category: searchParams.get('category') || 'All',
    brand: searchParams.get('brand') || 'All',
    page: 1,
    limit: 9,
  });

  // 2. Fetch Data
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // Cache for 5 mins
  });
  console.log('products in page', products);

  // 3. 🧠 DERIVE BRANDS: Extract unique brands from actual products
  const availableBrands = useMemo(() => {
    if (!Array.isArray(products)) return [];

    const uniqueBrands = [
      ...new Set(
        products.map(p => p.brand).filter(Boolean) // Removes null/undefined
      ),
    ];

    return uniqueBrands
      .filter(brand => brand.toLowerCase() !== 'uncategorized') // Hide "Not Tagged" noise
      .sort((a, b) => a.localeCompare(b)); // Better sorting
  }, [products]);

  // 4. Sync URL with State (When Navbar is clicked)
  useEffect(() => {
    const cat = searchParams.get('category');
    const brand = searchParams.get('brand');

    // Only update if URL params are present and different from current state
    if (
      (cat && cat !== filters.category) ||
      (brand && brand !== filters.brand)
    ) {
      setFilters(prev => ({
        ...prev,
        category: cat || 'All',
        brand: brand || 'All',
        page: 1,
      }));
    }
  }, [searchParams]);

  // 5. Update URL when Filters Change (Optional but good UX)
  // This allows users to share the URL with current filters
  useEffect(() => {
    const params = {};
    if (filters.category !== 'All') params.category = filters.category;
    if (filters.brand !== 'All') params.brand = filters.brand;
    setSearchParams(params);
  }, [filters.category, filters.brand]);

  // 6. Filter Logic
  const filteredProducts = useMemo(() => {
    // 1. Safety Check: If API returns weird data, return empty array
    if (!Array.isArray(products)) return [];

    return products.filter(product => {
      // A. Safe Search (Handle missing name)
      const name = product.name?.toLowerCase() || '';
      const matchesSearch = name.includes(filters.search.toLowerCase());

      // B. Safe Category Check
      // If category is missing, we treat it as "uncategorized" internally
      const productCat = product.category?.toLowerCase() || 'uncategorized';
      const filterCat = filters.category.toLowerCase();
      // Logic: If filter is 'All', show everything.
      // If filter matches specific category, show it.
      // 'Uncategorized' items will ONLY show up in 'All' (unless you make an 'Uncategorized' filter option)
      const matchesCategory =
        filters.category === 'All' || productCat === filterCat;

      // C. Safe Brand Check
      const productBrand = product.brand?.toLowerCase() || 'uncategorized';
      const filterBrand = filters.brand.toLowerCase();
      const matchesBrand =
        filters.brand === 'All' || productBrand === filterBrand;

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [products, filters]);

  // 7. Pagination Logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / filters.limit);
  const startIndex = (filters.page - 1) * filters.limit;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + filters.limit
  );

  console.log('currentProducts', currentProducts);

  // Scroll top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters.page]);

  if (isLoading)
    return (
      <div className='animate-spin h-10 w-10 border-4 border-gray-300 border-t-red-500 rounded-full'></div>
    );

  return (
    <div className='container mx-auto md:px-12 px-4 py-8 max-w-7xl'>
      {/* TOP BAR */}
      <div className='flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8 border-b border-black pb-6'>
        <div className='relative w-full md:max-w-md'>
          <input
            type='text'
            placeholder='Search Products'
            className='w-full bg-gray-50 rounded-md py-2 pl-10 focus:outline-none focus:border-black transition-colors font-mono tracking-tighter text-md'
            value={filters.search}
            onChange={e =>
              setFilters({ ...filters, search: e.target.value, page: 1 })
            }
          />
          <Search className='absolute left-3 top-2.5 text-gray-400' size={20} />
        </div>
        <div className='flex items-center gap-4'>
          <span className='font-mono text-sm text-gray-500'>
            {totalItems} RESULT{totalItems !== 1 ? 'S' : ''}
          </span>
          <div className='flex items-center gap-2 font-mono text-xs uppercase'>
            <span>Show:</span>
            <select
              className='border border-gray-300 p-1 focus:outline-none'
              value={filters.limit}
              onChange={e =>
                setFilters({
                  ...filters,
                  limit: Number(e.target.value),
                  page: 1,
                })
              }
            >
              <option value={9}>9</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile filter */}
      <div className='flex md:hidden justify-between items-center mb-4'>
        <button
          onClick={() => setIsFilterOpen(true)}
          className='flex items-center gap-2 font-bebas text-lg '
        >
          <Filter size={18} /> FILTERS
        </button>
        <span className='font-mono text-sm text-gray-500'>
          {totalItems} RESULTS
        </span>
      </div>
      <div className='flex gap-8 relative'>
        {/* 👈 LEFT COLUMN: Filters */}
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          availableBrands={availableBrands}
          filters={filters}
          setFilters={setFilters}
          clearFilters={() =>
            setFilters({
              ...filters,
              category: 'All',
              brand: 'All',
              search: '',
              page: 1,
            })
          }
        />

        {/* RIGHT COLUMN: Product Grid */}
        <main className='flex-1 min-h-[600px]'>
          {/* Active Filters Badges (Mobile/Desktop) */}
          {(filters.category !== 'All' || filters.brand !== 'All') && (
            <div className='flex gap-2 mb-6 font-mono font-semibold text-xs'>
              {filters.category !== 'All' && (
                <span className='border border-gray-200 text-secondary px-3 py-1 flex items-center gap-2 rounded-sm'>
                  {filters.category}
                  <button
                    onClick={() => setFilters({ ...filters, category: 'All' })}
                    className='cursor-pointer'
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.brand !== 'All' && (
                <span className='bg-primary text-white px-3 py-1 flex items-center gap-2 rounded-sm'>
                  {filters.brand}
                  <button
                    onClick={() => setFilters({ ...filters, brand: 'All' })}
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {currentProducts.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6 lg:gap-8'>
              {currentProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className='h-full flex flex-col items-center justify-center text-gray-400 font-mono py-20'>
              <p className='text-xl mb-2'>No products found.</p>
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    category: 'All',
                    brand: 'All',
                    search: '',
                  })
                }
                className='text-sm underline hover:text-black cursor-pointer'
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* 🔢 PAGINATION */}
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={page => setFilters({ ...filters, page })}
          />
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
