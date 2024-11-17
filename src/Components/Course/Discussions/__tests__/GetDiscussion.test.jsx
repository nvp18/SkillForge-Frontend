import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import apiClient from "../../../../apiClient";
import GetDiscussion from "./GetDiscussion";

jest.mock("../../../../apiClient");

describe("GetDiscussion Component", () => {
  const mockDiscussion = {
    id: 1,
    title: "Mock Discussion",
    description: "This is a test discussion.",
    createdat: "2024-11-10T10:00:00Z",
    createdby: "Admin",
    discussionReplyList: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays discussion", async () => {
    apiClient.get.mockResolvedValueOnce({ data: [mockDiscussion] });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<GetDiscussion />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Mock Discussion")).toBeInTheDocument();
      expect(screen.getByText("This is a test discussion.")).toBeInTheDocument();
    });
  });

  test("allows posting a reply", async () => {
    apiClient.get.mockResolvedValueOnce({ data: [mockDiscussion] });
    apiClient.post.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<GetDiscussion />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Reply"));
    userEvent.click(screen.getByText("Reply"));

    userEvent.type(screen.getByPlaceholderText(/write your reply/i), "This is a test reply.");
    userEvent.click(screen.getByText("Post Reply"));

    await waitFor(() => {
      expect(screen.getByText("Reply posted successfully.")).toBeInTheDocument();
    });
  });
});
