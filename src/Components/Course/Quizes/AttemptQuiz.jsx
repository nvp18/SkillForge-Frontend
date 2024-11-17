import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../../apiClient';

const AttemptQuiz = () => {
    const { courseId, quizId } = useParams(); // Get both courseId and quizId from URL
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]); // Array of questions
    const [answers, setAnswers] = useState([]); // Stores user's answers
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [error, setError] = useState(null);
    const [submitStatus, setSubmitStatus] = useState(null); // Submission status message

    useEffect(() => {
        const fetchQuizQuestions = async () => {
          const token = localStorage.getItem('token');
          try {
            const response = await apiClient.get(`/api/course/getQuestions/${quizId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
      
            setQuestions(response.data); // Expecting an array of questions
            setError(null);
          } catch (err) {
            setError(err.response?.data?.message || 'Failed to load quiz. Please try again later.');
            console.error(err);
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
        if (!localStorage.getItem('token')) {
          setSubmitStatus('No token found. Please log in again.');
          console.error('No token available.');
          return;
        }
      
        if (answers.length === 0) {
          setSubmitStatus('No answers to submit. Please attempt the quiz.');
          return;
        }
      
        try {
          const response = await apiClient.post(`/api/course/submitQuiz/${courseId}`, answers, {
            maxBodyLength: Infinity, // Ensure large payloads are supported
          });
      
          setSubmitStatus('Quiz submitted successfully!');
          console.log('Submission response:', response.data);
        } catch (error) {
          if (error.response) {
            console.error('Server error response:', error.response);
            setSubmitStatus(`Failed to submit quiz: ${error.response.data?.message || 'Server error'}`);
          } else if (error.request) {
            console.error('No response from server:', error.request);
            setSubmitStatus('No response from server. Please try again later.');
          } else {
            console.error('Error in submission:', error.message);
            setSubmitStatus(`Submission error: ${error.message}`);
          }
        }
      };
      

    return (
        <div className="p-8 min-h-screen bg-gray-100">
            {error && <p className="text-red-500">{error}</p>}
            {questions.length > 0 ? (
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
                        </div>
                    ) : (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold">Quiz Completed!</h2>
                            <p className="text-gray-700">Please review your answers before submitting.</p>
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
                            {submitStatus && <p className="mt-4 text-green-500">{submitStatus}</p>}
                        </div>
                    )}
                </>
            ) : (
                <p>Loading quiz...</p>
            )}
        </div>
    );
};

export default AttemptQuiz;
