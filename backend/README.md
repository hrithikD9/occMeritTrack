# OCC MeritTrack Backend API

Node.js + Express + MongoDB backend for the OCC MeritTrack HSC performance evaluation system.

## 🚀 Features

- **RESTful API** for student management
- **JWT Authentication** for teachers
- **Automatic rank calculation** using weighted formula
- **MongoDB Atlas** cloud database
- **Express validation** for data integrity
- **Role-based access control** (Teacher/Student)

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (free tier works)
- npm or yarn

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_jwt_secret_key
JWT_EXPIRE=30d
TEACHER_PASSKEY=OCC2026
NODE_ENV=development
```

#### Getting MongoDB Atlas Connection String:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `myFirstDatabase` with your database name (e.g., `occmerittrack`)

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/occmerittrack?retryWrites=true&w=majority
```

#### Generating JWT Secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Seed the database with sample data (70 students):**
```bash
npm run seed
```

The server will start on `http://localhost:5000`

### 4. Test the API

Health check:
```bash
curl http://localhost:5000
```

Expected response:
```json
{
  "success": true,
  "message": "OCC MeritTrack API is running",
  "version": "1.0.0"
}
```

## 📚 API Endpoints

### Authentication Routes

#### POST /api/auth/login
Login as teacher or student

**Request:**
```json
{
  "role": "teacher",
  "passkey": "OCC2026"
}
```

**Response (Teacher):**
```json
{
  "success": true,
  "role": "teacher",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Student):**
```json
{
  "success": true,
  "role": "student"
}
```

#### GET /api/auth/verify
Verify JWT token (requires Bearer token)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "role": "teacher"
}
```

---

### Student Routes

#### GET /api/students
Get all students (public access)

**Response:**
```json
{
  "success": true,
  "count": 70,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Aisha Rahman",
      "tests": [
        {
          "testNumber": 1,
          "obtainedMarks": 24,
          "totalMarks": 25,
          "percentage": 96,
          "_id": "507f1f77bcf86cd799439012"
        }
      ],
      "finalPercentage": 96.8,
      "rank": 1
    }
  ]
}
```

#### GET /api/students/:id
Get single student by ID (public access)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Aisha Rahman",
    "tests": [...],
    "finalPercentage": 96.8,
    "rank": 1
  }
}
```

#### POST /api/students
Add new student or add test to existing student (Teacher only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "John Doe",
  "testNumber": 1,
  "obtainedMarks": 23,
  "totalMarks": 25
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "tests": [
      {
        "testNumber": 1,
        "obtainedMarks": 23,
        "totalMarks": 25,
        "percentage": 92
      }
    ],
    "finalPercentage": 92,
    "rank": 5
  }
}
```

**Note:** If student with same name (case-insensitive) exists, the test is added to their record. Otherwise, a new student is created.

#### PUT /api/students/:id
Update student test marks (Teacher only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "testIndex": 0,
  "obtainedMarks": 24,
  "totalMarks": 25
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    ...updated student object
  }
}
```

#### DELETE /api/students/:id
Delete student (Teacher only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

## 🧮 Ranking Algorithm

The system uses a **weighted percentage formula** to calculate final percentage:

```
Final Percentage = (Σ Obtained Marks / Σ Total Marks) × 100
```

**Example:**
- Test 1: 24/25
- Test 2: 48/50
- Test 3: 73/75
- Test 4: 97/100

Final Percentage = (24+48+73+97) / (25+50+75+100) × 100 = **96.8%**

Ranks are automatically recalculated whenever:
- A new student is added
- Test marks are updated
- A student is deleted

## 🔒 Authentication & Authorization

### Teacher Access
- Requires passkey: `OCC2026`
- Gets JWT token valid for 30 days
- Can add, edit, and delete students

### Student Access
- No authentication required
- Read-only access
- Can view rankings, charts, and export data

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── studentController.js  # Student CRUD operations
├── middleware/
│   └── auth.js              # JWT verification middleware
├── models/
│   └── Student.js           # Mongoose schema with hooks
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   └── studentRoutes.js     # Student endpoints
├── utils/
│   └── seedData.js          # Database seeding script
├── .env                     # Environment variables (create this)
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── README.md
└── server.js                # Express app entry point
```

## 🧪 Testing

### Using cURL

**Login as teacher:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"role":"teacher","passkey":"OCC2026"}'
```

**Get all students:**
```bash
curl http://localhost:5000/api/students
```

**Add student (replace TOKEN):**
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "Test Student",
    "testNumber": 1,
    "obtainedMarks": 23,
    "totalMarks": 25
  }'
```

### Using Postman/Thunder Client

1. Import the API endpoints
2. Set `Authorization` header: `Bearer <your_token>`
3. Test all CRUD operations

## 🚀 Deployment

### Option 1: Render (Recommended - Free)

1. Create account at [Render.com](https://render.com)
2. New Web Service → Connect GitHub repo
3. Build Command: `cd backend && npm install`
4. Start Command: `cd backend && npm start`
5. Add environment variables in Render dashboard
6. Deploy

### Option 2: Railway (Free)

1. Create account at [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy

### Option 3: Heroku

1. Install Heroku CLI
2. Create Heroku app: `heroku create occmerittrack-api`
3. Set environment variables: `heroku config:set MONGO_URI=...`
4. Deploy: `git push heroku main`

## 🐛 Troubleshooting

**Error: Cannot connect to MongoDB**
- Check your MongoDB Atlas connection string
- Ensure your IP is whitelisted in Atlas (or use 0.0.0.0/0 for testing)
- Verify database user credentials

**Error: JWT token invalid**
- Check JWT_SECRET matches between requests
- Token might be expired (default 30 days)
- Ensure Bearer token format: `Bearer <token>`

**Error: Port already in use**
- Change PORT in .env file
- Kill process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)

**Error: Student with this name already exists**
- This is expected behavior - the API adds test to existing student
- Use case-insensitive unique names

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret key for JWT signing | 64-char random string |
| JWT_EXPIRE | Token expiration duration | 30d |
| TEACHER_PASSKEY | Teacher authentication passkey | OCC2026 |
| NODE_ENV | Environment mode | development/production |

## 🔐 Security Notes

- Never commit `.env` file (already in .gitignore)
- Use strong JWT_SECRET in production (32+ characters)
- Enable MongoDB IP whitelisting in production
- Use HTTPS in production
- Change TEACHER_PASSKEY for production

## 📄 License

MIT License - Free to use and modify

## 🤝 Support

For issues or questions:
- Check API documentation above
- Review error logs in console
- Verify environment variables
- Check MongoDB Atlas connection

---

**Built with ❤️ for OCC HSC Performance Evaluation**
