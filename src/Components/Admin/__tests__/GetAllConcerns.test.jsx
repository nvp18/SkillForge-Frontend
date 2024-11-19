import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import GetAllConcerns from "../GetAllConcerns";
import apiClient from "../../../apiClient";

vi.mock("../../../apiClient");

describe("GetAllConcerns Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  test("fetches and displays concerns", async () => {
    apiClient.get.mockResolvedValueOnce({
      data: [{ id: 1, subject: "Test Concern", status: "NOT_READ" }],
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <GetAllConcerns />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText("Test Concern")).toBeInTheDocument();
  });

  test("handles fetch error", async () => {
    apiClient.get.mockRejectedValueOnce(new Error("Failed to fetch concerns"));

    await act(async () => {
      render(
        <MemoryRouter>
          <GetAllConcerns />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText(/Failed to fetch concerns/i)).toBeInTheDocument();
  });

  // test("renders modal when clicking 'Raise a Concern'", async () => {
  //   apiClient.get.mockResolvedValueOnce({
  //     data: [{ id: 1, subject: "Test Concern", status: "NOT_READ" }],
  //   });

  //   await act(async () => {
  //     render(
  //       <MemoryRouter>
  //         <GetAllConcerns />
  //       </MemoryRouter>
  //     );
  //   });

  //   await waitFor(() => screen.getByTestId("raise-concern-button"));
  //   fireEvent.click(screen.getByTestId("raise-concern-button"));

  //   expect(await screen.findByText(/Submit your concern/i)).toBeInTheDocument();
  // });

  // test("handles form submission success", async () => {
  //   apiClient.post.mockResolvedValueOnce({});
  //   apiClient.get.mockResolvedValueOnce({
  //     data: [{ id: 1, subject: "Test Concern", status: "NOT_READ" }],
  //   });

  //   await act(async () => {
  //     render(
  //       <MemoryRouter>
  //         <GetAllConcerns />
  //       </MemoryRouter>
  //     );
  //   });

  //   fireEvent.click(screen.getByTestId("raise-concern-button"));
  //   fireEvent.change(screen.getByPlaceholderText("Enter your concern"), {
  //     target: { value: "New Concern" },
  //   });
  //   fireEvent.click(screen.getByText("Submit"));

  //   expect(await screen.findByText(/Concern submitted successfully/i)).toBeInTheDocument();
  // });

  // test("navigates on concern click", async () => {
  //   apiClient.get.mockResolvedValueOnce({
  //     data: [{ id: 1, subject: "Navigate Test", status: "READ" }],
  //   });

  //   await act(async () => {
  //     render(
  //       <MemoryRouter initialEntries={["/"]}>
  //         <Routes>
  //           <Route path="/" element={<GetAllConcerns />} />
  //           <Route path="/concerns/:id" element={<div>Concern Details</div>} />
  //         </Routes>
  //       </MemoryRouter>
  //     );
  //   });

  //   fireEvent.click(await screen.findByText("Navigate Test"));
  //   expect(await screen.findByText(/Concern Details/i)).toBeInTheDocument();
  // });
});
