## Backend options

1. Node.js with Express.js:
    - Node.js is a popular choice for building lightweight and scalable backend applications.
    - Express.js is a minimalist web framework for Node.js that makes it easy to build APIs and handle HTTP requests.
    - This combination is well-suited for small to medium-sized projects and provides a rich ecosystem of npm packages for various functionalities.

2. Django with Django REST Framework (DRF):
    - Django is a high-level Python web framework known for its simplicity, robustness, and scalability.
    - Django REST Framework (DRF) is a powerful toolkit for building Web APIs in Django.
    If you're comfortable with Python or prefer a more opinionated framework, Django with DRF can be a great choice.

3. ASP.NET Core:
    - ASP.NET Core is a cross-platform, high-performance framework for building modern web applications and services with .NET.
    - It provides robust features for building APIs, including built-in support for authentication, authorization, and dependency injection.
    - If you're already familiar with C# or .NET, ASP.NET Core can be a solid choice for your backend.


## Azure cloud service db options

1. Azure SQL Database:
    - Azure SQL Database is a fully managed relational database service based on the latest version of Microsoft SQL Server Database Engine.
    - It offers built-in high availability, automated backups, and intelligent performance optimization.
    - Azure SQL Database is well-suited for applications that require a relational database with ACID (Atomicity, Consistency, Isolation, Durability) properties.

2. Azure Cosmos DB:
    - Azure Cosmos DB is a globally distributed, multi-model database service designed for building highly responsive and scalable applications.
    - It supports multiple data models including document, key-value, graph, and column-family.
    - Azure Cosmos DB offers automatic scaling, low-latency reads and writes, and comprehensive SLAs for throughput, latency, consistency, and availability.

3. Azure Database for PostgreSQL / MySQL:
    - Azure offers managed PostgreSQL and MySQL database services that are fully compatible with their respective open-source counterparts.
    - These services provide high availability, automated backups, and security features, making them suitable for applications built with PostgreSQL or MySQL.

4. Azure Blob Storage:
    - Azure Blob Storage is an object storage solution for storing and serving large amounts of unstructured data.
    - While not a traditional relational database, Blob Storage can be used to store files, images, documents, and other binary data in your application.
    - It's cost-effective and scalable, and integrates well with other Azure services.

5. Azure Table Storage:
    - Azure Table Storage is a NoSQL data store for storing semi-structured data at scale.
    - It's well-suited for applications that require fast and flexible storage of non-relational data, such as user profiles, session state, and metadata.


## Other Notes
- click a magic/fireworks button - ingests your note and transforms into a better formatted item


## Roadmap Skeleton
Step 1: Set Up Azure Cosmos DB

Create Cosmos DB Account:
    - Set up a new Azure Cosmos DB account in the Azure portal if you haven't already.
    - Choose the appropriate API (e.g., SQL API for document data model).

Create Users Container:
    - Within your Cosmos DB account, create a container to store user documents.
    - Define the partition key and throughput settings as per your requirements.

Step 2: Backend Implementation

Express Server Setup:
    - Create an Express server to handle authentication requests.
    - Set up routes for user registration and login.

Implement User Registration:
    - Create a route to handle user registration.
    - Validate user input (e.g., username, password).
    - Hash the password using bcrypt before storing it in the database.
    - Insert the user document into the Cosmos DB users container.

Implement User Login:
    - Create a route to handle user login.
    - Validate user credentials (username/password).
    - Compare the hashed password with the stored hash in the database.
    - Generate a JSON Web Token (JWT) upon successful authentication.

Secure Routes with JWT Authentication Middleware:
    - Implement middleware to verify JWT tokens for protected routes.
    - Restrict access to routes requiring authentication.

Step 3: Frontend Implementation

Create Signup Form Component:
    - Design and implement a signup form component using Angular Reactive Forms.
    - Capture user input for username, email, and password.

Implement Signup Service:
    - Create a service to interact with the backend API for user registration.
    - Handle HTTP requests (POST) to the backend endpoint.

Create Login Form Component:
    - Design and implement a login form component using Angular Reactive Forms.
    - Capture user input for username and password.

Implement Login Service:
    - Create a service to interact with the backend API for user login.
    - Handle HTTP requests (POST) to the backend endpoint.
    - Store the JWT token in the browser's local storage upon successful login.

Step 4: Integration and Testing

Integrate Backend with Frontend:
    - Connect the frontend signup and login components with the corresponding backend services.
    - Implement error handling and display appropriate messages to the user.

Test User Registration and Login:
    - Test the signup and login workflows to ensure they function as expected.
    - Verify that user data is stored in the Cosmos DB users container.
    - Confirm that JWT tokens are generated and stored correctly.

Refactor and Optimize Code:
    - Review the codebase for any potential improvements or optimizations.
    - Ensure code follows best practices and standards.

Step 5: Documentation and Deployment

Write Documentation:
    - Document the authentication workflow, including API endpoints and frontend components.
    - Provide instructions for developers on how to set up and run the application.

Deploy Backend and Frontend:
    - Deploy the Express backend to Azure App Service or any other hosting platform.
    - Deploy the Angular frontend to Azure Static Web Apps or a similar service.
    - Configure environment variables and ensure the application runs smoothly in the production environment.