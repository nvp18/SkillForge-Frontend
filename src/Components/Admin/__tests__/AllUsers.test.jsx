import { render, screen, waitFor } from "@testing-library/react";
import apiClient from "../../apiClient";
import AllUsers from "./AllUsers";

jest.mock("../../apiClient");

describe("AllUsers Component", () => {
  test("fetches and displays all users", async () => {
    apiClient.get.mockResolvedValueOnce({ data: [{ userId: 1, userName: "User 1" }] });

    render(<AllUsers />);

    await waitFor(() => {
      expect(screen.getByText("User 1")).toBeInTheDocument();
    });
  });

  test("handles fetch error", async () => {
    apiClient.get.mockRejectedValueOnce({ response: { data: { message: "Failed to fetch users" } } });

    render(<AllUsers />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch users")).toBeInTheDocument();
    });
  });
});
