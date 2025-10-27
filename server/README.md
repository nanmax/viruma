# Article Hub - Server

A Node.js/Express backend server with PostgreSQL database for the Article Hub application.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Article Management**: CRUD operations for articles
- **User Management**: Admin panel for user management
- **Real-time Notifications**: Socket.IO integration for live updates
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: Helmet.js, CORS, and input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet.js, CORS
- **Development**: TypeScript, Nodemon

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd viruma/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the server root:
   ```env
   PORT=5001
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb your_database_name
   
   # Run the database schema (database.sql)
   psql -d your_database_name -f database.sql
   ```

## Scripts

```bash
# Development with auto-reload
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Articles
- `GET /api/articles` - Get all articles
- `POST /api/articles` - Create new article (authenticated)
- `PUT /api/articles/:id` - Update article (authenticated)
- `DELETE /api/articles/:id` - Delete article (admin only)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `DELETE /api/users/:id` - Delete user

## API Documentation

Visit `http://localhost:5001/api-docs` when server is running to view the interactive Swagger documentation.

## Database Schema

### Users Table
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE)
- email (VARCHAR UNIQUE)
- password (VARCHAR)
- role (VARCHAR DEFAULT 'user')
- created_at (TIMESTAMP)
```

### Articles Table
```sql
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- content (TEXT)
- author_id (INTEGER REFERENCES users(id))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Authentication

The server uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **user**: Can create, read, and update own articles
- **admin**: Full access including user management and article deletion

## Real-time Features

Socket.IO is implemented for real-time notifications:

- **article-notification**: Broadcast when new articles are created
- **user-connected**: Track user connections
- **Connection events**: Handle connect/disconnect

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-Origin Resource Sharing
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Request validation middleware

## Development

### Project Structure
```
server/
├── src/
│   ├── app.ts              # Main application file
│   ├── config/
│   │   └── database.ts     # Database configuration
│   ├── controllers/        # Route controllers
│   │   ├── authController.ts
│   │   └── articleController.ts
│   ├── middleware/         # Custom middleware
│   │   └── auth.ts         # Authentication middleware
│   ├── models/            # Database models
│   │   ├── User.ts
│   │   └── Article.ts
│   ├── routes/            # API routes
│   │   ├── auth.ts
│   │   ├── article.ts
│   │   └── users.ts
│   └── types/             # TypeScript type definitions
│       └── index.ts
├── database.sql           # Database schema
├── package.json
├── tsconfig.json
└── .env.example
```

### Adding New Features

1. **New Route**: Add to appropriate route file in `src/routes/`
2. **New Controller**: Create in `src/controllers/`
3. **New Model**: Add to `src/models/`
4. **Database Changes**: Update `database.sql`

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure PostgreSQL for production
- [ ] Set up proper logging
- [ ] Configure reverse proxy (nginx)
- [ ] Set up SSL/TLS certificates

### Environment Variables

```env
PORT=5001                           # Server port
DATABASE_URL=postgresql://...       # PostgreSQL connection string
JWT_SECRET=your-secret-key          # JWT signing secret
NODE_ENV=production                 # Environment mode
```

## Monitoring

- Server logs are output to console
- API requests logged via Morgan middleware
- Socket.IO connection events tracked

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process on port

3. **JWT Authentication Fails**
   - Check JWT_SECRET configuration
   - Verify token format in requests

4. **Socket.IO Connection Issues**
   - Check CORS configuration
   - Verify client/server ports match

## Contributing

1. Follow TypeScript best practices
2. Add Swagger documentation for new endpoints
3. Include proper error handling
4. Write descriptive commit messages

## License

[Your License Here]

## Support

For issues and questions, please create an issue in the repository or contact the development team.