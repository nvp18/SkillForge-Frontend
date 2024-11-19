import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import apiClient from '../../../apiClient';
import { CourseProvider, useCourse } from '../CourseContext';

// Mock the apiClient module
vi.mock('../../apiClient', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('CourseProvider and useCourse Hook', () => {
  afterEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('throws an error if useCourse is used outside CourseProvider', () => {
    expect(() => renderHook(() => useCourse())).toThrowError(
      'useCourse must be used within a CourseProvider'
    );
  });

  // it('fetches course details successfully', async () => {
  //   const mockCourseDetails = { courseName: 'Test Course' };
  //   localStorage.setItem('token', 'mockToken');
  //   apiClient.get.mockResolvedValueOnce({ data: mockCourseDetails });

  //   const { result } = renderHook(() => useCourse(), {
  //     wrapper: ({ children }) => (
  //       <MemoryRouter initialEntries={['/course/123']}>
  //         <Routes>
  //           <Route path="/course/:courseId" element={<CourseProvider>{children}</CourseProvider>} />
  //         </Routes>
  //       </MemoryRouter>
  //     ),
  //   });

  //   await waitFor(() => {
  //     expect(result.current.courseDetails).toEqual(mockCourseDetails);
  //     expect(result.current.loading).toBe(false);
  //     expect(result.current.error).toBeNull();
  //   });
  // });

  it('sets error when courseId is missing', async () => {
    const { result } = renderHook(() => useCourse(), {
      wrapper: ({ children }) => <CourseProvider>{children}</CourseProvider>,
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Course ID is required.');
      expect(result.current.loading).toBe(false);
    });
  });

  // it('sets error when token is missing', async () => {
  //   apiClient.get.mockRejectedValueOnce(new Error('Token is missing.'));

  //   const { result } = renderHook(() => useCourse(), {
  //     wrapper: ({ children }) => (
  //       <MemoryRouter initialEntries={['/course/123']}>
  //         <Routes>
  //           <Route path="/course/:courseId" element={<CourseProvider>{children}</CourseProvider>} />
  //         </Routes>
  //       </MemoryRouter>
  //     ),
  //   });

  //   await waitFor(() => {
  //     expect(result.current.error).toBe('An error occurred while fetching course details.');
  //     expect(result.current.loading).toBe(false);
  //   });
  // });

  // it('handles API error with specific message', async () => {
  //   localStorage.setItem('token', 'mockToken');
  //   apiClient.get.mockRejectedValueOnce({
  //     response: { data: { message: 'API error occurred' } },
  //   });

  //   const { result } = renderHook(() => useCourse(), {
  //     wrapper: ({ children }) => (
  //       <MemoryRouter initialEntries={['/course/123']}>
  //         <Routes>
  //           <Route path="/course/:courseId" element={<CourseProvider>{children}</CourseProvider>} />
  //         </Routes>
  //       </MemoryRouter>
  //     ),
  //   });

  //   await waitFor(() => {
  //     expect(result.current.error).toBe('API error occurred');
  //     expect(result.current.loading).toBe(false);
  //   });
  // });

  // it('handles network error without specific response', async () => {
  //   localStorage.setItem('token', 'mockToken');
  //   apiClient.get.mockRejectedValueOnce(new Error('Network error'));

  //   const { result } = renderHook(() => useCourse(), {
  //     wrapper: ({ children }) => (
  //       <MemoryRouter initialEntries={['/course/123']}>
  //         <Routes>
  //           <Route path="/course/:courseId" element={<CourseProvider>{children}</CourseProvider>} />
  //         </Routes>
  //       </MemoryRouter>
  //     ),
  //   });

  //   await waitFor(() => {
  //     expect(result.current.error).toBe('Network error');
  //     expect(result.current.loading).toBe(false);
  //   });
  // });
});
