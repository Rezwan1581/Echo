// import logo from './logo.svg';
import './App.css';
import Dashboard from './modules/Dashboard/dashboard';
import Form from './modules/Form';
import { Routes, Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null || true;
  console.log(isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to={'/users/sign_in'} />
  }
  else if (isLoggedIn && ['/users/sign_in', '/users/sign_up'].includes(window.location.pathname)) {
    return <Navigate to={'/'} />
  }
  return children
}

function App() {
  return (
    //h-screen apply the background color to the whole screen
    //<div className="App bg-primary h-screen">
    //<div className="App h-screen">
    <Routes>
      <Route path='/' element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path='/users/sign_in' element={
        <ProtectedRoute>
          <Form isSignInPage={true}
          />
        </ProtectedRoute>
      } />
      <Route path='/users/sign_up' element={
        <ProtectedRoute>
          <Form isSignInPage={false} />
        </ProtectedRoute>
      } />
    </Routes>

    // <div className="bg-[#2d2d2e] h-screen flex justify-center items-center">
    //   {/* <h1>Hello Echo</h1> */}

    //   {/* <Form /> */}
    //   <Dashboard />
    // </div>
  );
}

export default App;
