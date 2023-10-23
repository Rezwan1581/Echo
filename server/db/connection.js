const mongoose = require('mongoose');

const url = "mongodb+srv://Rezwan:87654321Asif@cluster0.ollwbnb.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the MongoDB database');
}).catch((error) => {
    console.error(`Mongoose connection error: ${error}`);
});

