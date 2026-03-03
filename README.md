# 📦 Product Hub — Product Management System

A production-ready, full-stack Product Management System built with **React + TypeScript** (frontend) and **Node.js + Express + TypeScript** (backend), backed by **MongoDB**.

---

## 🏗️ Architecture

```
┌────────────────┐     HTTP/REST     ┌────────────────────┐     Mongoose     ┌──────────────┐
│   React App    │ ◄──────────────► │  Express Server     │ ◄─────────────► │   MongoDB    │
│  (Vite + TS)   │    Axios          │  (TypeScript)       │                  │              │
│   Port: 5173   │                   │   Port: 5000        │                  │  Port: 27017 │
└────────────────┘                   └────────────────────┘                  └──────────────┘

    Client Tier              →          Server Tier           →         Database Tier
```

### Folder Structure

```
Product Management System 1/
├── client/                     # React + TypeScript Frontend
│   ├── src/
│   │   ├── api/                # Axios API service
│   │   │   └── productApi.ts
│   │   ├── components/         # Reusable React components
│   │   │   ├── DeleteModal.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductList.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useDebounce.ts
│   │   │   └── useProducts.ts
│   │   ├── types/              # TypeScript type definitions
│   │   │   └── product.ts
│   │   ├── App.tsx             # Main application component
│   │   └── App.css             # Complete design system
│   ├── .env                    # Frontend environment variables
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts           # MongoDB connection
│   │   ├── controllers/
│   │   │   └── product.controller.ts
│   │   ├── middlewares/
│   │   │   └── error.middleware.ts
│   │   ├── models/
│   │   │   └── product.model.ts
│   │   ├── routes/
│   │   │   └── product.routes.ts
│   │   ├── services/
│   │   │   └── product.service.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── app.ts              # Express app configuration
│   │   └── server.ts           # Server entry point
│   ├── .env                    # Backend environment variables
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v18+ installed
- **MongoDB** running locally (or provide a remote MongoDB URI)

### 1. Clone and Install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment

**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/product_management
NODE_ENV=development
```

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

Make sure MongoDB is running locally:
```bash
mongod
```

Or use MongoDB Atlas — just update `MONGODB_URI` in `server/.env`.

### 4. Run the Application

**Start Backend** (Terminal 1):
```bash
cd server
npm run dev
```
Server runs at **http://localhost:5000**

**Start Frontend** (Terminal 2):
```bash
cd client
npm run dev
```
Frontend runs at **http://localhost:5173**

---

## 📡 API Endpoints

| Method   | Endpoint          | Description                    |
|----------|-------------------|--------------------------------|
| `GET`    | `/api/products`   | List products (paginated)      |
| `POST`   | `/api/products`   | Create a new product           |
| `GET`    | `/api/products/:id` | Get single product           |
| `PUT`    | `/api/products/:id` | Update a product             |
| `DELETE` | `/api/products/:id` | Delete a product             |
| `GET`    | `/api/health`     | Health check                   |

### Query Parameters (GET /api/products)

| Param    | Type     | Default     | Description             |
|----------|----------|-------------|-------------------------|
| `page`   | number   | 1           | Page number             |
| `limit`  | number   | 10          | Items per page          |
| `search` | string   | —           | Search by product name  |
| `sort`   | string   | `createdAt` | Sort field              |
| `order`  | string   | `desc`      | Sort order (asc/desc)   |

### Response Format

```json
{
  "success": true,
  "data": [...],
  "message": "Products fetched successfully",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## ✅ Features

### Frontend
- ✅ Product CRUD (Create, Read, Update, Delete)
- ✅ Search with 300ms debounce
- ✅ Sorting by Name, Price, Stock
- ✅ Pagination with smart page windowing
- ✅ Client-side validation
- ✅ Loading & error states
- ✅ Optimistic UI updates (edit + delete)
- ✅ Delete confirmation modal
- ✅ Stock level badges (OK / Low / Out of Stock)
- ✅ Responsive design
- ✅ Premium dark theme with glassmorphism

### Backend
- ✅ Express + TypeScript
- ✅ Mongoose ODM with validation
- ✅ Service layer pattern (Controller → Service → Model)
- ✅ Centralized error handling middleware
- ✅ Search using regex (case-insensitive)
- ✅ Pagination with skip + limit
- ✅ Input validation
- ✅ Environment variables via dotenv
- ✅ CORS enabled
- ✅ Proper HTTP status codes

---

## 🛠️ Scripts

### Backend (`server/`)
| Script         | Command                 |
|----------------|-------------------------|
| Development    | `npm run dev`           |
| Build          | `npm run build`         |
| Production     | `npm start`             |

### Frontend (`client/`)
| Script         | Command                 |
|----------------|-------------------------|
| Development    | `npm run dev`           |
| Build          | `npm run build`         |
| Preview        | `npm run preview`       |

---

## 📝 License

MIT
