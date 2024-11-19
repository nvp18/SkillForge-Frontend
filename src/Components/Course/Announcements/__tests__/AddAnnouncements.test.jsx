import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import * as apiClient from '../../../../apiClient'; // Ensure correct import
import AddAnnouncement from '../AddAnnouncements';

// Mock the named post method
vi.mock('../../../../apiClient', () => ({
  post: vi.fn(), // Mock post method directly
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: () => ({ courseId: '123' }),
  };
});

describe('AddAnnouncement', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    apiClient.post.mockClear(); // Clear post mock
    mockNavigate.mockClear();
    vi.mocked(require('react-router-dom').useNavigate).mockReturnValue(mockNavigate);
  });

  it('renders the component correctly', () => {
    render(
      <MemoryRouter>
        <AddAnnouncement />
      </MemoryRouter>
    );

    expect(screen.getByText(/Add Announcement/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter announcement title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter announcement description/i)).toBeInTheDocument();
  });

  it('shows an error message if API call fails', async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { data: { message: 'Failed to post announcement' } },
    });

    render(
      <MemoryRouter>
        <AddAnnouncement />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter announcement title/i), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter announcement description/i), {
      target: { value: 'Test Description' },
    });

    fireEvent.click(screen.getByText(/Post/i));

    await waitFor(() => {
      expect(screen.getByText(/Failed to post announcement/i)).toBeInTheDocument();
    });
  });

  it('shows success modal when announcement is posted successfully', async () => {
    apiClient.post.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <AddAnnouncement />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter announcement title/i), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter announcement description/i), {
      target: { value: 'Test Description' },
    });

    fireEvent.click(screen.getByText(/Post/i));

    await waitFor(() => {
      expect(screen.getByText(/Announcement successfully posted/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/OK/i));

    expect(mockNavigate).toHaveBeenCalledWith('/course/123/announcements');
  });

  it('navigates back on cancel', () => {
    render(
      <MemoryRouter>
        <AddAnnouncement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Cancel/i));

    expect(mockNavigate).toHaveBeenCalledWith('/course/123/announcements');
  });
});
