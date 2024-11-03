const express = require('express');
const { getMessage, sendMessage, getConversations } = require('../controllers/chatController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all messages in a conversation between two users
router.get('/chat/messages/:id', requireAuth, getMessage);

// Send a message in a conversation
router.post('/chat/messages/:id', requireAuth, sendMessage);

// Get all conversations for a user
router.get('/chat/conversations', requireAuth, getConversations);

module.exports = router;
