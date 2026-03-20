import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { HexColorPicker } from "react-colorful";

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
        const res = await axios.get(`${backendUrl}/api/category`);
        setCategories(res.data.categories);
        if (res.data.categories.length > 0) {
          setCategory(res.data.categories[0].name);
          setSubCategories(res.data.categories[0].subCategories);
          setSubCategory(res.data.categories[0].subCategories[0] || "");
        }
      } catch (error) {
        console.log(error)
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
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <button
          type='button'
          className={`mb-2 px-4 py-2 rounded font-bold shadow ${showColors ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white'}`}
          onClick={() => setShowColors(v => !v)}
        >
          {showColors ? 'Remove Color Variations' : 'Add Color Variations'}
        </button>
      </div>
      {showColors ? (
        <div className='flex flex-col gap-6 w-full'>
          {colorVariants.map((variant, idx) => (
            <div key={idx} className='border p-3 rounded mb-2 w-full'>
              <div className='flex items-center gap-4 mb-2'>
                <span>Color:</span>
                <HexColorPicker color={variant.color} onChange={color => {
                  setColorVariants(cv => cv.map((v, i) => i === idx ? { ...v, color } : v));
                }} />
                <input type='text' value={variant.color} onChange={e => setColorVariants(cv => cv.map((v, i) => i === idx ? { ...v, color: e.target.value } : v))} className='w-24 border px-2 py-1 ml-2' />
                <button type='button' className='ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold shadow' onClick={() => setColorVariants(cv => cv.filter((_, i) => i !== idx))}>Remove</button>
              </div>
              <div className='flex gap-2'>
                {[0,1,2,3].map(imgIdx => (
                  <label key={imgIdx} htmlFor={`color${idx}_image${imgIdx}`}>
                    <img
                      className='w-20 h-20 object-cover border'
                      src={variant.images[imgIdx] ? URL.createObjectURL(variant.images[imgIdx]) : assets.upload_area}
                      alt='color variant'
                    />
                    <input
                      type='file'
                      id={`color${idx}_image${imgIdx}`}
                      hidden
                      onChange={e => {
                        const file = e.target.files[0];
                        setColorVariants(cv => cv.map((v, i) => i === idx ? { ...v, images: v.images.map((img, j) => j === imgIdx ? file : img) } : v));
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type='button' className='mt-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-bold shadow' onClick={() => setColorVariants(cv => [...cv, { color: '#000000', images: [null, null, null, null] }])}>+ Add Color</button>
        </div>
      ) : (
        <div>
          <p className='mb-2'>Upload Image</p>
          <div className='flex gap-2'>
            {[image1, image2, image3, image4].map((img, index) => (
              <label key={index} htmlFor={`image${index + 1}`}>
                <img
                  className='w-20'
                  src={!img ? assets.upload_area : URL.createObjectURL(img)}
                  alt=""
                />
                <input
                  type="file"
                  id={`image${index + 1}`}
                  hidden
                  onChange={(e) => {
                    const setter = [setImage1, setImage2, setImage3, setImage4][index];
                    setter(e.target.files[0]);
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      )}

      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className='w-full max-w-[500px] px-3 py-2'
          type="text"
          placeholder='Provide Name'
          required
        />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className='w-full max-w-[500px] px-3 py-2'
          placeholder='Provide description'
          required
        />
      </div>

      <div>
        <div>
          <p className='mb-2'>Product Category</p>
          <select
            onChange={(e) => {
              const selected = e.target.value;
              setCategory(selected);
            }}
            value={category}
            className='w-full px-3 py-2'
          >
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2'>Product SubCategory</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className='w-full px-3 py-2'
          >
            {subCategories.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2'>Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className='w-full px-3 py-2'
            type="number"
            required
          />
        </div>
      </div>

      <div>
        <p className='mb-2'>Product Sizes <span className='text-gray-400'>(optional)</span></p>
        <div className='flex gap-3'>
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`${
                  sizes.includes(size) ? "bg-red-100" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

    

      <button type='submit' className='w-28 py-3 mt-4 bg-green-500 hover:bg-green-600 text-white rounded font-bold shadow'>Add</button>
    </form>
  );
};

export default Add;
