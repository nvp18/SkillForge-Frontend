import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import apiClient from "../../../../apiClient";
import GetAnnouncement from "./GetAnnouncement";

jest.mock("../../../../apiClient");


describe("GetAnnouncement Component", () => {
  const mockAnnouncement = {
    id: 1,
    title: "Test Announcement",
    description: "Test Description",
    createdat: "2024-11-15T12:00:00Z",
    updatedat: "2024-11-16T12:00:00Z",
    createdby: "Admin",
  };

  const mockNavigate = jest.fn();
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useParams: () => ({ announcementId: "1", courseId: "123" }),
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "test-token");
  });

  test("fetches and displays an announcement", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockAnnouncement });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<GetAnnouncement />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Title: Test Announcement")).toBeInTheDocument();
      expect(screen.getByText("Description: Test Description")).toBeInTheDocument();
    });
  });

  test("displays error message on fetch failure", async () => {
    apiClient.get.mockRejectedValueOnce({
      response: { data: { message: "Failed to fetch announcement." } },
    });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<GetAnnouncement />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch announcement.")).toBeInTheDocument();
    });
  });

  test("shows modal and navigates after delete", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockAnnouncement });
    apiClient.delete.mockResolvedValueOnce({ data: { message: "Deleted successfully." } });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<GetAnnouncement />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Title: Test Announcement"));

    userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByText("Deleted successfully.")).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole("button", { name: /ok/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/course/123/announcements");
  });
});
