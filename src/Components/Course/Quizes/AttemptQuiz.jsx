import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../../apiClient';

const Modal = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Quiz Result</h2>
            <p className="text-gray-700">{message}</p>
            <div className="mt-4 flex justify-end">
                <button
                    onClick={onClose}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
);

const AttemptQuiz = () => {
    const { courseId, quizId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [error, setError] = useState(null);
    const [submitStatus, setSubmitStatus] = useState(''); // Stores API result message
    const [showModal, setShowModal] = useState(false); // Modal visibility control

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchQuizQuestions = async () => {
            try {
                const response = await apiClient.get(`/api/course/getQuestions/${quizId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setQuestions(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load quiz. Please try again later.');
            }
        };

        fetchQuizQuestions();
    }, [quizId]);

    const handleAnswer = (questionId, answer) => {
        setAnswers((prev) => [
            ...prev.filter((ans) => ans.id !== questionId),
            { id: questionId, attemptedAns: answer },
        ]);
    };

    const handleSubmit = async () => {
        if (answers.length === 0) {
            setSubmitStatus('No answers to submit. Please attempt the quiz.');
            setShowModal(true);
            return;
        }

        try {
            const response = await apiClient.post(
                `/api/course/submitQuiz/${courseId}`,
                answers,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    maxBodyLength: Infinity,
                }
            );

            const resultMessage = typeof response.data === 'string' ? response.data : response.data?.message;
            setSubmitStatus(resultMessage);
            setShowModal(true);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to submit quiz. Please try again.';
            setSubmitStatus(errorMessage);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate(`/course/${courseId}/create-quiz`); // Navigate back to quizzes list
    };

    return (
        <div className="p-8 min-h-screen bg-gray-100">
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : questions.length > 0 ? (
                <>
                    <h1 className="text-3xl font-bold">Attempt Quiz</h1>
                    {!quizCompleted ? (
                        <div className="mt-8 space-y-8">
                            {questions.map((question, index) => (
                                <div key={question.id} className="bg-white p-4 rounded shadow-md">
                                    <h2 className="text-xl font-semibold mb-4">
                                        {index + 1}. {question.question}
                                    </h2>
                                    <div className="space-y-2">
                                        {[1, 2, 3, 4].map((num) => (
                                            <button
                                                key={num}
                                                onClick={() => handleAnswer(question.id, question[`option${num}`])}
                                                className={`block w-full py-2 px-4 rounded ${
                                                    answers.find((a) => a.id === question.id)?.attemptedAns ===
                                                    question[`option${num}`]
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                                }`}
                                            >
                                                {question[`option${num}`]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setQuizCompleted(true)}
                                className="mt-8 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Finish
                            </button>
                            <button
                                onClick={() => navigate(`/course/${courseId}/quizzes`)}
                                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Back to Quizzes
                            </button>
                        </div>
                    ) : (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold">Quiz Completed!</h2>
                            <p className="text-gray-700">Review your answers before submitting.</p>
                            <ul className="mt-4">
                                {questions.map((q, index) => {
                                    const answer = answers.find((a) => a.id === q.id)?.attemptedAns || 'Not answered';
                                    return (
                                        <li key={q.id} className="mb-2">
                                            <strong>Question {index + 1}:</strong> {q.question} <br />
                                            <strong>Your Answer:</strong> {answer}
                                        </li>
                                    );
                                })}
                            </ul>
                            <button
                                onClick={handleSubmit}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Submit Quiz
                            </button>
                            <button
                                onClick={() => navigate(`/course/${courseId}/create-quiz`)}
                                className="mt-4 ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Back to Quizzes
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p>Loading quiz...</p>
            )}

            {showModal && (
                <Modal
                    message={submitStatus}
                    onClose={handleCloseModal} // Redirects after modal closes
                />
            )}
        </div>
    );
};

export default AttemptQuiz;
