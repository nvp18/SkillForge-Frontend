import { renderHook } from "@testing-library/react";
import apiClient from "../../apiClient";
import { CourseProvider, useCourse } from "./CourseContext";

jest.mock("../../apiClient");

describe("CourseContext", () => {
  test("fetches and provides course details", async () => {
    const mockCourseDetails = { courseName: "Test Course" };
    apiClient.get.mockResolvedValueOnce({ data: mockCourseDetails });

    const { result, waitForNextUpdate } = renderHook(() => useCourse(), {
      wrapper: CourseProvider,
    });

    await waitForNextUpdate();

    expect(result.current.courseDetails).toEqual(mockCourseDetails);
  });
});
