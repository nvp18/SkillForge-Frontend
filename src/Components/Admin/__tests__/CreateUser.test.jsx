import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import apiClient from "../../apiClient";
import CreateUser from "./CreateUser";

jest.mock("../../apiClient");

describe("CreateUser Component", () => {
  test("creates a new user successfully", async () => {
    apiClient.post.mockResolvedValueOnce({});

    render(<CreateUser />);

    userEvent.type(screen.getByLabelText(/user name/i), "New User");
    userEvent.click(screen.getByText(/create user/i));

    await waitFor(() => {
      expect(screen.getByText("User successfully added.")).toBeInTheDocument();
    });
  });

  test("handles user creation error", async () => {
    apiClient.post.mockRejectedValueOnce({ response: { data: { message: "User creation failed" } } });

    render(<CreateUser />);

    userEvent.click(screen.getByText(/create user/i));

    await waitFor(() => {
      expect(screen.getByText("User creation failed")).toBeInTheDocument();
    });
  });
});
