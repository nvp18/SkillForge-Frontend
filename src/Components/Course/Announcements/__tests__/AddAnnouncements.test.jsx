import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import apiClient from "../../../../apiClient";
import AddAnnouncement from "./AddAnnouncements";

jest.mock("../../../../apiClient");


describe("AddAnnouncement Component", () => {
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

  test("adds a new announcement successfully", async () => {
    apiClient.post.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<AddAnnouncement />} />
        </Routes>
      </MemoryRouter>
    );

    userEvent.type(screen.getByLabelText(/title/i), "New Announcement");
    userEvent.type(screen.getByLabelText(/description/i), "This is a new announcement.");

    userEvent.click(screen.getByRole("button", { name: /post/i }));

    await waitFor(() => {
      expect(screen.getByText("Announcement successfully posted.")).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole("button", { name: /ok/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/course/123/announcements");
  });

  test("displays error when adding fails", async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { data: { message: "Failed to post announcement." } },
    });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<AddAnnouncement />} />
        </Routes>
      </MemoryRouter>
    );

    userEvent.type(screen.getByLabelText(/title/i), "New Announcement");
    userEvent.click(screen.getByRole("button", { name: /post/i }));

    await waitFor(() => {
      expect(screen.getByText("Failed to post announcement.")).toBeInTheDocument();
    });
  });
});

