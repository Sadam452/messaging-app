const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// MySQL Database connection (using environment variables)
const db = mysql.createConnection({
    host: "localhost", 
    user: "cs_user",
    password: "your_password",
    database: "cs_messaging"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Route for Customer Dashboard (fetch messages for a customer)
app.get('/api/messages/customer/:userId', (req, res) => {
    const userId = req.params.userId; 
    db.query('SELECT * FROM messages WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error("Error fetching customer messages:", err);
            return res.status(500).send('Error retrieving messages');
        }
        res.json(results);
    });
});

// Route for Agent Dashboard (fetch all messages)
app.get('/api/messages', (req, res) => {
    db.query('SELECT * FROM messages', (err, results) => {
        if (err) {
            console.error("Error fetching all messages:", err);
            return res.status(500).send('Error retrieving messages');
        }
        res.json(results);
    });
});

// Endpoint to send a new message (from a customer)
app.post('/send-message', (req, res) => {
    const { userId, messageBody } = req.body;
    // const timestamp = new Date().toISOString();

    if (!userId || !messageBody) {
        return res.status(400).send('User ID and message body are required.');
    }
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format to 'YYYY-MM-DD HH:MM:SS'

    db.query(
        'INSERT INTO messages (user_id, message_body, timestamp_utc) VALUES (?, ?, ?)',
        [userId, messageBody, timestamp],
        (err, result) => {
            if (err) {
                console.error("Error saving message:", err);
                return res.status(500).send('Error saving the message.');
            }
            res.send('Message sent successfully.');
        }
    );
});

// Endpoint to respond to a message (for agents)
app.post('/api/response', (req, res) => {
    const { id, agent_response } = req.body;

    if (!id || !agent_response) {
        return res.status(400).send('Message ID and agent response are required.');
    }

    db.query(
        'UPDATE messages SET agent_response = ? WHERE id = ?',
        [agent_response, id],
        (err, result) => {
            if (err) {
                console.error("Error updating response:", err);
                return res.status(500).send('Error updating the response.');
            }
            res.send({ message: 'Response added successfully.' });
        }
    );
});

// Endpoint for agent message search
app.get('/api/search-messages', (req, res) => {
    const searchQuery = req.query.query;

    if (!searchQuery) {
        return res.status(400).send('Search query is required.');
    }

    db.query(
        'SELECT * FROM messages WHERE message_body LIKE ? OR user_id LIKE ?',
        [`%${searchQuery}%`, `%${searchQuery}%`],
        (err, results) => {
            if (err) {
                console.error("Error searching messages:", err);
                return res.status(500).send('Error searching messages.');
            }
            res.json(results);
        }
    );
});

// Serve the index.html page for the login form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the customer dashboard 
app.get('/customer-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'customer-dashboard.html'));
});

// Serve the agent dashboard
app.get('/agent-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'agent-dashboard.html'));
});

// Handle 404 - Page not found
app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});