# DealWise Backend API

A production-ready Node.js/Express backend with comprehensive authentication system.

## Features

- **Secure Authentication**: JWT access tokens + refresh token rotation
- **Password Security**: bcrypt hashing with strong validation requirements
- **Email Verification**: Secure token-based email verification
- **Password Reset**: Secure password reset with expiring tokens
- **Rate Limiting**: Brute-force protection on auth endpoints
- **Security Headers**: Helmet.js for security headers
- **Input Validation**: Joi schema validation
- **Database**: PostgreSQL with proper indexing

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Setup PostgreSQL database:**
   - Create a PostgreSQL database
   - Update DATABASE_URL in .env

4. **Run migrations:**
   ```bash
   npm run migrate
   ```

5. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

Required environment variables (see .env.example):

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for signing access tokens
- `JWT_REFRESH_SECRET`: Secret for refresh tokens
- `PORT`: Server port (default: 5000)
- `FRONTEND_URL`: Frontend URL for CORS and email links

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/request-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify` - Verify email address

### User

- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)

## Authentication Flow

1. **Registration:**
   - User registers with email/password
   - Email verification token sent
   - User verifies email via token

2. **Login:**
   - User provides email/password
   - Server returns access token (15 min) + refresh token cookie (30 days)
   - Access token used for protected routes

3. **Token Refresh:**
   - When access token expires, frontend calls /refresh
   - Server rotates refresh token and returns new access token

4. **Logout:**
   - Refresh token removed from database and cookie cleared

## Security Features

- Passwords hashed with bcrypt (cost: 12)
- All tokens stored as SHA-256 hashes in database
- Rate limiting on authentication endpoints
- HttpOnly cookies for refresh tokens
- CORS configured for frontend domain
- Security headers via Helmet.js
- SQL injection prevention via parameterized queries

## Password Requirements

- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one digit
- At least one special character (!@#$%^&*)

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (TEXT, Unique)
- `password_hash` (TEXT)
- `full_name` (TEXT)
- `email_verified` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

### Refresh Tokens Table
- `id` (SERIAL, Primary Key)
- `user_id` (UUID, Foreign Key)
- `token_hash` (TEXT)
- `expires_at` (TIMESTAMP)

### Tokens Table
- `id` (SERIAL, Primary Key)
- `user_id` (UUID, Foreign Key)
- `token_hash` (TEXT)
- `type` (TEXT) - 'email_verification' or 'password_reset'
- `expires_at` (TIMESTAMP)
- `used` (BOOLEAN)

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
3. Configure proper `DATABASE_URL` for production DB
4. Set up SSL/TLS certificates
5. Configure reverse proxy (nginx) if needed
6. Set up proper logging and monitoring
7. Replace mock email service with real email provider

## Development Notes

- Email service is currently mocked (logs to console)
- Replace `utils/emailService.js` with real email service for production
- Frontend API examples are in `examples/frontend-api-calls.js`
- All sensitive data is properly secured and never logged