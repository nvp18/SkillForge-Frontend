import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import apiClient from "../../apiClient";
import Login from "./Login";

jest.mock("../../apiClient");
const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders login form", () => {
    render(<Login />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test("handles successful login", async () => {
    apiClient.post.mockResolvedValueOnce({
      data: { Token: "mockToken", Role: "ADMIN" },
    });

    render(<Login />, { wrapper: MemoryRouter });

    userEvent.type(screen.getByLabelText(/username/i), "admin");
    userEvent.type(screen.getByLabelText(/password/i), "password");
    userEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("mockToken");
      expect(localStorage.getItem("role")).toBe("ADMIN");
      expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("handles failed login", async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    render(<Login />, { wrapper: MemoryRouter });

    userEvent.type(screen.getByLabelText(/username/i), "wronguser");
    userEvent.type(screen.getByLabelText(/password/i), "wrongpassword");
    userEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  test("toggles password visibility", () => {
    render(<Login />, { wrapper: MemoryRouter });

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole("button", { name: /eye/i });

    expect(passwordInput).toHaveAttribute("type", "password");

    userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("handles input changes", () => {
    render(<Login />, { wrapper: MemoryRouter });

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    userEvent.type(usernameInput, "testuser");
    userEvent.type(passwordInput, "testpassword");

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("testpassword");
  });
});
