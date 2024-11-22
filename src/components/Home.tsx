import React from 'react'
import QuizIcon from '@mui/icons-material/Quiz';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Handle the click event to navigate to the quiz page
  const handleClick = () => {
    navigate('/quiz'); // Navigate to the 'quiz' route
  };
    return (
        <div className='flex flex-col justify-center items-center h-[95vh] gap-5'>
          <QuizIcon className='size-9'/>
          <div>Welcome!! Lets Start this amazing Quiz..</div>
          <button onClick={handleClick} className='border p-3 border-black bg-slate-400 text-white'>Click to Start</button>
        </div>
      );
}

export default Home
