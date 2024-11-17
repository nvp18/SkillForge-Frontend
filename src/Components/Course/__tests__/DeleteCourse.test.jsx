import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import apiClient from "../../apiClient";
import DeleteCourse from "./DeleteCourse";

jest.mock("../../apiClient");

describe("DeleteCourse Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deletes course successfully", async () => {
    apiClient.delete.mockResolvedValueOnce({});
    render(<DeleteCourse />, { wrapper: MemoryRouter });

    userEvent.click(screen.getByText(/yes, delete/i));

    await waitFor(() => {
      expect(screen.getByText("Course successfully deleted")).toBeInTheDocument();
    });
  });

  test("shows error on delete failure", async () => {
    apiClient.delete.mockRejectedValueOnce({ response: { data: { message: "Delete failed" } } });

    render(<DeleteCourse />, { wrapper: MemoryRouter });

    userEvent.click(screen.getByText(/yes, delete/i));

    await waitFor(() => {
      expect(screen.getByText("Delete failed")).toBeInTheDocument();
    });
  });

  test("cancels delete process", () => {
    render(<DeleteCourse />, { wrapper: MemoryRouter });
    userEvent.click(screen.getByText(/cancel/i));
    expect(screen.getByText(/delete course/i)).toBeInTheDocument();
  });
});
