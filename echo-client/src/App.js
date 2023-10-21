// import logo from './logo.svg';
import './App.css';
import Dashboard from './modules/Dashboard/dashboard';
import Form from './modules/Form';

function App() {
  return (
    //h-screen apply the background color to the whole screen
    //<div className="App bg-primary h-screen">
    //<div className="App h-screen">
    <div className="bg-[#292a2c] h-screen flex justify-center items-center">
      {/* <h1>Hello Echo</h1> */}

      {/* <Form /> */}
      <Dashboard />


    </div>
  );
}

export default App;
