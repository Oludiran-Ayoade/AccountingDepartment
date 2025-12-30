# Bowen University Accounting Department Portal - Frontend

A modern, responsive web application built with Next.js 14, TypeScript, and TailwindCSS for the Accounting Department at Bowen University.

## Features

- 🌙 **Dark Mode by Default** - Modern dark theme with light mode toggle
- 📚 **Notes Library** - Browse, search, and download course materials
- 🗳️ **Democratic Elections** - Secure voting system for class representatives
- 👤 **User Profiles** - Track downloads and voting history
- 📱 **Mobile-First Design** - Fully responsive across all devices
- ✨ **Smooth Animations** - Engaging user experience with Framer Motion
- 🔐 **Secure Authentication** - University email and matric number verification

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod
- **Icons:** Lucide React
- **HTTP Client:** Axios

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8080`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── src/
│   ├── app/                  # Next.js app router pages
│   │   ├── auth/            # Authentication pages
│   │   ├── notes/           # Notes library
│   │   ├── vote/            # Voting system
│   │   ├── profile/         # User profile
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/          # Reusable components
│   │   ├── ui/              # UI components
│   │   └── layout/          # Layout components
│   ├── lib/                 # Utilities and API
│   └── store/               # Zustand stores
├── public/                  # Static assets
└── tailwind.config.ts       # Tailwind configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Key Features

### Landing Page
- Animated hero section with gradient backgrounds
- Feature showcase with icons
- Statistics display
- Call-to-action sections

### Authentication
- University email validation (@bowen.edu.ng)
- Matric number format validation (ACC/20/1234)
- Secure token-based authentication
- Persistent login state

### Notes Library
- Advanced search functionality
- Filter by course, semester, and lecturer
- Sort by newest, most downloaded, or title
- Preview and download options
- Download tracking

### Voting System
- View active elections
- Read candidate manifestos
- One-click voting with confirmation
- Vote tracking and history
- Real-time election status

### User Profile
- Personal information display
- Download history
- Voting history
- Activity statistics

## Customization

### Theme Colors
Edit `src/app/globals.css` to customize the color scheme:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... other colors */
}
```

### Animations
Customize animations in `tailwind.config.ts`:

```typescript
animation: {
  'fade-in': 'fadeIn 0.5s ease-in-out',
  'slide-up': 'slideUp 0.6s ease-out',
  // ... other animations
}
```

## API Integration

The frontend expects the following API endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/notes` - Fetch notes
- `POST /api/notes/:id/download` - Download note
- `GET /api/elections` - Fetch elections
- `POST /api/elections/:id/vote` - Submit vote
- `GET /api/profile` - Fetch user profile

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Bowen University Accounting Department
- Email: accounting@bowen.edu.ng
- Website: https://bowen.edu.ng
