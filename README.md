# Personal Finance & Budget Tracking Application

A comprehensive, full-stack web application designed to help users track their income, expenses, set monthly budgets, and gain visual insights into their financial health.

## 🔗 Repository Links
* **Backend Repository:**  https://github.com/Maheesha-Nethmina/Budget-Tracking-Application-Backend
* **Frontend Repository:** https://github.com/Maheesha-Nethmina/Budget-Tracking-Application-frontend

## 🚀 Features

* **Secure Authentication:** User registration and login with JWT-based secure session handling.
* **Transaction Management:** Add, edit, delete, and list income and expense transactions. Filter by date range, category, and type.
* **Budget Tracking:** Set monthly budget limits for specific expense categories. Features visual progress bars and dynamic alerts when spending exceeds the limit.
* **Category Management:** Customize income and expense categories (e.g., Salary, Food, Rent).
* **Interactive Dashboard:** A data-driven overview featuring total income, total expenses, current balance, recent transactions, and dynamic charts (Expense Distribution Pie Chart & Monthly Bar Chart).

## 🛠️ Tech Stack


* React.js
* Spring Boot
* PostgreSQL 

---

## ⚙️ Setup & Installation Instructions

Follow these steps to get the application running on your local machine.

### Prerequisites
* Node.js and npm installed
* Java Development Kit (JDK 17 or higher) installed
* Maven installed
* A local relational database server (PostgreSQL or MySQL) running

### 1. Running the Database
Before starting the backend, ensure your database server is running and create a new database for the application.

1. Open your database client (e.g., pgAdmin).
2. Create a new database named `budget_tracking_db`.
3. Open the backend project and navigate to `src/main/resources/application.properties`.
4. Update the database URL, username, and password to match your local environment:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/budget_tracking_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

### 2. Installing Dependencies
You will need to install the required packages for both the frontend and backend.

Backend:
If you are using an IDE like IntelliJ IDEA or Eclipse, simply open the pom.xml file to automatically download the Maven dependencies. 
Alternatively, run:
```
cd backend
mvn clean install

```

Frontend:
Open a new terminal, navigate to the frontend directory, and install the Node modules:

```
cd frontend
npm install
```

### 3. Running the Backend
To start the Spring Boot server:

1. Navigate to the root of the backend directory.
2. Run the application using Maven:
   
```
mvn spring-boot:run
```

3. The backend server will start on http://localhost:8080.

### 4. Running the Frontend
To start the React development server:

1. Open a terminal and navigate to the frontend directory.
2. Start the app:

```
npm run dev
```
3. The frontend application will start and can be accessed at http://localhost:5173 (or the port specified by Vite/Create React App).


   
