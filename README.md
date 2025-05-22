# Ayush-HMS Server

Backend server implementation for the Ayush-HMS (Hospital Management System) application. This server provides API endpoints for the mobile application, handling patient data, dispensary management, authentication, and admin operations.

## 🛠️ Tech Stack

### Core Technologies
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **pg-promise** - PostgreSQL interface for Node.js

### Security & Authentication
- **bcrypt** - Password hashing library
- **express-validator** - Input validation middleware

### Location Services
- **geolib** - Geospatial calculations library
- **geopoint** - Geographic point calculations

### Testing & Development
- **Jest** - Testing framework
- **Supertest** - HTTP testing library
- **Nodemon** - Development server with auto-reload

### Task Scheduling
- **node-cron** - Task scheduler for Node.js

## 🔄 API Endpoints

### Authentication
- **POST /login** - Employee authentication
- **POST /admin-login** - Admin authentication

### Patient Management
- **POST /patient-entry** - Register new patient
- **GET /patient-entries/:dispensaryId** - Get patient entries for a dispensary
- **GET /search/patient-entry** - Search patient entries

### Dispensary Management
- **GET /my-dispensary** - Get registered dispensary details

### Admin Dashboard
- **GET /admin/dispensary-dash** - Admin dashboard data
- **GET /admin/dispensary-entries/:dispensaryId** - Patient entries for admin
- **GET /admin/employees/:dispensaryId** - Employee data for admin

## 📁 Project Structure

```
ayush-hms-server/
├── db/                  # Database configuration
│   └── index.js         # PostgreSQL connection setup
├── models/              # Data models
│   ├── distanceModel.js # Location distance calculations
│   └── isAdminModel.js  # Admin validation logic
├── routes/              # API route handlers
│   ├── admin/           # Admin-specific routes
│   │   ├── adminDispensaryDashRoute.js
│   │   ├── adminDispensaryEntries.js
│   │   ├── adminEmployeesRoute.js
│   │   └── loginRoute.js
│   ├── employee/        # Employee-specific routes
│   │   ├── adminLoginRoute.js
│   │   ├── myDispensaryRoute.js
│   │   ├── patientEntiresRoute.js
│   │   └── patientEntryRoute.js
│   └── search/          # Search functionality routes
│       └── patientEntrySearch.js
├── tests/               # Test files
├── server.js            # Main application entry point
└── package.json         # Project dependencies
```

## 💾 Database Schema

### Tables
1. **Employee** - Stores employee information
   - employee_id (PK)
   - name
   - username
   - password (hashed)
   - dispensary_id (FK)
   - is_admin

2. **Dispensary** - Stores dispensary information
   - dispensary_id (PK)
   - name
   - location (POINT)
   - address

3. **PatientEntry** - Stores patient data
   - entry_id (PK)
   - first_name
   - last_name
   - age
   - gender
   - adhaar_number
   - diagnosis
   - treatment
   - other_info
   - entry_date
   - employee_id (FK)
   - dispensary_id (FK)
   - phone_number

4. **Attendance** - Tracks employee location and attendance
   - attendance_id (PK)
   - employee_id (FK)
   - dispensary_id (FK)
   - entry_date
   - location (POINT)
   - distance

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- PostgreSQL (v12+ recommended)
- npm or yarn

### PostgreSQL Setup
1. Install PostgreSQL:
   ```bash
   # macOS with Homebrew
   brew install postgresql
   
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # Windows
   # Download installer from https://www.postgresql.org/download/windows/
   ```

2. Start PostgreSQL service:
   ```bash
   # macOS
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo service postgresql start
   ```

3. Create the database:
   ```bash
   # Login to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE ayush;
   
   # Connect to the database
   \c ayush
   ```

4. Create required tables (run in PostgreSQL shell):
   ```sql
   -- Enable PostGIS extension (for geographic data)
   CREATE EXTENSION postgis;
   
   -- Create Dispensary table
   CREATE TABLE Dispensary (
     dispensary_id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     location POINT NOT NULL,
     address TEXT
   );
   
   -- Create Employee table
   CREATE TABLE Employee (
     employee_id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     username VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     dispensary_id INTEGER REFERENCES Dispensary(dispensary_id),
     is_admin BOOLEAN DEFAULT FALSE
   );
   
   -- Create PatientEntry table
   CREATE TABLE PatientEntry (
     entry_id SERIAL PRIMARY KEY,
     first_name VARCHAR(255) NOT NULL,
     last_name VARCHAR(255) NOT NULL,
     age INTEGER NOT NULL,
     gender VARCHAR(50) NOT NULL,
     adhaar_number VARCHAR(255),
     diagnosis TEXT,
     treatment TEXT,
     other_info TEXT,
     entry_date TIMESTAMP NOT NULL,
     employee_id INTEGER REFERENCES Employee(employee_id),
     dispensary_id INTEGER REFERENCES Dispensary(dispensary_id),
     phone_number VARCHAR(15)
   );
   
   -- Create Attendance table
   CREATE TABLE Attendance (
     attendance_id SERIAL PRIMARY KEY,
     employee_id INTEGER REFERENCES Employee(employee_id),
     dispensary_id INTEGER REFERENCES Dispensary(dispensary_id),
     entry_date TIMESTAMP NOT NULL,
     location GEOMETRY(POINT, 4326),
     distance NUMERIC(10, 2)
   );
   ```

5. Create a sample dispensary and admin user:
   ```sql
   -- Insert sample dispensary
   INSERT INTO Dispensary (name, location, address)
   VALUES ('Main Dispensary', POINT(78.4867, 17.3850), '123 Main St, Hyderabad');
   
   -- Insert admin user (password: admin123)
   INSERT INTO Employee (name, username, password, dispensary_id, is_admin)
   VALUES ('Admin User', 'admin', '$2b$10$x7yzJsBVFdPJA4S5PXlDXuwEABm3kj4tZzSXXbkbzx.FQ4eCcZ7QG', 1, TRUE);
   ```

### Server Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/starbvuks/ayush-hms-server.git
   cd ayush-hms-server
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure database connection:
   - Open `db/index.js`
   - Update PostgreSQL connection details if needed:
     ```javascript
     const client = new Client({
       host: "localhost",
       port: 5432,
       database: "ayush",
       user: "postgres",
       password: "your_password", // Change this to your PostgreSQL password
     });
     ```

4. Start the server:
   ```bash
   npm run server
   # or
   yarn server
   ```

5. Verify the server is running:
   - Open your browser and navigate to `http://localhost:3000`
   - You should see the message "connected"

## 🧪 Running Tests
```bash
npm test
# or
yarn test
```

## 📡 Connecting to the Mobile App
To connect the mobile app to this server:
1. Update the `.env` file in the mobile app project with:
   ```
   EXPO_PUBLIC_API_URL=http://YOUR_SERVER_IP:3000
   ```
   Replace `YOUR_SERVER_IP` with your server's IP address (use your computer's local IP if testing on the same network)

2. If running on an emulator:
   - Android: Use `10.0.2.2:3000` as the API URL
   - iOS: Use `localhost:3000` as the API URL

## 📋 License
[Specify license information]

## 👥 Contributors
[List of contributors] 