import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { HexColorPicker } from "react-colorful";
import { FiUpload, FiX, FiPlus, FiTrash2, FiFolder, FiTag, FiDollarSign, FiGrid, FiHash } from 'react-icons/fi';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [showColors, setShowColors] = useState(false);
  const [colorVariants, setColorVariants] = useState([]); 

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/categories`);
        setCategories(res.data.categories);
        if (res.data.categories.length > 0) {
          setCategory(res.data.categories[0].name);
          setSubCategories(res.data.categories[0].subCategories);
          setSubCategory(res.data.categories[0].subCategories[0] || "");
        }
      } catch (error) {
        console.log(error)
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const found = categories.find(cat => cat.name === category);
    setSubCategories(found ? found.subCategories : []);
    setSubCategory(found && found.subCategories.length > 0 ? found.subCategories[0] : "");
  }, [category, categories]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      
      if (showColors && colorVariants.length > 0) {
        const colorsArr = colorVariants.map((variant, idx) => ({ color: variant.color }));
        formData.append("colors", JSON.stringify(colorsArr));
        colorVariants.forEach((variant, idx) => {
          variant.images.forEach((img, imgIdx) => {
            if (img) formData.append(`color${idx+1}_image${imgIdx+1}`, img);
          });
        });
      } else {
        image1 && formData.append("image1", image1);
        image2 && formData.append("image2", image2);
        image3 && formData.append("image3", image3);
        image4 && formData.append("image4", image4);
      }
      
      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
        setSizes([]);
        setBestseller(false);
        setColorVariants([]);
        setShowColors(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            Add New Product
          </h1>
          <p className="text-sm sm:text-base text-gray-500">Create a new product for your collection</p>
        </div>

        <form onSubmit={onSubmitHandler} className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8">
          {/* Color Variations Toggle */}
          <div className="flex justify-end">
            <button
              type='button'
              className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                showColors 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-md' 
                  : 'bg-gradient-to-r from-gray-800 to-gray-700 text-white hover:from-gray-900 hover:to-gray-800 shadow-md'
              }`}
              onClick={() => setShowColors(v => !v)}
            >
              <FiGrid size={16} />
              {showColors ? 'Disable Color Variations' : 'Enable Color Variations'}
            </button>
          </div>

          {/* Image Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 hover:border-gray-400 transition-colors">
            {showColors ? (
              <div className='space-y-4 sm:space-y-6'>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4">Color Variants</h3>
                {colorVariants.map((variant, idx) => (
                  <div key={idx} className='bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4'>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                        <span className="font-medium text-gray-700">Color:</span>
                        <div className="flex flex-wrap items-center gap-2">
                          <HexColorPicker 
                            color={variant.color} 
                            onChange={color => {
                              setColorVariants(cv => cv.map((v, i) => i === idx ? { ...v, color } : v));
                            }} 
                          />
                          <input 
                            type='text' 
                            value={variant.color} 
                            onChange={e => setColorVariants(cv => cv.map((v, i) => i === idx ? { ...v, color: e.target.value } : v))} 
                            className='w-24 sm:w-28 border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm'
                          />
                        </div>
                      </div>
                      <button 
                        type='button' 
                        className='bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 text-sm w-full sm:w-auto justify-center'
                        onClick={() => setColorVariants(cv => cv.filter((_, i) => i !== idx))}
                      >
                        <FiTrash2 size={14} /> Remove
                      </button>
                    </div>
                    
                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4'>
                      {[0,1,2,3].map(imgIdx => (
                        <label key={imgIdx} className="cursor-pointer group">
                          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-gray-400 transition-all">
                            <img
                              className='w-full h-full object-cover'
                              src={variant.images[imgIdx] ? URL.createObjectURL(variant.images[imgIdx]) : assets.upload_area}
                              alt={`color ${idx} image ${imgIdx}`}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                              <FiUpload className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                            </div>
                          </div>
                          <input
                            type='file'
                            hidden
                            onChange={e => {
                              const file = e.target.files[0];
                              setColorVariants(cv => cv.map((v, i) => i === idx ? { ...v, images: v.images.map((img, j) => j === imgIdx ? file : img) } : v));
                            }}
                          />
                          <p className="text-xs text-center text-gray-500 mt-1">Image {imgIdx + 1}</p>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button 
                  type='button' 
                  className='w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md text-sm sm:text-base'
                  onClick={() => setColorVariants(cv => [...cv, { color: '#000000', images: [null, null, null, null] }])}
                >
                  <FiPlus /> Add Color Variant
                </button>
              </div>
            ) : (
              <div>
                <p className='text-gray-700 font-medium mb-2 sm:mb-3 text-sm sm:text-base'>Product Images</p>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4'>
                  {[image1, image2, image3, image4].map((img, index) => (
                    <label key={index} className="cursor-pointer group">
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-gray-400 transition-all">
                        <img
                          className='w-full h-full object-cover'
                          src={!img ? assets.upload_area : URL.createObjectURL(img)}
                          alt={`product ${index + 1}`}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                          <FiUpload className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                        </div>
                      </div>
                      <input
                        type="file"
                        hidden
                        onChange={(e) => {
                          const setter = [setImage1, setImage2, setImage3, setImage4][index];
                          setter(e.target.files[0]);
                        }}
                      />
                      <p className="text-xs text-center text-gray-500 mt-1">Image {index + 1}</p>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                <FiHash size={16} /> Product Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-sm sm:text-base'
                type="text"
                placeholder="e.g., Classic Denim Jacket"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Product Description</label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all resize-none text-sm sm:text-base'
                rows="4"
                placeholder="Describe your product..."
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                <FiFolder size={16} /> Category
              </label>
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-sm sm:text-base'
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* SubCategory */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                <FiTag size={16} /> Subcategory
              </label>
              <select
                onChange={(e) => setSubCategory(e.target.value)}
                value={subCategory}
                className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-sm sm:text-base'
              >
                {subCategories.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                <FiDollarSign size={16} /> Price
              </label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm sm:text-base'
                type="number"
                placeholder="0.00"
                required
              />
            </div>

            {/* Bestseller Toggle */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Bestseller</label>
              <button
                type="button"
                onClick={() => setBestseller(!bestseller)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                  bestseller 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {bestseller ? '⭐ Bestseller' : 'Mark as Bestseller'}
              </button>
            </div>

            {/* Sizes */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Sizes <span className='text-gray-400'>(Optional)</span>
              </label>
              <div className='flex flex-wrap gap-2 sm:gap-3'>
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() =>
                      setSizes((prev) =>
                        prev.includes(size)
                          ? prev.filter((item) => item !== size)
                          : [...prev, size]
                      )
                    }
                    className={`w-10 sm:w-12 md:w-14 py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                      sizes.includes(size) 
                        ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-md transform scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button 
              type='submit' 
              className='px-5 sm:px-6 md:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg sm:rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm sm:text-base'
            >
              <FiPlus size={18} />
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;