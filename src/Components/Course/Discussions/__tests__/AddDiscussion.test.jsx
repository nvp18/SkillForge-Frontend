import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import apiClient from "../../../../apiClient";
import AddDiscussion from "./AddDiscussion";

jest.mock("../../../../apiClient");

describe("AddDiscussion Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("posts a new discussion", async () => {
    apiClient.post.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<AddDiscussion />} />
        </Routes>
      </MemoryRouter>
    );

    userEvent.type(screen.getByPlaceholderText(/enter discussion title/i), "New Discussion");
    userEvent.type(screen.getByPlaceholderText(/enter discussion description/i), "Discussion description");

    userEvent.click(screen.getByText("Post"));

    await waitFor(() => {
      expect(screen.getByText("Discussion successfully posted.")).toBeInTheDocument();
    });
  });

  test("displays error on post failure", async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { data: { message: "Failed to post discussion." } },
    });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<AddDiscussion />} />
        </Routes>
      </MemoryRouter>
    );

    userEvent.type(screen.getByPlaceholderText(/enter discussion title/i), "New Discussion");
    userEvent.click(screen.getByText("Post"));

    await waitFor(() => {
      expect(screen.getByText("Failed to post discussion.")).toBeInTheDocument();
    });
  });
});
