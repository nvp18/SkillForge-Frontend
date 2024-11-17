import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CourseSidebar from '../../Course/CourseSidebar';
import AddQuiz from './AddQuiz';

const Quiz = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [quiz, setQuiz] = useState(null); // Expecting a single quiz object with minimal details
    const [showAddQuiz, setShowAddQuiz] = useState(false);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState('admin'); // Replace with actual role logic

    // Load quiz data for the course
    const loadQuiz = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:8080/api/course/getQuiz/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuiz(response.data); // Expecting an object { id, title, description }
            setError(null);
        } catch (err) {
            setError('There was an error fetching the quiz.');
            console.error(err);
        }
    };

    useEffect(() => {
        loadQuiz();
    }, [courseId]);

    const handleAddQuiz = () => {
        setShowAddQuiz(true);
    };

    const handleQuizSaved = () => {
        setShowAddQuiz(false);
        loadQuiz(); // Reload quizzes
    };

    const handleAttemptQuiz = (quiz) => {
        navigate(`/course/${courseId}/attempt-quiz/${quiz.id}`); // Include courseId in the path
    };
    

    const handleDeleteQuiz = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8080/api/course/deleteQuiz/${quiz.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuiz(null); // Clear quiz after deletion
            setError(null);
        } catch (err) {
            setError('Failed to delete the quiz. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="flex">
            <CourseSidebar courseId={courseId} />

            <div className="flex-1 ml-64 md:ml-60 p-8 bg-gray-50 min-h-[88vh]">
                {error && <p className="text-red-500">{error}</p>}

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-[#342056]">Quiz</h1>
                    {userRole === 'admin' && !quiz && (
                        <button
                            onClick={handleAddQuiz}
                            className="bg-[#368e8f] hover:bg-[#5aa5a8] text-white font-bold py-2 px-4 rounded"
                        >
                            Add Quiz
                        </button>
                    )}
                    {userRole === 'admin' && quiz && (
                        <p className="text-gray-500">A quiz is already added. Cannot add another quiz.</p>
                    )}
                </div>

                {showAddQuiz && (
                    <AddQuiz
                        courseId={courseId}
                        onClose={() => setShowAddQuiz(false)}
                        onQuizSaved={handleQuizSaved}
                    />
                )}

                {quiz && (
                    <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-[#342056]">{quiz.title}</h2>
                                <p className="text-gray-700">{quiz.description}</p>
                            </div>
                            <button
                                onClick={() => handleAttemptQuiz(quiz)}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Attempt
                            </button>
                        </div>

                        {userRole === 'admin' && (
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleDeleteQuiz}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Delete Quiz
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quiz;
