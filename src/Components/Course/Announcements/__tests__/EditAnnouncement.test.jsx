import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import apiClient from "../../../../apiClient";
import EditAnnouncement from "./EditAnnouncement";

jest.mock("../../../../apiClient");


describe("EditAnnouncement Component", () => {
  const mockAnnouncement = {
    title: "Old Title",
    description: "Old Description",
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

  test("fetches and displays the existing announcement details", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockAnnouncement });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<EditAnnouncement />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Old Title")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Old Description")).toBeInTheDocument();
    });
  });

  test("updates an announcement successfully", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockAnnouncement });
    apiClient.put.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<EditAnnouncement />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue("Old Title"));

    userEvent.clear(screen.getByDisplayValue("Old Title"));
    userEvent.type(screen.getByLabelText(/title/i), "New Title");

    userEvent.click(screen.getByRole("button", { name: /edit/i }));

    await waitFor(() => {
      expect(screen.getByText("Announcement successfully edited.")).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole("button", { name: /ok/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/course/123/announcement/1");
  });
});
