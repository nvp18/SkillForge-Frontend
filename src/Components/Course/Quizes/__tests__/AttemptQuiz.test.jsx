import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import apiClient from "../../../../apiClient";
import AttemptQuiz from "./AttemptQuiz";

jest.mock("../../../../apiClient");

describe("AttemptQuiz Component", () => {
  const mockQuestions = [
    {
      id: 1,
      question: "Question 1?",
      option1: "Option A",
      option2: "Option B",
      option3: "Option C",
      option4: "Option D",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays quiz questions", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockQuestions });

    render(<AttemptQuiz />);

    await waitFor(() => {
      expect(screen.getByText("Question 1?")).toBeInTheDocument();
    });
  });

  test("allows answer selection and submits quiz", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockQuestions });
    apiClient.post.mockResolvedValueOnce({ data: { message: "Quiz submitted!" } });

    render(<AttemptQuiz />);

    await waitFor(() => screen.getByText("Question 1?"));
    userEvent.click(screen.getByText("Option A"));

    userEvent.click(screen.getByText("Submit Quiz"));

    await waitFor(() => {
      expect(screen.getByText("Quiz submitted successfully!")).toBeInTheDocument();
    });
  });
});
