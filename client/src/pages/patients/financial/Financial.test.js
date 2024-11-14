import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Financial from "./Financial";
import PatientSidebar from "../../../components/patientSidebar/PatientSidebar";
import AddEstimateModal from "../../../components/addEstimateModal/AddEstimateModal";
import { usePatient } from "../../../context/PatientContext";
import { supabase } from "../../../components/routes/supabaseClient";

// Mock the context provider and Supabase client
jest.mock("../../../context/PatientContext", () => ({
  usePatient: jest.fn(),
}));

jest.mock("../../../components/routes/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
    })),
  },
}));

describe("Financial Page", () => {
  beforeEach(() => {
    usePatient.mockReturnValue({
      selectedPatient: { id: 1, name: "Test Patient" },
    });
  });

  test("renders Financial page and fetches data", async () => {
    supabase
      .from()
      .select()
      .eq()
      .mockResolvedValueOnce({ data: [], error: null });

    render(<Financial />);

    expect(screen.getByText("Estimates")).toBeInTheDocument();
    expect(screen.getByText("Pending Invoices")).toBeInTheDocument();

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith("estimates");
    });
  });

  test("handles fetch errors in Financial page", async () => {
    // Simulate an error in the fetch
    supabase
      .from()
      .select()
      .eq()
      .mockResolvedValueOnce({
        data: null,
        error: { message: "Failed to fetch" },
      });

    render(<Financial />);

    // Check if error handling is properly displayed
    await waitFor(() => {
      expect(screen.getByText("Failed to fetch")).toBeInTheDocument(); // Ensure error message appears
    });
  });

  test("opens Add Estimate modal", () => {
    render(<Financial />);

    const addButton = screen.getByRole("button", { name: "+" });
    fireEvent.click(addButton);

    expect(screen.getByText("Add Estimate")).toBeInTheDocument(); // Assuming modal title
  });

  test("closes Add Estimate modal", () => {
    render(<Financial />);

    const addButton = screen.getByRole("button", { name: "+" });
    fireEvent.click(addButton);

    const cancelButton = screen.getByRole("button", { name: "Cancel" }); // Assuming cancel button exists
    fireEvent.click(cancelButton);

    expect(screen.queryByText("Add Estimate")).not.toBeInTheDocument();
  });

  test("handles convertEstimateToInvoice function", async () => {
    supabase.from().insert.mockResolvedValueOnce({ error: null });
    supabase.from().update.mockResolvedValueOnce({ error: null });

    render(<Financial />);

    // Simulate an example estimate being converted
    const exampleEstimate = { estimate_id: 1, estimate_name: "Test Estimate" };
    const convertButton = screen.getByText("Convert to Invoice");
    fireEvent.click(convertButton);

    // Separate each assertion into its own waitFor block
    await waitFor(() => {
      expect(supabase.from().insert).toHaveBeenCalledWith(
        expect.objectContaining({
          invoice_name: exampleEstimate.estimate_name,
        })
      );
    });

    await waitFor(() => {
      expect(supabase.from().update).toHaveBeenCalledWith(
        expect.objectContaining({
          is_active: false,
        })
      );
    });
  });

  test("renders PatientSidebar component", () => {
    render(<PatientSidebar />);

    // Verify if the Patient Sidebar renders correctly
    expect(screen.getByText("Patient Information")).toBeInTheDocument(); // Assuming sidebar title
  });

  test("handles Add Estimate modal form submission", async () => {
    render(<AddEstimateModal />);

    // Simulate form input for adding an estimate
    const estimateNameInput = screen.getByLabelText("Estimate Name");
    fireEvent.change(estimateNameInput, { target: { value: "Test Estimate" } });

    const saveButton = screen.getByRole("button", { name: "Save" });
    fireEvent.click(saveButton);

    // Assuming the modal will call insert() method after submitting
    await waitFor(() => {
      expect(supabase.from().insert).toHaveBeenCalledWith(
        expect.objectContaining({
          estimate_name: "Test Estimate",
        })
      );
    });
  });
});
