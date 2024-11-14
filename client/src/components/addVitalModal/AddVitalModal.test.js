import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import AddVitalModal from "./AddVitalModal";

// Mocking the functions passed as props
const onAddVital = jest.fn();
const onClose = jest.fn();

afterEach(cleanup);

describe("AddVitalModal", () => {
  // Test if the modal renders when isOpen is true
  it("renders the modal when isOpen is true", () => {
    render(
      <AddVitalModal isOpen={true} onClose={onClose} onAddVital={onAddVital} />
    );

    expect(screen.getByText("Add Vital")).toBeInTheDocument();
  });

  // Test if the modal does not render when isOpen is false
  it("does not render the modal when isOpen is false", () => {
    render(
      <AddVitalModal isOpen={false} onClose={onClose} onAddVital={onAddVital} />
    );

    expect(screen.queryByText("Add Vital")).not.toBeInTheDocument();
  });

  // Test if onAddVital is called with correct values when the Add button is clicked
  it("calls onAddVital with the correct values when Add button is clicked", () => {
    render(
      <AddVitalModal isOpen={true} onClose={onClose} onAddVital={onAddVital} />
    );

    const dateInput = screen.getByLabelText(/Date:/i);
    const weightInput = screen.getByLabelText(/Weight \(lbs\):/i);
    const temperatureInput = screen.getByLabelText(/Temperature \(Celsius\):/i);
    const heartRateInput = screen.getByLabelText(/Heart Rate:/i);
    const addButton = screen.getByText("Add");

    // Simulate entering values in the form fields
    fireEvent.change(dateInput, { target: { value: "2024-11-15" } });
    fireEvent.change(weightInput, { target: { value: "150" } });
    fireEvent.change(temperatureInput, { target: { value: "36.5" } });
    fireEvent.change(heartRateInput, { target: { value: "72" } });

    // Simulate clicking the Add button
    fireEvent.click(addButton);

    // Check if onAddVital was called with the correct values
    expect(onAddVital).toHaveBeenCalledWith({
      date: "2024-11-15",
      weight: "150",
      temperature: "36.5",
      heart_rate: "72",
    });

    // Check if onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);

    // Check if the form was reset
    expect(dateInput.value).toBe("");
    expect(weightInput.value).toBe("");
    expect(temperatureInput.value).toBe("");
    expect(heartRateInput.value).toBe("");
  });

  // Test if onClose is called when the Cancel button is clicked
  it("calls onClose when Cancel button is clicked", () => {
    render(
      <AddVitalModal isOpen={true} onClose={onClose} onAddVital={onAddVital} />
    );

    const cancelButton = screen.getByText("Cancel");

    // Simulate clicking the Cancel button
    fireEvent.click(cancelButton);

    // Check if onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
