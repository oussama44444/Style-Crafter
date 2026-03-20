# Style Crafter

Style Crafter is a full-stack fashion e-commerce platform with three separate apps:
- Customer storefront (frontend)
- Admin dashboard (admin)
- REST API server (backend)

The project is built with React + Vite on the client side and Node.js + Express + MongoDB on the server side. It supports product browsing, authentication, cart management, order placement, and admin product/category/order workflows.

## Core Properties and Features

### 1) Customer Storefront Properties
- Product listing and product details pages
- Category and subcategory browsing
- Search and filter experience
- Cart add/update flow
- Checkout/order placement
- User sign up / sign in
- Order history view

### 2) Admin Dashboard Properties
- Admin authentication
- Product add, update, remove
- Product model image management
- Category and subcategory management
- Order list and order status updates

### 3) Backend API Properties
- JWT-based auth flows for users and admin
- Protected routes for admin and user operations
- MongoDB persistence with Mongoose models
- Cloudinary-based media handling
- Modular route/controller structure

## Tech Stack

### Frontend (Customer)
- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- Framer Motion + GSAP (animations)

### Admin
- React 18
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT + bcrypt
- Multer + Cloudinary
- CORS + dotenv

## Project Structure

- frontend: customer-facing app
- admin: admin panel app
- backend: API, controllers, routes, models, middleware

## Data Model Properties

### Product
- name (String, required): display product title
- description (String, required): product details/content
- price (Number, required): selling price
- image (String[], required): default product image URLs
- category (String, required): top-level category
- subCategory (String, required): nested category value
- sizes (String[], required): available sizes
- bestseller (Boolean, default false): featured/bestseller flag
- date (Number, required): product creation timestamp value
- colors (Array, optional): color variants
	- color (String, required): color name or hex value
	- images (String[], required): image URLs for this color
- createdAt / updatedAt (Date): added by timestamps option

### Category
- name (String, required, unique): category name
- subCategories (String[]): optional list of subcategory names

### User
- name (String, required): full name
- email (String, required, unique): user email identifier
- password (String, required): hashed password
- cartData (Object, default {}): cart state keyed by product/variant

### Order
- userId (String, required): owner user id
- items (Array, required): ordered products snapshot
- amount (Number, required): total amount
- address (Object, required): shipping address object
- status (String, default "Order Placed"): order status value
- paymentMethod (String, required): checkout method (PUA, visa, d17)
- payment (Boolean, default false): payment completion state
- date (Number, required): order timestamp value

## API Route Properties

### User Routes
- POST /api/user/register
- POST /api/user/login
- POST /api/user/admin

### Product Routes
- POST /api/product/add (admin)
- PUT /api/product/modify (admin)
- POST /api/product/remove (admin)
- GET /api/product/list
- POST /api/product/single
- GET /api/product/:_id
- GET /api/product/model
- POST /api/product/set-model-product (admin)
- Model image routes under /api/product/model-image*

### Category Routes
- GET /api/category
- POST /api/category/add
- DELETE /api/category/:id

### Cart Routes
- POST /api/cart/get (auth user)
- POST /api/cart/add (auth user)
- POST /api/cart/update (auth user)

### Order Routes
- POST /api/order/place (auth user)
- POST /api/order/visa (auth user)
- POST /api/order/D17 (auth user)
- POST /api/order/userorders (auth user)
- POST /api/order/list (admin)
- POST /api/order/status (admin)

## Environment Properties

Set these variables in backend/.env:
- MONGODB_URL: MongoDB connection string
- CLOUDINARY_NAME: Cloudinary cloud name
- CLOUDINARY_API_KEY: Cloudinary API key
- CLOUDINARY_SECRET_KEY: Cloudinary secret
- JWT_SECRET: JWT signing secret
- ADMIN_EMAIL: admin login email
- ADMIN_PASSWORD: admin login password
- port: backend server port (defaults to 6009)

Frontend and admin can use their own .env files for API base URLs as needed by your local setup.

## Local Development

Install dependencies:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install
```

Run apps in separate terminals:

```bash
cd backend
npm run server
```

```bash
cd frontend
npm run dev
```

```bash
cd admin
npm run dev
```

## Current Notes

- Repository includes separate frontend/admin projects for cleaner scaling.
- Environment files are ignored in git for security.
- Backend root health check: GET /
