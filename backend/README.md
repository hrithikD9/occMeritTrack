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
TEACHER_PASSKEY=your_secure_passkey_here
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

Example format:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/yourdatabase?retryWrites=true&w=majority
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

**Seed the database with sample data (optional for testing):**
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
  "passkey": "your_passkey_here"
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
  "count": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
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
    "name": "John Doe",
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

#### POST /api/students/recalculate-ranks
Manually recalculate all student ranks (Teacher only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Ranks recalculated successfully",
  "count": 70,
  "data": [
    ...array of all students with updated ranks
  ]
}
```

**Note:** This endpoint applies the multi-level tie-breaking algorithm to all students. Useful after system updates or to ensure consistency.

---

## 🧮 Ranking Algorithm

### Weighted Percentage Calculation

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

### Multi-Level Tie-Breaking System

When students have identical percentages, the system applies sophisticated tie-breaking:

1. **Primary:** Higher final percentage wins
2. **Secondary:** If percentages match → More tests taken ranks higher
3. **Tertiary:** If percentage AND test count match → Higher total marks ranks higher  
4. **True Tie:** Only if all three criteria match → Students share the same rank

**Epsilon Comparison:** Uses 0.01 tolerance for floating-point precision

### Automatic Recalculation

Ranks are automatically recalculated using Mongoose post-save hooks whenever:
- ✅ A new student is added
- ✅ Test marks are updated
- ✅ A student is deleted

### Manual Recalculation

Teachers can manually trigger rank recalculation via:
```
POST /api/students/recalculate-ranks
```

## 🔒 Authentication & Authorization

### Teacher Access
- Requires configured passkey (set in `TEACHER_PASSKEY` environment variable)
- Gets JWT token with configurable expiration (default: 30 days)
- Full CRUD access: add, edit, and delete students
- Can manually recalculate all rankings

### Student Access
- No authentication required
- Read-only access only
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
  -d '{"role":"teacher","passkey":"YOUR_PASSKEY"}'
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

### General Deployment Steps

**Supported Platforms:** Render, Railway, Heroku, or any Node.js hosting service

1. Connect your GitHub repository to the platform
2. Configure build settings:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
3. Add all environment variables from your `.env` file
4. Ensure MongoDB Atlas whitelist includes your hosting platform's IPs
5. Deploy and test the API endpoints

**Important:** Always use HTTPS in production and update CORS settings to match your frontend domain.

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
| TEACHER_PASSKEY | Teacher authentication passkey | your_secure_passkey |
| NODE_ENV | Environment mode | development/production |

## 🔐 Security Best Practices

- ✅ Never commit `.env` file (already in .gitignore)
- ✅ Use strong JWT_SECRET (minimum 64 characters, randomly generated)
- ✅ Use strong TEACHER_PASSKEY (avoid dictionary words or simple patterns)
- ✅ Enable MongoDB Atlas IP whitelisting in production
- ✅ Always use HTTPS in production environments
- ✅ Configure CORS to allow only your frontend domain
- ✅ Regularly rotate JWT secrets and passkeys
- ✅ Monitor API logs for suspicious authentication attempts

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
