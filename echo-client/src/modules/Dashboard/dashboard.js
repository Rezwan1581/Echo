import React from 'react'
import Avatar from '../../assets/avatar1.png'
import Input from "../../components/Input/input"

const Dashboard = () => {

    const contacts = [
        {
            name: 'Asif',
            status: 'Available',
            image: Avatar
        },
        {
            name: 'Jamy',
            status: 'Available',
            image: Avatar
        },
        {
            name: 'Jim',
            status: 'Available',
            image: Avatar
        },
        {
            name: 'Rishad',
            status: 'Available',
            image: Avatar
        },
        {
            name: 'Tonmoy',
            status: 'Available',
            image: Avatar
        },
        {
            name: 'Moin',
            status: 'Available',
            image: Avatar
        }
    ]
    return (
        <div className='w-screen flex'>
            <div className='w-[25%] rounded-lg h-screen shadow-lg bg-secondary'>
                <div className=' flex items-center my-8 mx-14'>
                    <div className='border-2 border-primary rounded-full'>
                        <img src={Avatar} width={75} height={75} className="rounded-full border border-white" />
                    </div>
                    <div className='ml-4'>
                        <h1 className='text-2xl'>User's name</h1>
                        <p className='text-lg font-light'>User Details</p>
                    </div>
                </div>
                <hr style={{ borderTop: '2px solid #ffffff' }} />

                <div className='mx-14 mt-10'>
                    <div className='text-primary text-2xl font-bold'>Messages</div>
                    <div className='mt-9'>{
                        contacts.map(({ name, status, image }) => {
                            return (
                                <div className='flex items-center py-6 border-b border-b-gray-400'>
                                    <div className='cursor-pointer flex items-center'>
                                        <div className='rounded-full'>
                                            <img src={image} width={50} height={50} className="rounded-full border border-white" />
                                        </div>
                                        <div className='ml-4 '>
                                            <h1 className='text-lg font-medium' >{name}</h1>
                                            <p className='text-sm font-light text-gray-600'>{status}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
            </div>
            <div className='w-[50%] rounded-lg  h-screen shadow-lg bg-lightBackground flex flex-col items-center'>
                <div className='w-[75%] bg-secondary h-[80px] my-10 rounded-full flex items-center px-10'>
                    <div className='rounded-full cursor-pointer'>
                        <img src={Avatar} width={50} height={50} className="rounded-full border border-white" />
                    </div>
                    <div className='ml-4 mr-auto'>
                        <h3 className='text-lg font-semibold '>Khandaker</h3>
                        <p className='text-sm font-light text-gray-600'>online</p>
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
                <div className='h-[74%] w-full mt-2 overflow-scroll' style={{ overflowX: 'hidden' }}>
                    <div className='h-[1000px] p-14 flex flex-col'>
                        <div className='w- auto max-w-[45%] bg-accent rounded-b-2xl rounded-tr-2xl p-4 mr-auto text-left'>
                            Line 43:25:  img elements must have an alt prop, either with meaningful text, or an empty
                            string for decorative images  jsx-a11y/alt-text
                        </div>
                        <div className='max-w-[45%] bg-lightText rounded-b-2xl rounded-tl-2xl ml-auto p-4 text-right'>
                            Line 60:45:
                        </div>
                        <div className='w- auto max-w-[45%] bg-accent rounded-b-2xl rounded-tr-2xl p-4 mr-auto text-left'>
                            Line 43:25:
                        </div>
                        <div className='max-w-[45%] bg-lightText rounded-b-2xl rounded-tl-2xl ml-auto p-4 text-right'>
                            Line 60:45: img elements must have an alt prop, either with meaningful text, or an empty
                            string for decorative images  jsx-a11y/alt-text
                        </div>
                        <div className='w- auto max-w-[45%] bg-accent rounded-b-2xl rounded-tr-2xl p-4 mr-auto text-left'>
                            Line 43:25:
                        </div>
                        <div className='max-w-[45%] bg-lightText rounded-b-2xl rounded-tl-2xl ml-auto p-4 text-right'>
                            Line 60:45:
                        </div>
                        <div className='w- auto max-w-[45%] bg-accent rounded-b-2xl rounded-tr-2xl p-4 mr-auto text-left'>
                            Line 43:25:
                        </div>
                        <div className='max-w-[45%] bg-lightText rounded-b-2xl rounded-tl-2xl ml-auto p-4 text-right'>
                            Line 60:45:
                        </div>
                        <div className='w- auto max-w-[45%] bg-accent rounded-b-2xl rounded-tr-2xl p-4 mr-auto text-left'>
                            Line 43:25:
                        </div>
                        <div className='max-w-[45%] bg-lightText rounded-b-2xl rounded-tl-2xl ml-auto p-4 text-right'>
                            Line 60:45:
                        </div>
                        <div className='w- auto max-w-[45%] bg-accent rounded-b-2xl rounded-tr-2xl p-4 mr-auto text-left'>
                            Line 43:25:
                        </div>
                        <div className='max-w-[45%] bg-lightText rounded-b-2xl rounded-tl-2xl ml-auto p-4 text-right'>
                            Line 60:45: img elements must have an alt prop, either with meaningful text, or an empty
                            string for decorative images  jsx-a11y/alt-text
                        </div>
                        <div className='w- auto max-w-[45%] bg-accent rounded-b-2xl rounded-tr-2xl p-4 mr-auto text-left'>
                            Line 43:25:
                        </div>
                        <div className='max-w-[45%] bg-lightText rounded-b-2xl rounded-tl-2xl ml-auto p-4 text-right'>
                            Line 60:45: img elements must have an alt prop, either with meaningful text, or an empty
                            string for decorative images  jsx-a11y/alt-text
                        </div>

                    </div>
                </div>
                <div className='p-9 w-full flex items-center'>
                    <Input className='w-[75%] p-4 border-0 shadow-lg rounded-md focus:ring-0 focus-border-0 outline-none' placeholder='Type a text...' />

                    <div className='ml-6 p-3 cursor-pointer bg-send rounded-full '>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M10 14l11 -11"></path>
                            <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
                        </svg>
                    </div>
                    <div className='ml-3 p-3 cursor-pointer bg-send rounded-full '>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-rounded-plus" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                            <path d="M15 12h-6"></path>
                            <path d="M12 9v6"></path>
                        </svg>
                    </div>
                </div>

            </div>
            <div className='w-[25%] rounded-lg  h-screen shadow-lg  bg-secondary'></div>
        </div >
    )
}

export default Dashboard