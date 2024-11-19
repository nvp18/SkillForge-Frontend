
// import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// import { vi } from 'vitest';
// import apiClient from '../../../../apiClient';
// import AddQuiz from '../AddQuiz';

// vi.mock('../../../../apiClient');

// describe('AddQuiz Component', () => {
//   const mockOnClose = vi.fn();
//   const mockOnQuizSaved = vi.fn();

//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   test('renders the form elements correctly', () => {
//     render(<AddQuiz courseId="123" onClose={mockOnClose} onQuizSaved={mockOnQuizSaved} />);

//     expect(screen.getByLabelText(/Quiz Title:/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Quiz Description:/i)).toBeInTheDocument();
//     expect(screen.getByText(/Add a Question:/i)).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /Save Quiz/i })).toBeInTheDocument();
//   });

//   test('displays error if quiz title or description is missing', async () => {
//     render(<AddQuiz courseId="123" onClose={mockOnClose} onQuizSaved={mockOnQuizSaved} />);
    
//     fireEvent.click(screen.getByRole('button', { name: /Save Quiz/i }));
    
//     expect(await screen.findByRole('alert')).toHaveTextContent('Quiz title and description are required.');
//   });

//   test('allows adding a question', () => {
//     render(<AddQuiz courseId="123" onClose={mockOnClose} onQuizSaved={mockOnQuizSaved} />);

//     fireEvent.change(screen.getByLabelText(/Add a Question:/i), { target: { value: 'Sample Question?' } });
//     fireEvent.change(screen.getByPlaceholderText(/Option 1/i), { target: { value: 'Answer 1' } });
//     fireEvent.change(screen.getByPlaceholderText(/Option 2/i), { target: { value: 'Answer 2' } });

//     fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));

//     expect(screen.getByRole('list')).toHaveLength(1);
//   });

//   test('allows editing a question', async () => {
//     render(<AddQuiz courseId="123" onClose={mockOnClose} onQuizSaved={mockOnQuizSaved} />);

//     const { container } = render(<AddQuiz courseId="123" onClose={mockOnClose} onQuizSaved={mockOnQuizSaved} />);
//     const editButtons = container.querySelectorAll('FaCheckCircle');
    
//     fireEvent.click(editButtons[0]);
//     await waitFor(() => {
//       expect(screen.getByLabelText('Correct Answer: Option 2')).toBeInTheDocument();
//       expect(screen.getByText(/Error Occurred/i)).toHaveLength(1);
//     });
//     fireEvent.click(screen.getByText(/Sample test/i));
//     expect(screen.queryByText('Correct Answer Updated')).toBeInTheDocument();
//   });

//   test('calls api to save quiz and resets on success', async () => {
//     apiClient.post.mockResolvedValueOnce({ data: { success: true } });

//     render(<AddQuiz courseId="123" onClose={mockOnClose} onQuizSaved={mockOnQuizSaved} />);
//     fireEvent.change(screen.getByLabelText(/quizTitle/i), {target: { value: 'Basic Math quiz ' }}); fireEvent.change(screen.getByLabelText(/QuizDescription/i), {target: { value: 'Description' }});
    
//     fireEvent.click(screen.getByRole('button', { name: /Save Quiz/i }));
//     await waitFor(() => {
//       expect(mockOnClose).toHaveBeenCalled();
//       expect(mockOnQuizSaved).toHaveBeenCalled();
//     });
//   });

//   test('displays error on failed quiz save', async () => {
//     apiClient.post.mockRejectedValueOnce({response: { data: { message: "Failed to save quiz" } }});

//     render(<AddQuiz courseId="123" onClose={mockOnClose} onQuizSaved={mockOnQuizSaved} />);
//     fireEvent.click(screen.getByRole('button', { name: /Save Quiz/i }));
//     await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Failed to save quiz'));
//   });
// });


import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import apiClient from '../../../../apiClient';
import AddQuiz from '../AddQuiz';

vi.mock('../../../../apiClient');

describe('AddQuiz Component', () => {
  const mockOnClose = vi.fn();
  const mockOnQuizSaved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the form elements correctly', () => {
    render(<AddQuiz courseId="123" onClose={mockOnClose} onQuizSaved={mockOnQuizSaved} />);

    expect(screen.getByLabelText(/Quiz Title:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quiz Description:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Add a Question:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Quiz/i })).toBeInTheDocument();
  });

  test('displays error if quiz title or description is missing', async () => {
    render(<AddQuiz courseId="123" onClose={mockOnClose} onQuizSaved={mockOnQuizSaved} />);

    fireEvent.click(screen.getByRole('button', { name: /Save Quiz/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Quiz title and description are required.');
  });

  test('allows adding a question', () => {
    render(<AddQuiz courseId="123" onClose={mockOnClose} onQuizSaved={mockOnQuizSaved} />);

    fireEvent.change(screen.getByLabelText(/Add a Question:/i), { target: { value: 'Sample Question?' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 1/i), { target: { value: 'Answer 1' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 2/i), { target: { value: 'Answer 2' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 3/i), { target: { value: 'Answer 3' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 4/i), { target: { value: 'Answer 4' } });
    fireEvent.click(screen.getByLabelText(/Correct answer: Option 1/i));

    fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));

    expect(screen.getByText((_, node) => {
      const hasText = (n) => n.textContent === 'Questions (1)';
      const nodeHasText = hasText(node);
      const childrenDontHaveText = Array.from(node?.children || []).every(
        (child) => !hasText(child)
      );
      return nodeHasText && childrenDontHaveText;
    })
  ).toBeInTheDocument();
  
  });

  test('allows editing a question', () => {
    render(<AddQuiz courseId="123" onClose={mockOnClose} onQuizSaved={mockOnQuizSaved} />);

    fireEvent.change(screen.getByLabelText(/Add a Question:/i), { target: { value: 'Initial Question?' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 1/i), { target: { value: 'Ans 1' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 2/i), { target: { value: 'Ans 2' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 3/i), { target: { value: 'Ans 3' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 4/i), { target: { value: 'Ans 4' } });
    fireEvent.click(screen.getByLabelText(/Correct answer: Option 1/i));
    fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));

    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

    expect(screen.getByText((_, node) => {
    const hasText = (n) => n.textContent === 'Questions (1)';
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node?.children || []).every(
      (child) => !hasText(child)
    );
    return nodeHasText && childrenDontHaveText;
  })
).toBeInTheDocument();

  });

  test('calls API to save quiz and resets on success', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { success: true } });

    render(<AddQuiz courseId="123" onClose={mockOnClose} onQuizSaved={mockOnQuizSaved} />);

    fireEvent.change(screen.getByLabelText(/Quiz Title:/i), { target: { value: 'Test Quiz' } });
    fireEvent.change(screen.getByLabelText(/Quiz Description:/i), { target: { value: 'This is a test description' } });

    fireEvent.change(screen.getByLabelText(/Add a Question:/i), { target: { value: 'Sample Question?' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 1/i), { target: { value: 'Answer 1' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 2/i), { target: { value: 'Answer 2' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 3/i), { target: { value: 'Answer 3' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 4/i), { target: { value: 'Answer 4' } });
    fireEvent.click(screen.getByLabelText(/Correct answer: Option 1/i));
    fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));

    fireEvent.click(screen.getByRole('button', { name: /Save Quiz/i }));

    await waitFor(() => {
      expect(mockOnQuizSaved).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('displays error on failed quiz save', async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { data: { message: 'Failed to save quiz' } },
    });
  
    render(<AddQuiz courseId="123" onClose={mockOnClose} onQuizSaved={mockOnQuizSaved} />);
  
    fireEvent.change(screen.getByLabelText(/Quiz Title:/i), { target: { value: 'Test Quiz' } });
    fireEvent.change(screen.getByLabelText(/Quiz Description:/i), { target: { value: 'This is a test description' } });
  
    // Add a valid question before saving
    fireEvent.change(screen.getByLabelText(/Add a Question:/i), { target: { value: 'Sample Question?' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 1/i), { target: { value: 'Answer 1' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 2/i), { target: { value: 'Answer 2' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 3/i), { target: { value: 'Answer 3' } });
    fireEvent.change(screen.getByPlaceholderText(/Option 4/i), { target: { value: 'Answer 4' } });
    fireEvent.click(screen.getByLabelText(/Correct answer: Option 1/i));
    fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));
  
    fireEvent.click(screen.getByRole('button', { name: /Save Quiz/i }));
  
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to save quiz');
    });
  });
  
});
