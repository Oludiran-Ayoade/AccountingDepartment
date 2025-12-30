# Bowen University Accounting Department Portal - Backend

A RESTful API built with Go (Golang), Gin framework, and MongoDB for the Accounting Department portal.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 📚 **Notes Management** - CRUD operations for course notes
- 🗳️ **Election System** - Democratic voting with vote tracking
- 👥 **User Management** - Profile and activity tracking
- 🔒 **Role-Based Access** - Student and admin roles
- 📊 **MongoDB Integration** - Efficient NoSQL database

## Tech Stack

- **Language:** Go 1.21+
- **Framework:** Gin
- **Database:** MongoDB
- **Authentication:** JWT (golang-jwt/jwt)
- **Password Hashing:** bcrypt

## Getting Started

### Prerequisites

- Go 1.21 or higher
- MongoDB 4.4 or higher (running locally or remote)

### Installation

1. Install dependencies:
```bash
go mod download
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
```
PORT=8080
MONGODB_URI=mongodb:mongodb+srv://Oludiran-Ayoade:Circumspect1_@newnode.xwu1abo.mongodb.net/?bowen_accounting=true&w=majority&appName=NewNode
DB_NAME=bowen_accounting
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
```

3. Run the server:
```bash
go run main.go
```

The API will be available at `http://localhost:8080`

## Project Structure

```
backend/
├── config/              # Database configuration
├── controllers/         # Request handlers
├── middleware/          # Authentication & authorization
├── models/             # Data models
├── routes/             # API routes
├── utils/              # Helper functions
├── main.go             # Application entry point
├── go.mod              # Go dependencies
└── .env                # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Notes
- `GET /api/notes` - Get all notes (with filters)
- `GET /api/notes/:id` - Get note by ID
- `POST /api/notes` - Create note (Admin only)
- `POST /api/notes/:id/download` - Download note (Auth required)
- `DELETE /api/notes/:id` - Delete note (Admin only)

### Elections
- `GET /api/elections` - Get all elections
- `GET /api/elections/:id` - Get election by ID
- `POST /api/elections` - Create election (Admin only)
- `POST /api/elections/vote` - Cast vote (Auth required)
- `GET /api/elections/my-votes` - Get user's votes (Auth required)
- `GET /api/elections/:id/results` - Get election results

### Users
- `GET /api/users/profile` - Get user profile (Auth required)
- `GET /api/users/downloads` - Get download history (Auth required)

## Request Examples

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@bowen.edu.ng",
    "matricNumber": "ACC/20/1234",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@bowen.edu.ng",
    "password": "password123"
  }'
```

### Get Notes (with filters)
```bash
curl http://localhost:8080/api/notes?course=ACC%20201&semester=1st%20Semester
```

### Cast Vote
```bash
curl -X POST http://localhost:8080/api/elections/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "electionId": "election_id_here",
    "positionId": "position_id_here",
    "candidateId": "candidate_id_here"
  }'
```

## Database Collections

### users
- User accounts with authentication details
- Fields: firstName, lastName, email, matricNumber, password, role

### notes
- Course notes and materials
- Fields: title, description, course, semester, lecturer, fileUrl, uploadedBy, downloadCount

### elections
- Election information with positions and candidates
- Fields: title, description, status, startDate, endDate, positions

### votes
- Vote records (anonymous)
- Fields: electionId, positionId, candidateId, userId, votedAt

### note_downloads
- Download tracking
- Fields: noteId, userId, downloadAt

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Tokens expire after 7 days.

## Role-Based Access

- **Student**: Can view notes, download notes, vote in elections
- **Admin**: All student permissions + create/delete notes, create elections

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message here"
}
```

## Development

### Run with hot reload (using Air)
```bash
# Install Air
go install github.com/cosmtrek/air@latest

# Run with hot reload
air
```

### Run tests
```bash
go test ./...
```

## Production Deployment

1. Build the application:
```bash
go build -o server main.go
```

2. Set production environment variables
3. Run the binary:
```bash
./server
```

## Security Considerations

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Implement rate limiting
- Add input validation
- Enable MongoDB authentication
- Use environment-specific configurations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Bowen University Accounting Department
- Email: accounting@bowen.edu.ng
