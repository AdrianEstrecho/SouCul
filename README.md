# SouCul - Regional Filipino Souvenirs E-commerce

A full-stack e-commerce platform showcasing Filipino regional products and delicacies.

## 🏗️ Project Structure

```
SouCul/
├── src/                       # Frontend React application
│   ├── Components/           # Reusable React components
│   │   ├── AboutUs.jsx
│   │   ├── Categories.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── HomePin.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Navbar.jsx
│   │   └── Products.jsx
│   ├── StyleSheet/          # Component-specific styles
│   ├── assets/              # Images and media files
│   ├── Baguio/              # Region-specific pages
│   ├── Bohol/
│   ├── Boracay/
│   ├── Tagaytay/
│   ├── Vigan/
│   ├── Cart.jsx             # Shopping cart page
│   ├── Checkout.jsx         # Checkout page
│   ├── Login.jsx            # Authentication page
│   ├── ProductPage.jsx      # Product details page
│   ├── Profile.jsx          # User profile page
│   ├── SoulCul.jsx          # Main app component
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── public/                   # Static assets
│   ├── assets/              # Public images
│   ├── admin.html           # Admin panel
│   ├── admin.js             # Admin functionality
│   └── admin.css            # Admin styles
├── backend/                  # PHP REST APIs (admin + customer)
├── scripts/                  # Development utilities
│   ├── test-db-connection.js
│   ├── diagnose-db.js
│   ├── run-db-test.bat
│   ├── setup-backend.bat
│   └── README.md
├── guides/                   # Documentation
│   └── BACKEND_GUIDE.md     # Complete backend setup
├── index.html               # Frontend entry point
├── package.json             # Frontend dependencies
├── eslint.config.js         # ESLint configuration
├── vite.config.js           # Vite configuration
└── .env                     # Database configuration
```

**Note:** Frontend stays in root for straightforward static build deployment. Backend has its own folder.

## 🚀 Quick Start

### First Time Setup

```bash
# 1. Create backend folder structure
.\restructure.bat

# 2. Set up backend configuration files
.\setup-backend.bat
```

### Frontend Setup (React + Vite)

Frontend files are in the root directory.

```bash
npm install
npm run dev
```

Access at: `http://localhost:5173` (or the next available port, such as `5174`).

### Local Dev Commands

Run admin API only (port `8000`):

```bash
npm run dev:api
```

Run customer API only (port `8001`):

```bash
npm run dev:api:customer
```

Run both admin + customer APIs:

```bash
npm run dev:api:all
```

Run frontend + both APIs together:

```bash
npm run dev:all
```

Vite proxy behavior in local dev:

- `/api/*`, `/health`, and `/uploads/*` -> admin backend (`http://127.0.0.1:8000`)
- `/api/v1/customer/*` -> customer backend (`http://127.0.0.1:8001`)

You can override targets in `.env` using:

- `VITE_ADMIN_PROXY_TARGET`
- `VITE_CUSTOMER_PROXY_TARGET`

### Backend Setup (PHP + MySQL)

```bash
cd backend
composer install
copy .env.example .env
# Edit .env with your database credentials
php -S 127.0.0.1:8000 -t admin/public admin/public/index.php
php -S 127.0.0.1:8001 -t customer/public customer/public/index.php
```

Access at:

- Admin API: `http://localhost:8000`
- Customer API: `http://localhost:8001`

**Complete backend setup guide:** [guides/BACKEND_GUIDE.md](./guides/BACKEND_GUIDE.md)

## 🌐 Production Deployment (Hostinger Premium)

Recommended production topology:

- `https://yourdomain.com` -> React frontend
- `https://api-admin.yourdomain.com` -> Admin API (`backend/admin/public`)
- `https://api-customer.yourdomain.com` -> Customer API (`backend/customer/public`)

Quick flow:

1. Build frontend:
   ```bash
   npm run build
   ```
2. Upload contents of `dist/` to your main domain `public_html`.
3. Upload `backend/` folder and point subdomain document roots to admin/customer `public` directories.
4. Set production API URLs in `public_html/runtime-config.js`:
   ```javascript
   window.__SOUCUL_CONFIG__ = window.__SOUCUL_CONFIG__ || {};
   window.__SOUCUL_CONFIG__.adminApiBaseUrl = "https://api-admin.yourdomain.com";
   window.__SOUCUL_CONFIG__.customerApiBaseUrl = "https://api-customer.yourdomain.com";
   ```
5. Import `backend/database-schema.sql` then `backend/migration.sql` in Hostinger MySQL.
6. Configure DB/JWT environment variables for both API hosts.

Full step-by-step instructions: [guides/HOSTINGER_DEPLOYMENT.md](./guides/HOSTINGER_DEPLOYMENT.md)

## 🗄️ Database Setup

1. **Start XAMPP MySQL** (port 3307 or 3306)

2. **Test connection:**
   ```bash
   node scripts/test-db-connection.js
   ```

3. **Diagnose issues:**
   ```bash
   node scripts/diagnose-db.js
   ```

See [BACKEND_GUIDE.md](./guides/BACKEND_GUIDE.md) for detailed database setup instructions.

## 📚 Documentation

- **[BACKEND_GUIDE.md](./guides/BACKEND_GUIDE.md)** - Complete backend development guide
  - Environment setup
  - Database schema
  - API contract
  - Testing & deployment
- **[HOSTINGER_DEPLOYMENT.md](./guides/HOSTINGER_DEPLOYMENT.md)** - Step-by-step production deployment for Hostinger Premium (frontend + admin/customer APIs)

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite 8
- React Router DOM

**Backend:**
- PHP 8.2+
- MySQL 8.0+
- Composer

**Deployment:**
- Hostinger Premium (frontend + backend)

## 👥 Team

- Frontend Developers | @AdrianEstrecho & @yashiro-nyx
- Backend Developer (Customer API) | @RubinusSorro
- Backend Developer (Admin API) | @Vaelarr

## 📝 License

Proprietary - SouCul Team / Technological Institute of the Philippines, CCS
