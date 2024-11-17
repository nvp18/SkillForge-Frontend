import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import apiClient from "../../../../apiClient";
import Quiz from "./Quiz";

jest.mock("../../../../apiClient");

describe("Quiz Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockQuiz = {
    id: 1,
    title: "Sample Quiz",
    description: "This is a test quiz.",
  };

  test("renders quiz list and handles 'Add Quiz' action", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockQuiz });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Quiz courseId="123" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Sample Quiz")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Add Quiz"));
    expect(screen.getByText("Add Quiz")).toBeInTheDocument();
  });

  test("deletes a quiz", async () => {
    apiClient.delete.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Quiz courseId="123" />} />
        </Routes>
      </MemoryRouter>
    );

    userEvent.click(screen.getByText(/delete quiz/i));
    await waitFor(() => {
      expect(screen.getByText("Quiz deleted successfully.")).toBeInTheDocument();
    });
  });
});
