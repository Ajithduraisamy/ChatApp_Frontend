import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useHistory } from 'react-router-dom';

const Chat = ({ chatId, token }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const newSocket = io('http://localhost:3002', {
      query: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('joinRoom', chatId);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from server', reason);
    });

    newSocket.on('reconnect', (attempt) => {
      console.log(`Reconnected to server after ${attempt} attempts`);
      newSocket.emit('joinRoom', chatId);
    });

    newSocket.on('receiveMessage', (newMessage) => {
      console.log('Received message:', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup function
    return () => {
      newSocket.emit('leaveRoom', chatId);
      newSocket.close();
    };
  }, [chatId, token]); // Dependencies: chatId and token

  // Fetch initial messages and handle authentication
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/chats/private/${chatId}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched messages:', response.data.messages);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        // Redirect to login if unauthorized or token is missing
        if (!token || (error.response && error.response.status === 401)) {
          history.push('/login');
        }
      }
    };
    fetchMessages();
  }, [chatId, token, history]);

  // Function to send a message
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await axios.post(`http://localhost:3002/chats/private/${chatId}/messages`, { content: message }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Message sent:', response.data.newMessage);
      setMessages((prevMessages) => [...prevMessages, response.data.newMessage]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle specific error cases if needed
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 overflow-auto p-3">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <div className="p-2 bg-light border rounded">
              {msg.sender && <strong>{msg.sender.username}: </strong>}
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-top">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="button" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;