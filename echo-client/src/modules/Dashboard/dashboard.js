import React, { useEffect, useState, useRef } from 'react'
import Avatar from '../../assets/avatar2.png'
import Input from "../../components/Input/input"
import { io } from 'socket.io-client'
import { useNavigate } from "react-router-dom";


const Dashboard = () => {

    // const contacts = [
    //     {
    //         name: 'Asif',
    //         status: 'Available',
    //         image: Avatar
    //     },
    //     {
    //         name: 'Jamy',
    //         status: 'Available',
    //         image: Avatar
    //     },

    // ]

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
    const [conversations, setConversations] = useState([]);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState({});

    const [selectedConversation, setSelectedConversation] = useState(null);

    const [socket, setSocket] = useState(null)
    const messageRef = useRef(null)

    const navigate = useNavigate();

    useEffect(() => {
        setSocket(io('http://localhost:8080'))
    }, [])

    useEffect(() => {
        socket?.emit('addUser', user?.id);
        socket?.on('getUsers', users => {
            console.log('activeUsers :>> ', users);
        })
        socket?.on('getMessage', data => {
            // VVI -- here prev used in setMessages to maintain sequence of the messages.  agge pore na ashe jeno.
            setMessages(prev => ({
                ...prev,
                messages: [...prev.messages, { user: data.user, message: data.message }]
            }))
        })
    }, [socket])

    // useEffect(() => {
    //     messageRef?.current?.scrollIntoView({ behavior: 'smooth' })
    // }, [messages?.messages])


    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user:detail'))
        const fetchConversations = async () => {
            const res = await fetch(`http://localhost:8000/api/conversations/${loggedInUser?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }

            });
            const resData = await res.json()
            //console.log('resData from Dashboard ->', resData);
            setConversations(resData);

        }
        fetchConversations();
    }, [])



    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch(`http://localhost:8000/api/users/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const resData = await res.json()
            setUsers(resData)
        }
        fetchUsers()
    }, [])




    //console.log('User from Dashboard->', user);
    //console.log('Conversations from Dashboard ->', conversations);


    const fetchMessages = async (conversationId, receiver) => {
        const res = await fetch(`http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const resData = await res.json()
        setMessages({ messages: resData, receiver, conversationId })
    }


    // const sendMessage = async (e) => {
    //     const url = 'http://localhost:8000/api/message';

    //     const res = await fetch(url, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             conversationId: message?.conversationId,
    //             senderId: user?._id,
    //             message,
    //             receiverId: message?.receiver?.receiverId,
    //         }),
    //     });
    //     const resData = await res.json()
    //     console.log('resData from Dashboard ->', resData);
    //     setMessage('');
    // }

    const sendMessage = async (e) => {
        setMessage('')

        socket?.emit('sendMessage', {
            senderId: user?.id,
            receiverId: messages?.receiver?.receiverId,
            message,
            conversationId: messages?.conversationId
        });

        const res = await fetch(`http://localhost:8000/api/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversationId: messages?.conversationId,
                senderId: user?.id,
                message,
                receiverId: messages?.receiver?.receiverId
            })
        });
    }


    const handleDeleteConversation = (conversationId) => {
        // Send a DELETE request to your server's endpoint
        fetch(`http://localhost:8000/api/conversation/${conversationId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.status === 200) {
                    // Remove the deleted conversation from the local state
                    setConversations((prevConversations) =>
                        prevConversations.filter((conv) => conv.conversationId !== conversationId)
                    );
                }
            })
            .catch((error) => console.error(error));
    };

    // // Function to handle user sign-out
    // const handleSignOut = () => {
    //     // Perform any necessary sign-out actions (e.g., clear local storage, log the user out on the server, etc.)
    //     // Redirect to the sign-in page or any other desired behavior
    //     // Example: Clear user data from local storage and redirect to the sign-in page
    //     localStorage.removeItem('user:detail');
    //     window.location.href = '/login'; // Replace with your desired redirect path
    // };

    const handleSignOut = () => {
        // Clear the user's token and user details from local storage
        localStorage.removeItem("user:token");
        localStorage.removeItem("user:detail");

        // Redirect to the sign-in page or any other appropriate page
        navigate("/users/sign_in"); // You can replace this with the desired redirect URL

        // You can also add an API call to the server to invalidate the token on the server-side if needed.
    };

    // // Function to handle user sign-out
    // async function handleSignOut() {
    //     try {
    //         // Make a POST request to the server's sign-out route
    //         const response = await fetch('/api/signout', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 // You might need to include the user's authentication token if applicable
    //                 // 'Authorization': `Bearer ${userAuthToken}`
    //             },
    //         });

    //         if (response.status === 200) {
    //             // Sign-out was successful
    //             console.log('Sign-out successful');
    //             //window.location.href = '/signin';
    //             // Redirect the user to the login page or perform any other desired action.
    //             // For example, in React, you might use React Router: history.push('/login');
    //         } else {
    //             // Handle sign-out error
    //             console.error('Sign-out failed');
    //             // Display an error message or perform error-handling actions.
    //         }
    //     } catch (error) {
    //         console.error('An error occurred:', error);
    //         // Handle network errors or other exceptions
    //     }
    // }



    return (
        <div className='w-screen flex'>
            <div className='w-[25%] rounded-lg h-screen shadow-lg bg-secondary'>
                <div className=' flex items-center my-8 mx-14'>
                    <div className='border-2 border-primary rounded-full'>
                        <img src={Avatar} width={75} height={75} className="rounded-full border border-white" />
                    </div>
                    <div className='ml-4'>
                        {/* <h1 className='text-2xl'>{user.firstName} {user.lastName}</h1> */}
                        <h1 className="text-2xl">{user.firstName}&nbsp;{user.lastName}</h1>
                        <p className='text-lg font-light'>User Details</p>
                    </div>
                </div>
                <hr style={{ borderTop: '2px solid #ffffff' }} />

                <div className='mx-14 mt-10'>
                    <div className='text-primary text-2xl font-bold'>Messages</div>
                    <div className='mt-9'>
                        {
                            conversations.length > 0 ?
                                conversations.map(({ conversationId, user, image = Avatar }) => {
                                    return (
                                        <div className='flex items-center py-6 border-b border-b-gray-400'>
                                            <div className='cursor-pointer flex items-center' onClick={() => fetchMessages(conversationId, user)}>
                                                <div className='rounded-full'>
                                                    <img src={image} width={50} height={50} className="rounded-full border border-white" />
                                                </div>
                                                <div className='ml-4 '>
                                                    <h1 className='text-lg font-medium'>{user?.firstName}&nbsp;{user?.lastName}</h1>
                                                    <p className='text-sm font-light text-gray-600'>{user?.email}</p>
                                                    <p className='text-xs font-light text-gray-600'>status: online/ *2* min ago/offline</p>
                                                </div>
                                            </div>
                                            <div className='ml-auto cursor-pointer' onClick={() => handleDeleteConversation(conversationId)}>
                                                {/* Delete SVG Icon */}
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M4 7l16 0"></path>
                                                    <path d="M10 11l0 6"></path>
                                                    <path d="M14 11l0 6"></path>
                                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                                                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    );
                                }) : <div className='text-center text-lg font-semibold mt-24'> No Conversation

                                </div>

                        }
                    </div>
                </div>
            </div>
            <div className='w-[50%] rounded-lg  h-screen shadow-lg bg-lightBackground flex flex-col items-center'>
                {
                    messages?.receiver?.firstName && messages?.receiver?.lastName && (
                        <div className='w-[75%] bg-accent h-[80px] my-10 rounded-full flex items-center px-10'>
                            <div className='rounded-full cursor-pointer'>
                                <img src={Avatar} width={50} height={50} className="rounded-full border border-white" />
                            </div>
                            <div className='ml-4 mr-auto'>
                                <h3 className='text-lg font-semibold '>{`${messages.receiver.firstName} ${messages.receiver.lastName}`}</h3>
                                <p className='text-sm font-light text-gray-600'>{messages.receiver.email}</p>
                                {/* <p className='text-xs font-light text-gray-600'>status: online/ *2* min ago/offline</p> */}
                            </div>
                            <div className='cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-phone-outgoing" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path>
                                    <path d="M15 9l5 -5"></path>
                                    <path d="M16 4l4 0l0 4"></path>
                                </svg>
                            </div>
                        </div>
                    )
                }

                {/* <div className='h-[74%] w-full mt-2 overflow-scroll' style={{ overflowX: 'hidden' }}>
                    <div className='h-[1000px] p-14 flex flex-col'> */}
                <div className="h-[74%] w-full mt-2 overflow-y-auto" style={{ overflowX: 'hidden' }}>
                    <div className="h-auto max-h-[1000px] p-14 flex flex-col">
                        {/* <div className='w- auto max-w-[45%] bg-accent rounded-b-2xl rounded-tr-2xl p-4 mr-auto text-left'>
                            Line 43:25:  img elements must have an alt prop, either with meaningful text, or an empty
                            string for decorative images  jsx-a11y/alt-text
                        </div>
                        <div className='w-auto max-w-[45%] bg-lightText rounded-b-2xl rounded-tl-2xl ml-auto p-4 text-right'>
                            Line 60:45:
                        </div>
                        <div className='w-auto max-w-[45%] bg-accent rounded-b-2xl rounded-tr-2xl p-4 mr-auto text-left'>
                            Line 43:25:
                        </div> */}
                        {
                            messages?.messages?.length > 0 ?
                                messages.messages.map(({ message, user: { id } = {} }) => {
                                    return (


                                        <div className={`w- auto max-w-[45%] rounded-b-2xl p-4 mt-6 ${id === user?.id ?
                                            ' bg-lightText ml-auto text-right rounded-tl-2xl' : ' bg-accent rounded-tr-2xl  mr-auto text-left'
                                            }`}>
                                            {message}
                                        </div>
                                        // {/* <div ref={messageRef}></div> */}

                                    )
                                }) : <div className='text-center text-lg font-semibold mt-24 '>No Message</div>

                        }
                    </div>
                </div>

                {
                    messages?.receiver?.firstName && messages?.receiver?.lastName && (

                        // <div className='p-9 w-full flex items-center'>
                        //     <Input className='w-[75%] p-4 border-0 shadow-lg rounded-md focus:ring-0 focus-border-0 outline-none'
                        //         placeholder='Type a text...' value={message} onChange={(e) => setMessage(e.target.value)} />

                        //     {/* <div className={`ml-6 p-3 cursor-pointer bg-send rounded-full ${!message
                        //         && 'pointer-events-none'}`} onClick={() => sendMessage()}> */}

                        //     <div className={`ml-3 p-3 cursor-pointer bg-send rounded-full ${!message && 'pointer-events-none'}`}
                        //         style={{
                        //             border: !message ? '4px solid red' : 'none' // Add your normal border styles here
                        //         }}
                        //         onClick={() => sendMessage()}
                        //     >
                        //         <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        //             <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        //             <path d="M10 14l11 -11"></path>
                        //             <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
                        //         </svg>
                        //     </div>
                        //     <div className={`ml-3 p-3 cursor-pointer bg-send rounded-full ${!message && 'pointer-events-none'}`}
                        //         style={{
                        //             border: !message ? '4px solid red' : 'none' // Add your normal border styles here
                        //         }}
                        //     >
                        //         <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-rounded-plus" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        //             <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        //             <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                        //             <path d="M15 12h-6"></path>
                        //             <path d="M12 9v6"></path>
                        //         </svg>
                        //     </div>
                        // </div>

                        <div className='p-9 w-full flex items-center'>
                            <Input
                                className='w-[75%] p-4 border-0 shadow-lg rounded-md focus:ring-0 focus-border-0 outline-none'
                                placeholder='Type a text...'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <div
                                className={`ml-3 p-3 cursor-pointer bg-send rounded-full ${!message && 'pointer-events-none'
                                    }`}
                                onClick={() => sendMessage()}
                            >
                                {message ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="icon icon-tabler icon-tabler-send"
                                        width="30"
                                        height="30"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 14l11 -11"></path>
                                        <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>

                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="icon icon-tabler icon-tabler-send-off"
                                        width="30"
                                        height="30"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 14l2 -2m2 -2l7 -7"></path>
                                        <path d="M10.718 6.713l10.282 -3.713l-3.715 10.289m-1.063 2.941l-1.722 4.77a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l4.772 -1.723"></path>
                                        <path d="M3 3l18 18"></path>
                                    </svg>
                                )}
                            </div>
                            <div
                                className={`ml-3 p-3 cursor-pointer bg-send rounded-full ${!message && 'pointer-events-none'
                                    }`}
                            >
                                {message ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="icon icon-tabler icon-tabler-square-rounded-plus"
                                        width="30"
                                        height="30"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                                        <path d="M15 12h-6"></path>
                                        <path d="M12 9v6"></path>
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="icon icon-tabler icon-tabler-square-forbid"
                                        width="30"
                                        height="30"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
                                        <path d="M9 9l6 6"></path>
                                    </svg>
                                )}
                            </div>
                        </div>
                    )
                }




            </div>
            <div className='w-[25%] rounded-lg  h-screen shadow-lg  bg-secondary'>

                {/* <div className="flex items-center justify-end p-4">

                    <button onClick={handleSignOut} className="text-white bg-red-500 px-4 py-2 rounded-md">
                        Sign Out
                    </button>
                </div> */}

                <div className="flex items-center justify-end p-4">
                    <a
                        href="#"
                        onClick={handleSignOut}
                        className="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group"
                    >
                        <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
                        <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
                        <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
                        <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease">
                            Sign Out
                        </span>
                    </a>
                </div>

                <div className='text-primary text-2xl font-bold px-8 py-8 mt-14 '>Users</div>

                <hr style={{ borderTop: '2px solid #ffffff' }} />
                <div className=' px-8 py-8'>
                    {
                        users.length > 0 ?
                            users.map(({ conversationId, user, image = Avatar }) => {
                                return (
                                    <div className='flex items-center py-6 border-b border-b-gray-400'>
                                        <div className='cursor-pointer flex items-center' onClick={() =>
                                            fetchMessages('new', user)}>
                                            <div className='rounded-full'>
                                                <img src={image} width={50} height={50} className="rounded-full border border-white" />
                                            </div>
                                            <div className='ml-4 '>
                                                <h1 className='text-lg font-medium' >{user?.firstName}&nbsp;{user?.lastName}</h1>
                                                <p className='text-sm font-light text-gray-600'>{user?.email}</p>
                                                {/* <p className='text-xs font-light text-gray-600'>status: online/ *2* min ago/offline</p> */}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : <div className='text-center text-lg font-semibold mt-24'> No Conversation

                            </div>

                    }
                </div>

            </div>




        </div >
    )
}

export default Dashboard