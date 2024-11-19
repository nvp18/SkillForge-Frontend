import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadModules from '../UploadModules';
import apiClient from '../../../../apiClient'; // Ensure correct path
import { useNavigate } from 'react-router-dom';

vi.mock('../../../../apiClient', () => ({
  post: vi.fn(), // Mock the POST request
}));

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: vi.fn(), // Mock navigation
}));

describe('UploadModules Component', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  // test('uploads a module successfully', async () => {
  //   apiClient.post.mockResolvedValueOnce({ data: { success: true } });

  //   render(<UploadModules courseId="123" />);

  //   userEvent.type(screen.getByLabelText(/module name/i), 'New Module');
  //   userEvent.upload(screen.getByLabelText(/file/i), new File(['test'], 'test.pdf'));
  //   userEvent.type(screen.getByLabelText(/module number/i), '1');

  //   fireEvent.click(screen.getByRole('button', { name: /upload/i }));

  //   await waitFor(() => {
  //     expect(apiClient.post).toHaveBeenCalledWith(
  //       '/api/course/uploadCourseModule/123',
  //       expect.any(FormData)
  //     );
  //   });
  // });

  // test('displays error on upload failure', async () => {
  //   apiClient.post.mockRejectedValueOnce(new Error('Upload failed'));

  //   render(<UploadModules courseId="123" />);

  //   fireEvent.click(screen.getByRole('button', { name: /upload/i }));

  //   await waitFor(() => {
  //     expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
  //   });
  // });

  test('navigates back to module list on cancel', () => {
    render(<UploadModules courseId="123" />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/course/modules/123');
  });

  // test('handles file input change', () => {
  //   render(<UploadModules courseId="123" />);

  //   const fileInput = screen.getByLabelText(/file/i);
  //   const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });

  //   userEvent.upload(fileInput, file);

  //   expect(fileInput.files[0]).toStrictEqual(file);
  //   expect(fileInput.files).toHaveLength(1);
  // });
});
