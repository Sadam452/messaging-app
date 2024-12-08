document.addEventListener('DOMContentLoaded', () => {
  const userId = new URLSearchParams(window.location.search).get('userId');

  if (document.getElementById('welcome-message')) {
    // Customer Dashboard
    const welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.textContent = `Welcome, Customer ${userId}`;

    const sendMessageForm = document.getElementById('send-message-form');
    sendMessageForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const messageBody = document.getElementById('message-body').value;
      console.log('Sending message:', messageBody);
      fetch('/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, messageBody }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();
        })
        .then((data) => {
          alert(data);
          sendMessageForm.reset();
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });
    });

    // Fetch customer messages
    fetch(`/api/messages/customer/${userId}`)
      .then(response => response.json())
      .then(messages => {
        const tbody = document.querySelector('#messages-table tbody');
        tbody.innerHTML = ''; // Clear existing messages

        messages.forEach(message => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
                      <td>${message.id}</td>
                      <td>${message.message_body}</td>
                      <td>${message.timestamp_utc}</td>
                      <td>${message.agent_response || 'Pending'}</td>
                  `;
          tbody.appendChild(tr);
        });
      })
      .catch(error => console.error('Error fetching customer messages:', error));

  } else if (document.getElementById('messages-table')) {
    // Agent Dashboard
    fetch('/api/messages')
      .then(response => response.json())
      .then(messages => {
        const tbody = document.querySelector('#messages-table tbody');
        tbody.innerHTML = ''; // Clear existing messages

        messages.forEach(message => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
                      <td>${message.id}</td>
                      <td>${message.user_id}</td>
                      <td>${message.timestamp_utc}</td>
                      <td>${message.message_body}</td>
                      <td>${message.agent_response || 'Pending'}</td>
                      <td><button onclick="respondToMessage(${message.id})">Respond</button></td>
                  `;
          tbody.appendChild(tr);
        });
      })
      .catch(error => console.error('Error fetching agent messages:', error));

    // Search messages
    document.querySelector('#search-btn').addEventListener('click', () => {
      const query = document.getElementById('search-query').value;
      fetch(`/api/search-messages?query=${query}`)
        .then(response => response.json())
        .then(messages => {
          const tbody = document.querySelector('#messages-table tbody');
          tbody.innerHTML = ''; // Clear previous results

          messages.forEach(message => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                          <td>${message.id}</td>
                          <td>${message.user_id}</td>
                          <td>${message.timestamp_utc}</td>
                          <td>${message.message_body}</td>
                          <td>${message.agent_response || 'Pending'}</td>
                          <td><button onclick="respondToMessage(${message.id})">Respond</button></td>
                      `;
            tbody.appendChild(tr);
          });
        })
        .catch(error => console.error('Error searching messages:', error));
    });

    // Handle response submission
    document.querySelector('#submit-response').addEventListener('click', () => {
      const id = document.querySelector('#message-id').value;
      const agentResponse = document.querySelector('#agent-response').value;

      fetch('/api/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, agent_response: agentResponse })
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            alert('Response added successfully');
            // Optionally, you can update the table with the new response
            // or refresh the message list.
          }
        })
        .catch(error => console.error('Error submitting response:', error));
    });
  }
});


// Customer login
document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const userId = document.getElementById('user-id').value;
  const password = document.getElementById('password').value; // You might not need this if not implementing authentication
  const loginAs = document.querySelector('input[name="login-as"]:checked').value;

  if (!userId) { // You might not need to check the password
    alert('Please fill in the User ID field.');
    return;
  }

  if (loginAs === 'customer') {
    window.location.href = `/customer-dashboard?userId=${userId}`;
  } else {
    window.location.href = `/agent-dashboard?userId=${userId}`;
  }
});

function respondToMessage(id) {
  document.querySelector('#message-id').value = id;
  // You might want to scroll to the response form or do other UI updates here.
}