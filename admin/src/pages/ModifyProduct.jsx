import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { HexColorPicker } from "react-colorful";
import { assets } from '../assets/assets';
import { 
  FiSave, FiX, FiPlus, FiTrash2, FiFolder, FiTag, 
  FiDollarSign, FiGrid, FiImage, FiUpload, FiChevronLeft 
} from 'react-icons/fi';

const ModifyProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    sizes: [],
    images: [],
  });
  const [subCategories, setSubCategories] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [colorVariants, setColorVariants] = useState([]);
  const [showColors, setShowColors] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setForm({
            name: res.data.product.name,
            description: res.data.product.description,
            price: res.data.product.price,
            category: res.data.product.category,
            subCategory: res.data.product.subCategory,
            sizes: res.data.product.sizes || [],
            images: [],
          });
          setCurrentImages(res.data.product.image || []);
          const hasColors = res.data.product.colors && res.data.product.colors.length > 0;
          setColorVariants(res.data.product.colors || []);
          setShowColors(hasColors);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error('Failed to fetch product');
      }
    };
    
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/categories`);
        setCategories(res.data.categories);
      } catch (err) {
        toast.error('Failed to fetch categories');
      }
    };
    
    Promise.all([fetchProduct(), fetchCategories()]).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const found = categories.find(cat => cat.name === form.category);
    setSubCategories(found ? found.subCategories : []);
  }, [form.category, categories]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSizeToggle = size => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter(s => s !== size)
        : [...f.sizes, size],
    }));
  };

  const handleReplaceImage = (idx, file) => {
    setForm(f => {
      const newImages = [...f.images];
      newImages[idx] = file;
      return { ...f, images: newImages };
    });
    setCurrentImages(imgs => {
      const arr = [...imgs];
      arr[idx] = file;
      return arr;
    });
  };

  const handleDeleteImage = (idx, e) => {
    e.stopPropagation();
    setCurrentImages(imgs => imgs.filter((_, i) => i !== idx));
    setForm(f => {
      const newImages = [...f.images];
      newImages.splice(idx, 1);
      return { ...f, images: newImages };
    });
  };

  const handleColorChange = (idx, color) => {
    setColorVariants(cv => cv.map((v, i) => i === idx ? { ...v, color } : v));
  };

  const handleColorImageChange = (colorIdx, imgIdx, file) => {
    setColorVariants(cv => cv.map((v, i) => i === colorIdx ? { ...v, images: v.images.map((img, j) => j === imgIdx ? file : img) } : v));
  };

  const handleRemoveColor = idx => {
    setColorVariants(cv => cv.filter((_, i) => i !== idx));
  };

  const handleAddColor = () => {
    setColorVariants(cv => [...cv, { color: '#000000', images: [null, null, null, null] }]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!id) {
      toast.error('Product ID missing!');
      return;
    }
    
    const data = new FormData();
    data.append('id', id);
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('price', form.price);
    data.append('category', form.category);
    data.append('subCategory', form.subCategory);
    data.append('sizes', JSON.stringify(form.sizes));
    
    currentImages.forEach((img, idx) => {
      if (img && typeof img !== 'string') {
        data.append(`image${idx+1}`, img);
      } else if (img && typeof img === 'string') {
        data.append(`image${idx+1}`, img);
      }
    });
    
    if (colorVariants.length > 0) {
      const colorsArr = colorVariants.map(variant => ({ color: variant.color }));
      data.append('colors', JSON.stringify(colorsArr));
      colorVariants.forEach((variant, idx) => {
        variant.images.forEach((img, imgIdx) => {
          if (img) data.append(`color${idx+1}_image${imgIdx+1}`, img);
        });
      });
    }
    
    try {
      const res = await axios.put(`${backendUrl}/api/product/modify`, data, { headers: { token } });
      if (res.data.success) {
        toast.success('Product updated successfully!');
        navigate(-1);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to update product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
          >
            <FiChevronLeft size={16} /> Back to Products
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Modify Product
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Edit product details and images</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                placeholder="Product name"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all resize-none"
                placeholder="Product description"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                <FiDollarSign size={16} /> Price
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                <FiFolder size={16} /> Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
              >
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                <FiTag size={16} /> Subcategory
              </label>
              <select
                name="subCategory"
                value={form.subCategory}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
              >
                {subCategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Sizes</label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
                {["S", "M", "L", "XL", "XXL"].map(size => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`w-10 sm:w-12 md:w-14 py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                      form.sizes.includes(size)
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

          {/* Product Images */}
          <div className="border-t pt-4 sm:pt-6">
            <label className="block text-gray-700 font-medium mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <FiImage size={16} /> Product Images
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {[0, 1, 2, 3].map(idx => (
                <div key={idx} className="relative group">
                  <div className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-gray-400 transition-all">
                    {currentImages[idx] ? (
                      <>
                        <img
                          src={typeof currentImages[idx] === 'string' ? currentImages[idx] : URL.createObjectURL(currentImages[idx])}
                          alt={`Product ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={e => handleDeleteImage(idx, e)}
                          className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiUpload className="text-gray-400 text-lg sm:text-xl md:text-2xl" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={e => e.target.files && handleReplaceImage(idx, e.target.files[0])}
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs text-center text-gray-500 mt-1 sm:mt-2">Image {idx + 1}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Color Variants Toggle */}
          <div className="border-t pt-4 sm:pt-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowColors(!showColors)}
                className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                  showColors
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                    : 'bg-gradient-to-r from-gray-800 to-gray-700 text-white hover:from-gray-900 hover:to-gray-800 shadow-md'
                }`}
              >
                <FiGrid size={14} />
                {showColors ? 'Remove Color Variations' : 'Add Color Variations'}
              </button>
            </div>
          </div>

          {/* Color Variants Section */}
          {showColors && (
            <div className="border-t pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Color Variants</h3>
              <div className="space-y-4 sm:space-y-6">
                {colorVariants.map((variant, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <span className="font-medium text-gray-700 text-sm">Color:</span>
                        <div className="flex flex-wrap items-center gap-2">
                          <HexColorPicker
                            color={variant.color}
                            onChange={color => handleColorChange(idx, color)}
                          />
                          <input
                            type="text"
                            value={variant.color}
                            onChange={e => handleColorChange(idx, e.target.value)}
                            className="w-24 sm:w-28 border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:ring-2 focus:ring-gray-500"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
                        onClick={() => handleRemoveColor(idx)}
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                      {[0, 1, 2, 3].map(imgIdx => (
                        <label key={imgIdx} className="cursor-pointer group">
                          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-gray-400 transition-all">
                            <img
                              className="w-full h-full object-cover"
                              src={variant.images[imgIdx] 
                                ? (typeof variant.images[imgIdx] === 'string' 
                                  ? variant.images[imgIdx] 
                                  : URL.createObjectURL(variant.images[imgIdx]))
                                : assets.upload_area}
                              alt={`Color variant ${imgIdx + 1}`}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                              <FiUpload className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                            </div>
                          </div>
                          <input
                            type="file"
                            hidden
                            onChange={e => {
                              const file = e.target.files[0];
                              handleColorImageChange(idx, imgIdx, file);
                            }}
                          />
                          <p className="text-[10px] text-center text-gray-500 mt-1">Img {imgIdx + 1}</p>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
                  onClick={handleAddColor}
                >
                  <FiPlus size={16} /> Add Color Variant
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
            <button
              type="submit"
              className="w-full sm:flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base order-2 sm:order-1"
            >
              <FiSave size={18} /> Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2"
            >
              <FiX size={18} /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyProduct;