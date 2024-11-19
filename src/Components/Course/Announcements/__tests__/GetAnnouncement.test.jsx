import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import * as apiClient from "../../../../apiClient"; // Ensure correct path
import GetAnnouncement from "../GetAnnouncement"; // Correct component import

// Mock apiClient methods
vi.mock("../../../../apiClient", () => ({
  get: vi.fn(),
  delete: vi.fn(),
}));

// Define mockNavigate at the top level
const mockNavigate = vi.fn();

// Mock react-router-dom methods
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Mock useNavigate with mockNavigate
    useParams: () => ({ announcementId: "456", courseId: "123" }), // Mock announcementId and courseId as needed
  };
});

describe("GetAnnouncement Component", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockClear(); // Clear the mocked API client get calls
    vi.mocked(apiClient.delete).mockClear(); // Clear the mocked API client delete calls
    mockNavigate.mockClear(); // Clear previous mockNavigate calls
  });

  // it("renders loading state initially", async () => {
  //   vi.mocked(apiClient.get).mockImplementationOnce(
  //     () =>
  //       new Promise((resolve) =>
  //         setTimeout(() => resolve({ data: {} }), 100)
  //       ) // Simulate a delayed API response
  //   );
  
  //   render(
  //     <MemoryRouter>
  //       <GetAnnouncement />
  //     </MemoryRouter>
  //   );
  
  //   expect(screen.getByText("Loading...")).toBeInTheDocument();
  
  //   await waitFor(() => {
  //     expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  //   });
  // });
  
  
  
  
  // it("renders the component with fetched data", async () => {
  //   const mockData = {
  //     title: "Test Announcement",
  //     description: "This is a test description",
  //     createdat: "2023-01-01T12:00:00Z",
  //     updatedat: "2023-01-02T12:00:00Z",
  //     createdby: "Admin User",
  //   };
  
  //   vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockData });
  
  //   render(
  //     <MemoryRouter>
  //       <GetAnnouncement />
  //     </MemoryRouter>
  //   );
  
  //   await waitFor(() => {
  //     expect(screen.getByText("Title: Test Announcement")).toBeInTheDocument();
  //   });
  // });
  

  it("shows an error message if fetching announcement fails", async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce({
      response: { data: { message: "Failed to fetch announcement" } },
    });

    render(
      <MemoryRouter>
        <GetAnnouncement />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch announcement/i)).toBeInTheDocument();
    });
  });

  // it("handles delete announcement success and shows modal", async () => {
  //   localStorage.setItem("role", "ADMIN"); // Ensure the role is admin
  
  //   const mockData = {
  //     title: "Test Announcement",
  //     description: "This is a test description",
  //   };
  
  //   vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockData });
  //   vi.mocked(apiClient.delete).mockResolvedValueOnce({
  //     data: { message: "Announcement deleted successfully" },
  //   });
  
  //   render(
  //     <MemoryRouter>
  //       <GetAnnouncement />
  //     </MemoryRouter>
  //   );
  
  //   await waitFor(() => screen.getByRole("button", { name: /Delete/i }));
  //   fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
  
  //   await waitFor(() => {
  //     expect(screen.getByText(/Announcement deleted successfully/i)).toBeInTheDocument();
  //   });
  // });
  
  
  // it("handles delete announcement failure and shows modal", async () => {
  //   localStorage.setItem("role", "ADMIN");
  
  //   const mockData = {
  //     title: "Test Announcement",
  //     description: "This is a test description",
  //   };
  
  //   vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockData });
  //   vi.mocked(apiClient.delete).mockRejectedValueOnce({
  //     response: { data: { message: "Failed to delete announcement" } },
  //   });
  
  //   render(
  //     <MemoryRouter>
  //       <GetAnnouncement />
  //     </MemoryRouter>
  //   );
  
  //   await waitFor(() => screen.getByRole("button", { name: /Delete/i }));
  //   fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
  
  //   await waitFor(() => {
  //     expect(screen.getByText(/Failed to delete announcement/i)).toBeInTheDocument();
  //   });
  // });
  // it("navigates to edit announcement on edit button click", async () => {
  //   localStorage.setItem("role", "ADMIN");
  
  //   const mockData = {
  //     title: "Test Announcement",
  //     description: "This is a test description",
  //   };
  
  //   vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockData });
  
  //   render(
  //     <MemoryRouter>
  //       <GetAnnouncement />
  //     </MemoryRouter>
  //   );
  
  //   await waitFor(() => screen.getByRole("button", { name: /Edit/i }));
  //   fireEvent.click(screen.getByRole("button", { name: /Edit/i }));
  
  //   expect(mockNavigate).toHaveBeenCalledWith("editAnnouncement/456");
  // });
});
  
  


