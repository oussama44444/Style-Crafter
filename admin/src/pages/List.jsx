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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
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
        // FIX: Changed from /api/category to /api/categories
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

  // Filter products based on category, subcategory, and search
  const filteredList = list.filter(item => {
    let match = true;
    if (selectedCategory) match = match && item.category === selectedCategory;
    if (selectedSubCategory) match = match && item.subCategory === selectedSubCategory;
    if (searchTerm) {
      match = match && item.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return match;
  });

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Product Management
          </h1>
          <p className="text-gray-500">Manage your clothing collection</p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">{list.length}</div>
              <div className="text-sm text-gray-500">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">{categories.length}</div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">{filteredList.length}</div>
              <div className="text-sm text-gray-500">Filtered Results</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">
                {list.reduce((sum, item) => sum + (item.price || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Inventory Value</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
            >
              <FiFilter />
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  viewMode === 'grid' 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <FiGrid /> Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  viewMode === 'list' 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <FiList /> List
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Subcategory</label>
                  <select
                    value={selectedSubCategory}
                    onChange={e => setSelectedSubCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
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
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
                  >
                    <FiX /> Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {(selectedCategory || selectedSubCategory || searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategory && (
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm flex items-center gap-2">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="hover:text-red-500">
                  <FiX size={14} />
                </button>
              </span>
            )}
            {selectedSubCategory && (
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm flex items-center gap-2">
                Subcategory: {selectedSubCategory}
                <button onClick={() => setSelectedSubCategory('')} className="hover:text-red-500">
                  <FiX size={14} />
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm flex items-center gap-2">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="hover:text-red-500">
                  <FiX size={14} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-500">Try adjusting your filters or add a new product</p>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredList.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative aspect-square bg-gray-100">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image[0]}
                    alt={item.name}
                  />
                  {item.bestseller && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full shadow">
                      ⭐ Bestseller
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                      {item.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                      {item.subCategory}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-3">
                    {currency}{item.price}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FiTrash2 size={16} /> Remove
                    </button>
                    <button
                      onClick={() => navigate(`/modify/${item._id}`)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FiEdit2 size={16} /> Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Image</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Subcategory</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredList.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <img className="w-12 h-12 object-cover rounded" src={item.image[0]} alt={item.name} />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                          {item.subCategory}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {currency}{item.price}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => removeProduct(item._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 flex items-center gap-1"
                          >
                            <FiTrash2 size={14} /> Remove
                          </button>
                          <button
                            onClick={() => navigate(`/modify/${item._id}`)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 flex items-center gap-1"
                          >
                            <FiEdit2 size={14} /> Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;