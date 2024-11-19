import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import apiClient from '../../../../apiClient';
import AttemptQuiz from '../AttemptQuiz';

vi.mock('../../../../apiClient');

describe('AttemptQuiz Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/course/1/quiz/123']}>
        <Routes>
          <Route path="/course/:courseId/quiz/:quizId" element={<AttemptQuiz />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading quiz.../i)).toBeInTheDocument();
  });

  test('displays error if quiz fails to load', async () => {
    apiClient.get.mockRejectedValueOnce({
      response: { data: { message: 'Failed to load quiz' } },
    });

    render(
      <MemoryRouter initialEntries={['/course/1/quiz/123']}>
        <Routes>
          <Route path="/course/:courseId/quiz/:quizId" element={<AttemptQuiz />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load quiz/i)).toBeInTheDocument();
    });
  });

  test('renders quiz questions correctly', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 'q1',
          question: 'Question 1',
          option1: 'Option 1',
          option2: 'Option 2',
          option3: 'Option 3',
          option4: 'Option 4',
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={['/course/1/quiz/123']}>
        <Routes>
          <Route path="/course/:courseId/quiz/:quizId" element={<AttemptQuiz />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Question 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Option 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Option 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Option 3/i)).toBeInTheDocument();
      expect(screen.getByText(/Option 4/i)).toBeInTheDocument();
    });
  });

  test('allows answering a question', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 'q1',
          question: 'Question 1',
          option1: 'Option 1',
          option2: 'Option 2',
          option3: 'Option 3',
          option4: 'Option 4',
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={['/course/1/quiz/123']}>
        <Routes>
          <Route path="/course/:courseId/quiz/:quizId" element={<AttemptQuiz />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Option 1/i));
    });

    expect(screen.getByText(/Option 1/i).closest('button')).toHaveClass('bg-green-500');
  });

  test('displays error if no answers are submitted', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 'q1',
          question: 'Question 1',
          option1: 'Option 1',
          option2: 'Option 2',
          option3: 'Option 3',
          option4: 'Option 4',
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={['/course/1/quiz/123']}>
        <Routes>
          <Route path="/course/:courseId/quiz/:quizId" element={<AttemptQuiz />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Finish/i));
      fireEvent.click(screen.getByText(/Submit Quiz/i));
    });

    expect(await screen.findByText(/No answers to submit/i)).toBeInTheDocument();
  });

  test('displays success message on successful quiz submission', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 'q1',
          question: 'Question 1',
          option1: 'Option 1',
          option2: 'Option 2',
          option3: 'Option 3',
          option4: 'Option 4',
        },
      ],
    });

    apiClient.post.mockResolvedValueOnce({
      data: 'Quiz submitted successfully!',
    });

    render(
      <MemoryRouter initialEntries={['/course/1/quiz/123']}>
        <Routes>
          <Route path="/course/:courseId/quiz/:quizId" element={<AttemptQuiz />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Option 1/i));
      fireEvent.click(screen.getByText(/Finish/i));
      fireEvent.click(screen.getByText(/Submit Quiz/i));
    });

    expect(await screen.findByText(/Quiz submitted successfully!/i)).toBeInTheDocument();
  });

  test('displays error message on failed quiz submission', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 'q1',
          question: 'Question 1',
          option1: 'Option 1',
          option2: 'Option 2',
          option3: 'Option 3',
          option4: 'Option 4',
        },
      ],
    });

    apiClient.post.mockRejectedValueOnce({
      response: { data: { message: 'Failed to submit quiz' } },
    });

    render(
      <MemoryRouter initialEntries={['/course/1/quiz/123']}>
        <Routes>
          <Route path="/course/:courseId/quiz/:quizId" element={<AttemptQuiz />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Option 1/i));
      fireEvent.click(screen.getByText(/Finish/i));
      fireEvent.click(screen.getByText(/Submit Quiz/i));
    });

    expect(await screen.findByText(/Failed to submit quiz/i)).toBeInTheDocument();
  });
});
