import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import AddAllergyModal from "./AddAllergyModal";

// Mocking the functions passed as props
const onAddAllergy = jest.fn();
const onClose = jest.fn();

afterEach(cleanup);

describe("AddAllergyModal", () => {
  // Test if the modal renders when isOpen is true
  it("renders the modal when isOpen is true", () => {
    render(
      <AddAllergyModal isOpen={true} onClose={onClose} onAddAllergy={onAddAllergy} />
    );

    expect(screen.getByText("Add Allergy")).toBeInTheDocument();
  });

  // Test if the modal does not render when isOpen is false
  it("does not render the modal when isOpen is false", () => {
    render(
      <AddAllergyModal isOpen={false} onClose={onClose} onAddAllergy={onAddAllergy} />
    );

    expect(screen.queryByText("Add Allergy")).not.toBeInTheDocument();
  });

  // Test if onAddAllergy is called with the correct values when the Add button is clicked
  it("calls onAddAllergy with the correct values when Add button is clicked", () => {
    render(
      <AddAllergyModal isOpen={true} onClose={onClose} onAddAllergy={onAddAllergy} />
    );

    const nameInput = screen.getByLabelText(/Allergy:/i);
    const reactionInput = screen.getByLabelText(/Reaction:/i);
    const addButton = screen.getByText("Add");

    // Simulate entering values in the form fields
    fireEvent.change(nameInput, { target: { value: "Peanuts" } });
    fireEvent.change(reactionInput, { target: { value: "Anaphylaxis" } });

    // Simulate clicking the Add button
    fireEvent.click(addButton);

    // Check if onAddAllergy was called with the correct values
    expect(onAddAllergy).toHaveBeenCalledWith({
      name: "Peanuts",
      reaction: "Anaphylaxis",
    });

    // Check if onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);

    // Check if the form was reset
    expect(nameInput.value).toBe("");
    expect(reactionInput.value).toBe("");
  });

  // Test if onClose is called when the Cancel button is clicked
  it("calls onClose when Cancel button is clicked", () => {
    render(
      <AddAllergyModal isOpen={true} onClose={onClose} onAddAllergy={onAddAllergy} />
    );

    const cancelButton = screen.getByText("Cancel");

    // Simulate clicking the Cancel button
    fireEvent.click(cancelButton);

    // Check if onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
