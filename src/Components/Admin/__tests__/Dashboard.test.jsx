import { render, screen, waitFor } from "@testing-library/react";
import apiClient from "../../apiClient";
import Dashboard from "./Dashboard";

jest.mock("../../apiClient");

describe("Dashboard Component", () => {
  test("displays courses based on role", async () => {
    localStorage.setItem("role", "ADMIN");
    apiClient.get.mockResolvedValueOnce({ data: [{ courseId: 1, courseName: "Admin Course" }] });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Admin Course")).toBeInTheDocument();
    });
  });
});
