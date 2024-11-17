import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import apiClient from "../../../../apiClient";
import GetModules from "./GetModules";

jest.mock("../../../../apiClient");

describe("GetModules Component", () => {
  const mockModules = [
    { moduleId: 1, moduleName: "Module 1" },
    { moduleId: 2, moduleName: "Module 2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays modules", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockModules });

    render(
      <MemoryRouter>
        <GetModules />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Module 1")).toBeInTheDocument();
      expect(screen.getByText("Module 2")).toBeInTheDocument();
    });
  });
});
