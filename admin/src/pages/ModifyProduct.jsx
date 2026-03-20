import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { HexColorPicker } from "react-colorful";
import { assets } from '../assets/assets';
const ModifyProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
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

  useEffect(() => {
    // Fetch product
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
          setColorVariants(res.data.product.colors || []);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error('Failed to fetch product');
      }
    };
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/category`);
        setCategories(res.data.categories);
      } catch (err) {
        toast.error('Failed to fetch categories');
      }
    };
    fetchProduct();
    fetchCategories();
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

  const handleImageChange = e => {
    setForm(f => ({ ...f, images: Array.from(e.target.files) }));
  };

  // Handle replacing a single image
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

  // Handle deleting a single image
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
    // Send all images (existing URLs or new files)
    currentImages.forEach((img, idx) => {
      if (img && typeof img !== 'string') {
        data.append(`image${idx+1}`, img); // new file
      } else if (img && typeof img === 'string') {
        data.append(`image${idx+1}`, img); // existing URL
      }
    });
    // Add color variants
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
        toast.success('Product updated!');
        navigate(-1);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to update product');
    }
  };

  if (!product) return <div className="p-8">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded bg-white max-w-xl mx-auto mt-6">
      <h3 className="text-lg font-bold mb-2">Edit Product</h3>
      <div className="mb-2">
        <label>Name:</label>
        <input name="name" value={form.name} onChange={handleChange} className="border px-2 py-1 w-full" />
      </div>
      <div className="mb-2">
        <label>Description:</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="border px-2 py-1 w-full" />
      </div>
      <div className="mb-2">
        <label>Price:</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} className="border px-2 py-1 w-full" />
      </div>
      <div className="mb-2">
        <label>Category:</label>
        <select name="category" value={form.category} onChange={handleChange} className="border px-2 py-1 w-full">
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label>Subcategory:</label>
        <select name="subCategory" value={form.subCategory} onChange={handleChange} className="border px-2 py-1 w-full">
          {subCategories.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label>Sizes:</label>
        <div className="flex gap-2">
          {["S", "M", "L", "XL", "XXL"].map(size => (
            <span key={size} onClick={() => handleSizeToggle(size)} className={`px-2 py-1 border rounded cursor-pointer ${form.sizes.includes(size) ? 'bg-blue-200' : ''}`}>{size}</span>
          ))}
        </div>
      </div>
      <div className="mb-2">
        <label>Product Images:</label>
        <div className="flex gap-3">
          {[0,1,2,3].map(idx => (
            <div key={idx} className="relative w-20 h-24 flex flex-col items-center justify-center border rounded bg-gray-50">
              {currentImages[idx] ? (
                <>
                  <img src={typeof currentImages[idx] === 'string' ? currentImages[idx] : URL.createObjectURL(currentImages[idx])} alt="Product" className="w-full h-20 object-cover rounded" />
                  <button type="button" onClick={e => handleDeleteImage(idx, e)} className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center z-10 font-bold shadow">×</button>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onClick={e => e.stopPropagation()} onChange={e => e.target.files && handleReplaceImage(idx, e.target.files[0])} />
                </>
              ) : (
                <input type="file" accept="image/*" className="w-full h-full opacity-0 cursor-pointer" onChange={e => e.target.files && handleReplaceImage(idx, e.target.files[0])} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-2">
        <label>Color Variants:</label>
        <div className="flex flex-col gap-6 w-full">
          {colorVariants.map((variant, idx) => (
            <div key={idx} className="border p-3 rounded mb-2 w-full">
              <div className="flex items-center gap-4 mb-2">
                <span>Color:</span>
                <HexColorPicker color={variant.color} onChange={color => handleColorChange(idx, color)} />
                <input type="text" value={variant.color} onChange={e => handleColorChange(idx, e.target.value)} className="w-24 border px-2 py-1 ml-2" />
                <button type="button" className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold shadow" onClick={() => handleRemoveColor(idx)}>Delete</button>
              </div>
              <div className="flex gap-2">
                {[0,1,2,3].map(imgIdx => (
                  <label key={imgIdx} htmlFor={`color${idx}_image${imgIdx}`}> 
                    <img
                      className="w-20 h-20 object-cover border"
                      src={variant.images[imgIdx] ? (typeof variant.images[imgIdx] === 'string' ? variant.images[imgIdx] : URL.createObjectURL(variant.images[imgIdx])) : assets.upload_area}
                      alt='color variant'
                    />
                    <input
                      type='file'
                      id={`color${idx}_image${imgIdx}`}
                      hidden
                      onChange={e => {
                        const file = e.target.files[0];
                        handleColorImageChange(idx, imgIdx, file);
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type='button' className='mt-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-bold shadow' onClick={handleAddColor}>+ Add Color</button>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-bold shadow">Save</button>
        <button type="button" onClick={() => navigate(-1)} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-bold shadow">Cancel</button>
      </div>
    </form>
  );
};

export default ModifyProduct;
