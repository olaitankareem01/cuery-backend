# Cuery Backend

This project is a NestJS-based service for parsing, storing, and querying X12 271 transactions.

## Table of Contents

- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Assumptions and Design Decisions](#assumptions-and-design-decisions)
- [API Endpoints](#api-endpoints)

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18.x or later)
- **npm** (v6.x or later)
- **NestJS CLI** (optional but recommended)
- A code editor like **VSCode** (recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/olaitankareem01/cuery-backend.git

2. Navigate to the project directory
   
   ```bash
   cd cuery-backend
   ```
3. Install dependencies

    ```bash 
     npm install
4. Copy the .env.example file to .env and configure any necessary environment variables:

    ```bash
    cp .env.sample .env
  In the .env file, configure your environment variables as needed (e.g., PORT).

### Running the Application

  To start the application:

    ```bash
      npm start
    ```
  Alternatively, you can run the app using docker
### Running the application with docker:
1. Install Docker: Make sure you have Docker installed on your machine. You can download and install it from Docker's official website[https://www.docker.com/].

2. Run the command below to build the image:

   ```bash
   docker build -t cuery-backend .
   ```
3. Spin up the docker container: 
   After building the image, you can run your application in a Docker container with the following command:
   ```bash
   docker run -p 3000:3000 cuery-backend
   ```
  This command maps port 3000 of the container to port 3000 of your host machine. 
  Open your browser and go to http://localhost:3000 to access the application.

### Testing
  Jest is being used for unit testing. To run the test suite, including unit tests and controller tests:

  ## Running Test:
    ```bash
     npm run test
    ```
  ## Running Test Coverage
    To run tests and check coverage:

    ```bash
      npm run test:cov
    ```
### Assumptions and Design Decisions

### 1. Transaction Structure
it is assumed that each X12 271 transaction contains the following key components:

- **Subscriber Information**: Name and ID in the `NM1*IL` segment.
- **Eligibility Date**: In the `DTP*346` segment.
- **Service Types and Plan Names**: In the `EB` segment.

The transactions are passed based on predefined segments (`NM1`, `EB`, `DTP`) according to the X12 271 transaction standard.

---

### 2. Data Storage
Transactions are stored in an in-memory array (`transactions: Transaction[]`), which mimics a simple database.  
In production, this can later be replaced with a proper database (e.g., MongoDB, PostgreSQL) for scalability and persistence.

---

### 3. Error Handling
When a transaction is not found for the given subscriber ID or service type, a `NotFoundException` is thrown with an appropriate message.  
Transaction parsing is wrapped in a try-catch block to handle potential parsing errors and log them using NestJS's Logger.

---

### 4. Logger
We use the NestJS Logger to log key events (e.g., successful parsing and storing of transactions, errors) to the console.  
A more robust logging system may be implemented later with ELK stack for efficeint monitoring 

---

### 5. Parsing Logic
transactions with multiple service types codes and plans are stored as comma-seperated values

### 6. Query Logic
querying transactions, we handle cases where a subscriber's service types are stored as a comma-separated string and split them into arrays for comparison.  
In cases where multiple service types are present, we ensure that we can still query individual service types efficiently.

# API Endpoints

## 1. Parse Transaction

- **URL:** `/transaction/parse`
- **Method:** `POST`
- **Description:** Parses and stores an X12 271 transaction.

### Request Body
```json
{
  "transaction": "NM1*IL*DOE*JOHN*...~EB*ServiceType1*...~DTP*346*20220101"
}
```
### Response:
```json
{ 
  "status": "ok",
  "message": "Transaction parsed and stored successfully"
}
```
## 2. Query Transaction

- **URL:** `/transaction/query`
- **Method:** `GET`
- **Description:** Retrieves transaction details based on the subscriber ID and service type.

### Query Parameters
- **subscriber_id:** The ID of the subscriber.
- **service_type:** The service type to query for.

### Response:
```json
 {
  "subscriber_name": "DOE JOHN",
  "plan_name": "GOLD PLAN",
  "eligibility_date": "2020-01-01"
}
```

        
