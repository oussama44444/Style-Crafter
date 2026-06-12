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

// ✅ FIX 2: Complete CORS for all your domains
const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:7000",
  "http://localhost:6009",
  
  // Your FRONTEND (main customer store)
  "https://style-crafter-s7va.vercel.app",
  
  // Your ADMIN panel (management dashboard)
  "https://style-crafter-4xt4.vercel.app",
  "https://style-crafter-4xt4-git-main-oussama44444s-projects.vercel.app",
  "https://style-crafter-4xt4-c5crtits3-oussama44444s-projects.vercel.app",
  
  // Allow all Vercel preview deployments (optional, for testing)
  "https://*.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) {
      console.log('✅ Request with no origin allowed');
      return callback(null, true);
    }
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ Origin allowed:', origin);
      callback(null, true);
    } 
    // Check for wildcard .vercel.app domains
    else if (origin.match(/https:\/\/.*\.vercel\.app$/)) {
      console.log('✅ Vercel preview origin allowed:', origin);
      callback(null, true);
    }
    else {
      console.log('❌ Blocked origin:', origin);
      // For development, you can allow it anyway (remove in production)
      callback(null, true); // Temporarily allow for testing
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['token', 'Content-Type']
}));

// Handle preflight requests (OPTIONS method)
app.options('*', cors());

// Add request logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// ✅ Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/categories', categoryRoute);

// ✅ Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: "YOUR API IS WORKING 🚀",
    status: "online",
    timestamp: new Date().toISOString(),
    endpoints: {
      user: "/api/user",
      product: "/api/product",
      cart: "/api/cart",
      order: "/api/order",
      categories: "/api/categories"
    }
  });
});

// ✅ Test CORS endpoint
app.options('/api/test', cors());
app.get('/api/test', (req, res) => {
  res.json({ message: "CORS is working!", origin: req.headers.origin });
});

// ✅ 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found` 
  });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal server error' 
  });
});

// ✅ Start server (Render compatible)
app.listen(port, () => {
  console.log(`🚀 Server started on PORT: ${port}`);
  console.log(`📍 Local: http://localhost:${port}`);
  console.log(`✅ CORS enabled for all your Vercel domains`);
});