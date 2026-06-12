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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Category Management
          </h1>
          <p className="text-gray-500">Organize your clothing collections</p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setActiveTab('addCategory')}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'addCategory'
                    ? 'bg-gray-800 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiFolder className="inline mr-2" />
                Add Category
              </button>
              <button
                onClick={() => setActiveTab('addSubcategory')}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'addSubcategory'
                    ? 'bg-gray-800 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiTag className="inline mr-2" />
                Add Subcategory
              </button>
            </div>

            {/* Add Category Form */}
            {activeTab === 'addCategory' && (
              <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Category</h3>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      placeholder="e.g., Summer Collection, Winter Wear"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-900 hover:to-gray-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                  >
                    <FiPlus className="text-xl" />
                    Create Category
                  </button>
                </form>
              </div>
            )}

            {/* Add Subcategory Form */}
            {activeTab === 'addSubcategory' && (
              <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Subcategory</h3>
                <form onSubmit={handleAddSubCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Category
                    </label>
                    <select
                      value={selectedCategoryId}
                      onChange={e => setSelectedCategoryId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="">Choose a category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory Name
                    </label>
                    <input
                      type="text"
                      value={newSubCategory}
                      onChange={e => setNewSubCategory(e.target.value)}
                      placeholder="e.g., Dresses, Shirts, Accessories"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-900 hover:to-gray-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                  >
                    <FiSave className="text-xl" />
                    Add Subcategory
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Column - Categories List */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Your Collections</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-gray-500">No categories yet</p>
                <p className="text-sm text-gray-400 mt-2">Create your first category to get started</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {categories.map((cat, index) => (
                  <div
                    key={cat._id}
                    className="group bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms`, animation: 'fadeInUp 0.5s ease-out' }}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => toggleCategory(cat._id)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <FiChevronRight
                            className={`text-xl transform transition-transform duration-200 ${
                              openCategories[cat._id] ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800 text-lg">{cat.name}</span>
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                              {cat.subCategories.length}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                      >
                        <FiTrash2 />
                      </button>
                    </div>

                    {/* Subcategories */}
                    {openCategories[cat._id] && cat.subCategories.length > 0 && (
                      <div className="bg-white border-t border-gray-100">
                        {cat.subCategories.map((sub, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-4 py-3 ml-12 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                              <span className="text-gray-700">{sub}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteSubCategory(cat._id, sub)}
                              className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Empty subcategories message */}
                    {openCategories[cat._id] && cat.subCategories.length === 0 && (
                      <div className="px-4 pb-4 ml-12">
                        <p className="text-sm text-gray-400 italic">No subcategories yet</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default CategoryManager;