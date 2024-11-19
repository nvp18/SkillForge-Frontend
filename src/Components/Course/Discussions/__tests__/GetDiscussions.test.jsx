import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, vi, expect, beforeEach } from "vitest";
import apiClient from "../../../../apiClient";
import GetDiscussions from "../GetDiscussions";

vi.mock("../../../../apiClient");

describe("GetDiscussions Component", () => {
  const mockDiscussions = [
    { id: 1, title: "Discussion 1", createdat: "2024-11-10T10:00:00Z" },
    { id: 2, title: "Discussion 2", createdat: "2024-11-11T10:00:00Z" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<GetDiscussions />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches and displays discussions", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockDiscussions });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<GetDiscussions />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Discussion 2")).toBeInTheDocument();
      expect(screen.getByText("Discussion 1")).toBeInTheDocument();
    });
  });

  it("displays an error message when fetch fails", async () => {
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

  // it("navigates to AddDiscussion page", async () => {
  //   apiClient.get.mockResolvedValueOnce({ data: mockDiscussions });

  //   render(
  //     <MemoryRouter>
  //       <Routes>
  //         <Route path="/" element={<GetDiscussions />} />
  //         <Route path="/course/:courseId/addDiscussion" element={<div>Mock Add Discussion Page</div>} />
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => screen.getByText("Add Discussion"));
  //   userEvent.click(screen.getByText("Add Discussion"));

  //   expect(screen.getByText("Mock Add Discussion Page")).toBeInTheDocument();
  // });

  // it("navigates to specific discussion on title click", async () => {
  //   apiClient.get.mockResolvedValueOnce({ data: mockDiscussions });

  //   render(
  //     <MemoryRouter>
  //       <Routes>
  //         <Route path="/" element={<GetDiscussions />} />
  //         <Route
  //           path="/course/:courseId/discussion/:discussionId"
  //           element={<div>Mock Discussion Detail Page</div>}
  //         />
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => screen.getByText("Discussion 2"));
  //   userEvent.click(screen.getByText("Discussion 2"));

  //   expect(screen.getByText("Mock Discussion Detail Page")).toBeInTheDocument();
  // });
});
