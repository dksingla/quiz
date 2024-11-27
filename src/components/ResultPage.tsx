import React from 'react';

const ResultPage = ({ obj }:{obj: any}) => {
  const { numberOfCorrectAnswers, numberOfIncorrectAnswers } = obj;

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

    </div>
  );
};

export default ResultPage;
