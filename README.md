# 🚀 QuadZone E-Commerce Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/RedAvocado22/QuadZone/pulls)
[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.java.com)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-green.svg)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org)

**QuadZone** is a modern, full-stack e-commerce platform designed for technology products like smartphones, computers, and accessories. Built with a decoupled architecture featuring a Spring Boot REST API backend and a React TypeScript frontend, it provides a complete solution for online retail with comprehensive admin capabilities.

## 📖 Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#-key-features)
  - [Backend Features](#backend-features)
  - [Frontend Features](#frontend-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup-quadzone-api)
  - [Frontend Setup](#2-frontend-setup-quadzone-ui)
  - [Running the Application](#3-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

## About The Project

QuadZone is a comprehensive e-commerce solution that demonstrates modern full-stack development practices. The project consists of two main components:

- **Backend API** (`quadzone-api`): A robust Spring Boot REST API with JWT authentication, role-based access control, and comprehensive CRUD operations
- **Frontend Application** (`quadzone-ui`): A responsive React SPA built with TypeScript, featuring a modern admin dashboard and customer-facing storefront

The platform supports the complete e-commerce workflow from product catalog management to order processing, user management, and analytics.

## ✨ Key Features

### Backend Features

#### Authentication & Authorization
- 🔐 **JWT-based Authentication** with access and refresh tokens
- 👤 **User Registration** with email verification
- 🔑 **Password Reset** functionality via email
- 🛡️ **Role-Based Access Control** (USER, ADMIN, STAFF)
- 🔒 **Account Activation** and suspension handling
- 📧 **Email Service** integration for notifications

#### Product Management
- 📦 **Full CRUD Operations** for products
- 🔍 **Advanced Search** (by name, brand, description)
- 📄 **Pagination** for efficient data retrieval
- 🏷️ **Category Hierarchy** (categories and subcategories)
- ⭐ **Featured Products**, best sellers, and new arrivals
- 🖼️ **Image Management** with AWS S3 integration

#### Order Management
- 🛒 **Order Creation** and tracking
- 📊 **Order Status Management**
- 👨‍💼 **Admin Order Management** with search
- 📜 **Order History** for users

#### Additional Backend Features
- 👥 **User Management** with admin controls
- 📢 **Notification System** for users
- 📝 **Product Reviews** system
- 📧 **Contact Form** with email notifications
- 💱 **Exchange Rate API** integration
- 📚 **OpenAPI/Swagger Documentation**
- 🎯 **Global Exception Handling**
- ✅ **Comprehensive Validation**

### Frontend Features

#### User Interface
- 🎨 **Modern UI Design** with Material-UI and Ant Design
- 📱 **Fully Responsive** layout for all devices
- 🎭 **Theme Support** with light/dark mode
- 🎯 **Intuitive Navigation** with React Router

#### Customer Features
- 🏠 **Homepage** with featured products and categories
- 🔍 **Product Search** and filtering
- 📱 **Product Detail Pages** with reviews
- 🛒 **Shopping Cart** management
- 💳 **Checkout Process** with form validation
- 👤 **User Profile** management
- 📦 **Order Tracking** and history
- 📧 **Contact Form**

#### Admin Dashboard
- 📊 **Analytics Dashboard** with Chart.js and ApexCharts
- 📦 **Product Management** (CRUD operations)
- 🏷️ **Category Management** (CRUD operations)
- 👥 **User Management** (view, create, edit, delete users)
- 📦 **Order Management** (view, edit, track orders)
- 📝 **Blog/Post Management** with rich text editor (CKEditor 5)
- 📈 **Data Visualization** with interactive charts
- 🔔 **Notification Center**

#### Developer Experience
- ⚡ **Vite** for fast development and building
- 🔧 **TypeScript** for type safety
- 📝 **Form Handling** with Formik and Yup validation
- 🎨 **Styled Components** with Emotion
- 🔔 **Toast Notifications** with React-Toastify
- ⚠️ **Error Handling** with user-friendly messages
- 🔐 **Protected Routes** for authentication
- 📡 **Axios** for API communication

## 💻 Tech Stack

### Backend (`quadzone-api`)

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Spring Boot | 3.4.1 |
| **Language** | Java | 17+ |
| **Security** | Spring Security | 3.4.1 |
| **JWT** | JJWT | 0.12.6 |
| **ORM** | Spring Data JPA (Hibernate) | - |
| **Database** | MySQL | 8.0+ |
| **Validation** | Jakarta Bean Validation | - |
| **Documentation** | SpringDoc OpenAPI | 2.8.3 |
| **Build Tool** | Maven | 3.6+ |
| **Utilities** | Lombok | 1.18.34 |
| **Email** | Spring Mail | - |
| **Cloud Storage** | AWS S3 SDK | 2.30.36 |

### Frontend (`quadzone-ui`)

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | React | 18.2.0 |
| **Language** | TypeScript | 5.9.3 |
| **Build Tool** | Vite | 7.1.12 |
| **UI Libraries** | Material-UI (MUI) | 7.0.1 |
| **UI Libraries** | Ant Design | 5.28.0 |
| **Routing** | React Router | 7.9.5 |
| **Forms** | Formik | 2.4.9 |
| **Validation** | Yup | 1.7.1 |
| **HTTP Client** | Axios | 1.13.2 |
| **Charts** | ApexCharts | 4.5.0 |
| **Charts** | Chart.js | 4.5.1 |
| **Rich Text** | CKEditor 5 | 47.1.0 |
| **Notifications** | React-Toastify | 11.0.5 |
| **Alerts** | SweetAlert2 | 11.26.3 |
| **Styling** | Emotion | 11.14.0 |
| **Icons** | Iconify React | 5.2.1 |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│                    http://localhost:5173                     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Customer   │  │     Admin    │  │   Auth Flow  │     │
│  │   Storefront │  │  Dashboard   │  │   (JWT)      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                 │
│                      Axios (REST API)                        │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API (Spring Boot)                  │
│                    http://localhost:8080                     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Controllers │  │   Services   │  │ Repositories │     │
│  │  (REST)      │  │  (Business)  │  │   (JPA)      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                 │
│  ┌─────────────────────────┼─────────────────────────────┐ │
│  │  Security Layer (JWT Filter + Spring Security)       │ │
│  └─────────────────────────┼─────────────────────────────┘ │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (MySQL)                          │
│                  localhost:3306/quadzone                     │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

- **Decoupled Architecture**: Frontend and backend are completely independent
- **RESTful API**: Stateless API communication using JSON
- **JWT Authentication**: Token-based authentication for scalability
- **Role-Based Access Control**: Different permissions for different user roles
- **DTO Pattern**: Data Transfer Objects prevent exposing internal entities
- **Service Layer**: Business logic separated from controllers

## 🛠️ Getting Started

Follow these instructions to get a copy of the project running on your local machine for development and testing.

### Prerequisites

Ensure you have the following tools installed:

- **Git** - [Download Git](https://git-scm.com/)
- **Java Development Kit (JDK)** 17 or higher - [Download JDK 17](https://www.oracle.com/java/technologies/javase-downloads.html)
- **Apache Maven** 3.6+ - [Download Maven](https://maven.apache.org/download.cgi)
- **Node.js** 20 or higher - [Download Node.js](https://nodejs.org/)
- **Yarn** (Classic) or npm - [Download Yarn](https://classic.yarnpkg.com/en/docs/install)
- **MySQL Server** 8.0+ - [Download MySQL](https://dev.mysql.com/downloads/mysql/)
- **AWS Account** (optional, for S3 file storage)

### 1. Backend Setup (`quadzone-api`)

#### Step 1: Clone the Repository

```bash
git clone https://github.com/RedAvocado22/QuadZone.git
cd QuadZone
```

#### Step 2: Navigate to Backend Directory

```bash
cd quadzone-api
```

#### Step 3: Configure Database

1. Create a MySQL database:

```sql
CREATE DATABASE quadzone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Copy the environment example file:

```bash
cp env.example .env
```

3. Update environment variables in `.env` or `src/main/resources/application-dev.yml`:

```bash
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/quadzone
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# JWT Configuration (generate your own secrets)
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

#### Step 4: Build and Run the Backend

```bash
# Install dependencies and build
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend API will be available at:
- **API Base URL**: `http://localhost:8080`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Docs**: `http://localhost:8080/v3/api-docs`

### 2. Frontend Setup (`quadzone-ui`)

#### Step 1: Navigate to Frontend Directory

Open a new terminal window:

```bash
cd quadzone-ui
```

#### Step 2: Install Dependencies

Using Yarn (recommended):

```bash
yarn install
```

Or using npm:

```bash
npm install
```

#### Step 3: Configure API Base URL

The frontend is pre-configured to proxy API requests to `http://localhost:8080` via Vite proxy (see `vite.config.ts`). If your backend runs on a different port, update the proxy configuration.

#### Step 4: Run the Development Server

Using Yarn:

```bash
yarn dev
```

Or using npm:

```bash
npm run dev
```

The frontend will be available at:
- **Frontend URL**: `http://localhost:5173`

### 3. Running the Application

1. **Start the Backend** (Terminal 1):
   ```bash
   cd quadzone-api
   mvn spring-boot:run
   ```

2. **Start the Frontend** (Terminal 2):
   ```bash
   cd quadzone-ui
   yarn dev
   ```

3. **Access the Application**:
   - Open your browser and navigate to `http://localhost:5173`
   - The backend API is accessible at `http://localhost:8080`

## 📂 Project Structure

```
QuadZone/
├── .gitignore                      # Git ignore rules
├── README.md                       # This file
│
├── quadzone-api/                   # Backend Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/quadzone/
│   │   │   │   ├── admin/          # Admin controllers and DTOs
│   │   │   │   ├── auth/           # Authentication controller and service
│   │   │   │   ├── cart/           # Shopping cart entities
│   │   │   │   ├── config/         # Security, JWT, application config
│   │   │   │   ├── contact/        # Contact form handling
│   │   │   │   ├── exception/      # Global exception handler
│   │   │   │   ├── global/         # Public endpoints, exchange rate
│   │   │   │   ├── notification/   # Notification management
│   │   │   │   ├── order/          # Order management
│   │   │   │   ├── product/        # Product management
│   │   │   │   ├── review/         # Product reviews
│   │   │   │   ├── user/           # User management
│   │   │   │   └── utils/          # Utilities (email, mapper)
│   │   │   └── resources/
│   │   │       ├── application.yml          # Main configuration
│   │   │       ├── application-dev.yml      # Development profile
│   │   │       ├── application-prod.yml     # Production profile
│   │   │       └── db/
│   │   │           └── insert.sql           # Sample data
│   │   └── test/                   # Test files
│   ├── pom.xml                     # Maven dependencies
│   ├── env.example                 # Environment variables template
│   └── README.md                   # Backend-specific documentation
│
└── quadzone-ui/                    # Frontend React Application
    ├── public/                     # Static assets
    │   └── assets/                 # Images, icons, etc.
    ├── src/
    │   ├── api/                    # API client functions
    │   │   ├── auth.ts
    │   │   ├── base.ts
    │   │   ├── products.ts
    │   │   ├── categories.ts
    │   │   ├── orders.ts
    │   │   ├── users.ts
    │   │   └── ...
    │   ├── components/             # Reusable React components
    │   │   ├── cart/               # Cart components
    │   │   ├── layout/             # Layout components
    │   │   ├── shared/             # Shared components
    │   │   └── ...
    │   ├── contexts/               # React contexts
    │   │   ├── CartContext.tsx
    │   │   └── CurrencyContext.tsx
    │   ├── guards/                 # Route guards
    │   │   ├── GuestRoute.tsx
    │   │   └── ProtectedRoute.tsx
    │   ├── hooks/                  # Custom React hooks
    │   │   ├── useProducts.ts
    │   │   ├── useUser.tsx
    │   │   └── ...
    │   ├── layouts/                # Layout configurations
    │   │   ├── dashboard/          # Admin dashboard layout
    │   │   └── ...
    │   ├── pages/                  # Page components
    │   │   ├── admin/              # Admin pages
    │   │   │   ├── dashboard.tsx
    │   │   │   ├── products.tsx
    │   │   │   ├── orders.tsx
    │   │   │   └── ...
    │   │   ├── HomePage.tsx
    │   │   ├── LoginPage.tsx
    │   │   ├── ProductDetailPage.tsx
    │   │   └── ...
    │   ├── routing/                # Route configurations
    │   │   └── AdminRoutes.tsx
    │   ├── sections/               # Page sections
    │   │   ├── product/            # Product sections
    │   │   ├── order/              # Order sections
    │   │   └── ...
    │   ├── theme/                  # Theme configuration
    │   ├── types/                  # TypeScript types
    │   ├── utils/                  # Utility functions
    │   ├── App.tsx                 # Main app component
    │   └── main.tsx                # Application entry point
    ├── package.json                # Node.js dependencies
    ├── vite.config.ts              # Vite configuration
    ├── tsconfig.json               # TypeScript configuration
    └── README.md                   # Frontend-specific documentation
```

## 📚 API Documentation

The API documentation is automatically generated using SpringDoc OpenAPI. Once the backend is running:

- **Swagger UI**: `http://localhost:8080/swagger-ui.html` - Interactive API documentation
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs` - Machine-readable API spec
- **OpenAPI YAML**: `http://localhost:8080/v3/api-docs.yaml` - YAML format

### Main API Endpoints

All endpoints are prefixed with `/api/v1`:

- **Authentication**: `/api/v1/auth/*` - Login, register, password reset
- **Products**: `/api/v1/products/*` - Product CRUD operations
- **Categories**: `/api/v1/categories/*` - Category management
- **Orders**: `/api/v1/orders/*` - Order management
- **Users**: `/api/v1/users/*` - User management
- **Admin**: `/api/v1/admin/*` - Admin-only operations
- **Public**: `/api/v1/public/*` - Public endpoints (homepage, etc.)
- **Notifications**: `/api/v1/notifications/*` - User notifications

For detailed API documentation, see the [Backend README](quadzone-api/README.md).

## 🚀 Usage Guide

### For Customers

1. **Browse Products**: Navigate through the homepage to see featured products
2. **Search & Filter**: Use the search bar and category filters to find products
3. **View Product Details**: Click on any product to see detailed information
4. **Add to Cart**: Add products to your shopping cart
5. **Checkout**: Proceed to checkout and complete your order
6. **Track Orders**: View your order history and track order status

### For Administrators

1. **Login**: Access the admin dashboard at `/admin`
2. **Dashboard**: View analytics and overview statistics
3. **Manage Products**: Create, edit, and delete products
4. **Manage Categories**: Organize products into categories
5. **Manage Orders**: View and update order statuses
6. **Manage Users**: View and manage user accounts
7. **Blog Management**: Create and manage blog posts

## 🔧 Development

### Backend Development

```bash
# Run tests
mvn test

# Build JAR file
mvn clean package

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend Development

```bash
# Run development server with type checking
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Run linter
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn fm:fix

# Type checking in watch mode
yarn tsc:watch
```

### Code Quality

Both projects include:
- **ESLint** (Frontend) for JavaScript/TypeScript linting
- **Prettier** (Frontend) for code formatting
- **Java Code Style** (Backend) following Spring Boot conventions

## 🤝 Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add appropriate tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

## 📧 Support

For issues, questions, or contributions, please:

- Open an issue on [GitHub](https://github.com/RedAvocado22/QuadZone/issues)
- Contact the development team
- Review the documentation in individual component READMEs

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot) - Backend framework
- [React](https://reactjs.org/) - Frontend library
- [Material-UI](https://mui.com/) - UI component library
- [Ant Design](https://ant.design/) - Enterprise UI library
- All other open-source libraries and tools used in this project

---

**Built with ❤️ by the QuadZone Team**
