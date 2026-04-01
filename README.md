# GMC E-Commerce — MERN Stack

A full-featured e-commerce application built with MongoDB, Express.js, React.js, and Node.js. Deployed on Microsoft Azure.

## Features
- 🛍️ Product catalog with search, category filter, and pagination
- 🔐 JWT authentication (register / login / protected routes)
- 👤 Role-based access (customer vs admin)
- 🛒 Persistent shopping cart (per-user, MongoDB-backed)
- 📦 Order placement with shipping address + payment method
- 📋 Order history with status tracking
- ⚙️ Admin dashboard: create, edit, delete products

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router v6, Axios, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Deployment | Microsoft Azure App Service |

## Local Development

```bash
# Backend
cd server
cp config/.env.example config/.env   # fill in MONGO_URI + JWT_SECRET
npm install
npm run seed    # seed 10 products + admin user
npm start       # http://localhost:5000

# Frontend (separate terminal)
cd client
npm install
npm start       # http://localhost:3000 (proxies /api → :5000)
```

**Demo credentials:**
- Admin: `admin@gmc.com` / `admin123`
- Customer: `customer@gmc.com` / `customer123`

## Azure Deployment

1. Create MongoDB Atlas cluster → copy connection string
2. Create Azure Web App (Node 18 LTS, Linux)
3. Add App Settings in Azure Portal:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = a long random secret
   - `CLIENT_ORIGIN` = `https://<yourapp>.azurewebsites.net`
4. Set startup command: `node index.js`
5. Run `./deploy.sh` — builds React, bundles into Express, pushes to GitHub → Azure auto-deploys

## API Reference
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register |
| POST | `/api/auth/login` | Public | Login → JWT |
| GET | `/api/auth/me` | JWT | Current user |
| GET | `/api/products` | Public | List + search + filter |
| GET | `/api/products/:id` | Public | Product detail |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| GET | `/api/cart` | JWT | Get cart |
| POST | `/api/cart` | JWT | Add to cart |
| PUT | `/api/cart/:itemId` | JWT | Update quantity |
| DELETE | `/api/cart/:itemId` | JWT | Remove item |
| POST | `/api/orders` | JWT | Place order |
| GET | `/api/orders/mine` | JWT | My orders |
| GET | `/api/orders` | Admin | All orders |
| PUT | `/api/orders/:id/status` | Admin | Update status |
