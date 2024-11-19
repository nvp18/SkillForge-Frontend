import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import * as apiClient from "../../../../apiClient"; // Ensure correct path
import EditAnnouncement from "../EditAnnouncement"; // Ensure correct path

// Mock apiClient methods
vi.mock("../../../../apiClient", () => ({
  get: vi.fn(),
  put: vi.fn(),
}));

// Define mockNavigate at the top level
const mockNavigate = vi.fn();

// Mock react-router-dom methods
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Mock useNavigate with mockNavigate
    useParams: () => ({ announcementId: "456", courseId: "123" }),
  };
});

describe("EditAnnouncement Component", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockClear();
    vi.mocked(apiClient.put).mockClear();
    mockNavigate.mockClear();
  });

  // it("renders the component and fetches announcement details", async () => {
  //   vi.mocked(apiClient.get).mockResolvedValueOnce({
  //     data: { title: "Existing Title", description: "Existing Description" },
  //   });

  //   render(
  //     <MemoryRouter>
  //       <EditAnnouncement />
  //     </MemoryRouter>
  //   );

  //   expect(screen.getByText(/Edit Announcement/i)).toBeInTheDocument();

  //   expect(await screen.findByDisplayValue("Existing Title")).toBeInTheDocument();
  //   expect(await screen.findByDisplayValue("Existing Description")).toBeInTheDocument();
  // });

  it("shows an error message if fetching details fails", async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce({
      response: { data: { message: "Failed to fetch announcement details." } },
    });

    render(
      <MemoryRouter>
        <EditAnnouncement />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Failed to fetch announcement details./i)).toBeInTheDocument();
  });

  // it("edits the announcement and shows success modal", async () => {
  //   vi.mocked(apiClient.get).mockResolvedValueOnce({
  //     data: { title: "Existing Title", description: "Existing Description" },
  //   });

  //   vi.mocked(apiClient.put).mockResolvedValueOnce({});

  //   render(
  //     <MemoryRouter>
  //       <EditAnnouncement />
  //     </MemoryRouter>
  //   );

  //   expect(await screen.findByDisplayValue("Existing Title")).toBeInTheDocument();
  //   expect(await screen.findByDisplayValue("Existing Description")).toBeInTheDocument();

  //   fireEvent.change(screen.getByDisplayValue("Existing Title"), {
  //     target: { value: "Updated Title" },
  //   });
  //   fireEvent.change(screen.getByDisplayValue("Existing Description"), {
  //     target: { value: "Updated Description" },
  //   });

  //   fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

  //   expect(await screen.findByText(/Announcement successfully edited./i)).toBeInTheDocument();

  //   fireEvent.click(screen.getByRole("button", { name: /OK/i }));

  //   expect(mockNavigate).toHaveBeenCalledWith("/course/123/announcement/456");
  // });

  it("shows an error message if editing fails", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { title: "Existing Title", description: "Existing Description" },
    });

    vi.mocked(apiClient.put).mockRejectedValueOnce({
      response: { data: { message: "Failed to edit announcement." } },
    });

    render(
      <MemoryRouter>
        <EditAnnouncement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

    expect(
      await screen.findByText(/An error occurred while editing the announcement. Please try again./i)
    ).toBeInTheDocument();
  });

  it("navigates back on cancel", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { title: "Existing Title", description: "Existing Description" },
    });

    render(
      <MemoryRouter>
        <EditAnnouncement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/course/123/announcement/456");
  });

  // it("closes modal and navigates back on success", async () => {
  //   vi.mocked(apiClient.get).mockResolvedValueOnce({
  //     data: { title: "Existing Title", description: "Existing Description" },
  //   });

  //   vi.mocked(apiClient.put).mockResolvedValueOnce({});

  //   render(
  //     <MemoryRouter>
  //       <EditAnnouncement />
  //     </MemoryRouter>
  //   );

  //   fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

  //   expect(
  //     await screen.findByText((content, element) =>
  //       element?.textContent.includes("Announcement successfully edited.")
  //     )
  //   ).toBeInTheDocument();

  //   fireEvent.click(screen.getByRole("button", { name: /OK/i }));

  //   expect(mockNavigate).toHaveBeenCalledWith("/course/123/announcement/456");
  // });
});
