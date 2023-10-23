const mongoose = require('mongoose');

// Define a Mongoose schema
const conversationSchema = new mongoose.Schema({


    members: {
        type: Array, //*********************** this type is array because here senderId and receiverId will be saved */
        required: true, // Makes the field required
    },

});

// Create a Mongoose model based on the schema
const Conversations = mongoose.model('Conversation', conversationSchema);

// Export the User model
module.exports = Conversations;