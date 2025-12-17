# Meeting Room Booking System

A modern, full-stack web application for managing and booking meeting rooms. Built with Next.js, Express.js, and PostgreSQL.

**Created by:** cooolbite

## 🚀 Features

### Core Functionality
- **Room Management (CRUD)**: Create, view, edit, and delete meeting rooms
- **Room Booking**: Book meeting rooms for specific date/time slots
- **Availability Check**: Check room availability to prevent double bookings
- **Booking Cancellation**: Cancel existing bookings
- **User Authentication**: Login and registration system (optional)

### Technical Features
- **Modern UI/UX**: Clean, minimalist design inspired by modern design systems
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Validation**: Prevents booking conflicts and validates input
- **Mock Data Support**: Works without database connection for development

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **API**: RESTful API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher) - Optional for development (mock data available)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd conference-room-reservation
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/meeting_room_db?schema=public"

# Server
PORT=8080
NODE_ENV=development
```

2. **Optional**: If you don't have a database set up, the application will use mock data automatically.

### Frontend Configuration

1. Create a `.env.local` file in the `frontend/` directory:

```env
# Frontend Port
NEXT_PUBLIC_PORT=3000

# Backend API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# API Endpoints
NEXT_PUBLIC_API_HEALTH_CHECK=/api/health
```

## 🗄️ Database Setup

### Option 1: Using PostgreSQL (Recommended for Production)

1. Create a PostgreSQL database:

```bash
createdb meeting_room_db
```

2. Update the `DATABASE_URL` in `backend/.env`

3. Run Prisma migrations:

```bash
cd backend
npx prisma migrate dev --name init
```

4. Generate Prisma Client:

```bash
npx prisma generate
```

### Option 2: Development without Database

The application will automatically use mock data if no database connection is available. No setup required!

## 🚀 Running the Application

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:8080`

#### Start Frontend Server

```bash
cd frontend
npm run dev
```

The frontend application will start on `http://localhost:3000`

### Production Mode

#### Build Frontend

```bash
cd frontend
npm run build
npm start
```

#### Start Backend

```bash
cd backend
npm start
```

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Check API health status

### Rooms
- `GET /api/v1/rooms` - Get all rooms
- `GET /api/v1/rooms/:id` - Get room by ID
- `POST /api/v1/rooms` - Create a new room
- `PUT /api/v1/rooms/:id` - Update a room
- `DELETE /api/v1/rooms/:id` - Delete a room

### Bookings
- `GET /api/v1/bookings` - Get all bookings
- `GET /api/v1/bookings/:id` - Get booking by ID
- `POST /api/v1/bookings` - Create a new booking
- `PUT /api/v1/bookings/:id/cancel` - Cancel a booking

### Availability
- `POST /api/availability/check` - Check room availability
- `POST /api/availability/rooms` - Get available rooms for time slot

### Authentication (Optional)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

## 📁 Project Structure

```
conference-room-reservation/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   │   ├── bookingController.js
│   │   │   └── roomController.js
│   │   ├── routes/          # API routes
│   │   │   ├── bookingRoutes.js
│   │   │   └── roomRoutes.js
│   │   └── lib/            # Utilities
│   │       └── prisma.js   # Prisma client
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── index.js            # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   │   ├── page.tsx    # Home page
│   │   │   ├── rooms/      # Room management pages
│   │   │   ├── booking/    # Booking page
│   │   │   ├── bookings/   # Bookings list page
│   │   │   └── availability/ # Availability check page
│   │   ├── components/     # React components
│   │   │   ├── Layout.tsx
│   │   │   └── RoomList.tsx
│   │   └── lib/            # Utilities
│   │       └── api.js      # API client functions
│   ├── package.json
│   └── tailwind.config.ts
│
└── README.md
```

## 🎨 UI/UX Design

The application features a clean, minimalist design inspired by modern design systems:

- **Typography-focused**: Large, readable fonts with proper hierarchy
- **Generous spacing**: Clean layouts with ample white space
- **Subtle interactions**: Smooth transitions and hover effects
- **Consistent styling**: Unified design language across all pages

## 🔍 Key Features Explained

### Room Management
- View all available meeting rooms
- Create new rooms with capacity and equipment details
- Edit existing room information
- Delete rooms (with cascade deletion of related bookings)

### Booking System
- Select a room and time slot
- Check availability before booking
- Automatic conflict detection
- View all your bookings
- Cancel bookings when needed

### Availability Check
- Check if a specific room is available
- Find all available rooms for a time slot
- Real-time validation

## 🧪 Development

### Backend Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
```

### Frontend Scripts

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run ESLint
```

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `DATABASE_URL` not found error
- **Solution**: Create `.env` file in `backend/` directory or use mock data mode

**Problem**: Prisma client errors
- **Solution**: Run `npx prisma generate` in the backend directory

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Ensure backend server is running on port 8080 and check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`

**Problem**: Styling not working
- **Solution**: Ensure Tailwind CSS is properly configured and run `npm install` in frontend directory

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=8080
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_PORT=3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_API_HEALTH_CHECK=/api/health
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**cooolbite**

## 🙏 Acknowledgments

- Design inspiration from modern design systems
- Built with Next.js and Express.js
- Powered by Prisma and PostgreSQL

## 📞 Support

For support, please open an issue in the repository or contact the maintainer.

---

**Note**: This application supports mock data mode for development without a database connection. Simply start the servers without configuring a database, and the application will automatically use mock data.

