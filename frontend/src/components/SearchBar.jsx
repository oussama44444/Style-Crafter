import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/Shopcontext';

import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const { showSearch, setShowSearch } = useContext(ShopContext);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  if (!showSearch) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setShowSearch(false);
      navigate(`/search?query=${encodeURIComponent(input.trim())}`);
    }
  };

  return (
    <div className='fixed inset-0 z-[200] flex items-start justify-center bg-black/30 backdrop-blur-sm'>
      <form
        onSubmit={handleSearch}
        className='mt-10 bg-white rounded-lg shadow-lg flex items-center px-4 py-2 gap-2 w-full max-w-xl'
      >
        <input
          autoFocus
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Search for products, categories, subcategories...'
          className='flex-1 outline-none px-2 py-1 text-lg'
        />
        <button
          type='submit'
          className=' text-white px-4 py-1 rounded '
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='black'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z'
            />
          </svg>
        </button>
        <button
          type='button'
          onClick={() => setShowSearch(false)}
          className='ml-2 text-gray-500 hover:text-black text-2xl'
        >
          ×
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
