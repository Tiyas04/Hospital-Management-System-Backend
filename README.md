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

### 👤 User Management

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/v1/user/register | Register user (doctor/patient) |
| POST | /api/v1/user/login | Login and receive tokens |
| POST | /api/v1/user/logout | Logout and clear tokens |
| PATCH | /api/v1/user/:username/updatepassword | Change password |
| PATCH | /api/v1/user/:username/updateavatar | Update avatar |
| GET | /api/v1/user/profile | Get logged-in user |
| GET | /api/v1/user/searchdoctor | Search doctors |
| GET | /api/v1/user/appointments/:appointmentId | View appointment by ID |
| GET | /api/v1/user/:patientId/diseaserecord | Get disease records |

### 📅 Appointments

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/v1/patient/appointments/:doctorId/book | Book appointment |
| GET | /api/v1/doctor/appointments | Doctor's appointments |
| GET | /api/v1/patient/appointments | Patient's appointments |
| GET | /api/v1/patient/appointments/previous | Previous appointments |
| PATCH | /api/v1/doctor/appointments/:appointmentId/status | Update status (doctor only) |
| PATCH | /api/v1/patient/appointments/:appointmentId/cancel | Cancel appointment (patient only) |

### 🧾 Receipts

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/v1/doctor/appointments/:appointmentId/generate-receipt | Generate receipt (doctor only) |
| GET | /api/v1/patient/appointments/:appointmentId/get-receipt | Get receipt (patient only) |

### 🏥 Medical Records

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/v1/patient/disease | Record disease information |

### 📊 Dashboard

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/v1/dashboard | Get dashboard statistics |

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