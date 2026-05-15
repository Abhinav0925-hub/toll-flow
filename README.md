<![CDATA[<div align="center">

# 🚀 TollFlow

### **Intelligent Toll Road Management System**

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://www.mongodb.com/mern-stack)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

*A full-stack, production-grade toll plaza management system with real-time analytics, live license plate scanning, FastTag digital payments, and a high-tech dark-mode surveillance UI.*

---

[Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Project Structure](#-project-structure) · [Screenshots](#-screenshots)

</div>

---

## ✨ Features

| Module | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure admin login with hashed passwords (bcrypt) and token-based session management |
| 📊 **Real-Time Dashboard** | Live KPI cards (revenue, traffic volume, FastTag %, active booths) with 7-day revenue area charts and vehicle-type pie charts via Recharts |
| 📷 **Live License Plate Scanner** | Webcam-based optical scanner with laser-sweep animation and simulated AI plate detection |
| 🚗 **Vehicle Entry Management** | Full CRUD for toll transactions — manual entry, auto-toll calculation by vehicle class, search & filter |
| 💳 **FastTag Integration** | Digital wallet system with balance tracking, auto-deduction (10% discount), recharge history, and status management |
| 🏗️ **Toll Booth Management** | Create, update, and deactivate toll plaza nodes with lane configuration |
| 📈 **Analytics Engine** | Aggregated MongoDB pipelines for daily revenue, traffic distribution, and FastTag adoption metrics |
| 🎨 **Cyberpunk Dark UI** | Glassmorphism panels, neon glow effects, JetBrains Mono typography, grid-pattern backgrounds, and micro-animations |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI component library |
| **Vite 8** | Lightning-fast dev server & bundler |
| **Tailwind CSS 4** | Utility-first styling framework |
| **React Router v7** | Client-side routing & protected routes |
| **Recharts 3** | Data visualization (area charts, pie charts) |
| **Lucide React** | Icon system |
| **Axios** | HTTP client for API calls |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Server runtime |
| **Express 5** | REST API framework |
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Mongoose 9** | ODM for schema modeling & validation |
| **JWT** | Stateless authentication tokens |
| **bcrypt** | Password hashing (salt rounds: 10) |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT  (React + Vite)                       │
│                         http://localhost:5173                        │
├──────────┬──────────┬──────────────┬──────────────┬─────────────────┤
│  Login   │Dashboard │   Vehicles   │ LiveScanner  │     Layout      │
│  Page    │  Page    │    Page      │  Component   │   (Sidebar +    │
│          │(Recharts)│  (CRUD +     │  (Webcam +   │    Navbar)      │
│          │          │   Search)    │   Sim OCR)   │                 │
├──────────┴──────────┴──────┬───────┴──────────────┴─────────────────┤
│                            │  Axios + JWT Bearer Token              │
│                    AuthContext (React Context API)                   │
└────────────────────────────┼────────────────────────────────────────┘
                             │  HTTP REST (JSON)
                             ▼
┌────────────────────────────────────────────────────────────────────┐
│                     SERVER  (Express.js API)                       │
│                       http://localhost:5000                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐          │
│  │ /api/auth│  │/api/booth│  │/api/vehic│  │/api/fasttg│          │
│  │          │  │          │  │les       │  │           │          │
│  │ • POST   │  │ • GET    │  │ • GET    │  │ • GET     │          │
│  │  /login  │  │ • POST   │  │ • POST   │  │ • POST    │          │
│  │ • GET    │  │ • PUT/:id│  │ • PUT/:id│  │ • PUT     │          │
│  │  /me     │  │ • DELETE │  │   /pay   │  │  /recharge│          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬──────┘          │
│       │              │             │              │                 │
│  ┌────┴──────────────┴─────────────┴──────────────┴──────┐         │
│  │            Auth Middleware (JWT Verification)          │         │
│  └───────────────────────┬───────────────────────────────┘         │
│                          │                                         │
│  ┌──────────┐ ┌──────────┴───┐                                     │
│  │/api/analy│ │              │                                     │
│  │tics      │ │              │                                     │
│  │          │ │  Mongoose    │                                     │
│  │ • GET    │ │  ODM Layer   │                                     │
│  │ /dashbrd │ │              │                                     │
│  └────┬─────┘ └──────┬───────┘                                     │
│       │               │                                            │
├───────┴───────────────┴────────────────────────────────────────────┤
│                                                                    │
│                    MongoDB Atlas (Cloud)                            │
│                                                                    │
│    ┌────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐         │
│    │ Users  │  │TollBooths│  │VehicleEntry│  │ FastTags │         │
│    └────────┘  └──────────┘  └────────────┘  └──────────┘         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Project Structure

```
toll-flow/
├── README.md
│
├── backend/                          # Express.js REST API Server
│   ├── server.js                     # Entry point — Express app, DB connect, route mounting
│   ├── seed.js                       # Database seeder (admin user, booths, FastTags, demo entries)
│   ├── .env                          # Environment variables (PORT, MONGODB_URI, JWT_SECRET)
│   ├── package.json
│   │
│   ├── middleware/
│   │   └── authMiddleware.js         # JWT token verification guard
│   │
│   ├── models/
│   │   ├── User.js                   # Admin user schema (name, email, password, role)
│   │   ├── TollBooth.js              # Toll plaza schema (name, location, lanes, isActive)
│   │   ├── VehicleEntry.js           # Transaction schema (plate, type, amount, payment status)
│   │   └── FastTag.js                # Digital wallet schema (balance, status, history[])
│   │
│   └── routes/
│       ├── auth.js                   # POST /login, GET /me
│       ├── booths.js                 # CRUD operations for toll booths
│       ├── vehicles.js               # Vehicle entries + toll calculation + FastTag deduction
│       ├── fasttags.js               # FastTag registration + recharge
│       └── analytics.js              # Dashboard aggregation pipeline (revenue, traffic, charts)
│
└── frontend/                         # React + Vite SPA
    ├── index.html                    # HTML shell
    ├── vite.config.js                # Vite configuration
    ├── postcss.config.js             # PostCSS + TailwindCSS plugin
    ├── eslint.config.js              # ESLint rules
    ├── package.json
    │
    └── src/
        ├── main.jsx                  # App bootstrap (BrowserRouter + AuthProvider)
        ├── App.jsx                   # Route definitions + ProtectedRoute wrapper
        ├── index.css                 # Global styles, design tokens, animations, glassmorphism
        ├── App.css                   # Additional app-level styles
        │
        ├── context/
        │   └── AuthContext.jsx       # Auth state management (login, logout, token, Axios interceptor)
        │
        ├── layouts/
        │   └── Layout.jsx            # Sidebar navigation + top navbar + content area
        │
        ├── components/
        │   └── LiveScanner.jsx       # Webcam license plate scanner with laser animation
        │
        └── pages/
            ├── Login.jsx             # Authentication terminal (cyberpunk themed)
            ├── Dashboard.jsx         # KPI cards + Revenue chart + Vehicle distribution pie
            └── Vehicles.jsx          # Vehicle log table + Manual entry modal + Scanner integration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ v18.x
- **npm** ≥ v9.x
- **MongoDB Atlas** account (connection URI) *or* a local MongoDB instance
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/Abhinav0925-hub/toll-flow.git
cd toll-flow
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tollflow?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
```

Seed the database with demo data:

```bash
node seed.js
```

> This creates an admin account, sample toll booths, FastTag wallets, and 7 days of historical vehicle entries for the dashboard charts.

Start the backend server:

```bash
node server.js
```

> The API will be available at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> The app will be available at `http://localhost:5173`

### 4. Login

Use the seeded admin credentials:

| Field | Value |
|---|---|
| **Email** | `admin@tollflow.com` |
| **Password** | `admin123` |

---

## 📡 API Reference

All protected endpoints require the `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate admin & receive JWT | ❌ |
| `GET` | `/api/auth/me` | Get current logged-in user profile | ✅ |

**Login Request Body:**
```json
{
  "email": "admin@tollflow.com",
  "password": "admin123"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "name": "System Admin", "email": "admin@tollflow.com", "role": "admin" }
}
```

---

### Toll Booths

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/booths` | List all toll booths | ✅ |
| `POST` | `/api/booths` | Create a new toll booth | ✅ |
| `PUT` | `/api/booths/:id` | Update a toll booth | ✅ |
| `DELETE` | `/api/booths/:id` | Delete a toll booth | ✅ |

**Create Booth Body:**
```json
{
  "name": "Plaza Alpha",
  "location": "Highway 1 North",
  "lanes": 4
}
```

---

### Vehicle Entries

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/vehicles` | Get all entries (limit 100, newest first) | ✅ |
| `POST` | `/api/vehicles` | Record a new vehicle passage | ✅ |
| `PUT` | `/api/vehicles/:id/pay` | Mark a pending entry as paid (cash) | ✅ |

**Toll Rate Schedule:**

| Vehicle Class | Base Toll (₹) | FastTag Rate (₹) |
|---|---|---|
| 🚗 Car | 100 | 90 (10% discount) |
| 🏍️ Bike | 50 | 45 |
| 🚌 Bus | 250 | 225 |
| 🚛 Truck | 350 | 315 |

**Create Entry Body:**
```json
{
  "vehicleNumber": "MH01AB1234",
  "vehicleType": "Car",
  "tollBooth": "665f1a2b3c4d5e6f7a8b9c0d",
  "fastTagEnabled": true
}
```

> **Business Logic:** If `fastTagEnabled` is `true`, the system looks up the vehicle's FastTag. If found with sufficient balance, toll is auto-deducted at a 10% discount and payment status is set to `Completed`. Otherwise, the entry is logged with `Pending` status for manual cash collection.

---

### FastTags

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/fasttags` | List all registered FastTags | ✅ |
| `POST` | `/api/fasttags` | Register a new FastTag | ✅ |
| `PUT` | `/api/fasttags/recharge/:id` | Recharge a FastTag wallet | ✅ |

**Register FastTag Body:**
```json
{
  "vehicleNumber": "MH01AB1234",
  "balance": 500
}
```

**Recharge Body:**
```json
{
  "amount": 1000
}
```

---

### Analytics

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/analytics/dashboard` | Get aggregated dashboard metrics | ✅ |

**Response:**
```json
{
  "vehiclesToday": 42,
  "revenueToday": 8750,
  "activeBooths": 2,
  "fastTagCount": 18,
  "typeDistribution": [
    { "name": "Car", "value": 120 },
    { "name": "Truck", "value": 45 }
  ],
  "chartData": [
    { "date": "05-10", "revenue": 12500, "vehicles": 65 },
    { "date": "05-11", "revenue": 9800, "vehicles": 48 }
  ]
}
```

---

## 🗄️ Database Schema

```
┌──────────────────────┐       ┌──────────────────────────┐
│       Users           │       │       TollBooths          │
├──────────────────────┤       ├──────────────────────────┤
│ _id        ObjectId   │       │ _id         ObjectId      │
│ name       String     │       │ name        String        │
│ email      String ◄──unique   │ location    String        │
│ password   String     │       │ lanes       Number        │
│ role       String     │       │ isActive    Boolean       │
│ createdAt  Date       │       │ createdAt   Date          │
└──────────────────────┘       └──────────┬───────────────┘
                                          │ ref
┌──────────────────────────────┐          │
│       VehicleEntries          │          │
├──────────────────────────────┤          │
│ _id            ObjectId       │          │
│ vehicleNumber  String (upper) │          │
│ vehicleType    Enum           │──────────┘
│   [Car|Bike|Bus|Truck]        │
│ tollBooth      ObjectId ──────┤► ref: TollBooth
│ fastTagEnabled Boolean        │
│ amount         Number         │
│ paymentStatus  Enum           │
│   [Pending|Completed]         │
│ entryTime      Date           │
└──────────────────────────────┘

┌──────────────────────────────┐
│        FastTags               │
├──────────────────────────────┤
│ _id            ObjectId       │
│ vehicleNumber  String ◄──unique (upper)
│ balance        Number         │
│ status         Enum           │
│   [Active|Suspended]          │
│ history[]                     │
│   ├── amount   Number         │
│   ├── type     Enum           │
│   │   [Recharge|Deduction]    │
│   └── date     Date           │
│ createdAt      Date           │
└──────────────────────────────┘
```

---

## 🎨 UI / Design System

The interface follows a **cyberpunk surveillance aesthetic** with the following design tokens:

| Token | Value | Usage |
|---|---|---|
| **Background** | `slate-950` (#020617) | App background |
| **Surface** | `slate-900/80` with `backdrop-blur` | Cards, panels |
| **Primary** | `blue-500/600` (#3b82f6) | Buttons, active states, accents |
| **Success** | `emerald-400/500` (#10b981) | Completed payments, positive states |
| **Warning** | `amber-400/500` (#f59e0b) | Pending states |
| **Danger** | `red-400/500` (#ef4444) | Errors, logout |
| **Font Sans** | `Inter` | Body text |
| **Font Mono** | `JetBrains Mono` | Headers, labels, data values |

### Custom Animations

- **`animate-float`** — Gentle vertical bobbing for hero elements
- **`animate-pulse-glow`** — Neon glow pulsation on background orbs
- **`animate-scan`** — Horizontal laser sweep for the license plate scanner
- **`animate-glitch`** — Cyberpunk glitch effect on hover
- **`glass-panel`** — Frosted glass effect with `backdrop-filter: blur(16px)`

---

## 🔧 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | — |
| `JWT_SECRET` | Secret key for JWT signing | — |

---

## 📜 Available Scripts

### Backend (`/backend`)

| Command | Description |
|---|---|
| `node server.js` | Start the Express API server |
| `node seed.js` | Seed the database with demo data |

### Frontend (`/frontend`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (HMR) |
| `npm run build` | Build production bundle to `/dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

**Built with ❤️ using the MERN Stack**

*TollFlow — Intelligent Highway Toll Management*

</div>
]]>
