import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CourseSidebar from "../CourseSidebar";

describe("CourseSidebar Component", () => {
  test("renders sidebar links", () => {
    render(<CourseSidebar courseId="123" />, { wrapper: MemoryRouter });

    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/modules/i)).toBeInTheDocument();
    expect(screen.getByText(/discussions/i)).toBeInTheDocument();
  });

  test("toggles sidebar collapsed state", () => {
    render(<CourseSidebar courseId="123" />, { wrapper: MemoryRouter });

    userEvent.click(screen.getByRole("button"));
    // Expect collapsed state
  });

  test("renders admin-only links if admin", () => {
    localStorage.setItem("role", "ADMIN");
    render(<CourseSidebar courseId="123" />, { wrapper: MemoryRouter });

    expect(screen.getByText(/edit course/i)).toBeInTheDocument();
    expect(screen.getByText(/delete course/i)).toBeInTheDocument();
  });
});
