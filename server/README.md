# Shoe Shop - Backend

This folder contains the Express + MongoDB backend for the Shoe Shop catalog.

Getting started

1. Install dependencies

```bash
cd server
npm install
```

2. Create a `.env` file based on `.env.example` and set your values (MongoDB URI, JWT secret, Cloudinary credentials).

3. Run in development

```bash
npm run dev
```

API Endpoints (initial)

- GET `/api/shoes` - list shoes (query: gender, subcategory, search)
- GET `/api/shoes/:id` - get shoe by id
- POST `/api/shoes` - create shoe (protected)
- PUT `/api/shoes/:id` - update shoe (protected)
- DELETE `/api/shoes/:id` - delete shoe (protected)

- POST `/api/admin/register` - register admin (use for initial seed only)
- POST `/api/admin/login` - admin login, returns JWT
- GET `/api/admin/me` - protected, get current admin

Notes

- For image uploads from the frontend, use Cloudinary unsigned upload to `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload` with the unsigned `CLOUDINARY_UPLOAD_PRESET` configured.
- On submit, send the resulting image `url` and `publicId` to the backend as part of the `images` array when creating/updating shoes.
