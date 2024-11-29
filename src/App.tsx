import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home';
import Quizpage from './components/Quizpage';
import CreateQuiz from './components/CreateQuiz';
import Admin from './components/Admin';
import Example from './components/Table';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/quiz",
    element: <Quizpage />,
  },
  {
    path: "/createquiz",
    element: <CreateQuiz />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/table",
    element: <Example/>
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

