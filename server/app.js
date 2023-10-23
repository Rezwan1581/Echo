const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const jwt = require('jsonwebtoken');

//DB Connection
require('./db/connection');

//Import Files
const Users = require('./models/Users');
const Conversations = require('./models/Conversations');
const Messages = require('./models/Messages');

//App use
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Routes
// Define a GET request handler
app.get('/', (req, res) => {
    // You can replace this with any data you want to send as a response

    //res.write('Welcome ! This is a GET request response');
    res.send('Welcome ! This is a GET request response');


    //     In this code:

    // We import and create an Express application.
    // We define a GET request handler for the /api/data endpoint. When a GET request is made to this endpoint, the handler function is executed.
    // In the handler function, you can replace the responseData object with the data you want to send as a response.
    // We use res.json(responseData) to send a JSON response back to the client.

    // const responseData = {
    //     message: 'This is a GET request response',
    //     data: {
    //         key: 'value',
    //     },
    // };
    // Send the JSON response

    //res.end();
});

//Route that handles a POST request
app.post('/api/register', async (req, res, next) => {
    try {
        // Get data from the request body
        const { firstName, lastName, email } = req.body;

        // Perform some validation or data processing
        if (!firstName || !lastName || !email) {
            req.status(400).send('Please fill all the required fields');
        } else {
            const isAlreadyExist = await Users.findOne({ email });
            if (isAlreadyExist) {
                req.status(400).send('User already exists');
            } else {
                const newUser = new Users({ firstName, lastName, email });

                newUser.save();
                next();

                // Respond with a success message
                return res.status(200).send('User registered successfully');
            }
        }
        // Save the data to the database or perform other operations
        // Replace this with your database interaction code


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the request' });
    }
});

app.post('/api/login', async (req, res, next) => {

    try {

        const { email } = req.body;

        if (!email) {
            req.status(400).send('Insert EMAIL !!!');
        } else {
            const user = await Users.findOne({ email });
            if (!user) {
                req.status(400).send('User does not exist! Please, Sign-up');
            } else {
                //payload data
                const payload = {
                    userId: user._id,
                    email: user.email,
                };

                const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_A_JWT_SECRET_KEY';

                // Generate the JWT token with the payload
                //const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Set an expiration time (e.g., 1 hour)
                jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '4h' }, async (err, token) => {
                    await Users.updateOne({ _id: user._id }, {
                        $set: { token }
                    })
                    user.save();
                    next();
                });

                res.status(200).json({ user: { email: user.email, firstName: user.firstName, lastName: user.lastName }, token: user.token });
            }

        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the request' });
    }
});

app.post('/api/conversation', async (req, res, next) => {

    try {
        const { senderId, receiverId } = req.body;
        const newConversation = new Conversations({ members: [senderId, receiverId] });
        await newConversation.save();
        return res.status(200).send('Conversation created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the request' });
    }
});



// "Async JavaScript" typically refers to the use of asynchronous programming techniques in JavaScript. 
//Asynchronous JavaScript allows you to write code that doesn't block the execution of other code and is 
//particularly useful for handling operations that might take some time to complete, 
//such as network requests, file I/O, or timers.

// Key concepts and mechanisms related to asynchronous JavaScript include:

// Promises: Promises are objects that represent the eventual completion or failure of an asynchronous operation and are used to work with asynchronous code in a more organized and structured manner.

// Async/Await: The async/await syntax is built on top of Promises and provides a way to write asynchronous code in a more synchronous style, making it easier to understand and maintain. The async keyword is used to define asynchronous functions, and await is used within those functions to pause execution until Promises are resolved.

// Callbacks: Callback functions are a common way to work with asynchronous operations in JavaScript. A callback is a function that is passed as an argument to another function and is executed when the asynchronous operation is complete.

// Event Loop: The event loop is the core of JavaScript's concurrency model. It's responsible for handling asynchronous operations and managing the execution of different pieces of code.

// Timers: JavaScript provides functions like setTimeout and setInterval for scheduling code to run at a future time or repeatedly at specified intervals.

// XHR and Fetch API: XMLHttpRequest (XHR) and the Fetch API are used for making asynchronous HTTP requests to retrieve data from a server.

// Promises for I/O: Promises can be used with I/O operations, such as reading files in a Node.js environment, to perform asynchronous file operations.


// Asynchronous JavaScript is essential for building responsive and non-blocking web applications, 
// as it allows the main thread to remain free for user interactions while handling time-consuming tasks in the background. 
//It also plays a crucial role in dealing with network requests and interacting with external resources.

// Asynchronous code can be more complex to write and reason about, but with the introduction of Promises and the 
//async/await syntax, it has become much more manageable and readable. This allows developers to build efficient 
//and user-friendly web applications.



app.get('/api/conversation/:userId', async (req, res) => {

    try {
        const userId = req.params.userId;

        //$in means include. In this line what it is doing is , Goes to the Conversation models 
        //and finds all the chat where this Id is included
        const conversations = await Conversations.find({ members: { $in: [userId] } });

        const conversationUserData = Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member != userId);
            const user = await Users.findById(receiverId);
            return ({ user: { email: user.email, firstName: user.firstName, lastName: user.lastName }, conversationId: conversation._id })

        }))

        res.status(200).json(await conversationUserData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the request' });
    }
});

app.post('/api/message', async (req, res, next) => {

    try {
        const { conversationId, senderId, message } = req.body;
        const newMessage = new Messages({ conversationId, senderId, message });
        await newMessage.save();
        return res.status(200).send('*****Happy Messaging*****');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the request' });
    }
});




// Start the server and listen for incoming connections
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
