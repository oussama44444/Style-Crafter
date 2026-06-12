import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { FiPlus, FiTrash2, FiChevronRight, FiFolder, FiTag, FiSave } from 'react-icons/fi';

const CategoryManager = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [openCategories, setOpenCategories] = useState({});
  const [activeTab, setActiveTab] = useState('addCategory');

  const toggleCategory = (catId) => {
    setOpenCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/categories`);
      console.log("Fetched categories:", res.data);
      setCategories(res.data.categories);
    } catch (err) {
      console.error("Error:", err);
      alert('Failed to fetch categories');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await axios.post(`${backendUrl}/api/categories/add`, 
        { name: newCategory }, 
        { headers: { token } }
      );
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding category');
    }
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategoryId || !newSubCategory.trim()) return;
    const category = categories.find(cat => cat._id === selectedCategoryId);
    try {
      await axios.post(`${backendUrl}/api/categories/add`, 
        { name: category.name, subCategory: newSubCategory }, 
        { headers: { token } }
      );
      setNewSubCategory('');
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding subcategory');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category and all its subcategories?')) return;
    try {
      await axios.delete(`${backendUrl}/api/categories/${id}`, 
        { headers: { token } }
      );
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting category');
    }
  };

  const handleDeleteSubCategory = async (catId, subCategory) => {
    if (!window.confirm('Delete this subcategory?')) return;
    try {
      await axios.delete(`${backendUrl}/api/categories/${catId}`, 
        { data: { subCategory }, headers: { token } }
      );
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting subcategory');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-500">Organize your clothing collections</p>
        </div>

        {/* Main Grid - Column on mobile, side by side on desktop */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
          {/* Left Column - Forms */}
          <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setActiveTab('addCategory')}
                className={`flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md font-medium transition-all duration-200 text-xs sm:text-sm ${
                  activeTab === 'addCategory'
                    ? 'bg-gray-800 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiFolder className="inline mr-1 sm:mr-2 text-xs sm:text-sm" />
                <span className="hidden xs:inline">Add Category</span>
                <span className="xs:hidden">Category</span>
              </button>
              <button
                onClick={() => setActiveTab('addSubcategory')}
                className={`flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md font-medium transition-all duration-200 text-xs sm:text-sm ${
                  activeTab === 'addSubcategory'
                    ? 'bg-gray-800 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiTag className="inline mr-1 sm:mr-2 text-xs sm:text-sm" />
                <span className="hidden xs:inline">Add Subcategory</span>
                <span className="xs:hidden">Subcategory</span>
              </button>
            </div>

            {/* Add Category Form */}
            {activeTab === 'addCategory' && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 transform transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Create New Category</h3>
                <form onSubmit={handleAddCategory} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      placeholder="e.g., Summer Collection"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-gray-900 hover:to-gray-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
                  >
                    <FiPlus className="text-lg sm:text-xl" />
                    Create Category
                  </button>
                </form>
              </div>
            )}

            {/* Add Subcategory Form */}
            {activeTab === 'addSubcategory' && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 transform transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Add Subcategory</h3>
                <form onSubmit={handleAddSubCategory} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Select Category
                    </label>
                    <select
                      value={selectedCategoryId}
                      onChange={e => setSelectedCategoryId(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="">Choose a category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Subcategory Name
                    </label>
                    <input
                      type="text"
                      value={newSubCategory}
                      onChange={e => setNewSubCategory(e.target.value)}
                      placeholder="e.g., Dresses, Shirts"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-gray-900 hover:to-gray-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
                  >
                    <FiSave className="text-lg sm:text-xl" />
                    Add Subcategory
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Column - Categories List */}
          <div className="w-full lg:w-1/2 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Your Collections</h3>
              <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 sm:h-10 md:h-12 w-8 sm:w-10 md:w-12 border-b-2 border-gray-800"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 sm:py-10 md:py-12">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">📁</div>
                <p className="text-sm sm:text-base text-gray-500">No categories yet</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">Create your first category to get started</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                {categories.map((cat, index) => (
                  <div
                    key={cat._id}
                    className="group bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all duration-200 overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-3 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => toggleCategory(cat._id)}
                          className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
                        >
                          <FiChevronRight
                            className={`text-base sm:text-xl transform transition-transform duration-200 flex-shrink-0 ${
                              openCategories[cat._id] ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                            <span className="font-semibold text-gray-800 text-sm sm:text-base truncate">{cat.name}</span>
                            <span className="text-xs bg-gray-200 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0">
                              {cat.subCategories.length}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 p-1.5 sm:p-2 rounded-lg hover:bg-red-50 flex-shrink-0"
                      >
                        <FiTrash2 className="text-sm sm:text-base" />
                      </button>
                    </div>

                    {/* Subcategories */}
                    {openCategories[cat._id] && cat.subCategories.length > 0 && (
                      <div className="bg-white border-t border-gray-100">
                        {cat.subCategories.map((sub, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 ml-6 sm:ml-12 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></div>
                              <span className="text-gray-700 text-xs sm:text-sm truncate">{sub}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteSubCategory(cat._id, sub)}
                              className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50 flex-shrink-0"
                            >
                              <FiTrash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Empty subcategories message */}
                    {openCategories[cat._id] && cat.subCategories.length === 0 && (
                      <div className="px-3 sm:px-4 pb-2 sm:pb-4 ml-6 sm:ml-12">
                        <p className="text-xs sm:text-sm text-gray-400 italic">No subcategories yet</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default CategoryManager;