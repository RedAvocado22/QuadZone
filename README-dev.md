# QuadZone Development README

## Introduction
This document provides an overview of the QuadZone project structure and data flow to assist developers in maintaining and extending the application. It covers both frontend and backend architecture, highlighting key files, data flow patterns, and best practices for further development.

---

## Project Structure

### Frontend (`quadzone-ui/`)
- **src/components/**: React UI components organized by feature.
- **src/contexts/**: React Contexts for global state management (e.g., `CartContext.tsx` handles cart state).
- **src/api/**: API abstraction layer files managing communication with backend endpoints (e.g., `products.ts`, `cart.ts`).
- **src/hooks/**: Custom hooks providing reusable logic across components.
- **src/pages/**: React page components for routing.
- **src/assets/**: Static assets like images, icons, and stylesheets.
- Other configuration and types files (e.g., `types.ts`).

### Backend (`quadzone-api/`)
- **src/main/java/com/quadzone/**: Main Java package containing multiple modules:
  - **product/**: Product domain including `ProductController`, `ProductService`, and DTOs.
  - **cart/**: Cart domain with `CartController`, `CartService`, and DTOs.
  - **auth/**: Authentication components.
  - Additional domains include `order`, `user`, `notification`, `contact`, etc.
- **src/main/resources/**: Configuration files including environment-dependent YAML files.
- **pom.xml**: Maven configuration for dependencies and build.

---

## Frontend Data Flow

- Data requests use API abstraction files in `src/api/` to call backend REST endpoints. These functions handle parameters, call APIs using a base HTTP client, and return typed data.
- Application state related to complex or shared data (e.g., shopping cart) uses React Context (`src/contexts/CartContext.tsx`), which internally calls API functions to synchronize cart state with backend.
- Components consume context and hooks to render UI and update data.
- For example, `CartContext` manages cart items, total price, loading states, and provides methods like `addToCart`, `removeFromCart`, which make corresponding API calls.

---

## Backend Data Flow

- REST Controllers (e.g., `ProductController`, `CartController`) handle HTTP requests, map endpoints, and delegate business logic to services (e.g., `ProductService`).
- Controllers support full CRUD operations with detailed request validation and appropriate HTTP responses.
- Controllers work with DTOs for request and response payloads, ensuring data consistency.
- Services perform the core business rules, and interact with persistence layers (repositories).
- Example: `ProductController` serves product listing, details, creation, update, and deletion with appropriate pagination and filtering mechanisms.
- Example: `CartController` enables cart retrieval by user, adding/removing products, updating quantities, and clearing the cart.

---

## Interaction Between Frontend and Backend

- Frontend API files correspond to backend controllers and expose matching endpoints under `/api/v1/...` paths.
- Frontend calls backend asynchronously via these API modules and uses returned data to update UI state.
- Backend REST APIs are stateless and use user identifiers (e.g., user ID for cart) to perform operations.
- Data changes triggered from the frontend reflect in backend storage via these APIs.

---

## Key Files and Areas to Maintain and Extend

- Frontend API modules (`src/api`) must be updated when backend API changes.
- Contexts (`src/contexts`) should manage application state coherently and sync with backend as needed.
- Backend controllers and services (`src/main/java/com/quadzone/*Controller.java`, `*Service.java`) are primary places to handle new business logic.
- DTOs in backend define request/response contracts; changes require coordinated frontend updates.
- Tests and validation should accompany major changes to ensure stability.

---

## Recommendations for Contribution and Updates

- Understand the division between frontend responsibilities (UI, state management, API calls) and backend responsibilities (business logic, data persistence, security).
- Keep API contract changes synchronized between frontend and backend.
- Use existing contexts and hooks to maintain state consistency.
- Follow REST principles in backend controllers; provide clear API documentation using Swagger or similar tools.
- Document new modules or significant changes in this readme-dev for team awareness.

---

This document aims to help developers onboard quickly, understand core data flows, and maintain the QuadZone project efficiently.
