import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import UpdateModule from "../UpdateModule";
import apiClient from "../../../../apiClient";

vi.mock("../../../../apiClient", () => ({
  default: {
    put: vi.fn(),
  },
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn((path) => path)), // Correctly mock navigate
    useParams: vi.fn(() => ({ courseId: "123", moduleId: "456" })),
  };
});

describe("UpdateModule Component", () => {
  beforeEach(() => {
    localStorage.setItem("token", "mock-token");
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("renders form inputs and buttons", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<UpdateModule />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/module name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/file/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument(); // Fix here
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
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

    fireEvent.submit(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(apiClient.put).toHaveBeenCalledTimes(1);
    });
  });

  test("displays error message on update failure", async () => {
    apiClient.put.mockRejectedValueOnce({ response: { data: { message: "Update failed" } } });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<UpdateModule />} />
        </Routes>
      </MemoryRouter>
    );

    userEvent.type(screen.getByLabelText(/module name/i), "Updated Module");
    userEvent.upload(screen.getByLabelText(/file/i), new File(["updated"], "updated.pdf"));

    fireEvent.submit(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(screen.getByText(/update failed/i)).toBeInTheDocument();
    });
  });

  // test("navigates back to modules list on cancel", () => {
  //   const mockNavigate = vi.mocked(useNavigate)();

  //   render(
  //     <MemoryRouter>
  //       <Routes>
  //         <Route path="/" element={<UpdateModule />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   fireEvent.click(screen.getByText(/cancel/i));
  //   expect(mockNavigate).toHaveBeenCalledWith("/course/123/getModules");
  // });

  // test("displays validation error when fields are empty", async () => {
  //   render(
  //     <MemoryRouter>
  //       <Routes>
  //         <Route path="/" element={<UpdateModule />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   fireEvent.submit(screen.getByRole("button", { name: /update/i }));

  //   expect(await screen.findByText(/failed to update the module/i)).toBeInTheDocument();
  // });
});
