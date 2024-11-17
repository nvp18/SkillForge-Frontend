import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import apiClient from "../../../../apiClient";
import Announcements from "./GetAnnouncements";

jest.mock("../../../../apiClient");


describe("GetAnnouncements Component", () => {
  const mockAnnouncements = [
    { id: 1, title: "Announcement 1", createdat: "2024-11-15T12:00:00Z" },
    { id: 2, title: "Announcement 2", createdat: "2024-11-16T12:00:00Z" },
  ];

  const mockNavigate = jest.fn();
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useParams: () => ({ courseId: "123" }),
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "test-token");
  });

  test("fetches and displays announcements", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockAnnouncements });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Announcements />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Announcement 2")).toBeInTheDocument();
      expect(screen.getByText("Announcement 1")).toBeInTheDocument();
    });
  });

  test("displays error message on fetch failure", async () => {
    apiClient.get.mockRejectedValueOnce({
      response: { data: { message: "Failed to fetch announcements." } },
    });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Announcements />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch announcements.")).toBeInTheDocument();
    });
  });

  test("navigates to add announcement page for admin", async () => {
    localStorage.setItem("role", "ADMIN");
    apiClient.get.mockResolvedValueOnce({ data: mockAnnouncements });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Announcements />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add announcement/i })).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole("button", { name: /add announcement/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/course/123/addAnnouncement");
  });

  test("does not show add button for non-admin users", async () => {
    localStorage.setItem("role", "EMPLOYEE");
    apiClient.get.mockResolvedValueOnce({ data: mockAnnouncements });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Announcements />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /add announcement/i })).not.toBeInTheDocument();
    });
  });
});
