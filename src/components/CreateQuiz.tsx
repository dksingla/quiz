import React, { useState } from 'react';

const CreateQuiz = () => {
  // State to store quiz and questions data
  const [quizData, setQuizData] = useState({
    quizTitle: '',
    quizSynopsis: '',
    progressBarColor: '#9de1f6',
    nrOfQuestions: '1',
    questions: [{
      question: '',
      questionType: 'text',
      answerSelectionType: 'single',
      answers: ['', '', '', ''],
      correctAnswer: '1',
      messageForCorrectAnswer: '',
      messageForIncorrectAnswer: '',
      explanation: '',
      point: '10'
    }]
  });

  // Handle input changes for quiz and questions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section: string, index?: number) => {
    const { name, value } = e.target;
    if (section === 'quiz') {
      setQuizData({ ...quizData, [name]: value });
    } else if (section === 'question' && typeof index === 'number') {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  // Handle answer change
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>, questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].answers[answerIndex] = e.target.value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // Handle adding a new question
  const addNewQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          question: '',
          questionType: 'text',
          answerSelectionType: 'single',
          answers: ['', '', '', ''],
          correctAnswer: '1',
          messageForCorrectAnswer: '',
          messageForIncorrectAnswer: '',
          explanation: '',
          point: '10'
        }
      ]
    });
  };

  // Handle form submission (send data to backend)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send the quiz data to the backend
    try {
      const response = await fetch('http://localhost:4000/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizData)
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      const result = await response.json();
      alert('Quiz created successfully!');
      console.log(result);
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz');
    }
  };
  
  return (
    <div className="create-quiz-container flex flex-col justify-center items-center gap-2">
      <h2 className='text-2xl font-bold'>Create New Quiz</h2>

      <form className='flex flex-col gap-2 justify-center' onSubmit={handleSubmit}>
        {/* Quiz Title */}
        <div className='flex gap-2 items-center'>
          <label>Quiz Title:</label>
          <input
          className='border border-black rounded-md p-2'
            type="text"
            name="quizTitle"
            value={quizData.quizTitle}
            onChange={(e) => handleChange(e, 'quiz')}
            required
          />
        </div>

        {/* Quiz Synopsis */}
        <div className='flex gap-2 items-center'>
          <label>Quiz Synopsis:</label>
          <textarea
          className='border border-black rounded-md p-2'
            name="quizSynopsis"
            value={quizData.quizSynopsis}
            onChange={(e) => handleChange(e, 'quiz')}
            required
          />
        </div>

        {/* Progress Bar Color */}
        <div className='flex gap-2 items-center'>
          <label>Progress Bar Color:</label>
          <input
          className='border border-black rounded-md w-40'
            type="color"
            name="progressBarColor"
            value={quizData.progressBarColor}
            onChange={(e) => handleChange(e, 'quiz')}
          />
        </div>

        {/* Number of Questions */}
        <div className='flex gap-2 items-center'>
          <label>Number of Questions:</label>
          <input
          className='border border-black rounded-md w-40 p-1'
            type="number"
            name="nrOfQuestions"
            value={quizData.nrOfQuestions}
            onChange={(e) => handleChange(e, 'quiz')}
            min="1"
            required
          />
        </div>

        {/* Questions Section */}
        <div className='flex flex-col gap-2  justify-center'>
          <h3>Questions:</h3>
          {quizData.questions.map((question, index) => (
            <div key={index} className="question-container flex flex-col gap-2">
              <div className='flex gap-2 items-center'>
                <label>Question:</label>
                <input
                className='border border-black rounded-md w-40'
                  type="text"
                  name="question"
                  value={question.question}
                  onChange={(e) => handleChange(e, 'question', index)}
                  required
                />
              </div>

              {/* Answer Selection Type */}
              <div className='flex gap-2 items-center'>
                <label>Answer Selection Type:</label>
                <select
                className='border border-black rounded-md w-40'
                  name="answerSelectionType"
                  value={question.answerSelectionType}
                  onChange={(e) => handleChange(e, 'question', index)}
                >
                  <option value="single">Single</option>
                  <option value="multiple">Multiple</option>
                </select>
              </div>

              {/* Answer Options */}
              {question.answers.map((answer, answerIndex) => (
                <div className='flex gap-2 items-center' key={answerIndex}>
                  <label>Answer {answerIndex + 1}:</label>
                  <input
                  className='border border-black rounded-md w-40 p-2'
                    type="text"
                    value={answer}
                    onChange={(e) => handleAnswerChange(e, index, answerIndex)}
                    required
                  />
                </div>
              ))}

              {/* Correct Answer */}
              <div className='flex gap-2 items-center'>
                <label>Correct Answer (Index)</label>
                <input
                className='border border-black rounded-md w-40 p-2'
                  type="number"
                  name="correctAnswer"
                  value={question.correctAnswer}
                  onChange={(e) => handleChange(e, 'question', index)}
                  min="1"
                  max="4"
                  required
                />
              </div>

              {/* Messages for Correct/Incorrect Answer */}
              <div className='flex gap-2 items-center'>
                <label>Message for Correct Answer:</label>
                <input
                className='border border-black rounded-md w-44 p-2'
                  type="text"
                  name="messageForCorrectAnswer"
                  value={question.messageForCorrectAnswer}
                  onChange={(e) => handleChange(e, 'question', index)}
                />
              </div>
              <div className='flex gap-2 items-center'>
                <label>Message for Incorrect Answer:</label>
                <input
                className='border border-black rounded-md w-44 p-2'
                  type="text"
                  name="messageForIncorrectAnswer"
                  value={question.messageForIncorrectAnswer}
                  onChange={(e) => handleChange(e, 'question', index)}
                />
              </div>

              {/* Explanation */}
              <div className='flex gap-2 items-center'>
                <label>Explanation:</label>
                <input
                className='border border-black rounded-md w-40 p-2'
                  type="text"
                  name="explanation"
                  value={question.explanation}
                  onChange={(e) => handleChange(e, 'question', index)}
                />
              </div>

              {/* Points */}
              <div className='flex gap-2 items-center'>
                <label>Points:</label>
                <input
                className='border border-black rounded-md w-40 p-2'
                  type="number"
                  name="point"
                  value={question.point}
                  onChange={(e) => handleChange(e, 'question', index)}
                  min="1"
                  required
                />
              </div>

              <hr />
            </div>
          ))}

          {/* Button to add more questions */}
          <button className='border border-black rounded-md w-40' type="button" onClick={addNewQuestion}>
            Add New Question
          </button>
        </div>

        <div>
          <button className='border border-black rounded-md w-40' type="submit">Create Quiz</button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
