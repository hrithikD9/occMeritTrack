# 🎓 OCC MeritTrack

**Full-Stack HSC Candidate Performance Evaluation & Ranking System**

A modern web application for tracking and evaluating HSC candidate performance across multiple tests with sophisticated automatic ranking, role-based access control, and real-time cloud synchronization.

![React](https://img.shields.io/badge/React-18.3-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)

## ✨ Features

### 📊 Core Functionality
- **Sophisticated Ranking System** - Multi-level tie-breaking logic with percentage, test count, and total marks comparison
- **Weighted Percentage Calculation** - Fair assessment: `(Σ obtained / Σ total) × 100`
- **Real-time Rank Updates** - Automatic recalculation after any data change using MongoDB hooks
- **Manual Rank Recalculation** - Teacher-only button to refresh all rankings on demand
- **Multi-Test Support** - Track performance across unlimited independent test numbers
- **Performance Analytics** - Individual student performance charts and progress visualization
- **Test Filtering** - View rankings for specific tests or overall performance
- **CSV Export** - Export complete student data for offline analysis

### 🔐 Authentication & Security
- **JWT Authentication** - Secure token-based authentication for teachers
- **Role-Based Access Control** - Teacher (full CRUD) and Student (read-only) modes
- **Protected API Routes** - Middleware-based route protection
- **Passkey System** - Configurable teacher authentication
- **Cloud Database** - MongoDB Atlas with secure connection and IP whitelisting

### 🎨 User Experience
- **Modern Dark Theme** - Beautiful purple gradient design with glassmorphism effects
- **Mobile Responsive** - Card view on mobile, table view on desktop
- **Smart Autocomplete** - Prevents duplicate students with case-insensitive name matching
- **Inline Editing** - Edit test marks directly in the ranking table (teacher mode)
- **Loading States** - Clear feedback during all API operations
- **Error Handling** - User-friendly error messages and comprehensive validation

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
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_random_64_character_secret_key_here
JWT_EXPIRE=30d
TEACHER_PASSKEY=your_secure_passkey_here
NODE_ENV=development
```

**Important Configuration Steps:**

1. **MongoDB URI:** 
   - Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create new cluster (M0 free tier available)
   - Create database user with strong password
   - Configure network access (whitelist IP or 0.0.0.0/0 for development)
   - Get connection string from "Connect" → "Connect your application"
   - Replace `<password>` with your database password

2. **JWT Secret:** Generate a secure random key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Teacher Passkey:** Set your custom passkey for teacher authentication

#### Seed Database (Optional)

Add sample data for testing:

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
- **Teacher:** Enter your configured passkey from `TEACHER_PASSKEY` in `.env` for full access (add, edit, delete)
- **Student:** No passkey needed for read-only access (view rankings only)

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

The system uses a **sophisticated multi-level ranking system** that ensures fair competition:

### Weighted Average Formula

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

This weighted approach is **fairer** than simple averaging because it properly accounts for the relative importance of each test.

### Tie-Breaking Rules

When students have the same percentage, the system applies sophisticated tie-breaking:

1. **Primary:** Higher final percentage wins
2. **Secondary:** If percentages match → Student with MORE tests taken ranks higher
3. **Tertiary:** If percentage AND test count match → Student with HIGHER total marks ranks higher
4. **True Tie:** Only if ALL three criteria match → Students share the same rank

**Example Scenario:**
- Student A: 80%, 5 tests, 200 total marks → **Rank 1**
- Student B: 80%, 3 tests, 150 total marks → **Rank 2** (fewer tests)
- Student C: 80%, 3 tests, 150 total marks → **Rank 2** (TRUE TIE - all criteria match)
- Student D: 80%, 3 tests, 130 total marks → **Rank 4** (same percentage and tests, but lower marks)

### Floating-Point Precision

The system uses epsilon-based comparison (tolerance: 0.01) to handle floating-point arithmetic issues, ensuring students with percentages like 72.00 and 72.000001 are correctly identified as tied.

### Automatic Rank Updates

Ranks are recalculated automatically using Mongoose middleware hooks when:
- ✅ New student is added
- ✅ New test is added to existing student
- ✅ Test marks are edited
- ✅ Student is deleted

### Manual Recalculation

Teachers can manually trigger rank recalculation using the green "Recalculate" button in the filter bar. This is useful after system updates or to ensure consistency.

## 📡 API Endpoints Reference

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Login as teacher/student |
| GET | `/api/auth/verify` | Protected | Verify JWT token |

### Students

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/students` | Public | Get all students with rankings |
| GET | `/api/students/:id` | Public | Get single student by ID |
| POST | `/api/students` | Teacher | Add new student or test |
| PUT | `/api/students/:id` | Teacher | Update test marks |
| DELETE | `/api/students/:id` | Teacher | Delete student |
| POST | `/api/students/recalculate-ranks` | Teacher | Manually recalculate all ranks |

**Detailed API documentation:** See [backend/README.md](backend/README.md)

## 🎯 Key Features Explained

### 1. Sophisticated Ranking System
- **Multi-level tie-breaking:** Percentage → Test Count → Total Marks
- **Epsilon comparison:** Handles floating-point precision (0.01 tolerance)
- **Fair competition:** Only true equals share ranks
- **Automatic updates:** Triggered by MongoDB post-save hooks
- **Manual refresh:** Teacher-only recalculate button in filter bar

### 2. Mobile Responsive Design
- **Desktop:** Full table view with inline editing
- **Mobile:** Beautiful card-based layout with expandable details
- **Breakpoints:** Tailwind CSS responsive utilities (sm, md, lg)
- **Touch-friendly:** Large buttons and tap targets for mobile users

### 3. Case-Insensitive Name Matching
- "John Doe", "john doe", "JOHN DOE" treated as same student
- MongoDB index with collation strength 2
- Prevents duplicate student entries
- Real-time autocomplete suggestions

### 4. Flexible Test Numbers
- Each student can have independent test numbers
- Multiple students can submit the same test number
- A single student cannot submit the same test twice
- Filter rankings by specific test number

### 5. Smart Autocomplete
- Real-time name suggestions while typing
- Shows existing students' test counts and percentages
- Visual feedback for new vs. existing students
- Prevents accidental duplicates

### 6. Inline Editing (Teacher Mode)
- Click on any test mark badge to edit
- Validates obtained marks ≤ total marks
- Loading states during save operations
- Automatic rank recalculation after edit

### 7. Performance Charts
- Interactive line graph using Recharts
- Shows test-by-test progress
- Displays highest/lowest marks and statistics
- Responsive modal with adaptive sizing

## 🔐 Security Features

- **JWT Tokens** - Configurable expiration (default: 30 days)
- **Password Hashing** - bcryptjs for secure credential storage
- **Input Validation** - Express-validator for comprehensive request validation
- **CORS Protection** - Configured for specific allowed origins
- **Environment Variables** - All sensitive data stored securely in `.env` files (not committed)
- **MongoDB Security** - Network access controls and database user authentication
- **Protected Routes** - Middleware-based authentication for teacher-only operations
- **Token Storage** - Secure localStorage handling with automatic cleanup

## 🧪 Testing the API

### Using cURL

**Login as Teacher:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"role":"teacher","passkey":"YOUR_PASSKEY_HERE"}'
```

**Get All Students:**
```bash
curl http://localhost:5000/api/students
```

**Add Student (requires teacher authentication):**
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Student",
    "testNumber": 1,
    "obtainedMarks": 23,
    "totalMarks": 25
  }'
```

**Recalculate All Ranks (teacher only):**
```bash
curl -X POST http://localhost:5000/api/students/recalculate-ranks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Deployment

### Backend Deployment Options

**Recommended Platforms:** Render, Railway, Heroku (Free tiers available)

**General Setup:**
1. Connect your GitHub repository
2. Configure build and start commands:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
3. Add environment variables from your `.env` file
4. Ensure MongoDB Atlas IP whitelist includes your hosting platform

### Frontend Deployment Options

**Recommended Platforms:** Vercel, Netlify (Free tiers available)

**General Setup:**
1. Update frontend `.env` with your deployed backend URL:
   ```env
   VITE_API_URL=https://your-backend-url.com/api
   ```
2. Configure build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
3. Deploy from GitHub repository

**Important:** Update CORS settings in backend to include your frontend domain

**Deployment Documentation:**
- See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed platform-specific instructions
- Backend deployment guide: [backend/README.md](backend/README.md)

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
- Verify `TEACHER_PASSKEY` in backend `.env` matches what you're entering
- Check network tab for API responses and error messages
- Ensure backend server is running and accessible

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
