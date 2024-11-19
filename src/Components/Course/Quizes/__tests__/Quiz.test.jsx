
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import apiClient from '../../../../apiClient';
import Quiz from '../Quiz';

vi.mock('../../../../apiClient');

const mockUseNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockUseNavigate,
  };
});

describe('Quiz Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'mockToken');
    localStorage.setItem('role', 'ADMIN');
  });

  afterEach(() => {
    localStorage.clear();
  });

  // test('renders loading state initially', () => {
  //   render(
  //     <MemoryRouter initialEntries={['/course/1/quiz']}>
  //       <Routes>
  //         <Route path="/course/:courseId/quiz" element={<Quiz />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );
  
  //   // Look for a loading spinner, animation, or a general loading indicator
  //   expect(screen.queryByText((content, element) => {
  //     return element?.textContent.match(/Loading/i);
  //   })).toBeInTheDocument();
  // });
  
  

  test('displays error if quiz data fails to load', async () => {
    apiClient.get.mockRejectedValueOnce({
      response: { data: { message: 'Failed to load quiz' } },
    });

    render(
      <MemoryRouter initialEntries={['/course/1/quiz']}>
        <Routes>
          <Route path="/course/:courseId/quiz" element={<Quiz />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load quiz/i)).toBeInTheDocument();
    });
  });

  test('renders quiz data correctly', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: { id: 'quiz1', title: 'Sample Quiz', description: 'A test quiz' },
    });

    render(
      <MemoryRouter initialEntries={['/course/1/quiz']}>
        <Routes>
          <Route path="/course/:courseId/quiz" element={<Quiz />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Sample Quiz/i)).toBeInTheDocument();
      expect(screen.getByText(/A test quiz/i)).toBeInTheDocument();
    });
  });

  test('navigates to attempt quiz page on "Attempt" button click', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: { id: 'quiz1', title: 'Sample Quiz', description: 'A test quiz' },
    });

    render(
      <MemoryRouter initialEntries={['/course/1/quiz']}>
        <Routes>
          <Route path="/course/:courseId/quiz" element={<Quiz />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Attempt/i));
    });

    expect(mockUseNavigate).toHaveBeenCalledWith('/course/1/attempt-quiz/quiz1');
  });
  test('disables "Attempt" button if course status is completed', async () => {
    apiClient.get
      .mockResolvedValueOnce({
        data: { id: 'quiz1', title: 'Sample Quiz', description: 'A test quiz' },
      })
      .mockResolvedValueOnce({
        data: { status: 'COMPLETED' },
      });

    render(
      <MemoryRouter initialEntries={['/course/1/quiz']}>
        <Routes>
          <Route path="/course/:courseId/quiz" element={<Quiz />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const attemptButton = screen.getByText(/Attempt/i);
      expect(attemptButton).toBeDisabled();
    });
  });

  
  

  test('displays error message on quiz deletion failure', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: { id: 'quiz1', title: 'Sample Quiz', description: 'A test quiz' },
    });

    apiClient.delete.mockRejectedValueOnce({
      response: { data: { message: 'Failed to delete quiz' } },
    });

    render(
      <MemoryRouter initialEntries={['/course/1/quiz']}>
        <Routes>
          <Route path="/course/:courseId/quiz" element={<Quiz />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Delete Quiz/i));
    });

    expect(await screen.findByText(/Failed to delete quiz/i)).toBeInTheDocument();
  });

  
});
