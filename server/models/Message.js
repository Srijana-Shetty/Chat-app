const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
 user: {
    type: String,
    required: true,
 },
 showTime:{
   type:String,
   required:true,
 },
 text: {
    type: String,
    required: true,
 },
 room: {
    type: String,
    required: true,
 },
 createdAt: {
    type: Date,
    default: Date.now,
 },
});
const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
