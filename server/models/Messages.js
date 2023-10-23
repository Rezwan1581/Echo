const mongoose = require('mongoose');

// Define a Mongoose schema
const messageSchema = new mongoose.Schema({

    conversationId: {
        type: String,
    },

    //********************* Actually whose one should ne light green and whose one should be light blue for that */
    senderId: {
        type: String,
    },

    message: {
        type: String,
    },

});

// Create a Mongoose model based on the schema
const Messages = mongoose.model('Message', messageSchema);

// Export the User model
module.exports = Messages;