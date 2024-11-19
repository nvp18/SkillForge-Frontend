import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModuleContent from "../ModuleContent";
import { vi } from "vitest";
import apiClient from "../../../../apiClient"; // Correctly import apiClient

vi.mock("../../../../apiClient", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("ModuleContent Component", () => {
  const mockModuleContents = [
    { moduleId: 1, moduleName: "Module 1" },
    { moduleId: 2, moduleName: "Module 2" },
  ];

  const mockCloseViewer = vi.fn();

  beforeEach(() => {
    localStorage.setItem("token", "mock-token");
    vi.clearAllMocks(); // Clear mocks between tests
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("displays loading and renders iframe on success", async () => {
    apiClient.get.mockResolvedValueOnce({ data: { message: "http://mock-pdf-url.com/sample.pdf" } });

    render(<ModuleContent moduleContents={mockModuleContents} initialIndex={0} closeViewer={mockCloseViewer} />);

    expect(screen.getByText("Loading PDF...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTitle("Module 1")).toBeInTheDocument();
    });
  });

  test("displays error message on API failure", async () => {
    apiClient.get.mockRejectedValueOnce({ response: { data: { message: "Failed to load PDF" } } });

    render(<ModuleContent moduleContents={mockModuleContents} initialIndex={0} closeViewer={mockCloseViewer} />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load PDF")).toBeInTheDocument();
    });
  });

  test("navigates to previous module", async () => {
    apiClient.get.mockResolvedValueOnce({ data: { message: "http://mock-url1.pdf" } });
    apiClient.get.mockResolvedValueOnce({ data: { message: "http://mock-url2.pdf" } });

    render(<ModuleContent moduleContents={mockModuleContents} initialIndex={1} closeViewer={mockCloseViewer} />);

    fireEvent.click(screen.getByText("Prev Module"));

    await waitFor(() => {
      expect(screen.getByTitle("Module 1")).toBeInTheDocument();
    });
  });

  test("navigates to next module", async () => {
    apiClient.get.mockResolvedValueOnce({ data: { message: "http://mock-url1.pdf" } });
    apiClient.get.mockResolvedValueOnce({ data: { message: "http://mock-url2.pdf" } });

    render(<ModuleContent moduleContents={mockModuleContents} initialIndex={0} closeViewer={mockCloseViewer} />);

    fireEvent.click(screen.getByText("Next Module"));

    await waitFor(() => {
      expect(screen.getByTitle("Module 2")).toBeInTheDocument();
    });
  });

  test("disables prev button on first module", async () => {
    apiClient.get.mockResolvedValueOnce({ data: { message: "http://mock-url.pdf" } });

    render(<ModuleContent moduleContents={mockModuleContents} initialIndex={0} closeViewer={mockCloseViewer} />);

    expect(screen.getByText("Prev Module")).toBeDisabled();
  });

  test("disables next button on last module", async () => {
    apiClient.get.mockResolvedValueOnce({ data: { message: "http://mock-url.pdf" } });

    render(<ModuleContent moduleContents={mockModuleContents} initialIndex={1} closeViewer={mockCloseViewer} />);

    expect(screen.getByText("Next Module")).toBeDisabled();
  });
});
