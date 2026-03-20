import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import productModel from "../models/productModel.js";
import mongoose from 'mongoose';

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});


const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestSeller, colors } = req.body;

    // Handle main images (for non-color products or default color)
    const images = [
      req.files.image1 && req.files.image1[0],
      req.files.image2 && req.files.image2[0],
      req.files.image3 && req.files.image3[0],
      req.files.image4 && req.files.image4[0]
    ].filter(item => item !== undefined);

    let imagesUrl = [];
    if (images.length > 0) {
      imagesUrl = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            width: 650,
            height: 840,
            crop: "fill",
            gravity: "auto",
            resource_type: "image"
          });
          return result.secure_url;
        })
      );
    }

    // Handle color variants if provided
    let colorsArr = [];
    if (colors) {
      let parsedColors = [];
      try {
        parsedColors = JSON.parse(colors);
      } catch (e) {
        return res.json({ success: false, message: "Invalid colors format" });
      }
      for (let i = 0; i < parsedColors.length; i++) {
        const colorObj = parsedColors[i];
        const colorKey = `color${i+1}`;
        // Collect up to 4 images for this color
        const colorImages = [];
        for (let j = 1; j <= 4; j++) {
          const fileKey = `${colorKey}_image${j}`;
          if (req.files[fileKey] && req.files[fileKey][0]) {
            const result = await cloudinary.uploader.upload(req.files[fileKey][0].path, {
              width: 650,
              height: 840,
              crop: "fill",
              gravity: "auto",
              resource_type: "image"
            });
            colorImages.push(result.secure_url);
          }
        }
        if (colorImages.length > 0) {
          colorsArr.push({ color: colorObj.color, images: colorImages });
        }
      }
    }

    // If no main images, but color variants exist, use first color's images as main images
    if (imagesUrl.length === 0 && colorsArr.length > 0) {
      imagesUrl = colorsArr[0].images;
    }

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: true,
      sizes: sizes ? JSON.parse(sizes) : [],
      image: imagesUrl,
      date: Date.now(),
    };
    if (colorsArr.length > 0) {
      productData.colors = colorsArr;
    }

    const newProduct = new productModel(productData);
    await newProduct.save();

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const productId = req.params._id || req.body.productId;
    if (!productId) return res.json({ success: false, message: "Product ID required" });
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }
    const product = await productModel.findById(productId);
    if (!product) return res.json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const modelProduct = async (req, res) => {
  try {
    const product = await productModel.findOne({ bestseller: true });
    if (!product) return res.json({ success: false, message: "Model product not found" });
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const setModelProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.json({ success: false, message: "productId required" });
    
    await productModel.updateMany({}, { $set: { bestseller: false } });

    const updated = await productModel.findByIdAndUpdate(productId, { $set: { bestseller: true } }, { new: true });
    if (!updated) return res.json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Model product set", product: updated });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const modifyProduct = async (req, res) => {
  try {
    const { id, name, description, price, category, subCategory, sizes, colors } = req.body;
    if (!id) return res.json({ success: false, message: "Product ID required" });

  
    const product = await productModel.findById(id);
    if (!product) return res.json({ success: false, message: "Product not found" });

    
    // --- Main images ---
    let newImages = [];
    for (let i = 1; i <= 4; i++) {
      const key = `image${i}`;
      if (req.body[key] && typeof req.body[key] === 'string' && req.body[key].startsWith('http')) {
        newImages.push(req.body[key]);
      }
    }
    if (req.files) {
      for (let i = 1; i <= 4; i++) {
        const key = `image${i}`;
        if (req.files[key] && req.files[key][0]) {
          const file = req.files[key][0];
          const result = await cloudinary.uploader.upload(file.path, {
            width: 650,
            height: 840,
            crop: "fill",
            gravity: "auto",
            resource_type: "image"
          });
          newImages.push(result.secure_url);
        }
      }
    }
    // --- Color variants ---
    let colorsArr = [];
    if (colors) {
      let parsedColors = [];
      try {
        parsedColors = JSON.parse(colors);
      } catch (e) {
        return res.json({ success: false, message: "Invalid colors format" });
      }
      for (let i = 0; i < parsedColors.length; i++) {
        const colorObj = parsedColors[i];
        const colorKey = `color${i+1}`;
        // Collect up to 4 images for this color
        const colorImages = [];
        for (let j = 1; j <= 4; j++) {
          const fileKey = `${colorKey}_image${j}`;
          // If new file uploaded
          if (req.files && req.files[fileKey] && req.files[fileKey][0]) {
            const result = await cloudinary.uploader.upload(req.files[fileKey][0].path, {
              width: 650,
              height: 840,
              crop: "fill",
              gravity: "auto",
              resource_type: "image"
            });
            colorImages.push(result.secure_url);
          } else if (req.body[fileKey] && typeof req.body[fileKey] === 'string' && req.body[fileKey].startsWith('http')) {
            // Keep existing image URL
            colorImages.push(req.body[fileKey]);
          }
        }
        colorsArr.push({ color: colorObj.color, images: colorImages });
      }
    }
    // --- Remove deleted color variants/images from cloudinary ---
    if (product.colors && Array.isArray(product.colors)) {
      for (let oldIdx = 0; oldIdx < product.colors.length; oldIdx++) {
        const oldColor = product.colors[oldIdx];
        // If this color is not in new colorsArr, delete its images
        const stillExists = colorsArr.find(c => c.color === oldColor.color);
        if (!stillExists) {
          for (const imgUrl of oldColor.images) {
            if (imgUrl.includes('cloudinary.com')) {
              const parts = imgUrl.split('/');
              const fileName = parts[parts.length - 1];
              const publicId = fileName.substring(0, fileName.lastIndexOf('.'));
              try {
                await cloudinary.uploader.destroy(publicId);
              } catch (err) {
                console.error('Cloudinary delete error:', err.message);
              }
            }
          }
        }
      }
    }
    // --- Remove deleted main images from cloudinary ---
    const removedImages = product.image.filter(img => !newImages.includes(img));
    for (const imgUrl of removedImages) {
      if (imgUrl.includes('cloudinary.com')) {
        const parts = imgUrl.split('/');
        const fileName = parts[parts.length - 1];
        const publicId = fileName.substring(0, fileName.lastIndexOf('.'));
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error('Cloudinary delete error:', err.message);
        }
      }
    }
    // --- Update product ---
    const updateObj = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: sizes ? JSON.parse(sizes) : [],
      image: newImages,
    };
    if (colorsArr.length > 0) {
      updateObj.colors = colorsArr;
    } else {
      updateObj.colors = [];
    }
    const updated = await productModel.findByIdAndUpdate(
      id,
      updateObj,
      { new: true }
    );
    res.json({ success: true, message: "Product updated successfully", product: updated });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


const getProductsByCategoryAndSubcategory = async (req, res) => {
  try {
    const { category, subCategory } = req.query;
    if (!category || !subCategory) {
      return res.status(400).json({ success: false, message: "Both category and subCategory are required" });
    }
    const products = await productModel.find({
      category,
      subCategory
    });
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct, modelProduct, setModelProduct, modifyProduct, getProductsByCategoryAndSubcategory };
