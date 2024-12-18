# CS Messaging Web App [ Simple Assignment for learning purpose ]

## Overview
The CS Messaging Web App is a customer service platform where customers can send messages and agents can respond to them. It includes a dashboard for agents to manage messages and a customer interface to view and send messages. The app is built with **Node.js**, **Express**, **MySQL**, and **Bootstrap** for responsive design.

---

## Features
- **Login System:**
  - Customers and agents can log in.
  - Agents and customers have separate dashboards.
- **Customer Features:**
  - View their own messages.
  - Add new messages.
- **Agent Features:**
  - View all messages from customers.
  - Respond to messages.
  - Update responses.
  - Search messages by message content.
- **RESTful API Endpoints:**
  - Add new messages.
  - Retrieve messages for customers and agents.

---

## Technologies Used
- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS (Bootstrap), JavaScript
- **Database**: MySQL

---

## Setup and Installation

### Prerequisites
1. Install **MySQL**:
   ```bash
   sudo apt update
   sudo apt install mysql-server
   sudo service mysql start
   ```
2. Install Dependencies:
```bash
npm install express mysql2 dotenv cors
```
3. Install npm and nodejs:
```bash
sudo apt install nodejs npm
```


### Steps to Set Up the Project
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cs-messaging-web-app.git
   cd cs-messaging-web-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the MySQL database:
   - Create a database named `cs_messaging`.
   - Run the following SQL script to create the `messages` table:
     ```sql
     CREATE TABLE messages (
         id INT AUTO_INCREMENT PRIMARY KEY,
         user_id INT NOT NULL,
         message_body TEXT NOT NULL,
         timestamp_utc DATETIME NOT NULL,
         agent_response TEXT
     );
     ```
4. Configure the database connection:
   - Open `server.js`.
   - Update the database connection details:
     ```javascript
     const db = mysql.createConnection({
         host: 'localhost',
         user: 'your_mysql_user', // Replace with your MySQL username
         password: 'your_mysql_password', // Replace with your MySQL password
         database: 'cs_messaging'
     });
     ```

5. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

---

## How to Run
1. Open the app in your browser:
   - For customers: `http://localhost:3000/customer-dashboard?userId=<userId>`
   - For agents: `http://localhost:3000/agent-dashboard`

2. Navigate to `http://localhost:3000/` to access the login page.

---

## API Endpoints
### Messages API
- **GET `/customer-dashboard?userId=<userId>`**
  - Retrieves messages for a specific customer.
- **POST `/send-message`**
  - Adds a new message.
  - **Request Body**:
    ```json
    {
        "userId": <user_id>,
        "messageBody": "<message_body>"
    }
    ```
- **POST `/api/response`**
  - Updates the agent's response for a specific message.
  - **Request Body**:
    ```json
    {
        "id": <message_id>,
        "agent_response": "<response>"
    }
    ```
- **GET `/api/search-messages?query=<searchQuery>`**
  - Searches for messages by content or customer ID.

---

## Features in Detail
### Customer
- View personal messages with timestamps and agent responses.
- Submit new messages through a form.

### Agent
- View a table of all customer messages.
- Search messages by customer ID or content.
- Respond to customer messages or update previous responses.

---

## Troubleshooting
1. **Database Connection Issues**:
   - Ensure MySQL is running and the credentials in `server.js` are correct.
2. **Port Conflicts**:
   - If port `3000` is in use, change the port in `server.js`:
     ```javascript
     const port = process.env.PORT || 3001;
     ```

---

## Future Enhancements
    • Add user authentication with encrypted passwords.
    • Introduce role-based access controls.
    • Implement email notifications for responses.
    • Figure out a scheme to help agents divide work amongst themselves, and to prevent multiple agents working on the same message at once.
    • Explore ways to surface messages that are more urgent and in need of immediate attention. For example, customers who are asking about the loan approval process or when their loan will be disbursed might have more urgency than those asking how to update information on their Branch account.
    • Explore ways to surface additional information about customers (e.g. external profiles or some internal information we have about them) in the UI, to provide context to agents.
    • Implement a canned message feature that allows agents to quickly respond to enquiries using a set of pre-configured stock messages.
    • Make the agent UI (and/or the customer-facing UI) more interactive by leveraging websockets or similar technology, so that new incoming messages can show up in real time.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request.

---

## Contact
For questions or feedback, reach out at:
- **Email**: [hussainganie388@gmail.com](mailto:hussainganie388@gmail.com)
- **GitHub**: [Sadam452](https://github.com/sadam452)

---
