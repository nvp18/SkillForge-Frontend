import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import apiClient from "../../../../apiClient";
import AddQuiz from "./AddQuiz";

jest.mock("../../../../apiClient");

describe("AddQuiz Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("adds a new quiz", async () => {
    apiClient.post.mockResolvedValueOnce({});

    render(<AddQuiz courseId="123" onClose={jest.fn()} onQuizSaved={jest.fn()} />);

    userEvent.type(screen.getByPlaceholderText("Enter quiz title"), "New Quiz");
    userEvent.type(screen.getByPlaceholderText("Enter quiz description"), "Quiz description");

    userEvent.type(screen.getByPlaceholderText("Question"), "What is 2+2?");
    userEvent.type(screen.getByPlaceholderText("Option 1"), "4");
    userEvent.type(screen.getByPlaceholderText("Option 2"), "5");
    userEvent.type(screen.getByPlaceholderText("Option 3"), "6");
    userEvent.type(screen.getByPlaceholderText("Option 4"), "7");

    userEvent.click(screen.getByText("Add Question"));

    userEvent.click(screen.getByText("Save Quiz"));

    await waitFor(() => {
      expect(screen.getByText("Quiz saved successfully.")).toBeInTheDocument();
    });
  });

  test("displays error on save failure", async () => {
    apiClient.post.mockRejectedValueOnce({ response: { data: { message: "Failed to save quiz" } } });

    render(<AddQuiz courseId="123" onClose={jest.fn()} onQuizSaved={jest.fn()} />);

    userEvent.click(screen.getByText("Save Quiz"));

    await waitFor(() => {
      expect(screen.getByText("Failed to save quiz")).toBeInTheDocument();
    });
  });
});
