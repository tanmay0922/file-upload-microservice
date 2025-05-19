# **File Upload & Metadata Processing Microservice**

This is a Node.js backend microservice designed to handle secure file uploads, store associated metadata in a PostgreSQL database, process those files asynchronously using BullMQ, and provide access control to ensure users can only access their own uploaded files. It uses JWT for authentication, Multer for file handling, and BullMQ for background job processing.

---

## **Table of Contents**

* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [API Endpoints](#api-endpoints)

  * [Authentication](#authentication)
  * [File Upload](#file-upload)
  * [File Status](#file-status)
* [Running the Application](#running-the-application)
* [Testing the API](#testing-the-api)
* [Optional Enhancements](#optional-enhancements)
* [License](#license)

---

## **Installation**

### 1. Clone the repository:

```bash
git clone https://github.com/yourusername/file-upload-service.git
cd file-upload-service
```

### 2. Install dependencies:

```bash
npm install
```

This will install all the necessary packages including:

* **Express.js** for the backend framework.
* **jsonwebtoken** for JWT-based authentication.
* **bcryptjs** for password hashing.
* **Multer** for file upload handling.
* **Sequelize** for interacting with the PostgreSQL database.
* **BullMQ** for background job processing with Redis.

---

## **Environment Variables**

Create a `.env` file in the root of the project and add the following environment variables:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=postgres://username:password@localhost:5432/database_name
REDIS_HOST=localhost
REDIS_PORT=6379
```

* **`PORT`**: Port on which the application will run (default: 3000).
* **`JWT_SECRET`**: Secret key used for signing JWT tokens.
* **`DATABASE_URL`**: PostgreSQL connection string.
* **`REDIS_HOST` and `REDIS_PORT`**: Redis server host and port for BullMQ.

---

## **API Endpoints**

### **Authentication**

* **POST /auth/login**

  * **Description**: Logs in a user and returns a JWT token.
  * **Request Body**:

    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  * **Response**:

    ```json
    {
      "token": "your_jwt_token"
    }
    ```

* **POST /auth/register** (Optional)

  * **Description**: Registers a new user and returns a JWT token.
  * **Request Body**:

    ```json
    {
      "email": "newuser@example.com",
      "password": "password123"
    }
    ```
  * **Response**:

    ```json
    {
      "token": "your_jwt_token"
    }
    ```

### **File Upload**

* **POST /files/upload**

  * **Description**: Uploads a file and its associated metadata (title, description) and returns the file ID and upload status.
  * **Headers**:

    * `Authorization: Bearer <jwt_token>`
  * **Request Body** (form-data):

    * `file`: File to upload.
    * `title`: File title (optional).
    * `description`: File description (optional).
  * **Response**:

    ```json
    {
      "fileId": 1,
      "status": "uploaded",
      "message": "File uploaded successfully."
    }
    ```

### **File Status**

* **GET /files/\:id**

  * **Description**: Retrieves the status of the file uploaded by the authenticated user.
  * **Headers**:

    * `Authorization: Bearer <jwt_token>`
  * **Response**:

    ```json
    {
      "fileId": 1,
      "original_filename": "test-file.txt",
      "title": "Test File",
      "description": "This is a test file.",
      "status": "processed",
      "extracted_data": "sha256_hash_of_the_file",
      "uploaded_at": "2023-05-19T10:00:00Z"
    }
    ```

---

## **Running the Application**

### 1. Start PostgreSQL and Redis (if using Docker):

If you're using **Docker**, you can run the following command to start PostgreSQL and Redis containers:

```bash
docker-compose up -d
```

### 2. Run the application:

Start the Node.js server using:

```bash
node server.js
```

The application will run on `http://localhost:3000` by default.

### 3. Database Synchronization:

The app will automatically sync the database tables using Sequelize when it starts. If you want to run migrations manually, use Sequelize migrations (recommended for production).

---

## **Testing the API**

### **1. Test Login Endpoint**

* Use **Postman** or **cURL** to test the `/auth/login` endpoint by providing the user's email and password.
* You should receive a JWT token in response.

### **2. Test File Upload Endpoint**

* Use **Postman** or **cURL** to test the `/files/upload` endpoint with the JWT token in the `Authorization` header and the file in the `form-data`.
* The response will include the file ID and upload status.

### **3. Test File Status Endpoint**

* Use **Postman** or **cURL** to test the `/files/:id` endpoint by passing the file ID in the URL and including the JWT token in the `Authorization` header.

---

## **Optional Enhancements**

* **Pagination for File Listings**: Add pagination to the `/files` endpoint to list multiple files with a `page` query parameter.
* **Job Retries**: Use BullMQ's retry mechanism to automatically retry failed jobs for processing files.
* **Rate Limiting**: Implement upload rate limiting using **express-rate-limit** to prevent abuse.
* **Docker Setup**: Use the provided `docker-compose.yml` file to run PostgreSQL and Redis in Docker containers for local development.
* **Swagger/OpenAPI Documentation**: Add API documentation using **swagger-jsdoc** and **swagger-ui-express**.

---

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### **Key Changes Based on Code:**

* **File Upload (`POST /files/upload`)**: Clarified the implementation where metadata and file are uploaded, and job processing is triggered.
* **JWT Authentication (`POST /auth/login`)**: Reinforced the usage of JWT tokens for secure routes.
* **Job Queue Processing**: Mentioned **BullMQ** handling asynchronous job processing for files.
* **Environment Variables**: Specified `JWT_SECRET`, `DATABASE_URL`, and Redis settings.


