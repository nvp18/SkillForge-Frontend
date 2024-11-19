import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../Dashboard";
import apiClient from "../../../apiClient"; // Adjust the path if needed
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../../apiClient", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("Dashboard Component", () => {
  const renderDashboard = () =>
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks between tests
  });

  test("renders loading state", () => {
    apiClient.get.mockImplementation(() => new Promise(() => {})); // Simulate loading state
    renderDashboard();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("displays error message on fetch failure", async () => {
    apiClient.get.mockRejectedValueOnce({
      response: { data: { message: "Failed to fetch courses" } },
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch courses/i)).toBeInTheDocument();
    });
  });

  test("displays generic error when no error message is provided", async () => {
    apiClient.get.mockRejectedValueOnce(new Error("Network Error"));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
    });
  });

  test("renders Admin dashboard with courses", async () => {
    localStorage.setItem("role", "ADMIN");
    apiClient.get.mockResolvedValueOnce({
      data: [{ courseId: 1, courseName: "Admin Course", courseTags: "Tag1", daysToFinish: 10 }],
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/admin course/i)).toBeInTheDocument();
    });
  });

  test("renders Employee dashboard with courses", async () => {
    localStorage.setItem("role", "EMPLOYEE");
    apiClient.get.mockResolvedValueOnce({
      data: [{ course: { courseId: 2, courseName: "Employee Course", courseTags: "Tag2", daysToFinish: 5 } }],
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/employee course/i)).toBeInTheDocument();
    });
  });

  // test("navigates to course details on course click", async () => {
  //   localStorage.setItem("role", "ADMIN");
  //   apiClient.get.mockResolvedValueOnce({
  //     data: [{ courseId: 3, courseName: "Clickable Course", courseTags: "Tag3", daysToFinish: 15 }],
  //   });

  //   renderDashboard();

  //   await waitFor(() => {
  //     expect(screen.getByText(/clickable course/i)).toBeInTheDocument();
  //   });

  //   const courseCard = screen.getByText(/clickable course/i).closest("div");
  //   courseCard.click();

  //   // Simulate navigation
  //   await waitFor(() => {
  //     expect(window.location.pathname).toBe("/course/3");
  //   });
  // });

  // test("renders edit button for admin role", async () => {
  //   localStorage.setItem("role", "ADMIN");
  //   apiClient.get.mockResolvedValueOnce({
  //     data: [{ courseId: 4, courseName: "Editable Course", courseTags: "Tag4", daysToFinish: 20 }],
  //   });

  //   renderDashboard();

  //   await waitFor(() => {
  //     expect(screen.getByText(/editable course/i)).toBeInTheDocument();
  //     expect(screen.getByTestId("edit-button")).toBeInTheDocument();
  //   });
  // });

  test("does not render edit button for employee role", async () => {
    localStorage.setItem("role", "EMPLOYEE");
    apiClient.get.mockResolvedValueOnce({
      data: [{ course: { courseId: 5, courseName: "Non-Editable Course", courseTags: "Tag5", daysToFinish: 25 } }],
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/non-editable course/i)).toBeInTheDocument();
      expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
    });
  });
});
