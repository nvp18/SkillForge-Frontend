import { render, screen, waitFor } from "@testing-library/react";
import apiClient from "../../apiClient";
import GetAllConcerns from "./GetAllConcerns";

jest.mock("../../apiClient");

describe("GetAllConcerns Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays concerns", async () => {
    apiClient.get.mockResolvedValueOnce({ data: [{ id: 1, title: "Concern 1" }] });

    render(<GetAllConcerns />);

    await waitFor(() => {
      expect(screen.getByText("Concern 1")).toBeInTheDocument();
    });
  });

  test("handles fetch error", async () => {
    apiClient.get.mockRejectedValueOnce({ response: { data: { message: "Failed to fetch concerns" } } });

    render(<GetAllConcerns />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch concerns")).toBeInTheDocument();
    });
  });
});
