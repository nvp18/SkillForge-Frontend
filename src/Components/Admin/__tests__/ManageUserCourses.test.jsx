import { render, screen, waitFor } from "@testing-library/react";
import apiClient from "../../apiClient";
import ManageUserCourses from "./ManageUserCourses";

jest.mock("../../apiClient");

describe("ManageUserCourses Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays user courses", async () => {
    apiClient.get.mockResolvedValueOnce({ data: [{ courseId: 1, courseName: "Course 1" }] });

    render(<ManageUserCourses userId="123" />);

    await waitFor(() => {
      expect(screen.getByText("Course 1")).toBeInTheDocument();
    });
  });

  test("handles fetch error", async () => {
    apiClient.get.mockRejectedValueOnce({ response: { data: { message: "Failed to fetch courses" } } });

    render(<ManageUserCourses userId="123" />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch courses")).toBeInTheDocument();
    });
  });
});
