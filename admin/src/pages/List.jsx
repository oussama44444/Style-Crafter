import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiTrash2, FiEdit2, FiGrid, FiList, FiEye, FiX } from 'react-icons/fi';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/categories`);
        setCategories(res.data.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const found = categories.find(cat => cat.name === selectedCategory);
    setSubCategories(found ? found.subCategories : []);
    setSelectedSubCategory('');
  }, [selectedCategory, categories]);

  const filteredList = list.filter(item => {
    let match = true;
    if (selectedCategory) match = match && item.category === selectedCategory;
    if (selectedSubCategory) match = match && item.subCategory === selectedSubCategory;
    if (searchTerm) {
      match = match && item.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return match;
  });

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage your clothing collection</p>
        </div>

        {/* Stats Bar - Responsive */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{list.length}</div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-500">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{categories.length}</div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{filteredList.length}</div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-500">Filtered</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                {list.reduce((sum, item) => sum + (item.price || 0), 0).toLocaleString()}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-500">Inventory Value</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FiFilter size={16} />
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                  viewMode === 'grid' 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <FiGrid size={16} /> <span className="hidden xs:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                  viewMode === 'list' 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <FiList size={16} /> <span className="hidden xs:inline">List</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm">Subcategory</label>
                  <select
                    value={selectedSubCategory}
                    onChange={e => setSelectedSubCategory(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
                    disabled={!selectedCategory}
                  >
                    <option value="">All Subcategories</option>
                    {subCategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {(selectedCategory || selectedSubCategory || searchTerm) && (
                <div className="mt-3 sm:mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-red-600 hover:text-red-700 font-semibold flex items-center gap-2 text-sm"
                  >
                    <FiX size={14} /> Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {(selectedCategory || selectedSubCategory || searchTerm) && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {selectedCategory && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="hover:text-red-500">
                  <FiX size={12} />
                </button>
              </span>
            )}
            {selectedSubCategory && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                Subcategory: {selectedSubCategory}
                <button onClick={() => setSelectedSubCategory('')} className="hover:text-red-500">
                  <FiX size={12} />
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="hover:text-red-500">
                  <FiX size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-20">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-gray-800"></div>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-10 md:p-12 text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">📦</div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">No Products Found</h3>
            <p className="text-xs sm:text-sm text-gray-500">Try adjusting your filters or add a new product</p>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View - Responsive
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filteredList.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative aspect-square bg-gray-100">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image[0]}
                    alt={item.name}
                  />
                  {item.bestseller && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow">
                      ⭐ Bestseller
                    </span>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
                    <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                      {item.category}
                    </span>
                    <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                      {item.subCategory}
                    </span>
                  </div>
                  <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {currency}{item.price}
                  </div>
                  <div className="flex gap-1.5 sm:gap-2">
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <FiTrash2 size={14} /> <span className="hidden xs:inline">Remove</span>
                    </button>
                    <button
                      onClick={() => navigate(`/modify/${item._id}`)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <FiEdit2 size={14} /> <span className="hidden xs:inline">Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View - Responsive with horizontal scroll
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Image</th>
                      <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Name</th>
                      <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Category</th>
                      <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Price</th>
                      <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredList.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
                          <img className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover rounded" src={item.image[0]} alt={item.name} />
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-800 text-xs sm:text-sm whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-200 text-gray-700 rounded text-[10px] sm:text-xs whitespace-nowrap">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-semibold text-gray-900 text-xs sm:text-sm whitespace-nowrap">
                          {currency}{item.price}
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
                          <div className="flex gap-1 sm:gap-2 justify-center">
                            <button
                              onClick={() => removeProduct(item._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs transition-all duration-200 flex items-center gap-0.5 sm:gap-1"
                            >
                              <FiTrash2 size={12} /> Remove
                            </button>
                            <button
                              onClick={() => navigate(`/modify/${item._id}`)}
                              className="bg-green-500 hover:bg-green-600 text-white px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs transition-all duration-200 flex items-center gap-0.5 sm:gap-1"
                            >
                              <FiEdit2 size={12} /> Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;