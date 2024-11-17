import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import apiClient from "../../apiClient";
import EditCourse from "./EditCourse";

jest.mock("../../apiClient");

describe("EditCourse Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("updates course details successfully", async () => {
    apiClient.put.mockResolvedValueOnce({});
    render(<EditCourse />, { wrapper: MemoryRouter });

    userEvent.type(screen.getByLabelText(/course description/i), "Updated description");
    userEvent.type(screen.getByLabelText(/course tags/i), "tag1, tag2");
    userEvent.type(screen.getByLabelText(/days to finish/i), "10");
    userEvent.click(screen.getByText(/update course/i));

    await waitFor(() => {
      expect(screen.getByText("Course details successfully updated")).toBeInTheDocument();
    });
  });

  test("shows error on failed update", async () => {
    apiClient.put.mockRejectedValueOnce({ response: { data: { message: "Update failed" } } });

    render(<EditCourse />, { wrapper: MemoryRouter });

    userEvent.click(screen.getByText(/update course/i));

    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });

  test("cancels update process", () => {
    render(<EditCourse />, { wrapper: MemoryRouter });
    userEvent.click(screen.getByText(/cancel/i));
    expect(screen.getByText(/edit course/i)).toBeInTheDocument();
  });
});
