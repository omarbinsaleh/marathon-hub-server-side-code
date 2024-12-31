# Marathon Hub Server

## Overview

The Marathon Hub server is the backend for managing marathon events, registrations, and users. It provides APIs for CRUD operations on marathon events and registration data, with secure MongoDB integration. Built using Node.js, Express.js, and MongoDB, it ensures reliable and efficient data handling for the Marathon Hub platform.

---

## Features

### Marathon-Related APIs

1. **Add a Marathon**

   - Endpoint: `/marathons/add`
   - Method: `POST`
   - Function: Saves a marathon event to the database.

2. **Retrieve Marathons**

   - Endpoint: `/marathons`
   - Method: `GET`
   - Function: Fetches marathon events, supports filtering, sorting, and pagination.

3. **Retrieve User-Specific Marathons**

   - Endpoint: `/marathons/:email`
   - Method: `GET`
   - Function: Fetches marathons created by a specific user.

4. **Update Marathon Information**

   - Endpoint: `/marathons/update/:id`
   - Method: `PUT`
   - Function: Updates details of a specific marathon event.

5. **Delete a Marathon**
   - Endpoint: `/marathons/delete/:id`
   - Method: `DELETE`
   - Function: Removes a marathon event from the database.

---

### Marathon Registration APIs

6. **Register for a Marathon**

   - Endpoint: `/marathon-registrations`
   - Method: `POST`
   - Function: Saves registration details, prevents duplicate entries, and updates the total registration count.

7. **Update Registration**

   - Endpoint: `/marathon-registrations/update/:id`
   - Method: `PUT`
   - Function: Updates details of a specific marathon registration.

8. **Delete a Registration**

   - Endpoint: `/marathon-registrations/delete/:id`
   - Method: `DELETE`
   - Function: Removes a registration and decrements the registration count.

9. **Retrieve All Registrations**

   - Endpoint: `/marathon-registrations`
   - Method: `GET`
   - Function: Fetches all marathon registrations with optional search functionality.

10. **Retrieve Specific Registration**

    - Endpoint: `/marathon-registrations/:id`
    - Method: `GET`
    - Function: Fetches details of a specific marathon registration.

11. **Retrieve User-Specific Registrations**
    - Endpoint: `/marathon-registration/:email`
    - Method: `GET`
    - Function: Fetches all registrations by a specific user.

---

### User APIs

12. **Add a User**

    - Endpoint: `/users/add`
    - Method: `POST`
    - Function: Saves user information to the database.

13. **Retrieve All Users**

    - Endpoint: `/users`
    - Method: `GET`
    - Function: Fetches all users from the database.

14. **Retrieve a Specific User**
    - Endpoint: `/users/:id`
    - Method: `GET`
    - Function: Fetches details of a specific user.

---

### Testing

15. **Ping the Server**
    - Endpoint: `/`
    - Method: `GET`
    - Function: Tests if the server is running correctly.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/marathon-hub-server.git
   ```

---

## Install dependencies

```bash
  npm install
```
---

## Create a `.env` file in the root directory with the following variables

```text
   PORT=5000
   DB_USERNAME=<your_mongodb_username>
   DB_PASSWORD=<your_mongodb_password>
```

---

## Database Structure

### Collections
1. `marathons`
   Stores marathon event details.

2. `marathon_registrations`
   Stores participant registration details for marathons.

3. `users`
   Stores user information, including organizer and participant data.

---

## Dependencies
   - **Node.js**: JavaScript runtime.
   - **Express.js**: Backend framework.
   - **MongoDB**: Database for storing marathon data.
   - **dotenv**: For managing environment variables.
   - **cors**: To handle cross-origin requests.
