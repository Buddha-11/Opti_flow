import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/user';  // Assuming user context exists for authentication
import io from 'socket.io-client';

const socket = io('http://localhost:4000');  // Connect to the Socket.IO server

const Chat = () => {
  const { tokenId } = useContext(UserContext);  // Assuming you have tokenId from your context
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (tokenId) {
      socket.emit('join', { userId: tokenId });  // Notify the server that the user is online
    }
    
    socket.on('newMessage', (newMessage) => {
      // Update messages if the new message belongs to the current conversation
      if (newMessage.conversationId === currentConversationId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [tokenId, currentConversationId]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/chat/conversations', {
        headers: {
          Authorization: `Bearer ${document.cookie.split('jwt=')[1]}`
        }
      });
      const json = await res.json();
      setConversations(json.conversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await fetch(`/api/chat/messages/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${document.cookie.split('jwt=')[1]}`
        }
      });
      const json = await res.json();
      setMessages(json.messages);
      setCurrentConversationId(conversationId);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/chat/messages/${currentConversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${document.cookie.split('jwt=')[1]}`
        },
        body: JSON.stringify({ message })
      });
      const json = await res.json();
      setMessages((prevMessages) => [...prevMessages, json.newMessage]);
      setMessage('');  // Clear the input field
      socket.emit('sendMessage', json.newMessage);  // Emit the message to the socket
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div>
      <h1>Chat</h1>
      <div>
        <h2>Conversations</h2>
        <ul>
          {conversations.map((conversation) => (
            <li key={conversation._id} onClick={() => fetchMessages(conversation._id)}>
              {conversation.participants.map((p) => p.username).join(', ')}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((msg) => (
            <li key={msg._id}>{msg.message}</li>
          ))}
        </ul>
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
