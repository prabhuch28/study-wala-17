# Study Wala Backend

Spring Boot backend for the Study Wala application, providing AI-powered study planning and management features.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control
  - Secure password hashing

- **Study Management**
  - Create and manage study plans
  - Track study progress
  - Generate AI-powered study suggestions

- **AI Integration**
  - OpenAI GPT-4 integration for study plan generation
  - Smart study recommendations

- **RESTful API**
  - Comprehensive API documentation with Swagger UI
  - Input validation and error handling
  - CORS support

## Tech Stack

- **Backend Framework**: Spring Boot 3.2.0
- **Database**: MongoDB
- **Authentication**: JWT
- **API Documentation**: SpringDoc OpenAPI 3.0
- **Build Tool**: Maven
- **Containerization**: Docker

## Prerequisites

- Java 17 or higher
- Maven 3.6.3 or higher
- MongoDB 4.4 or higher
- Docker (optional, for containerized deployment)
- OpenAI API key

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/study-wala-backend.git
cd study-wala-backend
```

### 2. Configure Environment Variables
Copy the example environment file and update the values:
```bash
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
# Application
SERVER_PORT=8081
SERVER_SERVLET_CONTEXT_PATH=/api

# MongoDB
SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/study_wala

# JWT
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRATION_MS=86400000 # 24 hours

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Run with Docker (Recommended)
```bash
docker-compose up --build
```

### 4. Run Locally
#### Start MongoDB
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Build and Run the Application
```bash
mvn clean install
mvn spring-boot:run
```

The application will be available at `http://localhost:8081/api`

## API Documentation

Once the application is running, you can access the API documentation at:
- Swagger UI: http://localhost:8081/api/swagger-ui.html
- OpenAPI JSON: http://localhost:8081/api/api-docs

## Authentication

1. Register a new user:
   ```
   POST /api/auth/signup
   {
     "name": "John Doe",
     "username": "johndoe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. Login to get JWT token:
   ```
   POST /api/auth/login
   {
     "usernameOrEmail": "johndoe",
     "password": "password123"
   }
   ```

3. Use the token in subsequent requests:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

## Project Structure

```
src/main/java/com/studywala/backend/
├── config/           # Configuration classes
├── controller/       # REST controllers
├── dto/              # Data Transfer Objects
├── exception/        # Exception handling
├── model/            # Domain models
├── repository/       # Data access layer
├── security/         # Security configuration
├── service/          # Business logic
└── StudyWalaApplication.java  # Main application class
```

## Testing

Run the tests with:
```bash
mvn test
```

## Deployment

### Production Build
```bash
mvn clean package -DskipTests
java -jar target/study-wala-backend-0.0.1-SNAPSHOT.jar
```

### Docker Production Build
```bash
docker build -t study-wala-backend .
docker run -p 8081:8081 --env-file .env study-wala-backend
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SERVER_PORT` | Port to run the application | No | 8081 |
| `SERVER_SERVLET_CONTEXT_PATH` | Base path for API endpoints | No | /api |
| `SPRING_DATA_MONGODB_URI` | MongoDB connection string | No | mongodb://localhost:27017/study_wala |
| `JWT_SECRET` | Secret key for JWT token generation | Yes | - |
| `JWT_EXPIRATION_MS` | JWT token expiration time in milliseconds | No | 86400000 (24h) |
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:3000 |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Prerequisites

- Java 17 or higher
- Maven 3.6.3 or higher
- MongoDB 4.4 or higher
- OpenAI API key

## Setup

1. Clone the repository
2. Create a `.env` file in the project root with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```
3. Make sure MongoDB is running locally on the default port (27017) or update the `application.properties` with your MongoDB connection details

## Running the Application

1. Build the application:
   ```bash
   mvn clean install
   ```

2. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The application will be available at `http://localhost:8081/api`

## API Documentation

Once the application is running, you can access the API documentation at:
- Swagger UI: http://localhost:8081/api/swagger-ui.html
- OpenAPI JSON: http://localhost:8081/api/api-docs

## Project Structure

```
src/main/java/com/studywala/backend/
├── config/           # Configuration classes
├── controller/       # REST controllers
├── dto/              # Data Transfer Objects
├── exception/        # Exception handling
├── model/            # Domain models
├── repository/       # Data access layer
├── service/          # Business logic
└── StudyWalaApplication.java  # Main application class
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes | - |
| `SPRING_DATA_MONGODB_URI` | MongoDB connection string | No | mongodb://localhost:27017/study_wala |
| `SERVER_PORT` | Port to run the application | No | 8081 |

## API Endpoints

### Study Plans

- `POST /api/study-plans` - Create a new study plan
- `GET /api/study-plans` - Get all study plans for the current user
- `GET /api/study-plans/{id}` - Get a specific study plan
- `DELETE /api/study-plans/{id}` - Delete a study plan

## Testing

Run the tests with:
```bash
mvn test
```

## Deployment

For production deployment, you can create a JAR file:
```bash
mvn clean package
java -jar target/study-wala-backend-0.0.1-SNAPSHOT.jar
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
