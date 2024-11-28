import React from 'react';
import { useNavigate } from 'react-router-dom';
const ResultPage = ({ obj }: { obj: any }) => {
  const navigate = useNavigate();
  const { numberOfCorrectAnswers, numberOfIncorrectAnswers } = obj;
  const handleClick = () => {
    navigate('/');
  };
  return (
    <div className="text-center mt-12 font-sans p-6 flex flex-col gap-5">
      <div className='text-3xl font-bold'>Result:</div>
      {/* Correct Answers Section */}
      <div className="mb-6 flex gap-4">
        <h2 className="text-xl font-semibold text-green-400">Correct Answers: </h2>
        <h2 className="text-xl font-semibold text-white">{numberOfCorrectAnswers} </h2>
      </div>

      {/* Incorrect Answers Section */}
      <div className="mb-6 flex gap-4">
        <h2 className="text-xl font-semibold text-red-400">Incorrect Answers: </h2>
        <h2 className="text-xl font-semibold text-white">{numberOfIncorrectAnswers} </h2>
      </div>

      <div onClick={handleClick} className='text-white uppercase text-2xl cursor-pointer'>Start Again</div>

    </div>
  );
};

export default ResultPage;
