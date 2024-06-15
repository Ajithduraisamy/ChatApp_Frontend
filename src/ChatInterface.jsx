import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatInterface = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [socket, setSocket] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [seenMessages, setSeenMessages] = useState(new Set());

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io('https://chatapp-backend-09n7.onrender.com', {
      query: { token: user.token }
    });
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
        toast.info('Socket disconnected');
      }
    };
  }, [user.token]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', handleMessageReceived);

      socket.on('disconnect', () => {
        toast.info('Socket disconnected');
      });

      fetchRecentChats();
      fetchContacts();
    }
    return () => {
      if (socket) {
        socket.off('receiveMessage', handleMessageReceived);
      }
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 3000); // Hide alert after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('https://chatapp-backend-09n7.onrender.com/contacts', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setContacts(response.data.contacts);
    } catch (error) {
      handleRequestError(error, 'Error fetching contacts');
    }
  };

  const fetchRecentChats = async () => {
    try {
      const response = await axios.get('https://chatapp-backend-09n7.onrender.com/chats/recent', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setRecentChats(response.data.recentChats);
    } catch (error) {
      handleRequestError(error, 'Error fetching recent chats');
    }
  };

  const sendMessage = () => {
    if (!message.trim()) {
      setAlertMessage('Message cannot be empty.');
      return;
    }

    if (!selectedChat || !selectedChat.users) {
      setAlertMessage('Please select a chat with valid users.');
      return;
    }

    const newMessage = {
      content: message,
      chatId: selectedChat._id,
    };

    if (socket) {
      socket.emit('sendMessage', newMessage);
      setMessage('');
    }
  };

  const handleMessageReceived = (message) => {
    if (selectedChat && selectedChat._id === message.chat && !seenMessages.has(message._id)) {
      setMessages(prevMessages => [...prevMessages, message]);
      updateRecentChatsWithNewMessage(message);
      handleNotifications(message);
      setSeenMessages(prevSeenMessages => new Set(prevSeenMessages).add(message._id));
    }
  };

  const handleNotifications = (message) => {
    if (message.sender._id !== user.userId) {
      toast.info(`${message.sender.username} sent you a message: ${message.content}`);
    }
  };

  const handleSelectChat = async (chat) => {
    if (!chat._id) {
      console.error('Invalid chat ID');
      return;
    }

    setSelectedChat(chat);

    try {
      const response = await axios.get(`https://chatapp-backend-09n7.onrender.com/chats/${chat._id}/messages`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessages(response.data.messages);
      if (socket) {
        socket.emit('joinRoom', chat._id);
      }
    } catch (error) {
      handleRequestError(error, 'Error fetching chat messages');
    }
  };

  const handleSelectContact = async (contact) => {
    try {
      const response = await axios.post("https://chatapp-backend-09n7.onrender.com/chats/private", { recipientId: contact._id }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      handleSelectChat(response.data.chat);
      setSearchQuery('');
    } catch (error) {
      handleRequestError(error, 'Error creating or fetching chat');
    }
  };

  const updateRecentChatsWithNewMessage = (message) => {
    const updatedChats = recentChats.map(chat => {
      if (chat._id === message.chatId) {
        return {
          ...chat,
          latestMessage: message
        };
      }
      return chat;
    });
    setRecentChats(updatedChats);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRequestError = (error, defaultMessage) => {
    console.error(defaultMessage, error);
    toast.error(`${defaultMessage}. Please try again later.`);
  };

  return (
    <div className="container mt-5">
      <ToastContainer autoClose={3000} />
      {alertMessage && (
        <div className="alert alert-danger" role="alert">
          {alertMessage}
        </div>
      )}
      <div className="row">
        <div className="col-md-3">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search Contacts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery ? (
            <>
              <h4>Search Results</h4>
              <ul className="list-group mb-3">
                {contacts
                  .filter(contact =>
                    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(contact => (
                    <li
                      key={contact._id}
                      className="list-group-item"
                      onClick={() => handleSelectContact(contact)}
                    >
                      {contact.username}
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <>
              <h4>Recent Chats</h4>
              <ul className="list-group mb-3">
                {recentChats.map(chat => (
                  <li
                    key={chat._id}
                    className={`list-group-item ${selectedChat && selectedChat._id === chat._id ? 'active' : ''
                      }`}
                    onClick={() => handleSelectChat(chat)}
                  >
                    {chat.users?.find(u => u._id !== user.userId)?.username}
                    {chat.latestMessage && (
                      <span className="text-muted">: {chat.latestMessage.content}</span>
                    )}
                    {chat.unreadMessagesCount > 0 && (
                      <span className="badge bg-primary rounded-pill ms-2">
                        {chat.unreadMessagesCount}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="col-md-9">
          <h4>
            {selectedChat
              ? `Chat with ${selectedChat.users?.find(u => u._id !== user.userId)?.username}`
              : 'Select a chat or contact to start'}
          </h4>
          <div
            className="border rounded p-3 mb-3 position-relative"
            style={{ height: '400px', overflowY: 'scroll' }}
          >
            {messages.map((msg, index) => {
              const isMyMessage = msg.sender._id === user.userId;

              return (
                <div
                  key={index}
                  className={`mb-2 d-flex ${isMyMessage ? 'justify-content-end' : 'justify-content-start'
                    }`}
                >
                  <div
                    className={`p-2 rounded ${isMyMessage ? 'bg-primary text-white' : 'bg-light'
                      }`}
                  >
                    {msg.sender.username && <strong>{msg.sender.username}: </strong>}
                    {msg.content}
                    <div className="text-muted small">
                      {new Date(msg.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          {selectedChat && (
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
              />
              <button className="btn btn-primary" onClick={sendMessage}>
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;