# 🎓 OCC MeritTrack

**Full-Stack HSC Candidate Performance Evaluation & Ranking System**

A modern web application for tracking and evaluating HSC candidate performance across multiple tests with automatic rank calculation, role-based access control, and real-time cloud synchronization.

![React](https://img.shields.io/badge/React-18.3-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)

## ✨ Features

### 📊 Core Functionality
- **Automatic Ranking System** - Weighted percentage calculation: `(Σ obtained / Σ total) × 100`
- **Real-time Rank Updates** - Ranks recalculated automatically after any data change using MongoDB hooks
- **Multi-Test Support** - Track performance across multiple independent test numbers
- **Performance Analytics** - Individual student performance charts and progress tracking
- **Test Filtering** - View rankings for specific tests or overall performance
- **CSV Export** - Export student data for offline analysis and sharing

### 🔐 Authentication & Security
- **JWT Authentication** - Secure teacher access with Bearer token
- **Role-Based Access Control** - Teacher (full CRUD) and Student (read-only) modes
- **Protected API Routes** - Middleware-based authentication for sensitive operations
- **Passkey System** - Teacher passkey: `OCC2026`
- **Cloud Database** - MongoDB Atlas for secure, scalable data storage

### 🎨 User Experience
- **Modern Dark Theme** - Beautiful purple gradient design with glassmorphism effects
- **Smart Autocomplete** - Prevents duplicate students with case-insensitive name matching
- **Inline Editing** - Edit test marks directly in the ranking table
- **Responsive Design** - Seamlessly adapts to desktop, tablet, and mobile devices
- **Loading States** - Clear feedback during API operations
- **Error Handling** - User-friendly error messages and validation

## 🛠️ Tech Stack

### Frontend
- **React 18.3+** - Modern UI library with hooks
- **Vite 5.4+** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **Recharts 2.13+** - Interactive data visualization library

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js 4.18+** - Web application framework
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose 8.0+** - ODM with schema validation and hooks
- **JWT (jsonwebtoken 9.0+)** - Token-based authentication
- **bcryptjs 2.4+** - Password hashing (for future enhancements)
- **Express Validator 7.0+** - Request validation middleware
- **CORS** - Cross-origin resource sharing support

## 📋 Prerequisites

- **Node.js 18 or higher**
- **npm or yarn**
- **MongoDB Atlas account** (free tier available at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/occMeritTrack.git
cd occMeritTrack
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/occmerittrack?retryWrites=true&w=majority
JWT_SECRET=your_random_64_character_secret_key_here
JWT_EXPIRE=30d
TEACHER_PASSKEY=OCC2026
NODE_ENV=development
```

**Getting MongoDB URI:**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster (M0 free tier)
3. Create database user with password
4. Whitelist your IP (or use `0.0.0.0/0` for development)
5. Click "Connect" → "Connect your application" → Copy connection string
6. Replace `<password>` with your database password

**Generating JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
npm run seed
```

#### Start Backend Server

```bash
npm run dev   # Development mode with auto-reload
# OR
npm start     # Production mode
```

✅ Backend running at `http://localhost:5000`

### 3. Frontend Setup

Return to root directory:

```bash
cd ..  # Go back to project root
npm install
```

#### Configure Frontend Environment

Create `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend

```bash
npm run dev
```

✅ Frontend running at `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

**Login Options:**
- **Teacher:** Enter passkey `OCC2026` for full access
- **Student:** No passkey needed for read-only access

## 📁 Project Structure

```
occMeritTrack/
├── backend/                        # Node.js + Express API
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   └── studentController.js   # Student CRUD operations
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── models/
│   │   └── Student.js            # Mongoose schema with hooks
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── studentRoutes.js      # Student endpoints
│   ├── utils/
│   │   └── seedData.js           # Database seeding script
│   ├── .env                      # Environment variables (create this)
│   ├── .env.example              # Environment template
│   ├── .gitignore
│   ├── package.json
│   ├── README.md                 # Backend documentation
│   └── server.js                 # Express app entry point
│
├── src/                          # React frontend
│   ├── api/
│   │   └── api.js               # API service layer
│   ├── components/
│   │   ├── AddCandidate.jsx     # Form to add test results
│   │   ├── FilterBar.jsx        # Filter and export controls
│   │   ├── PerformanceChart.jsx # Student performance charts
│   │   ├── RankingTable.jsx     # Main ranking display
│   │   └── RoleSelectionModal.jsx # Login modal
│   ├── utils/
│   │   └── helpers.js           # Helper functions
│   ├── App.jsx                  # Main application component
│   ├── App.css                  # Custom styles
│   ├── config.js                # Configuration constants
│   ├── index.css                # Tailwind CSS imports
│   └── main.jsx                 # Application entry point
│
├── public/                      # Static assets
├── .env                        # Frontend environment variables
├── .env.example               # Frontend env template
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md                  # This file
├── tailwind.config.js
└── vite.config.js
```

## 🔄 Data Flow Architecture

### Adding a Student/Test

```
User Input (Frontend)
    ↓
AddCandidate Component
    ↓
App.jsx handleAddCandidate()
    ↓
API Call: POST /api/students
    ↓
Backend studentController.addStudent()
    ↓
Find existing student (case-insensitive)
    ↙          ↘
  Exists      New Student
    ↓              ↓
Add test    Create student
    ↓              ↓
Mongoose pre-save hook
    ↓
Calculate test percentage
    ↓
Mongoose post-save hook
    ↓
Recalculate all ranks (MongoDB)
    ↓
Return updated student
    ↓
Frontend reloads all students
    ↓
UI updates with new ranks
```

### Authentication Flow

```
User selects role
    ↓
RoleSelectionModal
    ↓
API Call: POST /api/auth/login
    ↓
Backend authController.login()
    ↓
Verify passkey (if teacher)
    ↓
Generate JWT token
    ↓
Store token in localStorage
    ↓
Add token to API requests
    ↓
Protected routes accessible
```

## 🧮 Ranking Algorithm

The system uses a **weighted average formula** for accurate ranking across tests with different total marks:

```
Final Percentage = (Σ Obtained Marks / Σ Total Marks) × 100
```

**Example:**
- Test 1: 24/25 (96%)
- Test 2: 48/50 (96%)
- Test 3: 73/75 (97.33%)
- Test 4: 97/100 (97%)

**Calculation:**
```
Total Obtained = 24 + 48 + 73 + 97 = 242
Total Marks = 25 + 50 + 75 + 100 = 250
Final Percentage = (242 / 250) × 100 = 96.8%
```

This approach is **fairer** than simple averaging because it accounts for the weight of each test.

### Automatic Rank Updates

Ranks are recalculated automatically using Mongoose middleware hooks when:
- ✅ New student is added
- ✅ New test is added to existing student
- ✅ Test marks are edited
- ✅ Student is deleted

## 📡 API Endpoints Reference

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Login as teacher/student |
| GET | `/api/auth/verify` | Protected | Verify JWT token |

### Students

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/students` | Public | Get all students |
| GET | `/api/students/:id` | Public | Get single student |
| POST | `/api/students` | Teacher | Add student/test |
| PUT | `/api/students/:id` | Teacher | Update test marks |
| DELETE | `/api/students/:id` | Teacher | Delete student |

**Detailed API documentation:** See [backend/README.md](backend/README.md)

## 🎯 Key Features Explained

### 1. Case-Insensitive Name Matching
- "John Doe", "john doe", "JOHN DOE" are treated as the same student
- MongoDB index with collation strength 2
- Prevents duplicate student entries

### 2. Flexible Test Numbers
- Each student can have independent test numbers (1, 2, 3...)
- Multiple students can submit the same test number
- A single student cannot submit the same test twice

### 3. Smart Autocomplete
- Real-time name suggestions while typing
- Shows existing students' test counts and percentages
- Visual feedback for new vs. existing students

### 4. Inline Editing
- Click on any test mark badge to edit
- Validates obtained marks ≤ total marks
- Loading states during save operations

### 5. Performance Charts
- Interactive line graph using Recharts
- Shows test-by-test progress
- Displays highest/lowest marks and statistics

## 🔐 Security Features

- **JWT Tokens** - Expire after 30 days
- **Password Hashing** - bcryptjs for secure storage
- **Input Validation** - Express-validator for request validation
- **CORS Protection** - Configured for specific origins
- **Environment Variables** - Sensitive data in .env (not committed)
- **MongoDB Security** - IP whitelisting and user authentication

## 🧪 Testing the API

### Using cURL

**Login as Teacher:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"role":"teacher","passkey":"OCC2026"}'
```

**Get All Students:**
```bash
curl http://localhost:5000/api/students
```

**Add Student (replace YOUR_TOKEN):**
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Student",
    "testNumber": 1,
    "obtainedMarks": 23,
    "totalMarks": 25
  }'
```

## 🚀 Deployment

### Backend Deployment (Render - Free)

1. Create account at [Render.com](https://render.com)
2. New Web Service → Connect repository
3. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Add all variables from `.env`
4. Deploy

### Frontend Deployment (Vercel/Netlify - Free)

1. Update `.env`: `VITE_API_URL=https://your-backend-url.onrender.com/api`
2. Deploy to Vercel or Netlify
3. Configure build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

**Alternative:** [Railway.app](https://railway.app), [Heroku](https://heroku.com)

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Verify MongoDB URI in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure database user credentials are correct

**Port Already in Use:**
- Change `PORT` in `.env` to different number
- Kill existing process: `npx kill-port 5000`

**JWT Token Invalid:**
- Check `JWT_SECRET` matches between requests
- Token might be expired (default 30 days)

### Frontend Issues

**API Connection Failed:**
- Ensure backend is running on port 5000
- Verify `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors

**Authentication Not Working:**
- Clear localStorage: `localStorage.clear()`
- Verify passkey is `OCC2026`
- Check network tab for API responses

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [JWT Introduction](https://jwt.io/introduction)
- [Tailwind CSS Docs](https://tailwindcss.com)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for OCC HSC Performance Evaluation

---

**🎉 Happy Coding!**

For detailed backend documentation, see [backend/README.md](backend/README.md)
# occMeritTrack
