# City Management Application

This project is a City Management application that allows you to add, update, delete, and filter cities. The application includes a simple front-end interface and connects to a backend API to manage city data stored in a MySQL database.

## Features

- **Add City**: Add new cities with details including name, population, country, latitude, and longitude.
- **Update City**: Edit the details of existing cities.
- **Delete City**: Remove cities from the database.
- **Filter & Search**: Filter cities by country and search by name.
- **Sort**: Sort cities by name or population.

## Technologies Used

- **Front-End**: HTML, CSS, JavaScript
- **Back-End**: Node.js (assumed for API implementation)
- **Database**: MySQL

## Setup Instructions

### Prerequisites

- Node.js and npm (Node Package Manager)
- MySQL database

### Setting Up the Database

1. **Create the Database**: Ensure you have a MySQL database running and create a database for the project, e.g., `city_management`.

2. **Create the Table**: Run the following SQL command to create the `cities` table:

    ```sql
    CREATE TABLE cities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        population INT NOT NULL,
        country VARCHAR(255) NOT NULL,
        latitude DECIMAL(9, 6) NOT NULL,
        longitude DECIMAL(9, 6) NOT NULL
    );
    ```

3. **Insert Dummy Data**: Populate the `cities` table with dummy data using the following SQL commands:

    ```sql
    INSERT INTO cities (name, population, country, latitude, longitude) VALUES
    ('New York', 8419000, 'USA', 40.712776, -74.005974),
    ('Los Angeles', 3980000, 'USA', 34.052235, -118.243683),
    ('London', 8982000, 'UK', 51.507351, -0.127758),
    ('Tokyo', 13929000, 'Japan', 35.676192, 139.650311),
    ('Paris', 2148000, 'France', 48.856613, 2.352222),
    ('Sydney', 5312000, 'Australia', -33.868820, 151.209296),
    ('Berlin', 3645000, 'Germany', 52.520008, 13.404954),
    ('Moscow', 11920000, 'Russia', 55.755825, 37.617298),
    ('Toronto', 2930000, 'Canada', 43.651070, -79.347015),
    ('Rio de Janeiro', 6748000, 'Brazil', -22.906847, -43.172897);
    ```

### Setting Up the Back-End

1. **Clone the Repository**: Clone this repository to your local machine.

    ```bash
    git clone https://github.com/dhruvjaiswal2981/City-Management.git
    cd city-management
    ```

2. **Install Dependencies**: Navigate to the back-end directory and install the required Node.js packages.

    ```bash
    cd backend
    npm install
    ```

3. **Configure Database Connection**: Update the database configuration file (e.g., `config.js`) with your MySQL connection details.

4. **Start the Server**: Run the server to start the API.

    ```bash
    npm start
    ```

### Setting Up the Front-End

1. **Navigate to Front-End Directory**: 

    ```bash
    cd frontend
    ```

2. **Run the Application**: Open `index.html` in your web browser or use a local server to serve the static files.

### API Endpoints

- **GET `/cities`**: Fetch all cities with optional query parameters for filtering, searching, and sorting.
- **POST `/cities`**: Add a new city.
- **PUT `/cities/:name`**: Update an existing city by name.
- **DELETE `/cities/:name`**: Delete a city by name.



