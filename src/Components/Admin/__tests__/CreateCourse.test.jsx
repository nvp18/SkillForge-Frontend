import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import apiClient from "../../apiClient";
import CreateCourse from "./CreateCourse";

jest.mock("../../apiClient");

describe("CreateCourse Component", () => {
  test("creates a new course successfully", async () => {
    apiClient.post.mockResolvedValueOnce({});

    render(<CreateCourse />);

    userEvent.type(screen.getByLabelText(/course name/i), "New Course");
    userEvent.click(screen.getByText(/create course/i));

    await waitFor(() => {
      expect(screen.getByText("Course successfully created")).toBeInTheDocument();
    });
  });

  test("handles course creation error", async () => {
    apiClient.post.mockRejectedValueOnce({ response: { data: { message: "Course creation failed" } } });

    render(<CreateCourse />);

    userEvent.click(screen.getByText(/create course/i));

    await waitFor(() => {
      expect(screen.getByText("Course creation failed")).toBeInTheDocument();
    });
  });
});
