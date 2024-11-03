const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const {getReceiverSocketId} = require('../socket/socket')
// Get all messages between two users
const getMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;
        
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');

        if (!conversation) return res.status(200).json({ success: true, messages: [] });

        return res.status(200).json({ success: true, messages: conversation.messages });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to get messages' });
    }
};

// Send a message
const sendMessage = async (req, res) => {
    try {
        console.log("hi");
        
        const senderId = req.user.id;
        const receiverId = req.params.id;
        const { message: textMessage } = req.body;
        console.log(senderId,receiverId,textMessage)
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message: textMessage
        });

        conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

        // Emit real-time message using Socket.IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        return res.status(201).json({ success: true, newMessage });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};

// Get all conversations for a user
const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        }).populate('participants', 'username');

        return res.status(200).json({ success: true, conversations });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to get conversations' });
    }
};

module.exports = { getMessage, sendMessage, getConversations };
