import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import AddMedicationModal from "./AddMedicationModal";

// Mocking the functions passed as props
const onAddMedication = jest.fn();
const onClose = jest.fn();

afterEach(cleanup);

describe("AddMedicationModal", () => {
  // Test if the modal renders when isOpen is true
  it("renders the modal when isOpen is true", () => {
    render(
      <AddMedicationModal isOpen={true} onClose={onClose} onAddMedication={onAddMedication} />
    );

    expect(screen.getByText("Add Medication")).toBeInTheDocument();
  });

  // Test if the modal does not render when isOpen is false
  it("does not render the modal when isOpen is false", () => {
    render(
      <AddMedicationModal isOpen={false} onClose={onClose} onAddMedication={onAddMedication} />
    );

    expect(screen.queryByText("Add Medication")).not.toBeInTheDocument();
  });

  // Test if onAddMedication is called with the correct values when the Add button is clicked
  it("calls onAddMedication with the correct values when Add button is clicked", () => {
    render(
      <AddMedicationModal isOpen={true} onClose={onClose} onAddMedication={onAddMedication} />
    );

    const nameInput = screen.getByLabelText(/Medication:/i);
    const dosageInput = screen.getByLabelText(/Dosage:/i);
    const frequencyInput = screen.getByLabelText(/Frequency:/i);
    const datePrescribedInput = screen.getByLabelText(/Date Prescribed:/i);
    const endDateInput = screen.getByLabelText(/End Date:/i);
    const reasonInput = screen.getByLabelText(/Reason:/i);
    const doctorInput = screen.getByLabelText(/Prescribing Doctor:/i);
    const instructionsInput = screen.getByLabelText(/Instructions:/i);
    const refillsInput = screen.getByLabelText(/Refills:/i);
    const statusSelect = screen.getByLabelText(/Status:/i);
    const addButton = screen.getByText("Add");

    // Simulate entering values in the form fields
    fireEvent.change(nameInput, { target: { value: "Medication A" } });
    fireEvent.change(dosageInput, { target: { value: "50mg" } });
    fireEvent.change(frequencyInput, { target: { value: "Once a day" } });
    fireEvent.change(datePrescribedInput, { target: { value: "2024-11-15" } });
    fireEvent.change(endDateInput, { target: { value: "2024-12-15" } });
    fireEvent.change(reasonInput, { target: { value: "Headache" } });
    fireEvent.change(doctorInput, { target: { value: "Dr. Smith" } });
    fireEvent.change(instructionsInput, { target: { value: "Take with food" } });
    fireEvent.change(refillsInput, { target: { value: "2" } });
    fireEvent.change(statusSelect, { target: { value: "Completed" } });

    // Simulate clicking the Add button
    fireEvent.click(addButton);

    // Check if onAddMedication was called with the correct values
    expect(onAddMedication).toHaveBeenCalledWith({
      name: "Medication A",
      dosage: "50mg",
      frequency: "Once a day",
      date_prescribed: "2024-11-15",
      end_date: "2024-12-15",
      reason: "Headache",
      doctor: "Dr. Smith",
      instructions: "Take with food",
      refills: 2,
      status: "Completed",
    });

    // Check if onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);

    // Check if the form was reset
    expect(nameInput.value).toBe("");
    expect(dosageInput.value).toBe("");
    expect(frequencyInput.value).toBe("");
    expect(datePrescribedInput.value).toBe("");
    expect(endDateInput.value).toBe("");
    expect(reasonInput.value).toBe("");
    expect(doctorInput.value).toBe("");
    expect(instructionsInput.value).toBe("");
    expect(refillsInput.value).toBe("");
    expect(statusSelect.value).toBe("Ongoing"); // Default status
  });

  // Test if onClose is called when the Cancel button is clicked
  it("calls onClose when Cancel button is clicked", () => {
    render(
      <AddMedicationModal isOpen={true} onClose={onClose} onAddMedication={onAddMedication} />
    );

    const cancelButton = screen.getByText("Cancel");

    // Simulate clicking the Cancel button
    fireEvent.click(cancelButton);

    // Check if onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
