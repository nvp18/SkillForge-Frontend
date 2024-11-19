import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import ManageCourses from "../ManageUserCourses";
import apiClient from "../../../apiClient";

// Mocking API client
vi.mock("../../../apiClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mocking react-router-dom's useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()), // Mocked navigate function
    useParams: () => ({ userId: "123" }),
  };
});

describe("ManageCourses Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = () => {
    render(
      <Router>
        <ManageCourses />
      </Router>
    );
  };

  test("renders header and fetches courses successfully", async () => {
    apiClient.get
      .mockResolvedValueOnce({
        data: [
          { course: { courseId: 1, courseName: "Assigned Course" }, status: "Active" },
        ],
      })
      .mockResolvedValueOnce({
        data: [{ courseId: 2, courseName: "Unassigned Course" }],
      });

    setup();

    expect(screen.getByText("Manage Courses")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Assigned Course")).toBeInTheDocument();
      expect(screen.getByText("Unassigned Course")).toBeInTheDocument();
    });
  });

  // test("handles fetch error", async () => {
  //   apiClient.get.mockRejectedValueOnce({
  //     response: { data: { message: "Failed to fetch courses" } },
  //   });

  //   setup();

  //   await waitFor(() => {
  //     expect(screen.getByText("Failed to fetch courses.")).toBeInTheDocument();
  //   });
  // });

  // test("assigns a course successfully", async () => {
  //   apiClient.get
  //     .mockResolvedValueOnce({ data: [] }) // For assigned courses
  //     .mockResolvedValueOnce({ data: [{ courseId: 2, courseName: "Unassigned Course" }] });

  //   apiClient.post.mockResolvedValueOnce({});

  //   setup();

  //   await waitFor(() => {
  //     expect(screen.getByText("Unassigned Course")).toBeInTheDocument();
  //   });

  //   fireEvent.change(screen.getByRole("combobox", { name: /assign a course/i }), {
  //     target: { value: "2" },
  //   });

  //   fireEvent.click(screen.getByText("Assign"));

  //   await waitFor(() => {
  //     expect(screen.getByText("Course successfully assigned.")).toBeInTheDocument();
  //   });

  //   fireEvent.click(screen.getByText("OK"));
  // });

  // test("handles assign course error", async () => {
  //   apiClient.get.mockResolvedValueOnce({ data: [] });
  //   apiClient.post.mockRejectedValueOnce({
  //     response: { data: { message: "Error assigning course" } },
  //   });

  //   setup();

  //   fireEvent.change(screen.getByRole("combobox", { name: /assign a course/i }), {
  //     target: { value: "2" },
  //   });

  //   fireEvent.click(screen.getByText("Assign"));

  //   await waitFor(() => {
  //     expect(screen.getByText("Error assigning course")).toBeInTheDocument();
  //   });

  //   fireEvent.click(screen.getByText("OK"));
  // });

  // test("deassigns a course successfully", async () => {
  //   apiClient.get
  //     .mockResolvedValueOnce({
  //       data: [{ course: { courseId: 1, courseName: "Assigned Course" }, status: "Active" }],
  //     })
  //     .mockResolvedValueOnce({ data: [] });

  //   apiClient.delete.mockResolvedValueOnce({});

  //   setup();

  //   await waitFor(() => {
  //     expect(screen.getByText("Assigned Course")).toBeInTheDocument();
  //   });

  //   fireEvent.change(screen.getByRole("combobox", { name: /deassign a course/i }), {
  //     target: { value: "1" },
  //   });

  //   fireEvent.click(screen.getByText("Deassign"));

  //   await waitFor(() => {
  //     expect(screen.getByText("Course successfully deassigned.")).toBeInTheDocument();
  //   });

  //   fireEvent.click(screen.getByText("OK"));
  // });

  // test("handles deassign course error", async () => {
  //   apiClient.get.mockResolvedValueOnce({
  //     data: [{ course: { courseId: 1, courseName: "Assigned Course" }, status: "Active" }],
  //   });

  //   apiClient.delete.mockRejectedValueOnce({
  //     response: { data: { message: "Error deassigning course" } },
  //   });

  //   setup();

  //   fireEvent.change(screen.getByRole("combobox", { name: /deassign a course/i }), {
  //     target: { value: "1" },
  //   });

  //   fireEvent.click(screen.getByText("Deassign"));

  //   await waitFor(() => {
  //     expect(screen.getByText("Error deassigning course")).toBeInTheDocument();
  //   });

  //   fireEvent.click(screen.getByText("OK"));
  // });
});
