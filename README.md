# DriveBox

A cloud-based file storage application where users can securely upload, organize, preview, download, and delete files using Cloudinary as the storage provider.

The project is built with Node.js, Express.js, Passport.js, Prisma ORM, PostgreSQL, and EJS.

---

## Live Demo

**Application:** https://file-uploader-tibc.onrender.com

---

## Features

### Authentication
- User registration
- Secure login using Passport.js
- Password hashing with bcrypt
- Session-based authentication
- Protected routes

### Folder Management
- Create folders
- Rename folders
- Delete folders
- Prevent duplicate folder names for the same user

### File Management
- Upload files to Cloudinary
- Store file metadata in PostgreSQL
- Preview supported files
- Download files
- Delete files from both Cloudinary and the database

### Metadata Stored
- Original filename
- MIME type
- Cloudinary resource type
- File format
- File size
- Upload date
- Cloudinary URL
- Cloudinary Public ID

---

# Tech Stack

## Backend

- Node.js
- Express.js
- Passport.js
- Express Session
- Prisma ORM
- PostgreSQL
- Multer
- Cloudinary
- bcryptjs
- Express Validator

## Frontend

- EJS
- HTML
- CSS
- JavaScript

## Deployment

- Render
- Neon PostgreSQL
- Cloudinary

---

# Database Schema

The project consists of four main models.

### User

Stores user credentials and profile information.

### Folder

Stores user-created folders.

Each folder belongs to one user and contains multiple files.

### File

Stores metadata for every uploaded file.

- Original filename
- MIME type
- Cloudinary resource type
- File format
- File size
- Cloudinary URL
- Public ID

### Session

Stores authenticated user sessions.

---

# Installation

Clone the repository

```bash
git clone https://github.com/rudrakshupadhyay/File_Uploader.git
```

Move into the project

```bash
cd File_Uploader
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
DATABASE_URL=

SESSION_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Generate Prisma Client

```bash
npx prisma generate
```

Apply database migrations

```bash
npx prisma migrate deploy
```

Start the application

```bash
npm start
```

Development mode

```bash
npm run server
```

---

# Environment Variables

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL database connection string |
| SESSION_SECRET | Secret used by Express Session |
| CLOUDINARY_CLOUD_NAME | Cloudinary Cloud Name |
| CLOUDINARY_API_KEY | Cloudinary API Key |
| CLOUDINARY_API_SECRET | Cloudinary API Secret |

---

# Project Structure

```
├── config/
├── controllers/
├── generated/
├── lib/
├── models/
├── prisma/
│   └── migrations/
├── public/
├── routes/
├── uploads/
├── utils/
├── views/
├── app.js
├── package.json
└── README.md
```

---

# Screenshots

## Login

(Add screenshot)

## Dashboard

(Add screenshot)

## Folder

(Add screenshot)

## Upload Files

(Add screenshot)

---

# Future Improvements

- Folder sharing
- Drag and drop uploads
- Multiple file upload
- Search functionality
- Nested folders
- Storage usage dashboard
- React frontend
- Upload progress indicator
- File favorites

---

# License

This project is licensed under the MIT License.