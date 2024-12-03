import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);  // For loading state
  const navigate = useNavigate();

  // Fetch quizzes from the backend
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch('http://localhost:4000/quizzes'); // Fetch all quizzes
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes data');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Debugging line to check the data structure
        if (data.message === 'success') {
          setQuizzes(data.data); // Set quizzes to state
        }
        setLoading(false); // Stop loading when data is fetched
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setLoading(false); // Stop loading if error occurs
      }
    };

    fetchQuizData();
  }, []); // Runs once when component mounts

  if (loading) {
    return <div>Loading quizzes...</div>; // Display loading message
  }
  interface Quiz {
    id: number;
    quizTitle: string;
    quizSynopsis: string;
    nrOfQuestions: number;
  }
  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center p-4">
      {/* Buttons for Add, Edit, Delete */}
      <div className="flex gap-4 mb-4">
        <button onClick={() => navigate('/createquiz')} className="border p-3 border-black bg-slate-400 text-white cursor-pointer rounded-lg">Add</button>
        <button onClick={() => navigate('')} className="border p-3 border-black bg-slate-400 text-white cursor-pointer rounded-lg">Edit</button>
        <button onClick={() => navigate('')} className="border p-3 border-black bg-slate-400 text-white cursor-pointer rounded-lg">Delete</button>
      </div>

      {/* Table for quizzes */}
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Quiz Title</th>
              <th className="border border-gray-300 px-4 py-2">Quiz Synopsis</th>
              <th className="border border-gray-300 px-4 py-2">No. of Questions</th>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td className="border border-gray-300 px-4 py-2">{quiz.quizTitle}</td>
                <td className="border border-gray-300 px-4 py-2">{quiz.quizSynopsis}</td>
                <td className="border border-gray-300 px-4 py-2">{quiz.nrOfQuestions}</td>
                <td className="border border-gray-300 px-4 py-2">{quiz.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <a href={`/table/${quiz.id}`} className="text-blue-500">Open</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
