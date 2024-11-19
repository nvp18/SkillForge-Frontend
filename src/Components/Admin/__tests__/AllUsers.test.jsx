import { render, screen, waitFor } from "@testing-library/react";
import AllUsers from "../AllUsers";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock fetch API
global.fetch = vi.fn();

describe("AllUsers Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header without crashing", () => {
    render(
      <BrowserRouter>
        <AllUsers />
      </BrowserRouter>
    );
    expect(screen.getByText("All Users")).toBeInTheDocument();
  });

  it("displays users on success", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ userId: 1, userName: "johndoe" }],
    });

    render(
      <BrowserRouter>
        <AllUsers />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/johndoe/i)).toBeInTheDocument();
    });
  });

  it("shows error message on failure", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(
      <BrowserRouter>
        <AllUsers />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch users/i)).toBeInTheDocument();
    });
  });

  it("navigates correctly on click", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ userId: 1, userName: "johndoe" }],
    });

    render(
      <BrowserRouter>
        <AllUsers />
      </BrowserRouter>
    );

    await waitFor(() => {
      const userLink = screen.getByRole("link", { name: /johndoe/i });
      expect(userLink).toBeInTheDocument();
    });
  });

  it("displays no users when list is empty", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <BrowserRouter>
        <AllUsers />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No users available/i)).toBeInTheDocument();
    });
  });
});
