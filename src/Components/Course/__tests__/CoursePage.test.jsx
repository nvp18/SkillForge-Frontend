import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import apiClient from "../../apiClient";
import { CourseProvider } from "./CourseContext";
import CoursePage from "./CoursePage";

jest.mock("../../apiClient");

describe("CoursePage Component", () => {
  const mockCourseDetails = {
    courseName: "Test Course",
    courseDescription: "This is a test course.",
    courseTags: "tag1, tag2",
    createdAt: "2023-11-15T00:00:00Z",
    updatedAt: "2023-11-17T00:00:00Z",
    daysToFinish: 7,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays course details", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockCourseDetails });

    render(
      <CourseProvider>
        <MemoryRouter>
          <CoursePage />
        </MemoryRouter>
      </CourseProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Course")).toBeInTheDocument();
      expect(screen.getByText("This is a test course.")).toBeInTheDocument();
    });
  });

  test("handles loading state", () => {
    render(
      <CourseProvider>
        <MemoryRouter>
          <CoursePage />
        </MemoryRouter>
      </CourseProvider>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
