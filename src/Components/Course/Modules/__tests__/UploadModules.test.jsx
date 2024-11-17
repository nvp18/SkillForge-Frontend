import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import apiClient from "../../../../apiClient";
import UploadModules from "./UploadModules";

jest.mock("../../../../apiClient");

describe("UploadModules Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("uploads a module successfully", async () => {
    apiClient.post.mockResolvedValueOnce({});
    
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<UploadModules />} />
        </Routes>
      </MemoryRouter>
    );

    userEvent.type(screen.getByLabelText(/module name/i), "New Module");
    userEvent.upload(screen.getByLabelText(/file/i), new File(["test"], "test.pdf"));
    userEvent.type(screen.getByLabelText(/module number/i), "1");

    userEvent.click(screen.getByText(/upload/i));

    await waitFor(() => {
      expect(screen.getByText("Module uploaded successfully.")).toBeInTheDocument();
    });
  });

  test("displays error on upload failure", async () => {
    apiClient.post.mockRejectedValueOnce({ response: { data: { message: "Upload failed" } } });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<UploadModules />} />
        </Routes>
      </MemoryRouter>
    );

    userEvent.click(screen.getByText(/upload/i));

    await waitFor(() => {
      expect(screen.getByText("Upload failed")).toBeInTheDocument();
    });
  });
});
