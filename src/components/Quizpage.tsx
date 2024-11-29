import React, { useEffect, useState } from 'react';
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
  const [quizResult, setQuizResultState] = useState< null>(null); // State to store quiz result
  const [quizData, setQuizData] = useState< null>(null); // State to store quiz data fetched from the backend
  const [loading, setLoading] = useState<boolean>(true); // Loading state to show loading indicator

// Fetch quiz data from the backend API
useEffect(() => {
  const fetchQuizData = async () => {
    try {
      const response = await fetch('http://localhost:4000/quizzes/5'); // Replace 1 with your desired quiz ID
      if (!response.ok) {
        throw new Error('Failed to fetch quiz data');
      }
      const data = await response.json();
      setQuizData(data.data); // Set the fetched quiz data to state
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      setLoading(false); // Stop loading even if there's an error
    }
  };

  fetchQuizData();
}, []); // Empty dependency array means this will run once when the component mounts


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
        <ResultPage obj={quizResult} /> // Display result page if quiz is complete
      ) : loading ? (
        <div>Loading...</div> // Show loading indicator while fetching data
      ) : (
        quizData && (
          <Quiz
          quiz={quizData}
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
        )
      )}
    </div>
  );
};

export default Quizpage;
