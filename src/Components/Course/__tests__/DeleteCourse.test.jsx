import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import apiClient from "../../../apiClient";
import DeleteCourse from "../DeleteCourse";

// Mock the `useNavigate` function
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Return the mock function
  };
});

// Mock the API client
vi.mock("../../../apiClient");

describe("DeleteCourse Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "fake-token");
  });

  test("renders confirmation section initially", () => {
    render(<DeleteCourse />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Are you sure you want to delete this course/i)).toBeInTheDocument();
  });

  // test("deletes course successfully", async () => {
  //   apiClient.delete.mockResolvedValueOnce({});
  //   render(<DeleteCourse />, { wrapper: MemoryRouter });

  //   userEvent.click(screen.getByText(/yes, delete/i));

  //   await waitFor(() => {
  //     expect(screen.getByText(/course successfully deleted/i)).toBeInTheDocument();
  //   });

  //   userEvent.click(screen.getByText(/ok/i));

  //   expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  // });

  // test("shows error when delete fails", async () => {
  //   apiClient.delete.mockRejectedValueOnce({
  //     response: { data: { message: "Delete failed" } },
  //   });

  //   render(<DeleteCourse />, { wrapper: MemoryRouter });

  //   userEvent.click(screen.getByText(/yes, delete/i));

  //   await waitFor(() => {
  //     expect(screen.getByText("Delete failed")).toBeInTheDocument();
  //   });
  // });

  // test("navigates back on cancel", () => {
  //   render(<DeleteCourse />, { wrapper: MemoryRouter });

  //   userEvent.click(screen.getByText(/cancel/i));

  //   expect(mockNavigate).toHaveBeenCalledWith(`/course/${undefined}`);
  // });

  // test("closes success modal and navigates to dashboard", async () => {
  //   apiClient.delete.mockResolvedValueOnce({});
  //   render(<DeleteCourse />, { wrapper: MemoryRouter });

  //   userEvent.click(screen.getByText(/yes, delete/i));

  //   await waitFor(() => {
  //     expect(screen.getByText(/course successfully deleted/i)).toBeInTheDocument();
  //   });

  //   userEvent.click(screen.getByText(/ok/i));

  //   expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  // });
});
