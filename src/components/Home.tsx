import React from 'react'
import QuizIcon from '@mui/icons-material/Quiz';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/quiz');
  };
  return (
    <div className='flex flex-col justify-center items-center h-[95vh] gap-5'>
      <QuizIcon className='size-9' />
      <div>Welcome!! Lets Start this amazing Quiz..</div>
      <button onClick={handleClick} className='border p-3 border-black bg-slate-400 text-white'>Click to Start</button>
    </div>
  );
}

export default Home
