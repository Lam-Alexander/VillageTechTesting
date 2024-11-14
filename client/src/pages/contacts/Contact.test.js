import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Contacts from "./Contacts";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../context/PatientContext";

jest.mock("@supabase/auth-helpers-react", () => ({
  useSupabaseClient: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../context/PatientContext", () => ({
  usePatient: jest.fn(),
}));

describe("Contacts Component", () => {
  let mockSupabase;
  let navigate;
  let setSelectedPatient;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn(),
      insert: jest.fn(),
      delete: jest.fn(),
      eq: jest.fn(),
      single: jest.fn(),
      order: jest.fn(),
      storage: {
        from: jest.fn().mockReturnThis(),
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      },
    };
    useSupabaseClient.mockReturnValue(mockSupabase);
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
    setSelectedPatient = jest.fn();
    usePatient.mockReturnValue({ setSelectedPatient });
  });

  test("renders without crashing", () => {
    render(<Contacts globalSearchTerm="" />);
    expect(screen.getByText("+ New Contact")).toBeInTheDocument();
  });

  test("fetches contacts on load", async () => {
    mockSupabase.select.mockResolvedValueOnce({
      data: [{ id: 1, first_name: "John", last_name: "Doe" }],
    });

    render(<Contacts globalSearchTerm="" />);

    await waitFor(() =>
      expect(mockSupabase.from).toHaveBeenCalledWith("owners")
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  test("handles error when fetching contacts fails", async () => {
    mockSupabase.select.mockRejectedValueOnce(new Error("Fetch error"));

    render(<Contacts globalSearchTerm="" />);

    await waitFor(() =>
      expect(
        screen.getByText("Failed to fetch contacts. Please try again later.")
      ).toBeInTheDocument()
    );
  });

  test("filters contacts by global search term", async () => {
    mockSupabase.select.mockResolvedValueOnce({
      data: [
        { id: 1, first_name: "Alice", last_name: "Johnson" },
        { id: 2, first_name: "Bob", last_name: "Smith" },
      ],
    });

    const { rerender } = render(<Contacts globalSearchTerm="Alice" />);

    await waitFor(() =>
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument()
    );
    expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();

    rerender(<Contacts globalSearchTerm="Bob" />);
    expect(screen.queryByText("Alice Johnson")).not.toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
  });

  test("creates a new contact", async () => {
    mockSupabase.insert.mockResolvedValueOnce({
      data: { id: 3, first_name: "Jane", last_name: "Doe" },
    });

    render(<Contacts globalSearchTerm="" />);
    fireEvent.click(screen.getByText("+ New Contact"));
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Doe" },
    });
    fireEvent.click(screen.getByText("Save Contact"));

    await waitFor(() =>
      expect(screen.getByText("Jane Doe")).toBeInTheDocument()
    );
  });

  test("deletes a contact", async () => {
    mockSupabase.select.mockResolvedValueOnce({
      data: [{ id: 1, first_name: "John", last_name: "Doe" }],
    });
    mockSupabase.delete.mockResolvedValueOnce({});

    render(<Contacts globalSearchTerm="" />);
    await waitFor(() => screen.getByText("John Doe"));

    fireEvent.click(screen.getByText("Delete"));
    await waitFor(() =>
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument()
    );
  });

  test("handles profile picture click in edit mode", async () => {
    mockSupabase.select.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          first_name: "Jane",
          last_name: "Doe",
          profile_picture_url: null,
        },
      ],
    });

    render(<Contacts globalSearchTerm="" />);
    await waitFor(() => screen.getByText("Jane Doe"));

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByAltText("Jane Doe"));

    expect(mockSupabase.storage.from).toHaveBeenCalledWith("contacts");
  });
});
