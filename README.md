# 🚀 QuadZone E-Commerce

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/RedAvocado22/QuadZone/pulls)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/RedAvocado22/QuadZone)
[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.java.com)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![Spring](https://img.shields.io/badge/Spring%20Boot-3.x-green.svg)](https://spring.io/projects/spring-boot)

**QuadZone** is a feature-rich, full-stack e-commerce platform built as a group project. It's designed to simulate a modern online store for technology products like smartphones, computers, and accessories.

This project demonstrates a decoupled architecture, with a robust **Spring Boot** backend API (`quadzone-api`) and a dynamic **React (Vite)** frontend (`quadzone-ui`).

## 📖 Table of Contents

-   [About The Project](#about-the-project)
-   [Key Features](#✨-key-features)
-   [Tech Stack](#💻-tech-stack)
-   [Project Structure](#📂-project-structure)
-   [Getting Started](#🛠️-getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Backend Setup (quadzone-api)](#1-backend-setup-quadzone-api)
    -   [Frontend Setup (quadzone-ui)](#2-frontend-setup-quadzone-ui)
-   [Usage](#🚀-usage)
-   [Contributing](#🤝-contributing)
-   [License](#📄-license)

## About The Project

QuadZone was developed to apply full-stack development principles to a real-world application. It handles core e-commerce functionalities, from user authentication and product cataloging to cart management and admin dashboards.

The backend is powered by Spring Boot, utilizing Spring Security for authentication and Spring Data JPA for database operations. The frontend is a responsive Single Page Application (SPA) built with React and TypeScript, leveraging modern UI libraries like MUI and Ant Design for a high-quality user experience.

## ✨ Key Features

-   **User Authentication:** Secure user Registration and Login with JWT (Spring Security).
-   **Role-Based Access:** Distinct roles for "User" and "Admin" with different permissions.
-   **Product Catalog:** Dynamic fetching, filtering, and searching for tech products.
-   **Shopping Cart:** Full cart functionality (add, update, remove items).
-   **Admin Dashboard:**
    -   Complete CRUD (Create, Read, Update, Delete) operations for products.
    -   Data visualization with **Chart.js** and **ApexCharts**.
    -   Rich text product descriptions using **CKEditor 5**.
-   **Form Handling:** Robust client-side and server-side validation using **Formik** and **Yup**.
-   **File Uploads:** Seamless image and media uploads managed via **Firebase Storage**.
-   **Notifications:** User-friendly alerts and notifications using **SweetAlert2** and **React-Toastify**.
-   **Responsive Design:** Fully responsive layout for all device sizes.

## 💻 Tech Stack

This project is built with a modern, decoupled tech stack:

| Category           | Technology                                                                |
| :----------------- | :------------------------------------------------------------------------ |
| **Backend**        | Java, **Spring Boot**, **Spring Security**, JPA (Hibernate)               |
| **Frontend**       | **React (Vite)**, **TypeScript**                                          |
| **UI Libraries**   | **MUI (Material-UI)**, **Ant Design (antd)**, Bootstrap, CSS              |
| **Core Libraries** | **React Router** (Routing), **Axios** (API Calls), **Formik/Yup** (Forms) |
| **Database**       | **MySQL**                                                                 |
| **File Storage**   | **Firebase Cloud Storage**                                                |
| **Build Tools**    | **Maven** (Backend), **Yarn** / **npm** (Frontend)                        |
| **Utilities**      | Git, GitHub, Postman, CKEditor 5, Chart.js, SweetAlert2                   |

## 📂 Project Structure

The repository is organized into two main parts:

```
RedAvocado22/QuadZone/
├── .github/              # Contains GitHub rules and CODEOWNERS
├── quadzone-api/         # Spring Boot Backend Application
│   ├── src/
│   └── pom.xml
└── quadzone-ui/          # React (Vite) Frontend Application
    ├── src/
    ├── package.json
    └── yarn.lock
```

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

Ensure you have the following tools installed on your system:

-   [Git](https://git-scm.com/)
-   [JDK 17](https://www.oracle.com/java/technologies/javase-downloads.html) or newer
-   [Apache Maven](https://maven.apache.org/download.cgi)
-   [Node.js v20](https://nodejs.org/) or newer
-   [Yarn (Classic)](https://classic.yarnpkg.com/en/docs/install) (or `npm`)
-   [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### 1. Backend Setup (quadzone-api)

1.  **Clone the repository:**

    ```sh
    git clone [https://github.com/RedAvocado22/QuadZone.git](https://github.com/RedAvocado22/QuadZone.git)
    cd QuadZone
    ```

2.  **Navigate to the API directory:**

    ```sh
    cd quadzone-api
    ```

3.  **Configure Database:**

    -   Create a new database schema in MySQL (e.g., `quadzone_db`).
    -   Open `src/main/resources/application.properties`.
    -   Update `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password` to match your MySQL configuration.

4.  **Configure Firebase:**

    -   Obtain your Firebase `serviceAccountKey.json` file.
    -   Place it in the `src/main/resources/` directory.
    -   (Update the file path in the Java code if necessary).

5.  **Build and Run the Backend:**
    ```sh
    mvn install
    mvn spring-boot:run
    ```
    The backend server will start on `http://localhost:8080`.

### 2. Frontend Setup (quadzone-ui)

1.  **Open a new terminal window.**

2.  **Navigate to the UI directory:**

    ```sh
    cd QuadZone/quadzone-ui
    ```

3.  **Install dependencies:**
    (Recommended, based on `package.json`):

    ```sh
    yarn install
    ```

    _(Alternatively, using npm):_

    ```sh
    npm install
    ```

4.  **Run the Frontend Development Server:**
    ```sh
    yarn dev
    ```
    _(Alternatively, using npm):_
    ```sh
    npm run dev
    ```
    The frontend development server will start on `http://localhost:5173` (or the port shown in your terminal).

## 🚀 Usage

Once both servers are running:

1.  Access the application in your browser at `http://localhost:5173`.
2.  Register a new user account or log in with an existing one.
3.  Browse products, add items to your cart, and explore the admin dashboard.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.
