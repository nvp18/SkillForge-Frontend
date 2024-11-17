import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import apiClient from "../../../../apiClient";
import DeleteModule from "./DeleteModule";

jest.mock("../../../../apiClient");

describe("DeleteModule Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deletes a module successfully", async () => {
    apiClient.delete.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <DeleteModule />
      </MemoryRouter>
    );

    userEvent.click(screen.getByText(/yes, delete/i));

    await waitFor(() => {
      expect(screen.getByText("Module successfully deleted")).toBeInTheDocument();
    });
  });

  test("displays error on delete failure", async () => {
    apiClient.delete.mockRejectedValueOnce({ response: { data: { message: "Delete failed" } } });

    render(
      <MemoryRouter>
        <DeleteModule />
      </MemoryRouter>
    );

    userEvent.click(screen.getByText(/yes, delete/i));

    await waitFor(() => {
      expect(screen.getByText("Delete failed")).toBeInTheDocument();
    });
  });
});
