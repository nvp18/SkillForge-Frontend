import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CourseSidebar from "../CourseSidebar";
import { vi } from "vitest";

describe("CourseSidebar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test("renders sidebar links", () => {
    render(<CourseSidebar courseId="123" />, { wrapper: MemoryRouter });

    expect(screen.getByTestId("home-link")).toBeInTheDocument();
    expect(screen.getByTestId("modules-link")).toBeInTheDocument();
    expect(screen.getByTestId("discussions-link")).toBeInTheDocument();
  });

  // test("toggles sidebar collapsed state", () => {
  //   render(<CourseSidebar courseId="123" />, { wrapper: MemoryRouter });

  //   const toggleButton = screen.getByTestId("toggle-button");
  //   fireEvent.click(toggleButton);

  //   expect(screen.getByTestId("sidebar")).toHaveClass("w-[15vw]");
  //   fireEvent.click(toggleButton);
  //   expect(screen.getByTestId("sidebar")).toHaveClass("w-16");
  // });

  test("renders admin-only links if admin role is present", () => {
    localStorage.setItem("role", "ADMIN");
    render(<CourseSidebar courseId="123" />, { wrapper: MemoryRouter });

    expect(screen.getByTestId("edit-link")).toBeInTheDocument();
    expect(screen.getByTestId("delete-link")).toBeInTheDocument();
  });

  test("hides admin links for non-admin role", () => {
    localStorage.setItem("role", "USER");
    render(<CourseSidebar courseId="123" />, { wrapper: MemoryRouter });

    expect(screen.queryByTestId("edit-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-link")).not.toBeInTheDocument();
  });

  test("collapses sidebar on small screens", () => {
    global.innerWidth = 500; // Mock smaller screen
    render(<CourseSidebar courseId="123" />, { wrapper: MemoryRouter });

    expect(screen.getByTestId("sidebar")).toHaveClass("w-16");
  });

  test("expands sidebar on larger screens", () => {
    global.innerWidth = 1024; // Mock larger screen
    render(<CourseSidebar courseId="123" />, { wrapper: MemoryRouter });

    expect(screen.getByTestId("sidebar")).toHaveClass("w-[15vw]");
  });
});
