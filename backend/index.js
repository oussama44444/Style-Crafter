import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connect } from 'mongoose';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import categoryRoute from './routes/categoryRoute.js';

const app = express();

// ✅ FIX 1: correct Render port variable
const port = process.env.PORT || 6009;

// ✅ Connect DB + Cloudinary
connectDB();
connectCloudinary();

// ✅ Middleware
app.use(express.json());

// ✅ FIX 2: proper CORS for production + local dev
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://style-crafter-s7va.vercel.app" // 🔴 replace this with your real Vercel URL
  ],
  credentials: true
}));

// ✅ Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/categories', categoryRoute);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send("YOUR API IS WORKING 🚀");
});

// ✅ Start server (Render compatible)
app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});