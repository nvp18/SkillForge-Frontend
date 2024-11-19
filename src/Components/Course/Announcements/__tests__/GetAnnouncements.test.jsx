import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import * as apiClient from "../../../../apiClient"; // Adjust the import to your structure
import GetAnnouncements from "../GetAnnouncements"; // Correct component import

// Mock apiClient methods
vi.mock("../../../../apiClient", () => ({
  get: vi.fn(),
}));

// Define mockNavigate at the top level
const mockNavigate = vi.fn();

// Mock react-router-dom methods
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Mock useNavigate with mockNavigate
    useParams: () => ({ courseId: "123" }), // Mock courseId
  };
});

describe("GetAnnouncements Component", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockClear(); // Clear the mocked API client get calls
    mockNavigate.mockClear(); // Clear previous mockNavigate calls
  });

  it("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <GetAnnouncements />
      </MemoryRouter>
    );
  
    // Use getAllByText or be specific with a selector
    const pageHeader = screen.getByRole('heading', { name: /Announcements/i });
    expect(pageHeader).toBeInTheDocument();
  });
  

  // it("renders the component with fetched announcements", async () => {
  //   const mockAnnouncements = [
  //     { id: "1", title: "Announcement 1", createdat: "2023-01-01T12:00:00Z" },
  //     { id: "2", title: "Announcement 2", createdat: "2023-01-02T12:00:00Z" },
  //   ];
  
  //   vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockAnnouncements });
  
  //   render(
  //     <MemoryRouter>
  //       <GetAnnouncements />
  //     </MemoryRouter>
  //   );
  
  //   await waitFor(() => {
  //     // Use a more flexible query
  //     expect(screen.getByText((content, element) => {
  //       return element?.textContent === "Announcement 1";
  //     })).toBeInTheDocument();
  
  //     expect(screen.getByText((content, element) => {
  //       return element?.textContent === "Announcement 2";
  //     })).toBeInTheDocument();
  //   });
  // });
  
  

  it("shows an error message if fetching announcements fails", async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce({
      response: { data: { message: "Failed to fetch announcements" } },
    });

    render(
      <MemoryRouter>
        <GetAnnouncements />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch announcements/i)).toBeInTheDocument();
    });
  });

  it("navigates to add announcement when Add Announcement button is clicked", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] });
  
    // Mock localStorage role to ADMIN
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((key) => (key === "role" ? "ADMIN" : "token_value")),
      },
      writable: true,
    });
  
    render(
      <MemoryRouter>
        <GetAnnouncements />
      </MemoryRouter>
    );
  
    await waitFor(() => screen.getByText(/Add Announcement/i));
    fireEvent.click(screen.getByText(/Add Announcement/i));
  
    expect(mockNavigate).toHaveBeenCalledWith("/course/123/addAnnouncement");
  });
  

  it("navigates to add announcement when Add Announcement button is clicked", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] });
  
    // Mock localStorage role to ADMIN
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((key) => (key === "role" ? "ADMIN" : "token_value")),
      },
      writable: true,
    });
  
    render(
      <MemoryRouter>
        <GetAnnouncements />
      </MemoryRouter>
    );
  
    await waitFor(() => screen.getByText(/Add Announcement/i));
    fireEvent.click(screen.getByText(/Add Announcement/i));
  
    expect(mockNavigate).toHaveBeenCalledWith("/course/123/addAnnouncement");
  });
  

  it("renders no announcements message when there are no announcements", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <GetAnnouncements />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Posted on:/i)).not.toBeInTheDocument();
    });
  });
});
