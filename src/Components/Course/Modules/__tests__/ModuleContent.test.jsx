import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import apiClient from "../../../../apiClient";
import ModuleContent from "./ModuleContent";

jest.mock("../../../../apiClient");

describe("ModuleContent Component", () => {
  const mockModuleContents = [
    { moduleId: 1, moduleName: "Module 1" },
    { moduleId: 2, moduleName: "Module 2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays PDF for selected module", async () => {
    apiClient.get.mockResolvedValueOnce({ data: { message: "test.pdf" } });

    render(<ModuleContent moduleContents={mockModuleContents} initialIndex={0} closeViewer={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByTitle("Module 1")).toBeInTheDocument();
    });
  });

  test("navigates between modules", async () => {
    apiClient.get.mockResolvedValueOnce({ data: { message: "test1.pdf" } });
    apiClient.get.mockResolvedValueOnce({ data: { message: "test2.pdf" } });

    render(<ModuleContent moduleContents={mockModuleContents} initialIndex={0} closeViewer={jest.fn()} />);

    await waitFor(() => screen.getByText(/module 1/i));
    userEvent.click(screen.getByText(/next module/i));

    await waitFor(() => {
      expect(screen.getByText(/module 2/i)).toBeInTheDocument();
    });
  });
});
