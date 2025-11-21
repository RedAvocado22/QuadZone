# QuadZone API

A comprehensive Spring Boot REST API for the QuadZone e-commerce platform. This API provides full CRUD operations for products, categories, orders, users, and more, with JWT-based authentication and role-based access control.

## Features

- **Authentication & Authorization**
  - JWT-based authentication with access and refresh tokens
  - User registration with email verification
  - Password reset functionality via email
  - Role-based access control (USER, ADMIN, STAFF)
  - Account activation and suspension handling

- **Product Management**
  - Full CRUD operations for products
  - Pagination and advanced search (by name, brand, description)
  - Product categories and subcategories
  - Featured products, best sellers, and new arrivals
  - Admin and public endpoints

- **Order Management**
  - Order creation and tracking
  - Order status management
  - Admin order management with search
  - Order history for users

- **User Management**
  - User profile management
  - Admin user management (CRUD operations)
  - User search and pagination
  - Current user context endpoint

- **Category Management**
  - Category CRUD operations
  - Category hierarchy (categories and subcategories)
  - Admin category management

- **Notifications**
  - User-specific notifications
  - Read/unread status management
  - Bulk operations (mark all as read)
  - Unread count tracking

- **Additional Features**
  - Contact form with email notifications
  - Product reviews
  - Exchange rate API
  - Email service integration
  - AWS S3 integration for file uploads
  - OpenAPI/Swagger documentation
  - Global exception handling
  - Comprehensive validation

## Technologies Used

- **Framework**: Spring Boot 3.4.1
- **Language**: Java 17
- **Security**: Spring Security with JWT (JJWT 0.12.6)
- **Database**: MySQL (with H2 for testing)
- **ORM**: Spring Data JPA (Hibernate)
- **Validation**: Jakarta Bean Validation
- **Documentation**: SpringDoc OpenAPI 2.8.3
- **Build Tool**: Maven
- **Utilities**: Lombok
- **Email**: Spring Mail
- **Cloud Storage**: AWS S3 SDK
- **Logging**: SLF4J with Logback

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ (for production)
- AWS Account (optional, for S3 file storage)

## Configuration

### Environment Variables

Create a `.env` file or set the following environment variables:

```bash
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/quadzone
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_base64_encoded
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_base64_encoded

# Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Frontend Configuration
FRONTEND_BASE_URL=http://localhost:5173

# AWS S3 Configuration (Optional)
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_BUCKET_NAME=quadzone-uploads
```

See `env.example` for reference.

### Application Profiles

- **Development** (`application-dev.yml`): Uses MySQL with sample data initialization
- **Production** (`application-prod.yml`): Production-ready configuration with connection pooling

## Running the Application

1. **Clone the repository** (if not already done)

2. **Navigate to the API directory**:
   ```bash
   cd quadzone-api
   ```

3. **Configure your database**:
   - Create a MySQL database named `quadzone`
   - Update `application-dev.yml` with your database credentials

4. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

   Or build and run:
   ```bash
   mvn clean package
   java -jar target/quadzone-api-0.0.1-SNAPSHOT.jar
   ```

5. **Access the API**:
   - API Base URL: `http://localhost:8080`
   - Swagger UI: `http://localhost:8080/swagger-ui.html`
   - API Docs: `http://localhost:8080/v3/api-docs`

## API Endpoints

All endpoints are versioned with `/api/v1` prefix.

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/authenticate` | Login and get JWT tokens | No |
| POST | `/refresh` | Refresh access token | No |
| POST | `/activate` | Activate user account | No |
| POST | `/forgot-password` | Request password reset | No |
| POST | `/reset-password` | Reset password with token | No |
| POST | `/logout` | Logout (invalidates token) | Yes |

### Products (`/api/v1/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get paginated products (with search) | No |
| GET | `/{id}` | Get product by ID | No |
| POST | `/` | Create new product | Yes |
| PUT | `/{id}` | Update product | Yes |
| DELETE | `/{id}` | Delete product | Yes |

**Query Parameters** (for GET `/`):
- `page` (default: 0): Page number (0-indexed)
- `size` (default: 10): Items per page
- `search`: Search query (name, brand, description)

### Categories (`/api/v1/categories`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin` | Get all categories (paginated) | Yes (Admin) |
| GET | `/admin/{id}` | Get category by ID (admin) | Yes (Admin) |
| GET | `/{id}` | Get category by ID | No |
| POST | `/admin` | Create category | Yes (Admin) |
| PUT | `/{id}` | Update category | Yes |
| DELETE | `/{id}` | Delete category | Yes |

### Admin (`/api/v1/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products (admin view) | Yes (Admin/Staff) |
| GET | `/products/{id}` | Get product by ID (admin view) | Yes (Admin/Staff) |
| POST | `/products` | Create product | Yes (Admin/Staff) |
| PUT | `/products/{id}` | Update product | Yes (Admin/Staff) |
| DELETE | `/products/{id}` | Delete product | Yes (Admin/Staff) |
| GET | `/categories` | Get all categories (admin view) | Yes (Admin/Staff) |
| GET | `/categories/{id}` | Get category by ID (admin view) | Yes (Admin/Staff) |
| POST | `/categories` | Create category | Yes (Admin/Staff) |
| PUT | `/categories/{id}` | Update category | Yes (Admin/Staff) |
| DELETE | `/categories/{id}` | Delete category | Yes (Admin/Staff) |

### Users (`/api/v1/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin` | Get all users (paginated) | Yes (Admin) |
| GET | `/admin/{id}` | Get user by ID (admin) | Yes (Admin) |
| GET | `/{id}` | Get user by ID | Yes |
| GET | `/me` | Get current authenticated user | Yes |
| POST | `/admin` | Create user (admin) | Yes (Admin) |
| PUT | `/{id}` | Update user | Yes |
| DELETE | `/{id}` | Delete user | Yes |

### Orders (`/api/v1/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin` | Get all orders (paginated) | Yes (Admin) |
| GET | `/admin/{id}` | Get order by ID (admin) | Yes (Admin) |
| GET | `/{id}` | Get order by ID | Yes |
| POST | `/admin` | Create order (admin) | Yes (Admin) |
| PUT | `/{id}` | Update order | Yes |
| DELETE | `/{id}` | Delete order | Yes |

### Notifications (`/api/v1/notifications`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all notifications (paginated or all) | Yes |
| GET | `/unread-count` | Get unread notification count | Yes |
| POST | `/` | Create notification | Yes |
| PUT | `/{id}/read` | Mark notification as read | Yes |
| PUT | `/read-all` | Mark all notifications as read | Yes |
| DELETE | `/{id}` | Delete notification | Yes |

### Public (`/api/v1/public`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get home page data (categories, featured, best sellers, new arrivals) | No |
| GET | `/products` | Get paginated products | No |
| GET | `/products/{id}` | Get product details | No |
| GET | `/rate` | Get USD to VND exchange rate | No |
| POST | `/send` | Submit contact form | No |

### Reviews (`/api/v1/reviews`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create product review | Yes |

## Security

### Authentication Flow

1. **Registration**: User registers → receives activation token via email
2. **Activation**: User activates account using token
3. **Login**: User authenticates → receives JWT access token and refresh token
4. **API Calls**: Include `Authorization: Bearer <access_token>` header
5. **Token Refresh**: Use refresh token to get new access token when expired

### JWT Token Configuration

- **Access Token**: Expires in 5 minutes (300,000 ms)
- **Refresh Token**: Expires in 1 day (86,400,000 ms)
- **Token Storage**: Stored in database for logout/invalidation support

### Role-Based Access Control

- **USER**: Regular user, can manage own profile and orders
- **ADMIN**: Full system access, can manage all resources
- **STAFF**: Similar to ADMIN, can manage products and categories

### CORS Configuration

CORS is configured for the frontend URL (default: `http://localhost:5173`). Multiple origins are supported via comma-separated list.

## Database

### Development

- Database: MySQL
- Initialization: Sample data loaded from `src/main/resources/db/insert.sql`
- DDL Mode: `create-drop` (schema recreated on startup)

### Production

- Database: MySQL with connection pooling (HikariCP)
- DDL Mode: `validate` (no schema changes)
- Connection pool: Min 5, Max 10 connections

## File Upload

The application supports file uploads via AWS S3:

- Max file size: 50MB (configurable)
- Supported types: Images (for products, categories, etc.)
- Upload endpoint: `/api/upload/image` (to be implemented or handled by S3)

## Email Service

Email service is configured for:

- Account activation emails
- Password reset emails
- Contact form notifications
- Order confirmations

Configure SMTP settings in `application.yml` or environment variables.

## Testing

Run tests with:

```bash
mvn test
```

Test coverage includes:
- Controller layer tests
- Service layer tests
- Security configuration tests

## API Documentation

Interactive API documentation is available via Swagger UI:

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`
- **OpenAPI YAML**: `http://localhost:8080/v3/api-docs.yaml`

## Project Structure

```
quadzone-api/
├── src/
│   ├── main/
│   │   ├── java/com/quadzone/
│   │   │   ├── admin/          # Admin controller and DTOs
│   │   │   ├── auth/           # Authentication controller and service
│   │   │   ├── cart/           # Shopping cart entities
│   │   │   ├── config/         # Security, JWT, application config
│   │   │   ├── contact/        # Contact form handling
│   │   │   ├── exception/      # Global exception handler and custom exceptions
│   │   │   ├── global/         # Public endpoints, exchange rate
│   │   │   ├── notification/   # Notification management
│   │   │   ├── order/          # Order management
│   │   │   ├── product/        # Product management
│   │   │   ├── review/         # Product reviews
│   │   │   ├── user/           # User management
│   │   │   └── utils/          # Utilities (email, entity mapper)
│   │   └── resources/
│   │       ├── application.yml          # Main configuration
│   │       ├── application-dev.yml      # Development profile
│   │       ├── application-prod.yml     # Production profile
│   │       └── db/
│   │           └── insert.sql           # Sample data
│   └── test/                   # Test files
├── pom.xml                     # Maven dependencies
└── README.md                   # This file
```

## Error Handling

The API uses a global exception handler (`GlobalExceptionHandler`) that provides consistent error responses:

- **400 Bad Request**: Validation errors, invalid input
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate entries, constraint violations
- **500 Internal Server Error**: Server errors

## Logging

Logging is configured with different levels:

- **Root**: WARN (production) / INFO (development)
- **Application packages**: INFO
- **Hibernate SQL**: DEBUG (development only)

## Best Practices

- DTO-based architecture (entities never exposed directly)
- Constructor injection (no field injection)
- Comprehensive validation using Jakarta Bean Validation
- Defensive null handling in mappers
- Stateless authentication (JWT)
- CORS enabled for frontend integration
- OpenAPI documentation for all endpoints

## Contributing

1. Follow the existing code style
2. Add appropriate tests for new features
3. Update API documentation
4. Ensure all tests pass
5. Update this README if adding new features

## License

[Add your license information here]

## Support

For issues and questions, please contact the development team or create an issue in the repository.
