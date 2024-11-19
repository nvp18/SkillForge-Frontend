import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import * as apiClient from "../../../../apiClient"; // Ensure correct path
import AddAnnouncement from "../AddAnnouncements"; // Correct component import

// Mock apiClient methods
vi.mock("../../../../apiClient", () => ({
  post: vi.fn(),
}));

// Define mockNavigate at the top level
const mockNavigate = vi.fn();

// Mock react-router-dom methods
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Mock useNavigate with mockNavigate
    useParams: () => ({ courseId: "123" }), // Mock courseId as needed
  };
});

describe("AddAnnouncement Component", () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockClear(); // Clear the mocked API client post calls
    mockNavigate.mockClear(); // Clear previous mockNavigate calls
  });

  it("renders the component correctly", () => {
    render(
      <MemoryRouter>
        <AddAnnouncement /> {/* Correct component name */}
      </MemoryRouter>
    );

    expect(screen.getByText(/Add Announcement/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter announcement title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter announcement description/i)).toBeInTheDocument();
  });

  it("shows an error message if API call fails", async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce({
      response: { data: { message: "Failed to post announcement" } },
    });
  
    render(
      <MemoryRouter>
        <AddAnnouncement />
      </MemoryRouter>
    );
  
    fireEvent.change(screen.getByPlaceholderText(/Enter announcement title/i), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter announcement description/i), {
      target: { value: "Test Description" },
    });
  
    fireEvent.click(screen.getByText(/Post/i));
  
    await waitFor(() => {
      expect(
        screen.getByText(/An error occurred while posting the announcement. Please try again./i)
      ).toBeInTheDocument();
    });
  });
  
  // it("shows success modal when announcement is posted successfully", async () => {
  //   vi.mocked(apiClient.post).mockResolvedValueOnce({});
  
  //   render(
  //     <MemoryRouter>
  //       <AddAnnouncement />
  //     </MemoryRouter>
  //   );
  
  //   fireEvent.change(screen.getByPlaceholderText(/Enter announcement title/i), {
  //     target: { value: "Test Title" },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText(/Enter announcement description/i), {
  //     target: { value: "Test Description" },
  //   });
  
  //   fireEvent.click(screen.getByText(/Post/i));
  
  //   // Locate the success message using findByText
  //   const successMessage = await screen.findByText(/Announcement successfully posted./i);
  //   expect(successMessage).toBeInTheDocument();
  
  //   fireEvent.click(screen.getByText(/OK/i));
  //   expect(mockNavigate).toHaveBeenCalledWith("/course/123/announcements");
  // });
  
  
  
  
  

  it("navigates back on cancel", () => {
    render(
      <MemoryRouter>
        <AddAnnouncement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Cancel/i));

    expect(mockNavigate).toHaveBeenCalledWith("/course/123/announcements");
  });

  it("handles empty title and description gracefully", () => {
    render(
      <MemoryRouter>
        <AddAnnouncement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Post/i));

    expect(screen.getByText(/Title and description cannot be empty/i)).toBeInTheDocument();
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it("clears error message on success", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <AddAnnouncement />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter announcement title/i), {
      target: { value: "Valid Title" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter announcement description/i), {
      target: { value: "Valid Description" },
    });

    fireEvent.click(screen.getByText(/Post/i));

    await waitFor(() => {
      expect(screen.queryByText(/Title and description cannot be empty/i)).not.toBeInTheDocument();
    });
  });
});
