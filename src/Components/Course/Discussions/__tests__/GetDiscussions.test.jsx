import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import apiClient from "../../../../apiClient";
import GetDiscussions from "./GetDiscussions";

jest.mock("../../../../apiClient");

describe("GetDiscussions Component", () => {
  const mockDiscussions = [
    { id: 1, title: "Discussion 1", createdat: "2024-11-10T10:00:00Z" },
    { id: 2, title: "Discussion 2", createdat: "2024-11-11T10:00:00Z" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays discussions", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockDiscussions });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<GetDiscussions />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Discussion 2")).toBeInTheDocument();
      expect(screen.getByText("Discussion 1")).toBeInTheDocument();
    });
  });

  test("displays error message on fetch failure", async () => {
    apiClient.get.mockRejectedValueOnce({
      response: { data: { message: "Failed to fetch discussions." } },
    });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<GetDiscussions />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch discussions.")).toBeInTheDocument();
    });
  });

  test("navigates to AddDiscussion page", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockDiscussions });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<GetDiscussions />} />
          <Route path="/course/:courseId/addDiscussion" element={<div>Mock Add Discussion Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Add Discussion"));
    userEvent.click(screen.getByText("Add Discussion"));

    expect(screen.getByText("Mock Add Discussion Page")).toBeInTheDocument();
  });
});
