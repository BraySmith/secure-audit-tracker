# Secure Audit Tracker
A full-stack application meant to combine Role-Based Access Control with automated security auditing.
While minimal in appearance, the application implements core security and engineering controls:
* **Authentication & Hashing:** JWT authentication and bcrypt password hashing.
* **Access Control & Auditing:** Custom RBAC middleware with automated audit logging.
* **Containerzation:** Containerized with Docker and Docker Compose.

## How To Run:
1. Setup and MongoDB database and create a `backend/.env` file containing your connection string, a JWT secret token, and `PORT=5000`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

2. Build and start the application from the root directory:
```bash
docker compose up --build
```
3. Access the web interface at `http://localhost:5173/`