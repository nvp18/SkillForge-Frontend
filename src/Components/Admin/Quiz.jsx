import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddQuiz from './AddQuiz';
import CourseSidebar from '../Course/CourseSidebar';
import { useParams } from 'react-router-dom';

const Quiz = () => {
    const { courseId } = useParams(); // Get courseId from URL
    const [quizzes, setQuizzes] = useState([]);
    const [showAddQuiz, setShowAddQuiz] = useState(false);
    const [error, setError] = useState(null);

    // Load quizzes from the backend
    const loadQuizzes = async () => {
        console.log('Reloading quizzes...'); // Debugging log to confirm reload
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:8080/api/course/getQuiz/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuizzes(response.data);
            setError(null);
        } catch (error) {
            setError('There was an error fetching the quizzes.');
            console.error('There was an error fetching the quizzes!', error);
        }
    };

    useEffect(() => {
        loadQuizzes(); // Load quizzes on component mount
    }, [courseId]);

    const handleAddQuiz = () => {
        setShowAddQuiz(true);
    };

    const handleQuizSaved = () => {
        setShowAddQuiz(false); // Close AddQuiz modal
        loadQuizzes(); // Reload quizzes after saving
    };

    return (
        <div className="flex">
            <CourseSidebar courseId={courseId} />
            
            <div className="flex-1 ml-64 md:ml-60 p-8 bg-gray-50 min-h-[90vh]">
                {error && <p className="text-red-500">{error}</p>}

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-[#342056]">Quizzes</h1>
                    <button
                        onClick={handleAddQuiz}
                        className="bg-[#368e8f] hover:bg-[#5aa5a8] text-white font-bold py-2 px-4 rounded"
                    >
                        Add Quiz
                    </button>
                </div>

                {/* Show AddQuiz component when "Add Quiz" button is clicked */}
                {showAddQuiz && (
                    <AddQuiz
                        courseId={courseId}
                        onClose={() => setShowAddQuiz(false)}
                        onQuizSaved={handleQuizSaved} // Pass the callback to reload quizzes
                    />
                )}

                {/* Quizzes List */}
                <div>
                    {quizzes.length > 0 ? (
                        quizzes.map((quiz) => (
                            <div key={quiz.id} className="bg-white p-4 mb-4 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold text-[#342056]">{quiz.title}</h2>
                                <p className="text-gray-700">{quiz.description}</p>
                            </div>
                        ))
                    ) : (
                        <p>No quizzes available. Please add a quiz.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quiz;
