# Bowen University Accounting Department Portal

A comprehensive full-stack web application for the Accounting Department at Bowen University, featuring notes sharing, democratic elections, and department announcements.

![Dark Mode](https://img.shields.io/badge/Theme-Dark%20Mode-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Go](https://img.shields.io/badge/Go-1.21-00ADD8)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green)

## 🌟 Features

### For Students
- 📚 **Notes Library** - Browse, search, and download course materials with advanced filters
- 🗳️ **Democratic Elections** - Participate in secure class representative elections
- 📢 **Announcements** - Stay updated with department news and events
- 👤 **User Profile** - Track your downloads and voting history
- 🌙 **Dark Mode** - Modern dark theme with light mode toggle
- 📱 **Mobile-First** - Fully responsive design for all devices

### For Administrators
- 📝 **Content Management** - Upload and manage course notes
- 🎯 **Election Management** - Create elections, add positions and candidates
- 📊 **Analytics** - View download statistics and election results
- 👥 **User Management** - Monitor student registrations and activities

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend
- **Language:** Go 1.21+
- **Framework:** Gin
- **Database:** MongoDB
- **Authentication:** JWT (golang-jwt/jwt)
- **Password Hashing:** bcrypt

## 📁 Project Structure

```
Accounting Dept/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js pages (App Router)
│   │   ├── components/    # Reusable React components
│   │   ├── lib/           # Utilities and API client
│   │   └── store/         # Zustand state management
│   ├── public/            # Static assets
│   └── package.json
│
├── backend/               # Go backend API
│   ├── config/           # Database configuration
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth & authorization
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── utils/            # Helper functions
│   ├── main.go           # Entry point
│   └── go.mod
│
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Go 1.21+
- MongoDB 4.4+

### Installation

#### 1. Clone the repository
```bash
cd "c:/Users/HP/Desktop/Accounting Dept"
```

#### 2. Set up the Backend

```bash
cd backend

# Install Go dependencies
go mod download

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Run the backend
go run main.go
```

The backend API will be available at `http://localhost:8080`

#### 3. Set up the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local if needed

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Set up MongoDB

Make sure MongoDB is running locally or update the `MONGODB_URI` in backend `.env` file with your MongoDB connection string.

## 📖 Usage

### Creating an Account
1. Navigate to `http://localhost:3000`
2. Click "Register" in the navbar
3. Fill in your details with a Bowen University email (@bowen.edu.ng)
4. Enter your matric number in the format: ACC/20/1234

### Browsing Notes
1. Click "Notes Library" in the navbar
2. Use search and filters to find specific notes
3. Click "Download" to download notes (requires login)

### Voting in Elections
1. Click "Vote" in the navbar
2. Review candidates and their manifestos
3. Click "Vote" on your preferred candidate
4. Confirm your vote (cannot be changed)

### Admin Access
To create an admin account, manually update a user's role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@bowen.edu.ng" },
  { $set: { role: "admin" } }
)
```

## 🎨 Design Features

### Landing Page
- Animated hero section with gradient backgrounds
- Feature showcase with icons
- Statistics display
- Call-to-action sections
- Announcement banner for active elections

### Authentication
- University email validation
- Matric number format validation
- Secure JWT token-based authentication
- Persistent login state

### Notes Library
- Advanced search functionality
- Filter by course, semester, lecturer
- Sort by newest, most downloaded, or title
- Preview and download options
- Download tracking

### Voting System
- View active elections
- Read candidate manifestos
- One-click voting with confirmation
- Vote tracking and history
- Real-time election status

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- CORS configuration
- Input validation

## 📱 Pages

- **/** - Landing page with animations
- **/auth/login** - User login
- **/auth/register** - User registration
- **/notes** - Notes library with search and filters
- **/vote** - Election voting system
- **/profile** - User profile and history
- **/announcements** - Department announcements
- **/admin** - Admin dashboard (admin only)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note (Admin)
- `POST /api/notes/:id/download` - Download note

### Elections
- `GET /api/elections` - Get all elections
- `POST /api/elections` - Create election (Admin)
- `POST /api/elections/vote` - Cast vote
- `GET /api/elections/:id/results` - Get results

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/downloads` - Get download history

## 🎯 Future Enhancements

- [ ] Email OTP verification
- [ ] File upload for notes (currently URL-based)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Export election results to CSV
- [ ] Note preview with embedded PDF viewer
- [ ] Bulk download for course packs
- [ ] Comment system for notes
- [ ] Rating system for notes
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Developed for the Accounting Department, Bowen University, Iwo, Osun State, Nigeria.

## 📧 Contact

- **Email:** accounting@bowen.edu.ng
- **Website:** https://bowen.edu.ng

## 🙏 Acknowledgments

- Bowen University Accounting Department
- All contributing students and faculty
- Open source community

---

**Built with ❤️ for Bowen University**
