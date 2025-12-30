# Quick Start Guide

Get the Bowen Accounting Department Portal up and running in minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ Go 1.21+ installed (`go version`)
- ✅ MongoDB running locally or accessible remotely

## Step 1: Start MongoDB

### Option A: Local MongoDB
```bash
# Windows (if installed as service)
net start MongoDB

# Or start manually
mongod --dbpath C:\data\db
```

### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `backend/.env` with your connection string

## Step 2: Start the Backend

Open a terminal in the project directory:

```bash
cd backend

# Install dependencies
go mod download

# Start the server
go run main.go
```

You should see:
```
Server starting on port 8080
```

✅ Backend is now running at `http://localhost:8080`

## Step 3: Start the Frontend

Open a **new** terminal in the project directory:

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

You should see:
```
- Local:        http://localhost:3000
```

✅ Frontend is now running at `http://localhost:3000`

## Step 4: Access the Application

1. Open your browser and go to `http://localhost:3000`
2. You should see the landing page with animations
3. Click "Register" to create your first account

## Step 5: Create Your First Account

1. Click **Register** in the navbar
2. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@bowen.edu.ng (must end with @bowen.edu.ng)
   - Matric Number: ACC/20/1234 (format: XXX/YY/ZZZZ)
   - Password: password123 (minimum 8 characters)
3. Click **Register**

✅ You're now logged in!

## Step 6: Explore the Features

### Browse Notes
1. Click **Notes Library** in the navbar
2. Use search and filters to find notes
3. Click **Download** on any note

### Vote in Elections
1. Click **Vote** in the navbar
2. Review candidates and their manifestos
3. Click **Vote** on your preferred candidate
4. Confirm your vote

### View Your Profile
1. Click **Profile** in the navbar
2. See your download history and voting records

## Creating an Admin Account

To access admin features, you need to manually set a user as admin in MongoDB:

### Using MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connect to `mongodb:mongodb+srv://Oludiran-Ayoade:Circumspect1_@newnode.xwu1abo.mongodb.net/?bowen_accounting=true&w=majority&appName=NewNode`
3. Open database: `bowen_accounting`
4. Open collection: `users`
5. Find your user by email
6. Edit the document and change `role` from `"student"` to `"admin"`
7. Save changes
8. Logout and login again

### Using MongoDB Shell
```bash
mongosh

use bowen_accounting

db.users.updateOne(
  { email: "john.doe@bowen.edu.ng" },
  { $set: { role: "admin" } }
)
```

✅ You now have admin access!

## Admin Features

As an admin, you can:
- Upload new notes
- Create elections
- View analytics
- Manage content

## Troubleshooting

### Backend won't start
- **Error: "Failed to connect to database"**
  - Make sure MongoDB is running
  - Check `backend/.env` has correct `MONGODB_URI`

### Frontend won't start
- **Error: "Cannot find module"**
  - Run `npm install` in the frontend directory
  - Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Can't register with email
- **Error: "User already exists"**
  - This email is already registered
  - Try logging in instead or use a different email

### Can't login
- **Error: "Invalid credentials"**
  - Check your email and password
  - Make sure you registered successfully
  - Try registering again with a different email

## Default Ports

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- MongoDB: `mongodb:mongodb+srv://Oludiran-Ayoade:Circumspect1_@newnode.xwu1abo.mongodb.net/?bowen_accounting=true&w=majority&appName=NewNode`

## Environment Variables

### Backend (.env)
```
PORT=8080
MONGODB_URI=mongodb:mongodb+srv://Oludiran-Ayoade:Circumspect1_@newnode.xwu1abo.mongodb.net/?bowen_accounting=true&w=majority&appName=NewNode
DB_NAME=bowen_accounting
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Testing the API

You can test the backend API directly:

### Health Check
```bash
curl http://localhost:8080/health
```

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@bowen.edu.ng",
    "matricNumber": "ACC/20/5678",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@bowen.edu.ng",
    "password": "password123"
  }'
```

## Next Steps

1. ✅ Explore all features
2. ✅ Create test data (notes, elections)
3. ✅ Customize the theme colors in `frontend/src/app/globals.css`
4. ✅ Add your university logo
5. ✅ Deploy to production

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Visit the Help page in the application
- Email: accounting@bowen.edu.ng

---

**Enjoy using the Bowen Accounting Department Portal! 🎉**
