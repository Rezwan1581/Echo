const mongoose = require('mongoose');

// Define a Mongoose schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true, // Makes the field required
    },
    lastName: {
        type: String,
        required: true, // Makes the field required
    },
    email: {
        type: String,
        required: true, // Makes the field required
        unique: true,    // Ensures that each email is unique
        lowercase: true, // Converts the email to lowercase before saving
        // You can add validation for email format if needed
    },

    token: {
        type: String,
    },
});

// Create a Mongoose model based on the schema
const Users = mongoose.model('User', userSchema);

// Export the User model
module.exports = Users;