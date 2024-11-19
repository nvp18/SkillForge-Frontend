import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, vi, expect, beforeEach } from "vitest";
import apiClient from "../../../../apiClient";
import DeleteModule from "../DeleteModule";

vi.mock("../../../../apiClient");

describe("DeleteModule Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders initial state and buttons", () => {
    render(
      <MemoryRouter initialEntries={["/course/123/module/456/delete"]}>
        <Routes>
          <Route path="/course/:courseId/module/:moduleId/delete" element={<DeleteModule />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Delete Module")).toBeInTheDocument();
    expect(screen.getByTestId("delete-button")).toBeInTheDocument();
    expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
  });

  it("deletes a module successfully", async () => {
    apiClient.delete.mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={["/course/123/module/456/delete"]}>
        <Routes>
          <Route path="/course/:courseId/module/:moduleId/delete" element={<DeleteModule />} />
          <Route path="/course/123/getModules" element={<div>Mock Modules Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    userEvent.click(screen.getByTestId("delete-button"));

    await waitFor(() => {
      expect(screen.getByTestId("success-modal")).toBeInTheDocument();
      expect(screen.getByText("Module successfully deleted")).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId("success-close-button"));

    await waitFor(() => {
      expect(screen.getByText("Mock Modules Page")).toBeInTheDocument();
    });
  });

  it("displays error on delete failure", async () => {
    apiClient.delete.mockRejectedValueOnce({
      response: { data: { message: "Delete failed" } },
    });

    render(
      <MemoryRouter initialEntries={["/course/123/module/456/delete"]}>
        <Routes>
          <Route path="/course/:courseId/module/:moduleId/delete" element={<DeleteModule />} />
        </Routes>
      </MemoryRouter>
    );

    userEvent.click(screen.getByTestId("delete-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent("Delete failed");
    });
  });

  it("navigates back to modules on cancel", async () => {
    render(
      <MemoryRouter initialEntries={["/course/123/module/456/delete"]}>
        <Routes>
          <Route path="/course/:courseId/module/:moduleId/delete" element={<DeleteModule />} />
          <Route path="/course/123/getModules" element={<div>Mock Modules Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    userEvent.click(screen.getByTestId("cancel-button"));

    await waitFor(() => {
      expect(screen.getByText("Mock Modules Page")).toBeInTheDocument();
    });
  });
});
