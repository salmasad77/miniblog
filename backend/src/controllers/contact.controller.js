const asyncHandler = require("express-async-handler");
const Message = require("../models/Message.model");

// @desc    Send a message
// @route   POST /api/contact
// @access  Public
exports.sendMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const newMessage = await Message.create({
    name,
    email,
    subject,
    message
  });

  res.status(201).json({ message: "Message sent successfully", data: newMessage });
});

// @desc    Get all messages
// @route   GET /api/contact
// @access  Private
exports.getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({}).sort({ createdAt: -1 });
  res.json(messages);
});
