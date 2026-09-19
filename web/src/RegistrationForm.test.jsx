import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegistrationForm from "./RegistrationForm";
import { createVisitor, getHosts, searchVisitors } from "./api";

vi.mock("./api", () => ({
  createVisitor: vi.fn(),
  getHosts: vi.fn(),
  searchVisitors: vi.fn(() => Promise.resolve([])),
}));

describe("RegistrationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    getHosts.mockResolvedValue([{ id: 1, name: "Alice Mercer" }]);
    render(<RegistrationForm onRegistered={() => {}} />);

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Host/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Purpose/i)).toBeInTheDocument();
  });

  it("shows validation error when full name is empty on submit", async () => {
    getHosts.mockResolvedValue([{ id: 1, name: "Alice Mercer" }]);
    render(<RegistrationForm onRegistered={() => {}} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(screen.getByText("Full name is required")).toBeInTheDocument();
    });
  });

  it("shows validation error when host is not selected", async () => {
    getHosts.mockResolvedValue([{ id: 1, name: "Alice Mercer" }]);
    render(<RegistrationForm onRegistered={() => {}} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/Full Name/i), "Test User");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(screen.getByText("Host is required")).toBeInTheDocument();
    });
  });

  it("calls createVisitor with form data on valid submission", async () => {
    getHosts.mockResolvedValue([{ id: 1, name: "Alice Mercer" }]);
    createVisitor.mockResolvedValue({ id: 1 });
    render(<RegistrationForm onRegistered={() => {}} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/Full Name/i), "Test User");
    await userEvent.type(screen.getByLabelText(/Company/i), "Test Co");
    await userEvent.selectOptions(screen.getByLabelText(/Host/i), "1");
    await userEvent.type(screen.getByLabelText(/Purpose/i), "Demo");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(createVisitor).toHaveBeenCalledWith({
        full_name: "Test User",
        company_name: "Test Co",
        host_id: "1",
        purpose: "Demo",
      });
    });
  });

  it("shows error message when createVisitor fails", async () => {
    getHosts.mockResolvedValue([{ id: 1, name: "Alice Mercer" }]);
    createVisitor.mockRejectedValue({ errors: { full_name: ["has already been taken"] } });
    render(<RegistrationForm onRegistered={() => {}} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/Full Name/i), "Test User");
    await userEvent.type(screen.getByLabelText(/Company/i), "Test Co");
    await userEvent.selectOptions(screen.getByLabelText(/Host/i), "1");
    await userEvent.type(screen.getByLabelText(/Purpose/i), "Demo");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(screen.getByText("has already been taken")).toBeInTheDocument();
    });
  });
});
