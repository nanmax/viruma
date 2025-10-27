# Article Hub - Fullstack Application

A modern fullstack web application for article management with real-time notifications.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Article Management**: Create, read, update, and delete articles
- **Real-time Notifications**: Live updates when new articles are posted
- **Responsive Design**: Mobile-friendly interface with Material-UI
- **Admin Panel**: User management for administrators
- **API Documentation**: Interactive Swagger documentation

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for components
- **React Router** for navigation
- **Socket.IO Client** for real-time features
- **Axios** for HTTP requests

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **Swagger** for API documentation

## 📁 Project Structure

```
viruma/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API and socket services
│   │   └── types/          # TypeScript type definitions
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── config/         # Configuration files
│   ├── database.sql        # Database schema
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd viruma
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your database credentials

# Setup database
psql -U username -h localhost -f database.sql

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
# Open new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Documentation**: http://localhost:5001/api-docs

## 🔐 Default Users

After running the database setup, you can create users through the registration form or use these test accounts:

**Admin User:**
- Username: admin
- Email: admin@example.com
- Role: admin

**Regular User:**
- Username: user
- Email: user@example.com
- Role: user

## 📖 API Documentation

The backend includes comprehensive API documentation built with Swagger. Visit `http://localhost:5001/api-docs` when the server is running to explore all available endpoints.

### Main Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/articles` - Get all articles
- `POST /api/articles` - Create new article
- `GET /api/users` - Get all users (admin only)

## ⚡ Real-time Features

The application uses Socket.IO for real-time notifications:

- **New Article Notifications**: Users receive instant notifications when new articles are published
- **Live Updates**: Article lists refresh automatically
- **Connection Management**: Handles user connections and disconnections gracefully

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes
- **Material Design**: Clean and modern interface
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for admin and regular users
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured cross-origin resource sharing
- **Helmet.js**: Security headers
- **Password Hashing**: bcrypt for secure password storage

## 🚀 Deployment

### Frontend Deployment
```bash
cd client
npm run build
# Deploy the build/ directory to your hosting service
```

### Backend Deployment
```bash
cd server
npm run build
# Deploy to your server with PM2 or similar process manager
```

### Environment Variables

**Backend (.env):**
```env
PORT=5001
DATABASE_URL=postgresql://username:password@localhost:5432/database
JWT_SECRET=your-secret-key
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add comments for complex logic
- Write tests for new features
- Update documentation when needed

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in .env
   - Verify database exists

2. **Port Already in Use**
   - Change PORT in server .env
   - Kill existing processes on ports 3000/5001

3. **Socket Connection Issues**
   - Check CORS settings
   - Verify frontend/backend URLs match

## 📞 Support

For questions and support:
- Create an issue in this repository
- Check the API documentation at `/api-docs`
- Review the individual README files in `/client` and `/server`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- Socket.IO team for real-time capabilities
- PostgreSQL community for the robust database
- React team for the amazing frontend framework