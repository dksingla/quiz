import React, { useState } from 'react';
import Quiz from '../lib/Quiz';
import quiz from './quizData';


// Function to handle quiz completion
const setQuizResult = (obj: any) => {
  console.log(obj);
}

const Quizpage = () => {
  const [backgroundColor, setBackgroundColor] = useState('white');

  const handleQuestionSubmit = (obj: { isCorrect: boolean; }) => {
    const newColor = obj.isCorrect === false ? 'red' : 'green';
    setBackgroundColor(newColor);
    setTimeout(() => {
      setBackgroundColor('white');
    }, 2000);
    console.log('User question results:', obj);
  };

  return (
    <div className='quiz-container w-screen h-screen flex flex-col justify-start items-center pt-20 ' style={{ backgroundColor: backgroundColor, transition: 'background-color 0.3s ease-in-out' }}>
      <Quiz
        quiz={quiz}
        shuffle
        shuffleAnswer
        onComplete={setQuizResult}
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
        allowPauseTimer={undefined} />
    </div>
  );
};

export default Quizpage;
