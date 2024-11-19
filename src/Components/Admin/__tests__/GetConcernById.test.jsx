import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import apiClient from "../../../apiClient";
import GetConcernById from "../GetConcernById";

vi.mock("../../../apiClient");

describe("GetConcernById Component", () => {
  const mockConcern = {
    id: "1",
    subject: "Test Concern",
    description: "Test description",
    createdat: "2023-11-10T12:00:00Z",
    concernReplies: [
      {
        reply: "Test reply 1",
        repliedat: "2023-11-11T12:00:00Z",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "mockToken");
    localStorage.setItem("role", "ADMIN");
  });

  afterEach(() => {
    localStorage.clear();
  });

  // test("fetches and displays concern details", async () => {
  //   apiClient.get.mockResolvedValueOnce({ data: [mockConcern] });

  //   render(
  //     <MemoryRouter initialEntries={["/concern/1"]}>
  //       <Routes>
  //         <Route path="/concern/:concernId" element={<GetConcernById />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   expect(screen.getByText("Loading...")).toBeInTheDocument();

  //   await waitFor(() => {
  //     expect(screen.getByText("Test Concern")).toBeInTheDocument();
  //     expect(screen.getByText("Test description")).toBeInTheDocument();
  //     expect(screen.getByText(/Created at:/)).toBeInTheDocument();
  //     expect(screen.getByText((_, node) => node.textContent.includes("11/10/2023"))).toBeInTheDocument();
  //   });
  // });

  test("handles fetch error", async () => {
    apiClient.get.mockRejectedValueOnce({ response: { data: { message: "Failed to fetch concern" } } });

    render(
      <MemoryRouter initialEntries={["/concern/1"]}>
        <Routes>
          <Route path="/concern/:concernId" element={<GetConcernById />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const errors = screen.getAllByText((_, node) => node.textContent.includes("Failed to fetch concern"));
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test("opens and sends reply successfully", async () => {
    apiClient.get.mockResolvedValueOnce({ data: [mockConcern] });
    apiClient.post.mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={["/concern/1"]}>
        <Routes>
          <Route path="/concern/:concernId" element={<GetConcernById />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Reply"));

    fireEvent.click(screen.getByText("Reply"));
    fireEvent.change(screen.getByPlaceholderText("Write your reply here..."), {
      target: { value: "New reply" },
    });

    fireEvent.click(screen.getByText("Send Reply"));

    await waitFor(() => {
      expect(screen.getByText("Reply sent successfully.")).toBeInTheDocument();
    });
  });

  test("handles reply error", async () => {
    apiClient.get.mockResolvedValueOnce({ data: [mockConcern] });
    apiClient.post.mockRejectedValueOnce({ response: { data: { message: "Failed to send reply" } } });

    render(
      <MemoryRouter initialEntries={["/concern/1"]}>
        <Routes>
          <Route path="/concern/:concernId" element={<GetConcernById />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Reply"));

    fireEvent.click(screen.getByText("Reply"));
    fireEvent.change(screen.getByPlaceholderText("Write your reply here..."), {
      target: { value: "New reply" },
    });

    fireEvent.click(screen.getByText("Send Reply"));

    await waitFor(() => {
      const errors = screen.getAllByText((_, node) => node.textContent.includes("Failed to send reply"));
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test("displays replies correctly", async () => {
    apiClient.get.mockResolvedValueOnce({ data: [mockConcern] });

    render(
      <MemoryRouter initialEntries={["/concern/1"]}>
        <Routes>
          <Route path="/concern/:concernId" element={<GetConcernById />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test reply 1")).toBeInTheDocument();
      expect(screen.getByText(/Replied at:/)).toBeInTheDocument();
    });
  });

  test("displays no replies message when no replies exist", async () => {
    apiClient.get.mockResolvedValueOnce({
      data: [{ ...mockConcern, concernReplies: [] }],
    });

    render(
      <MemoryRouter initialEntries={["/concern/1"]}>
        <Routes>
          <Route path="/concern/:concernId" element={<GetConcernById />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No replies yet.")).toBeInTheDocument();
    });
  });
});
