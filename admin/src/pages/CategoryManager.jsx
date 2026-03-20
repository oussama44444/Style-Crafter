import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

const CategoryManager = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [openCategories, setOpenCategories] = useState({});
  const toggleCategory = (catId) => {
    setOpenCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/category`);
      setCategories(res.data.categories);
    } catch (err) {
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
      await axios.post(`${backendUrl}/api/category/add`, { name: newCategory }, { headers: { token } });
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
      await axios.post(`${backendUrl}/api/category/add`, { name: category.name, subCategory: newSubCategory }, { headers: { token } });
      setNewSubCategory('');
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding subcategory');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category and all its subcategories?')) return;
    try {
      await axios.delete(`${backendUrl}/api/category/${id}`, { headers: { token } });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting category');
    }
  };

  const handleDeleteSubCategory = async (catId, subCategory) => {
    if (!window.confirm('Delete this subcategory?')) return;
    try {
      await axios.delete(`${backendUrl}/api/category/${catId}`, { data: { subCategory }, headers: { token } });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting subcategory');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Category Management</h2>
      <form onSubmit={handleAddCategory} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          placeholder="New Category Name"
          className="border px-2 py-1 rounded"
        />
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded font-bold shadow">Add Category</button>
      </form>
      <form onSubmit={handleAddSubCategory} className="mb-4 flex gap-2">
        <select
          value={selectedCategoryId}
          onChange={e => setSelectedCategoryId(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          value={newSubCategory}
          onChange={e => setNewSubCategory(e.target.value)}
          placeholder="New Subcategory Name"
          className="border px-2 py-1 rounded"
        />
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded font-bold shadow">Add Subcategory</button>
      </form>
      {loading ? <p>Loading...</p> : (
        <ul className="space-y-4">
          {categories.map(cat => (
            <li key={cat._id} className="border p-3 rounded">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCategory(cat._id)}
                    className="focus:outline-none text-gray-700 text-lg mr-2"
                    aria-label={openCategories[cat._id] ? 'Collapse' : 'Expand'}
                    style={{ width: 28, height: 28 }}
                  >
                    <div className="flex items-center gap-2">
                    <span style={{ display: 'inline-block', transition: 'transform 0.2s', transform: openCategories[cat._id] ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                      ▶
                    </span>
                    <span className="font-semibold text-lg">{cat.name}</span>
                    </div>
                  </button>
                 
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold shadow ml-2"
                >
                  Delete
                </button>
              </div>
              {cat.subCategories.length > 0 && openCategories[cat._id] && (
                <ul className="ml-6 mt-2 list-disc">
                  {cat.subCategories.map(sub => (
                    <li key={sub} className="flex justify-between items-center mb-2">
                      <span>{sub}</span>
                      <button
                        onClick={() => handleDeleteSubCategory(cat._id, sub)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded font-bold shadow ml-4 text-xs"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryManager;
