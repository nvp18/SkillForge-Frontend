import { render, screen, waitFor } from "@testing-library/react";
import apiClient from "../../apiClient";
import GetConcernById from "./GetConcernById";

jest.mock("../../apiClient");

describe("GetConcernById Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays concern details", async () => {
    apiClient.get.mockResolvedValueOnce({ data: { id: 1, title: "Concern 1" } });

    render(<GetConcernById concernId="1" />);

    await waitFor(() => {
      expect(screen.getByText("Concern 1")).toBeInTheDocument();
    });
  });

  test("handles fetch error", async () => {
    apiClient.get.mockRejectedValueOnce({ response: { data: { message: "Failed to fetch concern" } } });

    render(<GetConcernById concernId="1" />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch concern")).toBeInTheDocument();
    });
  });
});
