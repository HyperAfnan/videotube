## Project Architecture Overview

This project follows a modular, service-oriented architecture, designed for scalability and maintainability. The structure separates concerns by feature and responsibility, making it easy to extend and test.

### Key Directories and Their Roles

- **docs/**  
  Contains project documentation, such as email flow descriptions.

- **public/**  
  Serves static assets (e.g., temporary files).

- **src/**  
  The main application source code, organized as follows:

  - **app.js & index.js**  
    Entry points for initializing and starting the application.

  - **components/**  
    Feature-based modules (e.g., user, video, tweet, comment, playlist, like, subscription, dashboard, health).  
    Each feature typically includes:
    - `*.controller.js`: Handles HTTP requests and responses.
    - `*.service.js`: Business logic and orchestration.
    - `*.model.js`: Data models (e.g., Mongoose schemas).
    - `*.route.js`: API route definitions.
    - `*.validator.js`: Input validation logic.

  - **config/**  
    Centralized configuration for environment variables, database, Redis, and Bull queue dashboard.

  - **jobs/queues/**  
    Defines background job queues (e.g., email, user) and their dead-letter handling.

  - **microservices/**  
    Contains worker processes for asynchronous tasks, such as:
    - Email processing (including templates and dead-letter handling)
    - User-related background processing

  - **middlewares/**  
    Custom Express middlewares for authentication, error handling, logging, file uploads, rate limiting, and validation.

  - **utils/**  
    Utility functions and helpers, including:
    - API error/response formatting
    - File handling
    - Logging (with environment-specific loggers)
    - Swagger API documentation setup

### Architectural Highlights

- **Modular Feature Design:**  
  Each domain (user, video, tweet, etc.) is encapsulated in its own folder, following the controller-service-model pattern for separation of concerns.

- **Background Processing:**  
  Uses Bull queues and dedicated microservice workers for handling asynchronous tasks (e.g., sending emails, processing user events), improving scalability and reliability.

- **Centralized Configuration:**  
  All environment, database, and queue configurations are managed in the `config/` directory for consistency and ease of management.

- **Robust Middleware Layer:**  
  Middleware components handle cross-cutting concerns, ensuring clean and reusable request processing.

- **Comprehensive Utilities:**  
  Utility modules provide reusable logic for error handling, logging, file operations, and API documentation.

---

This architecture supports clean code organization, easy feature addition, and robust background processing, making it suitable for scalable web applications.
