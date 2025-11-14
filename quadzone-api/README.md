# QuadZone Product API

This is a Spring Boot REST API for managing products in the QuadZone e-commerce platform. It provides CRUD operations for products, including pagination, search, and integration with subcategories.

## Features

- Full CRUD operations for products
- Pagination and search functionality
- DTO-based architecture to avoid exposing JPA entities
- Basic validation and error handling
- CORS support for frontend integration
- Static image serving
- OpenAPI documentation
- Unit tests for controller layer

## Technologies Used

- Spring Boot 3.x
- Spring Data JPA
- Spring Security (JWT-based authentication)
- Jakarta EE (jakarta.* packages)
- Lombok
- H2 Database (for development)
- Maven

## API Endpoints

All endpoints are prefixed with `/api/products`.

### List Products
- **GET** `/api/products?page=0&size=10&q=search&sort=id`
- Returns a paginated list of products.
- Optional query parameters: `q` for name search, `page`, `size`, `sort`.

### Get Product by ID
- **GET** `/api/products/{id}`
- Returns a single product by ID.

### Create Product
- **POST** `/api/products`
- Creates a new product. Requires authentication for non-GET operations (but currently permitted for demo).

### Update Product
- **PUT** `/api/products/{id}`
- Updates an existing product.

### Delete Product
- **DELETE** `/api/products/{id}`
- Deletes a product by ID.

## ProductDTO Fields

```json
{
  "id": "Long",
  "name": "String (required)",
  "brand": "String",
  "modelNumber": "String",
  "price": "double (>=0)",
  "imageUrl": "String",
  "quantity": "Integer",
  "isActive": "boolean",
  "subCategoryId": "Long",
  "subCategoryName": "String",
  "createdAt": "LocalDateTime"
}
```

## Sample cURL Commands

### List Products
```bash
curl -X GET "http://localhost:8080/api/products?page=0&size=5" -H "accept: application/json"
```

### Search Products
```bash
curl -X GET "http://localhost:8080/api/products?q=iPhone" -H "accept: application/json"
```

### Get Product by ID
```bash
curl -X GET "http://localhost:8080/api/products/1" -H "accept: application/json"
```

### Create Product
```bash
curl -X POST "http://localhost:8080/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "price": 99.99,
    "quantity": 10,
    "isActive": true,
    "subCategoryId": 1
  }'
```

### Update Product
```bash
curl -X PUT "http://localhost:8080/api/products/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Product",
    "price": 149.99,
    "quantity": 5,
    "isActive": true,
    "subCategoryId": 1
  }'
```

### Delete Product
```bash
curl -X DELETE "http://localhost:8080/api/products/1"
```

## Running the Application

1. Ensure Java 17+ and Maven are installed.
2. Navigate to the `quadzone-api` directory.
3. Run `mvn spring-boot:run` to start the application on port 8080.
4. The API will be available at `http://localhost:8080/api/products`.

## Database

- Uses H2 in-memory database for development.
- Sample data is loaded from `src/main/resources/db/insert.sql` on startup.
- Includes 15 sample products across 7 subcategories.

## Security

- GET requests to `/api/products/**` are permitted without authentication.
- Other operations may require JWT authentication (configured in SecurityConfiguration).
- CORS is enabled for `http://localhost:5173` (Vite React app).

## Static Images

- Images are served from `/uploads/**` path, mapped to `file:uploads/` directory.

## Testing

- Run tests with `mvn test`.
- Controller tests are in `src/test/java/com/quadzone/product/api/ProductControllerTest.java`.

## OpenAPI Documentation

- Access Swagger UI at `http://localhost:8080/swagger-ui.html` (if enabled).

## Notes

- Uses constructor injection for dependencies.
- Defensive null handling in mappers.
- Pagination uses Spring Data's Pageable.
- Validation uses Jakarta Bean Validation.
