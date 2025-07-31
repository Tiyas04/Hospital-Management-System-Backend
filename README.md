# 🏥 Medical Appointment System – Backend

This is a **Node.js + Express.js** backend API for a medical appointment system. It enables secure registration and authentication of users (patients and doctors), booking and management of appointments, viewing medical history, and more.

---

## 🚀 Features

### 👥 User Management
- **Register as Doctor or Patient**
- **Secure Login/Logout** using JWT tokens
- **Password Update** with old password verification
- **Avatar Upload** via Cloudinary
- **Profile Access** for logged-in users

### 🩺 Doctor Search
- Search for doctors by **name** or **specialization**

### 📅 Appointment Management
- **Book appointments** with available doctors
- **Prevent double-booking** using unique index on time slot
- **View appointments** as a doctor or patient
- **Update appointment status** (doctors only)
- **Cancel appointments** (patients only)
- **View detailed appointment** info, including:
  - Patient/Doctor profile
  - Patient’s medical history (for doctors)

### 🔒 Security
- **JWT-based authentication**
- **Role-based access control**
- **Hashed passwords** using bcrypt
- **HttpOnly + secure cookies** for token storage
- **Validated file uploads** with Multer

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT for Authentication**
- **Multer for File Uploads**
- **Cloudinary** for storing avatars
- **Bcrypt** for password hashing

---

## 📁 Folder Structure (Simplified)

```plaintext
src
├── controllers
│   ├── appointment.controller.js
│   ├── disease.controller.js
│   ├── receipt.controller.js
│   └── user.controller.js
├── middlewares
│   ├── auth.middleware.js
│   ├── multer.middleware.js
│   └── role.middleware.js
├── models
│   ├── appointments.model.js
│   ├── disease.model.js
│   ├── receipt.model.js
│   └── user.model.js
├── routes
│   ├── appointment.route.js
│   ├── disease.route.js
│   ├── patient.route.js
│   └── user.route.js
└── utils
    ├── apierror.js
    ├── apiresponse.js
    └── asynchandler.js
```

---

## 📌 Environment Variables (`.env`)

```env
MONGODB_URL=your_mongodb_url
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
---

## ✅ API Endpoints Summary

### 🔐 Auth & User

| Method | Route                        | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| POST   | `/api/register`              | Register user (doctor/patient) |
| POST   | `/api/login`                 | Login and receive tokens       |
| POST   | `/api/logout`                | Logout and clear tokens        |
| PUT    | `/api/password/:username`    | Change password                |
| PUT    | `/api/avatar/:username`      | Update avatar                  |
| GET    | `/api/user`                  | Get logged-in user             |
| GET    | `/api/doctors/search?query=` | Search doctors                 |

### 📅 Appointments

| Method | Route                                     | Description                              |
| ------ | ----------------------------------------- | -----------------------------------------|
| POST   | `/api/appointments/book?doctorname=`      | Book appointment                         |
| GET    | `/api/appointments/doctor?status=`        | Doctor's appointments                    |
| GET    | `/api/appointments/patient?status=`       | Patient's appointments                   |
| GET    | `/api/appointments/:appointmentId`        | View appointment by ID                   |
| PUT    | `/api/appointments/:appointmentId/status` | Update status (doctor only)              |
| PUT    | `/api/appointments/:appointmentId/cancel` | Cancel appointment (patient only)        |
| POST   | `/api/appointments/:appointmentId/generate-receipt` | Generate receipt (doctor only) |
| GET    | `/api/appointments/:appointmentId/get-receipt` | Get receipt by appointment ID       |

---

## ⚠️ Known Limitations / To Do

- Add email verification (future)
- Rate limiting for security
- Pagination for doctor and appointment listings

---

## 🧪 Run Locally

### Install dependencies
npm install

### Set up .env file

### Start the server
npm run dev

---

## 📄 License

MIT

---