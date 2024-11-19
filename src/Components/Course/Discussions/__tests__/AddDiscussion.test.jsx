import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import apiClient from "../../../../apiClient";
import AddDiscussion from "../AddDiscussion";
import { vi } from "vitest";

vi.mock("../../../../apiClient");

describe("AddDiscussion Component", () => {
  const setup = () => {
    render(
      <MemoryRouter initialEntries={["/course/1/add-discussion"]}>
        <Routes>
          <Route path="/course/:courseId/add-discussion" element={<AddDiscussion />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the form correctly", () => {
    setup();

    expect(screen.getByPlaceholderText(/enter discussion title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter discussion description/i)).toBeInTheDocument();
    expect(screen.getByText("Post")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("posts a new discussion successfully and shows success modal", async () => {
    apiClient.post.mockResolvedValueOnce({});

    setup();

    userEvent.type(screen.getByPlaceholderText(/enter discussion title/i), "New Discussion");
    userEvent.type(screen.getByPlaceholderText(/enter discussion description/i), "Discussion description");

    userEvent.click(screen.getByText("Post"));

    await waitFor(() => {
      expect(screen.getByText("Discussion successfully posted.")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("OK"));

    await waitFor(() => {
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  test("displays error message on post failure", async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { data: { message: "Failed to post discussion." } },
    });

    setup();

    userEvent.type(screen.getByPlaceholderText(/enter discussion title/i), "New Discussion");
    userEvent.type(screen.getByPlaceholderText(/enter discussion description/i), "Discussion description");

    userEvent.click(screen.getByText("Post"));

    await waitFor(() => {
      expect(screen.getByText("Failed to post discussion.")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("OK"));

    await waitFor(() => {
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  // test("navigates back on cancel button click", async () => {
  //   setup();

  //   userEvent.click(screen.getByText("Cancel"));

  //   await waitFor(() => {
  //     expect(window.location.pathname).toBe("/course/1/discussions");
  //   });
  // });

  // test("displays error when title or description is missing", async () => {
  //   setup();

  //   // Empty title and description
  //   userEvent.click(screen.getByText("Post"));

  //   await waitFor(() => {
  //     expect(apiClient.post).not.toHaveBeenCalled();
  //     expect(screen.getByText("An error occurred while posting the discussion.")).toBeInTheDocument();
  //   });

  //   fireEvent.click(screen.getByText("OK"));

  //   await waitFor(() => {
  //     expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  //   });
  // });
});
