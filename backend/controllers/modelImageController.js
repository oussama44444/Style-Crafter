// backend/controllers/modelImageController.js
import { v2 as cloudinary } from "cloudinary";
import modelImageModel from "../models/modelImageModel.js";

export const uploadModelImage = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!req.file || !productId) {
      return res.json({ success: false, message: "Image and productId required" });
    }
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
    // Optionally: Remove previous model image if you want only one
    await modelImageModel.deleteMany({});
    const modelImage = await modelImageModel.create({
      url: result.secure_url,
      productId
    });
    res.json({ success: true, modelImage });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// backend/controllers/modelImageController.js
export const getModelImage = async (req, res) => {
  try {
    const modelImage = await modelImageModel.findOne({}).sort({ createdAt: -1 });
    if (!modelImage) {
      return res.json({ success: false, message: "No model image found" });
    }
    res.json({ success: true, modelImage });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all model images
export const getAllModelImages = async (req, res) => {
  try {
    const images = await modelImageModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, images });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add a new model image (reuse uploadModelImage, but don't delete all)
export const addModelImage = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!req.file || !productId) {
      return res.json({ success: false, message: "Image and productId required" });
    }
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
    const modelImage = await modelImageModel.create({
      url: result.secure_url,
      productId
    });
    res.json({ success: true, modelImage });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update a model image (change image and/or productId)
export const updateModelImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    let update = {};
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
      update.url = result.secure_url;
    }
    if (productId) update.productId = productId;
    const updated = await modelImageModel.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, modelImage: updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete a model image
export const deleteModelImage = async (req, res) => {
  try {
    const { id } = req.params;
    await modelImageModel.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};