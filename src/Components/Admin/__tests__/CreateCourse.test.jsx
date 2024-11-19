import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import CreateCourse from "../CreateCourse";
import apiClient from "../../../apiClient";

vi.mock("../../../apiClient", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("CreateCourse Component", () => {
  const setup = () => {
    render(
      <Router>
        <CreateCourse />
      </Router>
    );
  };

  test("renders the Create Course form", () => {
    setup();
    expect(screen.getByTestId("create-course-form")).toBeInTheDocument();
  });

  test("submits the form and shows success modal on successful course creation", async () => {
    apiClient.post.mockResolvedValueOnce({ data: true });

    setup();

    fireEvent.change(screen.getByTestId("course-name-input"), { target: { value: "New Course" } });
    fireEvent.change(screen.getByTestId("course-description-input"), { target: { value: "Description" } });
    fireEvent.change(screen.getByTestId("course-tags-input"), { target: { value: "tag1,tag2" } });
    fireEvent.change(screen.getByTestId("days-to-finish-input"), { target: { value: "10" } });

    fireEvent.submit(screen.getByTestId("create-course-form"));

    await waitFor(() => {
      expect(screen.getByTestId("success-modal")).toBeInTheDocument();
    });
  });

  test("handles API error and shows error modal", async () => {
    apiClient.post.mockRejectedValueOnce({ response: { data: { message: "Course creation failed" } } });

    setup();

    fireEvent.submit(screen.getByTestId("create-course-form"));

    await waitFor(() => {
      expect(screen.getByTestId("error-modal")).toBeInTheDocument();
      expect(screen.getByText("Course creation failed")).toBeInTheDocument();
    });
  });

  test("shows generic error if error message is missing", async () => {
    apiClient.post.mockRejectedValueOnce({});

    setup();

    fireEvent.submit(screen.getByTestId("create-course-form"));

    await waitFor(() => {
      expect(screen.getByTestId("error-modal")).toBeInTheDocument();
      expect(screen.getByText("An error occurred. Please try again.")).toBeInTheDocument();
    });
  });

  test("resets the form on success", async () => {
    apiClient.post.mockResolvedValueOnce({ data: true });

    setup();

    fireEvent.change(screen.getByTestId("course-name-input"), { target: { value: "New Course" } });
    fireEvent.change(screen.getByTestId("course-description-input"), { target: { value: "Description" } });
    fireEvent.change(screen.getByTestId("course-tags-input"), { target: { value: "tag1,tag2" } });
    fireEvent.change(screen.getByTestId("days-to-finish-input"), { target: { value: "10" } });

    fireEvent.submit(screen.getByTestId("create-course-form"));

    await waitFor(() => {
      expect(screen.getByTestId("success-modal")).toBeInTheDocument();
    });

    expect(screen.getByTestId("course-name-input").value).toBe("");
    expect(screen.getByTestId("course-description-input").value).toBe("");
  });
});
