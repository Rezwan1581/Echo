import { useState } from "react"
import Button from "../../components/Button/button"
import Input from "../../components/Input/input"
import { useNavigate } from "react-router-dom"
//import { navigate } from "@reach/router";


const Form = ({
    isSignInPage = true,
}) => {

    const [data, setdata] = useState({
        ...(!isSignInPage && {
            firstName: '',
            lastName: ''
        }),
        email: '',
    })

    console.log('data->', data)

    const navigate = useNavigate();

    // const handleSubmit = async (e) => {

    //     console.log('data -> ', data)

    //     e.preventDefault();

    //     const res = await fetch(`http://localhost:8000/api/${isSignInPage ? 'login' : 'register'}`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(data),
    //     });

    //     if (res.status === 400) {
    //         alert('Invalid Email');
    //     } else {
    //         const resData = await res.json()
    //         // console.log('Resopnse data -> ', resData)

    //         if (resData.token) {
    //             localStorage.setItem('user:token', resData.token);
    //             localStorage.setItem('user:detail', JSON.stringify(resData.user));
    //             navigate('/');
    //         }
    //     }


    // }

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     console.log('data -> ', data);

    //     const url = `http://localhost:8000/api/${isSignInPage ? 'login' : 'register'}`;

    //     const res = await fetch(url, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(data),
    //     });

    //     if (isSignInPage) {
    //         // Handle sign-in
    //         if (res.status === 400) {
    //             alert('Invalid Email');
    //         } else {
    //             const resData = await res.json();
    //             if (resData.token) {
    //                 localStorage.setItem('user:token', resData.token);
    //                 localStorage.setItem('user:detail', JSON.stringify(resData.user));
    //                 navigate('/');
    //             }
    //         }
    //     } else {
    //         // Handle sign-up
    //         if (res.status === 400) {
    //             const resData = await res.json();
    //             if (resData.message === 'User already exists') {
    //                 alert('Email is already in use');
    //             } else {
    //                 // Handle other errors
    //                 alert('An error occurred while processing the request');
    //             }
    //         } else if (res.status === 200) {
    //             const resData = await res.json();
    //             if (resData.token) {
    //                 localStorage.setItem('user:token', resData.token);
    //                 localStorage.setItem('user:detail', JSON.stringify(resData.user));
    //                 navigate('/');
    //             }
    //         }
    //     }
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = `http://localhost:8000/api/${isSignInPage ? 'login' : 'register'}`;

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (isSignInPage) {
            // Handle sign-in
            if (res.status === 400) {
                alert('Invalid Email');
            } else {
                const resData = await res.json();
                if (resData.token) {
                    localStorage.setItem('user:token', resData.token);
                    localStorage.setItem('user:detail', JSON.stringify(resData.user));
                    navigate('/');
                }
            }
        } else {
            // Handle sign-up
            if (res.status === 400) {
                const resData = await res.json();
                if (resData.message === 'User already exists') {
                    alert('Email is already in use');
                } else {
                    // Handle other errors
                    alert('An error occurred while processing the request');
                }
            } else if (res.status === 200) {
                const resData = await res.json();
                if (resData.token) {
                    localStorage.setItem('user:token', resData.token);
                    localStorage.setItem('user:detail', JSON.stringify(resData.user));
                    navigate('/login'); // Redirect to the sign-in page
                }
            }
        }
    }

    return (
        <div className="bg-signin h-screen shadow-lg rounded-lg flex flex-col justify-center items-center" >
            <div className="bg-white w-[400px] h-[650px] shadow-lg rounded-lg flex flex-col justify-center items-center">

                <div className="mt-6">
                    {/* <div className="text-4xl font-bold">Welcome {isSignInPage && 'Back'}</div>*/}
                    {isSignInPage ? (
                        <div className="text-4xl font-bold font-sans">Start Echo</div>
                    ) : (
                        <div className="text-4xl font-bold font-sans">Welcome </div>
                    )}


                    {/* <div className="text-2xl font-light mb-14" >Sign up to get started!!!</div>*/}
                    {isSignInPage ? (
                        <div className="text-m font-light mb-10 flex justify-center">Sign in to explore</div>
                    ) : (
                        <div className="text-m font-light mb-10">Sign up to get started!!!</div>
                    )}
                </div>

                <form className='flex flex-col items-center w-full' onSubmit={(e) => handleSubmit(e)}>
                    {!isSignInPage && <Input label="First name" name="name" placeholder="example: Rezwan" className="w-[70%] mb-4" value={data.firstName}
                        onChange={(e) => setdata({ ...data, firstName: e.target.value })} />}
                    {!isSignInPage && <Input label="Last name" name="name" placeholder="example: Ahmed" className="w-[70%] mb-4" value={data.lastName}
                        onChange={(e) => setdata({ ...data, lastName: e.target.value })} />}
                    <Input label="Email" type="email" name="email" placeholder="example: rezwan.ahmed@echo.com" className="w-[70%] mb-6" value={data.email}
                        onChange={(e) => setdata({ ...data, email: e.target.value })} />

                    {/* <Input label="Password" name="password" type="password" placeholder="Enter your password" className="mb-4" /> */}

                    {/* <Button label="Sign-up" className="mb-2" /> */}
                    {/* {isSignInPage ? (
                <Button label="Log-in" className="mb-2" />
            ) : (
                <Button label="Sign-up" className="mb-2" />
            )} */}

                    <Button label={isSignInPage ? "Log-in" : "Sign-up"} type='submit' className="mb-2" />

                </form>

                <div > {isSignInPage ? "Didn't have an account ?" : "Already have an account ?"}
                    <span className="text-primary cursor-pointer underline" onClick={() => navigate(`/users/${isSignInPage ? 'sign_up' : 'sign_in'}`)}>
                        {isSignInPage ? "Sign-up" : "Sign-in"}
                    </span>
                </div>

            </div >
        </div >
    )
}

export default Form