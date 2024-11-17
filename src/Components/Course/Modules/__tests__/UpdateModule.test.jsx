import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import apiClient from "../../../../apiClient";
import UpdateModule from "./UpdateModule";

jest.mock("../../../../apiClient");

describe("UpdateModule Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("updates a module successfully", async () => {
    apiClient.put.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<UpdateModule />} />
        </Routes>
      </MemoryRouter>
    );

    userEvent.type(screen.getByLabelText(/module name/i), "Updated Module");
    userEvent.upload(screen.getByLabelText(/file/i), new File(["updated"], "updated.pdf"));

    userEvent.click(screen.getByText(/update/i));

    await waitFor(() => {
      expect(screen.getByText("Module updated successfully.")).toBeInTheDocument();
    });
  });

  test("displays error on update failure", async () => {
    apiClient.put.mockRejectedValueOnce({ response: { data: { message: "Update failed" } } });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<UpdateModule />} />
        </Routes>
      </MemoryRouter>
    );

    userEvent.click(screen.getByText(/update/i));

    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });
});
