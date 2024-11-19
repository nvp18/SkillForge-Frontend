import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import apiClient from "../../../apiClient";
import { CourseProvider } from "../CourseContext";
import CoursePage from "../CoursePage";
import { vi } from "vitest";

vi.mock("../../../apiClient");
vi.mock("../CourseSidebar", () => ({
  default: () => <div data-testid="course-sidebar">Sidebar Mock</div>,
}));

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
    vi.clearAllMocks();
  });

  const renderWithProvider = () => {
    return render(
      <MemoryRouter initialEntries={["/course/123"]}>
        <Routes>
          <Route
            path="/course/:courseId"
            element={
              <CourseProvider>
                <CoursePage />
              </CourseProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );
  };

  test("renders loading state initially", () => {
    renderWithProvider();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("displays error message on API failure", async () => {
    apiClient.get.mockRejectedValueOnce({
      response: { data: { message: "Failed to fetch course details." } },
    });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByText(/error: failed to fetch course details/i)).toBeInTheDocument();
    });
  });

  // test("displays course details on successful API call", async () => {
  //   apiClient.get.mockResolvedValueOnce({ data: mockCourseDetails });

  //   renderWithProvider();

  //   await waitFor(() => {
  //     expect(screen.getByText("Test Course")).toBeInTheDocument();
  //     expect(screen.getByText("This is a test course.")).toBeInTheDocument();
  //     expect(screen.getByText("tag1, tag2")).toBeInTheDocument();
  //     expect(screen.getByText("7 days")).toBeInTheDocument();
  //     expect(screen.getByText("11/15/2023")).toBeInTheDocument(); // Created At
  //     expect(screen.getByText("11/17/2023")).toBeInTheDocument(); // Updated At
  //   });
  // });

  test("renders CourseSidebar component", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockCourseDetails });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId("course-sidebar")).toBeInTheDocument();
    });
  });

  // test("adjusts layout based on screen size", async () => {
  //   global.innerWidth = 500; // Simulate mobile view
  //   apiClient.get.mockResolvedValueOnce({ data: mockCourseDetails });

  //   renderWithProvider();

  //   await waitFor(() => {
  //     expect(screen.getByText("Test Course")).toHaveClass("ml-16");
  //   });

  //   global.innerWidth = 1024; // Simulate desktop view
  //   window.dispatchEvent(new Event("resize"));

  //   await waitFor(() => {
  //     expect(screen.getByText("Test Course")).toHaveClass("ml-[15vw]");
  //   });
  // });
});
