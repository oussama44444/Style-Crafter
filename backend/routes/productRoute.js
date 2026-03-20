import express from 'express'
import { listProducts, singleProduct, removeProduct, addProduct, modelProduct, setModelProduct, modifyProduct } from '../controllers/productController.js'
import { uploadModelImage, getModelImage, getAllModelImages, addModelImage, updateModelImage, deleteModelImage } from '../controllers/modelImageController.js';
import upload, { getProductImageUploadMiddleware } from '../middleware/multer.js';
import adminAuth from './../middleware/adminAuth.js';

const productRouter = express.Router();
// Use the new multer middleware for /add and /modify
productRouter.post('/add', adminAuth, getProductImageUploadMiddleware(), addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);
productRouter.put('/modify', adminAuth, getProductImageUploadMiddleware(), modifyProduct);
productRouter.get('/model', modelProduct);
productRouter.post('/set-model-product', adminAuth, setModelProduct);
productRouter.post('/model-image/upload', adminAuth, upload.single('image'), uploadModelImage);
productRouter.get('/model-image', getModelImage);
productRouter.get('/model-images', getAllModelImages);
productRouter.post('/model-image', adminAuth, upload.single('image'), addModelImage);
productRouter.put('/model-image/:id', adminAuth, upload.single('image'), updateModelImage);
productRouter.delete('/model-image/:id', adminAuth, deleteModelImage);
productRouter.get('/:_id', singleProduct);

export default productRouter