import React, { useState } from 'react';
import Quiz from '../lib/Quiz';
import quiz from './quizData';
import ResultPage from './ResultPage';

// Function to handle quiz completion and set the result page
const setQuizResult = (obj: any) => {
  // This function can set a state to display the ResultPage
  return obj;
};

const Quizpage = () => {
  const [backgroundColor, setBackgroundColor] = useState('blue');
  const [quizResult, setQuizResultState] = useState<any>(null); // State to store quiz result

  const handleQuestionSubmit = (obj: { isCorrect: boolean }) => {
    const newColor = obj.isCorrect === false ? 'red' : 'green';
    setBackgroundColor(newColor);
    setTimeout(() => {
      setBackgroundColor('blue');
    }, 2000);

    console.log('User question results:', obj);
  };

  // Handle quiz completion
  const handleQuizComplete = (result: any) => {
    setQuizResultState(result); // Set quiz result to state
    console.log('Quiz completed. Result:', result);
  };

  return (
    <div
      className="quiz-container w-screen h-screen overflow-scroll flex flex-col justify-start items-center pt-20 text-white font-bold"
      style={{ backgroundColor: backgroundColor, transition: 'background-color 0.3s ease-in-out' }}
    >

      <div className='uppercase text-3xl'>
        VRAGG 1 VAN 45
      </div>
      <div className='h-2 bg-white w-[95vw] m-5'>

      </div>

      {quizResult ? (
        <ResultPage obj={quizResult} />
      ) : (
        <Quiz
          quiz={quiz}
          shuffle
          shuffleAnswer
          onComplete={handleQuizComplete} // Pass handler here
          disableSynopsis
          enableProgressBar
          showDefaultResult={undefined}
          customResultPage={undefined}
          showInstantFeedback={undefined}
          continueTillCorrect={undefined}
          revealAnswerOnSubmit={undefined}
          allowNavigation={undefined}
          onQuestionSubmit={handleQuestionSubmit}
          timer={undefined}
          allowPauseTimer={undefined}
        />
      )}
    </div>
  );
};

export default Quizpage;
