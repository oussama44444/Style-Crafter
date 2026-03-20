import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const navigate = useNavigate();

  const fetchList = async () => {
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
    }
  };

  const removeProduct = async (id) => {
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
    // Fetch categories for filter
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/category`);
        setCategories(res.data.categories);
      } catch (err) {
        // ignore
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Update subcategories when category changes
    const found = categories.find(cat => cat.name === selectedCategory);
    setSubCategories(found ? found.subCategories : []);
    setSelectedSubCategory('');
  }, [selectedCategory, categories]);

  const filteredList = list.filter(item => {
    let match = true;
    if (selectedCategory) match = match && item.category === selectedCategory;
    if (selectedSubCategory) match = match && item.subCategory === selectedSubCategory;
    return match;
  });

  return (
    <>
      <p className="mb-2">All Products</p>
      {/* Category/Subcategory filter UI */}
      <div className="flex gap-4 mb-4">
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <select
          value={selectedSubCategory}
          onChange={e => setSelectedSubCategory(e.target.value)}
          className="border px-2 py-1 rounded"
          disabled={!selectedCategory}
        >
          <option value="">All Subcategories</option>
          {subCategories.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <div className="md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Remove</b>
          <b className="text-center">Modify</b>
        </div>
        {filteredList.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
          >
            <img className="w-12" src={item.image[0]} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {item.price}
              {currency}
            </p>
            <button
              onClick={() => removeProduct(item._id)}
              className="text-right md:text-center bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded font-bold shadow"
            >
              Remove
            </button>
            <button
              onClick={() => navigate(`/modify/${item._id}`)}
              className="text-right md:text-center bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded font-bold shadow"
            >
              Modify
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
