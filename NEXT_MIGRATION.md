# Next.js Migration Guide

## ✅ Completed

### Backend Conversion
- ✅ Migrated all Express routes to Next.js API routes
- ✅ Converted MongoDB models to TypeScript (Admin, Shoe)
- ✅ Set up JWT authentication middleware
- ✅ Implemented admin routes: `/api/admin/login`, `/api/admin/register`, `/api/admin/me`, `/api/admin/upload-image`
- ✅ Implemented shoe routes: `/api/shoes` (CRUD operations)
- ✅ Added Cloudinary image upload support

### Project Structure
```
app/
├── api/
│   ├── admin/
│   │   ├── login/route.ts
│   │   ├── register/route.ts
│   │   ├── me/route.ts
│   │   └── upload-image/route.ts
│   ├── shoes/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── init/route.ts
├── layout.tsx (root layout)
lib/
├── mongodb.ts (DB connection)
├── auth.ts (JWT utilities)
├── models/
│   ├── Admin.ts
│   └── Shoe.ts
└── initialize.ts (seed default admin)

middleware.ts (JWT verification)
next.config.js (Next.js config)
```

### Frontend API Updates
- ✅ Updated `src/api/axios.ts` to point to `/api` (same domain)
- ✅ Maintained auth token persistence in cookies and localStorage

## 🔄 Next Steps: Frontend Migration (Optional)

### Option A: Keep Vite Frontend (Recommended for now)
1. Keep your existing Vite setup in `src/` folder
2. API calls already updated to use `/api` endpoints
3. Run `npm run build` to build both frontend and API routes

### Option B: Migrate to Full Next.js App Router
1. Move pages from `src/pages/` to `app/`
2. Convert pages to page.tsx format
3. Move layouts from context to Next.js layout.tsx files
4. Update imports from react-router to next/navigation

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Environment Setup
```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Update .env.local with your values
```

### Development
```bash
npm run dev
# App runs on http://localhost:3000
# API routes available at http://localhost:3000/api
```

### Build
```bash
npm run build
npm start
```

## 📝 API Endpoints

### Public Routes
- `POST /api/admin/login` - Login with email/password
- `POST /api/admin/register` - Register (if `ENABLE_ADMIN_REGISTER=true`)
- `GET /api/shoes` - List all shoes (query: gender, subcategory, search)
- `GET /api/shoes/:id` - Get single shoe

### Protected Routes (require JWT in Authorization header)
- `GET /api/admin/me` - Get current admin info
- `POST /api/admin/upload-image` - Upload image to Cloudinary
- `POST /api/shoes` - Create shoe
- `PUT /api/shoes/:id` - Update shoe
- `DELETE /api/shoes/:id` - Delete shoe

## 🔐 Authentication Flow

1. User logs in via `POST /api/admin/login`
2. Server returns JWT token
3. Frontend stores token in cookie + localStorage
4. Frontend includes token in `Authorization: Bearer <token>` header
5. Middleware verifies token for protected routes

## 📦 Deployment to Vercel

### Environment Variables
Add to Vercel Project Settings:
```
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<strong-random-secret>
DEFAULT_ADMIN_EMAIL=<your-admin-email>
DEFAULT_ADMIN_PASSWORD=<strong-password>
CLOUDINARY_CLOUD_NAME=<your-value>
CLOUDINARY_API_KEY=<your-value>
CLOUDINARY_API_SECRET=<your-value>
CLOUDINARY_UPLOAD_PRESET=<your-value>
```

### Deploy
```bash
git push  # Auto-deploys to Vercel
```

## 🔍 Troubleshooting

### Issue: API routes returning 404
- Check that files are in `app/api/` directory
- Verify route file names match the endpoints (e.g., `route.ts` not `controller.ts`)

### Issue: "Token invalid" on protected routes
- Ensure JWT_SECRET in .env.local matches production
- Check token is being sent in Authorization header

### Issue: Images not uploading
- Verify Cloudinary credentials are correct
- Check CLOUDINARY_UPLOAD_PRESET exists

## 📚 Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Jose JWT Documentation](https://github.com/panva/jose)
- [Mongoose Documentation](https://mongoosejs.com/)
