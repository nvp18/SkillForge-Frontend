import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import apiClient from '../../../apiClient';
import { CourseProvider, useCourse } from '../CourseContext';

// Mock the apiClient module
vi.mock('../../../apiClient', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('CourseContext', () => {
  it('fetches and provides course details', async () => {
    const mockCourseDetails = { courseName: 'Test Course' };

    // Mock the API response
    apiClient.get.mockResolvedValueOnce({ data: mockCourseDetails });

    const { result } = renderHook(() => useCourse(), {
      wrapper: CourseProvider,
    });

    console.log('Initial courseDetails:', result.current.courseDetails); // Should log null initially

    // Wait for the state to update
    await waitFor(() => {
      console.log('Updated courseDetails:', result.current.courseDetails); // Should log the mock data
      expect(result.current.courseDetails).toEqual(mockCourseDetails);
    }, { timeout: 2000 }); // Increase timeout if needed
  });
});
