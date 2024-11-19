import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, vi } from "vitest";
import CreateUser from "../CreateUser";
import apiClient from "../../../apiClient";

vi.mock("../../../apiClient", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("CreateUser Component", () => {
  const setup = () => {
    render(<CreateUser />);
  };

  test("renders the Create User form", () => {
    setup();
    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("firstname-input")).toBeInTheDocument();
    expect(screen.getByTestId("lastname-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  test("creates a new user successfully", async () => {
    apiClient.post.mockResolvedValueOnce({ data: true });

    setup();

    fireEvent.change(screen.getByTestId("username-input"), { target: { value: "newuser" } });
    fireEvent.change(screen.getByTestId("firstname-input"), { target: { value: "John" } });
    fireEvent.change(screen.getByTestId("lastname-input"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByTestId("email-input"), { target: { value: "john.doe@example.com" } });

    fireEvent.submit(screen.getByTestId("create-user-form"));

    await waitFor(() => {
      expect(screen.getByTestId("success-modal")).toBeInTheDocument();
      expect(screen.getByText("User successfully added.")).toBeInTheDocument();
    });
  });

  test("handles user creation error", async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { data: { message: "User creation failed" } },
    });

    setup();

    fireEvent.submit(screen.getByTestId("create-user-form"));

    await waitFor(() => {
      expect(screen.getByTestId("error-modal")).toBeInTheDocument();
      expect(screen.getByText("User creation failed")).toBeInTheDocument();
    });
  });

  test("shows generic error when no error message is provided", async () => {
    apiClient.post.mockRejectedValueOnce({});

    setup();

    fireEvent.submit(screen.getByTestId("create-user-form"));

    await waitFor(() => {
      expect(screen.getByTestId("error-modal")).toBeInTheDocument();
      expect(screen.getByText("An error occurred. Please try again.")).toBeInTheDocument();
    });
  });

  test("resets the form after successful submission", async () => {
    apiClient.post.mockResolvedValueOnce({ data: true });

    setup();

    fireEvent.change(screen.getByTestId("username-input"), { target: { value: "newuser" } });
    fireEvent.change(screen.getByTestId("firstname-input"), { target: { value: "John" } });
    fireEvent.change(screen.getByTestId("lastname-input"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByTestId("email-input"), { target: { value: "john.doe@example.com" } });

    fireEvent.submit(screen.getByTestId("create-user-form"));

    await waitFor(() => {
      expect(screen.getByTestId("success-modal")).toBeInTheDocument();
    });

    expect(screen.getByTestId("username-input").value).toBe("");
    expect(screen.getByTestId("firstname-input").value).toBe("");
    expect(screen.getByTestId("lastname-input").value).toBe("");
    expect(screen.getByTestId("email-input").value).toBe("");
  });

  test("closes the success modal when OK button is clicked", async () => {
    apiClient.post.mockResolvedValueOnce({ data: true });

    setup();

    fireEvent.submit(screen.getByTestId("create-user-form"));

    await waitFor(() => {
      expect(screen.getByTestId("success-modal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("OK"));

    expect(screen.queryByTestId("success-modal")).not.toBeInTheDocument();
  });

  test("closes the error modal when OK button is clicked", async () => {
    apiClient.post.mockRejectedValueOnce({ response: { data: { message: "User creation failed" } } });

    setup();

    fireEvent.submit(screen.getByTestId("create-user-form"));

    await waitFor(() => {
      expect(screen.getByTestId("error-modal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("OK"));

    expect(screen.queryByTestId("error-modal")).not.toBeInTheDocument();
  });
});
