import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../../apiClient';
import CourseSidebar from '../../Course/CourseSidebar';
import AddQuiz from './AddQuiz';

const Quiz = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [showAddQuiz, setShowAddQuiz] = useState(false);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [courseStatus, setCourseStatus] = useState('');

    const loadQuiz = async () => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        setUserRole(role);

        try {
            const response = await apiClient.get(`/api/course/getQuiz/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuiz(response.data);
            setError(null);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('No quiz available for this course.');
            } else {
                setError(err.response?.data?.message || 'There was an error fetching the quiz.');
            }
            console.error(err);
        }
    };

    const loadCourseStatus = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await apiClient.get(`/api/employee/getCourseStatus/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCourseStatus(response.data.status);
        } catch (err) {
            console.error('Error fetching course status:', err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        loadQuiz();
        loadCourseStatus();
    }, [courseId]);

    const handleAddQuiz = () => {
        setShowAddQuiz(true);
    };

    const handleQuizSaved = () => {
        setShowAddQuiz(false);
        loadQuiz();
    };

    const handleAttemptQuiz = (quiz) => {
        navigate(`/course/${courseId}/attempt-quiz/${quiz.id}`);
    };

    const handleDeleteQuiz = async () => {
        const token = localStorage.getItem('token');
        try {
            await apiClient.delete(`/api/course/deleteQuiz/${quiz.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setQuiz(null);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete the quiz. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className=" flex min-h-[88vh] bg-gray-50">
            <CourseSidebar courseId={courseId} />

            <div className="flex-1 ml-64 md:ml-60 p-8 bg-gray-50 min-h-[88vh]">
                {error && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4">
                        <p className="font-semibold">{error}</p>
                    </div>
                )}

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-[#342056]">Quiz</h1>
                    {userRole === 'ADMIN' && !quiz && (
                        <button
                            onClick={handleAddQuiz}
                            className="bg-[#368e8f] hover:bg-[#5aa5a8] text-white font-bold py-2 px-4 rounded"
                        >
                            Add Quiz
                        </button>
                    )}
                    {userRole === 'ADMIN' && quiz && (
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
                                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
                                    courseStatus === 'COMPLETED' ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={courseStatus === 'COMPLETED'}
                            >
                                Attempt
                            </button>
                        </div>

                        {userRole === 'ADMIN' && (
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
