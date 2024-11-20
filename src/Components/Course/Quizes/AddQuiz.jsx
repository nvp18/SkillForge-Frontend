import React, { useState } from 'react';
import { FaCheckCircle, FaEdit, FaTrash } from 'react-icons/fa';
import apiClient from '../../../apiClient';

const AddQuiz = ({ courseId, onClose, onQuizSaved }) => {
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctans: ''
    });
    const [editingIndex, setEditingIndex] = useState(null);
    const [error, setError] = useState(null);
    const [questionError, setQuestionError] = useState('');

    const handleAddOrUpdateQuestion = () => {
        const { question, option1, option2, option3, option4, correctans } = currentQuestion;
        if (question && option1 && option2 && option3 && option4 && correctans) {
            setQuestionError('');
            if (editingIndex !== null) {
                const updatedQuestions = [...questions];
                updatedQuestions[editingIndex] = currentQuestion;
                setQuestions(updatedQuestions);
                setEditingIndex(null);
            } else {
                setQuestions([...questions, currentQuestion]);
            }
            setCurrentQuestion({
                question: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
                correctans: ''
            });
        } else {
            setQuestionError('Please fill in all fields and select a correct answer.');
        }
    };

    const handleCorrectAnswerSelect = (option) => {
        setCurrentQuestion({ ...currentQuestion, correctans: option });
    };

    const handleEditQuestion = (index) => {
        setCurrentQuestion(questions[index]);
        setEditingIndex(index);
    };

    const handleDeleteQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSaveQuiz = async () => {
        const token = localStorage.getItem("token");

        if (!quizTitle || !quizDescription) {
            setError("Quiz title and description are required.");
            return;
        }

        if (questions.length === 0) {
            setError("Please add at least one question.");
            return;
        }

        try {
            await apiClient.post(
                `/api/course/createQuiz/${courseId}`,
                {
                    title: quizTitle,
                    description: quizDescription,
                    questions: questions,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            onQuizSaved();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save quiz. Please try again.");
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h1 className="text-2xl font-bold mb-4">Add Quiz</h1>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-4">
                        <label className="block font-medium">Quiz Title:</label>
                        <input
                            type="text"
                            placeholder="Enter quiz title"
                            value={quizTitle}
                            onChange={(e) => setQuizTitle(e.target.value)}
                            className="w-full p-2 mt-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium">Quiz Description:</label>
                        <textarea
                            placeholder="Enter quiz description"
                            value={quizDescription}
                            onChange={(e) => setQuizDescription(e.target.value)}
                            className="w-full p-2 mt-2 border border-gray-300 rounded"
                            rows="3"
                        />
                    </div>

                    <div className="mb-4">
                        <h2 className="font-semibold mb-2">Questions ({questions.length})</h2>
                        {questions.length === 0 ? (
                            <p className="text-gray-500">No questions added yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {questions.map((q, index) => (
                                    <li key={index} className="p-4 border rounded-lg bg-gray-100 relative">
                                        <h3 className="font-semibold">{q.question}</h3>
                                        <ul className="mt-2 space-y-1">
                                            {[1, 2, 3, 4].map((num) => (
                                                <li key={num} className="flex items-center">
                                                    {q[`option${num}`]}
                                                    {q.correctans === q[`option${num}`] && (
                                                        <FaCheckCircle className="text-green-500 ml-2" />
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="absolute top-2 right-2 space-x-2">
                                            <button onClick={() => handleEditQuestion(index)} className="text-blue-500">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDeleteQuestion(index)} className="text-red-500">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium">Add a Question:</label>
                        <input
                            type="text"
                            placeholder="Question"
                            value={currentQuestion.question}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                            className="w-full p-2 mt-2 mb-2 border border-gray-300 rounded"
                        />

                        {[1, 2, 3, 4].map((num) => (
                            <div key={num} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="text"
                                    placeholder={`Option ${num}`}
                                    value={currentQuestion[`option${num}`]}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, [`option${num}`]: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <input
                                    type="radio"
                                    name="correctAnswer"
                                    checked={currentQuestion.correctans === currentQuestion[`option${num}`]}
                                    onChange={() => handleCorrectAnswerSelect(currentQuestion[`option${num}`])}
                                    className="text-green-500"
                                />
                                {currentQuestion.correctans === currentQuestion[`option${num}`] && (
                                    <FaCheckCircle className="text-green-500" />
                                )}
                            </div>
                        ))}

                        {questionError && <p className="text-red-500 mt-2">{questionError}</p>}

                        <button
                            type="button"
                            onClick={handleAddOrUpdateQuestion}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {editingIndex !== null ? 'Update Question' : 'Add Question'}
                        </button>
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveQuiz}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Save Quiz
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddQuiz;
