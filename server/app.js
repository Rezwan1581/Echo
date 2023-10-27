const express = require('express');
const port = process.env.PORT || 8000;
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const io = require('socket.io')(8080, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

//DB Connection
require('./db/connection');

//Import Files
const Users = require('./models/Users');
const Conversations = require('./models/Conversations');
const Messages = require('./models/Messages');
const { reset } = require('nodemon');

//App use

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


// Socket.io
let users = [];
io.on('connection', socket => {
    console.log('User connected', socket.id);

    //when something is received from front-end that is handled via socket.on 
    socket.on('addUser', userId => {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id };
            users.push(user);
            //if we want send anything to front end then we need to use io.emit
            io.emit('getUsers', users);
        }
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);
        const user = await Users.findById(senderId);
        console.log('sender :>> ', sender, receiver);
        if (receiver) {
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }
            });
        } else {
            // we have to io methods 1 is broadcast and one is "to" - to send message to multiple users use broadcast. and if you want to send
            //privately then 'to' 
            io.to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }
            });
        }
    });

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users);
    });
    // io.emit('getUsers', socket.userId);
});


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



app.post('/api/register', async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;

        // Validation: Check if required fields are provided
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ message: 'Please fill all the required fields' });
        }

        // Check if the user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new Users({ firstName, lastName, email });
        await newUser.save();

        // Respond with a success message
        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the request' });
    }
});

// Route for user login
app.post('/api/login', async (req, res) => {
    try {
        const { email } = req.body;

        // Validation: Check if an email is provided
        if (!email) {
            return res.status(400).json({ message: 'Insert EMAIL !!!' });
        }

        // Find the user by email
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist! Please, Sign-up' });
        }

        // Generate a JWT token
        const payload = {
            userId: user._id,
            email: user.email,
        };

        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_A_JWT_SECRET_KEY';
        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '4h' });

        // Update the user's token and save it
        user.token = token;
        await user.save();

        // Respond with user data and token
        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the request' });
    }
});

// app.post('/api/signout', async (req, res) => {
//     try {
//         // You need to identify the user who wants to sign out. You can do this based on user authentication.
//         // Once you know which user wants to sign out, you can clear their token.
//         // For example, if the user's JWT token is stored in the user's document (as you did during login), you can do:

//         // Find the user based on their authentication (e.g., by checking their session or user ID)
//         const user = await Users.findById(req.user._id);

//         if (user) {
//             // Clear the user's token
//             user.token = null;
//             await user.save();
//         }

//         // Respond with success message
//         res.status(200).json({ message: 'Sign-out successful' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while processing the request' });
//     }
// });

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



app.get('/api/conversations/:userId', async (req, res) => {

    try {
        const userId = req.params.userId;

        //$in means include. In this line what it is doing is , Goes to the Conversation models 
        //and finds all the chat where this Id is included
        const conversations = await Conversations.find({ members: { $in: [userId] } });

        const conversationUserData = Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member != userId);
            const user = await Users.findById(receiverId);
            return ({ user: { receiverId: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }, conversationId: conversation._id })

        }))

        res.status(200).json(await conversationUserData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the request' });
    }
});

app.delete('/api/conversation/:conversationId', async (req, res) => {
    try {
        const conversationId = req.params.conversationId;

        // Find and remove the conversation by its _id
        const deletedConversation = await Conversations.findByIdAndRemove(conversationId);

        if (deletedConversation) {
            // Conversation successfully deleted
            res.status(200).json({ message: 'Conversation deleted successfully' });
        } else {
            // Conversation not found
            res.status(404).json({ message: 'Conversation not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the request' });
    }
});

// app.post('/api/message', async (req, res, next) => {

//     try {

//         const { conversationId, senderId, message, receiverId = '' } = req.body;

//         // To create New Conversation
//         if (!senderId || !message) return res.status(400).send('Please fill all the required fields');
//         if (conversationId === 'new' && receiverId) {
//             const newConversation = new Conversations({ members: [senderId, receiverId] });
//             await newConversation.save();

//             const newMessage = new Messages({ conversationId: newConversation._id, senderId, message });
//             await newConversation.save();

//             return res.status(200).send('*****New Conversation Created*****Happy Messaging*****');
//         } else if (!conversationId && !receiverId) {
//             return res.status(400).send('Please fill all the required fields');
//         }
//         const newMessage = new Messages({ conversationId, senderId, message });
//         await newMessage.save();
//         return res.status(200).send('*****Happy Messaging*****');
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while processing the request' });
//     }
// });

app.post('/api/message', async (req, res) => {
    try {
        const { conversationId, senderId, message, receiverId = '' } = req.body;
        if (!senderId || !message) return res.status(400).send('Please fill all required fields')
        if (conversationId === 'new' && receiverId) {
            const newCoversation = new Conversations({ members: [senderId, receiverId] });
            await newCoversation.save();
            const newMessage = new Messages({ conversationId: newCoversation._id, senderId, message });
            await newMessage.save();
            return res.status(200).send('Message sent successfully');
        } else if (!conversationId && !receiverId) {
            return res.status(400).send('Please fill all required fields')
        }
        const newMessage = new Messages({ conversationId, senderId, message });
        await newMessage.save();
        res.status(200).send('Message sent successfully');
    } catch (error) {
        console.log(error, 'Error')
    }
})

// app.get('/api/message/:conversationId', async (req, res) => {

//     try {
//         const conversationId = req.params.conversationId;

//         // ************************ checking if there was any previous conversation happen or not
//         if (!conversationId) return res.status(200).json([]);

//         //$in means include. In this line what it is doing is , Goes to the Conversation models 
//         //and finds all the chat where this Id is included
//         const messages = await Messages.find({ conversationId });

//         const messageUserData = Promise.all(messages.map(async (message) => {

//             const user = await Users.findById(message.senderId);
//             return { user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }, message: message.message }

//         }));

//         res.status(200).json(await messageUserData);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while processing the request' });
//     }
// });


app.get('/api/message/:conversationId', async (req, res) => {
    try {
        const checkMessages = async (conversationId) => {
            console.log(conversationId, 'conversationId');
            const messages = await Messages.find({ conversationId });
            const messageUserData = Promise.all(messages.map(async (message) => {
                const user = await Users.findById(message.senderId);
                return { user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }, message: message.message };
            }));
            res.status(200).json(await messageUserData);
        };

        const conversationId = req.params.conversationId;

        if (conversationId === 'new') {
            const senderId = req.query.senderId;
            const receiverId = req.query.receiverId;
            // Check if a conversation already exists between sender and receiver
            const existingConversation = await Conversations.findOne({
                members: { $all: [senderId, receiverId] }
            });

            if (existingConversation) {
                // Conversation already exists, retrieve messages
                checkMessages(existingConversation._id);
            } else {
                // Create a new conversation if it doesn't exist
                const newConversation = new Conversations({ members: [senderId, receiverId] });
                await newConversation.save();
                checkMessages(newConversation._id);
            }
        } else {
            checkMessages(conversationId);
        }
    } catch (error) {
        console.log('Error', error);
    }
});

app.get('/api/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const users = await Users.find({ _id: { $ne: userId } });
        const usersData = Promise.all(users.map(async (user) => {
            return { user: { email: user.email, firstName: user.firstName, lastName: user.lastName, receiverId: user._id } }
        }))
        res.status(200).json(await usersData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the request' });
    }
})



// Start the server and listen for incoming connections
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
