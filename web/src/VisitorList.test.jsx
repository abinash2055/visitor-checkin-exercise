import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VisitorList from "./VisitorList";
import { getVisitors, checkOut, deactivateVisitor } from "./api";

vi.mock("./api", () => ({
  getVisitors: vi.fn(),
  checkOut: vi.fn(),
  deactivateVisitor: vi.fn(),
}));

describe("VisitorList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    getVisitors.mockReturnValue(new Promise(() => {}));
    render(<VisitorList onRefresh={0} />);
    expect(screen.getByText("Loading visitors…")).toBeInTheDocument();
  });

  it("shows no active visitors when list is empty", async () => {
    getVisitors.mockResolvedValue({ visitors: [], total: 0, page: 1, perPage: 20 });
    render(<VisitorList onRefresh={0} />);

    await waitFor(() => {
      expect(screen.getByText("No active visitors.")).toBeInTheDocument();
    });
  });

  it("displays active visitors with correct columns", async () => {
    const mockVisitors = [
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
    ];
    getVisitors.mockResolvedValue({ visitors: mockVisitors, total: 1, page: 1, perPage: 20 });
    render(<VisitorList onRefresh={0} />);

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
      expect(screen.getByText("Alice Mercer")).toBeInTheDocument();
      expect(screen.getByText("Sales meeting")).toBeInTheDocument();
    });
  });

  it("shows Check Out and Deactivate buttons for each visitor", async () => {
    const mockVisitors = [
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
    ];
    checkOut.mockResolvedValue({});
    deactivateVisitor.mockResolvedValue({ success: true });
    getVisitors.mockResolvedValue({ visitors: mockVisitors, total: 1, page: 1, perPage: 20 });
    render(<VisitorList onRefresh={0} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Check Out" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Deactivate" })).toBeInTheDocument();
    });
  });

  it("calls checkOut when Check Out button is clicked", async () => {
    const mockVisitors = [
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
    ];
    checkOut.mockResolvedValue({});
    getVisitors.mockResolvedValue({ visitors: mockVisitors, total: 1, page: 1, perPage: 20 });
    render(<VisitorList onRefresh={0} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Check Out" })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: "Check Out" }));
    await waitFor(() => {
      expect(checkOut).toHaveBeenCalledWith(1);
    });
  });

  it("calls deactivate when Deactivate button is clicked", async () => {
    const mockVisitors = [
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
    ];
    deactivateVisitor.mockResolvedValue({ success: true });
    getVisitors.mockResolvedValue({ visitors: mockVisitors, total: 1, page: 1, perPage: 20 });
    render(<VisitorList onRefresh={0} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Deactivate" })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: "Deactivate" }));
    await waitFor(() => {
      expect(deactivateVisitor).toHaveBeenCalledWith(1);
    });
  });

  it("shows pagination controls", async () => {
    const mockVisitors = [
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
    ];
    getVisitors.mockResolvedValue({ visitors: mockVisitors, total: 25, page: 1, perPage: 20 });
    render(<VisitorList onRefresh={0} />);

    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
    });
  });
});
