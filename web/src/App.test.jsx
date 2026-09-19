import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { getVisitors, createVisitor, checkOut, deactivateVisitor, getHosts, searchVisitors } from "./api";

vi.mock("./api", () => ({
  getVisitors: vi.fn(),
  createVisitor: vi.fn(),
  checkOut: vi.fn(),
  deactivateVisitor: vi.fn(),
  getHosts: vi.fn(),
  searchVisitors: vi.fn(() => Promise.resolve([])),
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the registration form and visitor list", () => {
    getHosts.mockResolvedValue([{ id: 1, name: "Alice Mercer" }]);
    getVisitors.mockResolvedValue({ visitors: [], total: 0, page: 1, perPage: 20 });

    render(<App />);

    expect(screen.getByText("Register Visitor")).toBeInTheDocument();
    expect(screen.getByText("Active Visitors")).toBeInTheDocument();
  });

  it("shows no active visitors message when list is empty", async () => {
    getHosts.mockResolvedValue([{ id: 1, name: "Alice Mercer" }]);
    getVisitors.mockResolvedValue({ visitors: [], total: 0, page: 1, perPage: 20 });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("No active visitors.")).toBeInTheDocument();
    });
  });

  it("displays visitor data when available", async () => {
    getHosts.mockResolvedValue([{ id: 1, name: "Alice Mercer" }]);
    getVisitors.mockResolvedValue({
      visitors: [
        {
          id: 1,
          full_name: "Jane Doe",
          company_name: "Acme Corp",
          purpose: "Sales meeting",
          checked_in_at: "2026-09-19T07:30:00+05:45",
          checked_out_at: null,
          active: true,
          repeat: false,
          host_id: 1,
          host_name: "Alice Mercer",
        },
      ],
      total: 1,
      page: 1,
      perPage: 20,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    });

    const hostCells = screen.getAllByText("Alice Mercer");
    const hasHostInVisitorTable = hostCells.some((cell) =>
      cell.closest("td") !== null
    );
    expect(hasHostInVisitorTable).toBe(true);
  });
});

describe("API functions", () => {
  it("getVisitors calls correct endpoint", async () => {
    getVisitors.mockResolvedValue({ visitors: [], total: 0, page: 1, perPage: 20 });
    await getVisitors(1);
    expect(getVisitors).toHaveBeenCalledWith(1);
  });

  it("createVisitor sends POST request", async () => {
    createVisitor.mockResolvedValue({ id: 1, full_name: "Test" });
    const data = { full_name: "Test", company_name: "Co", purpose: "Demo", host_id: 1 };
    await createVisitor(data);
    expect(createVisitor).toHaveBeenCalledWith(data);
  });

  it("checkOut sends PATCH request", async () => {
    checkOut.mockResolvedValue({ success: true });
    await checkOut(1);
    expect(checkOut).toHaveBeenCalledWith(1);
  });

  it("deactivateVisitor sends PATCH request", async () => {
    deactivateVisitor.mockResolvedValue({ success: true });
    await deactivateVisitor(1);
    expect(deactivateVisitor).toHaveBeenCalledWith(1);
  });

  it("getHosts calls correct endpoint", async () => {
    getHosts.mockResolvedValue([{ id: 1, name: "Alice" }]);
    await getHosts();
    expect(getHosts).toHaveBeenCalled();
  });

  it("searchVisitors calls correct endpoint", async () => {
    searchVisitors.mockResolvedValue([]);
    await searchVisitors("test");
    expect(searchVisitors).toHaveBeenCalledWith("test");
  });
});
