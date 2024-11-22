import React from 'react';
import './App.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './components/Home';
import Quizpage from './components/Quizpage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path:"/quiz",
    element:<Quizpage/>,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

