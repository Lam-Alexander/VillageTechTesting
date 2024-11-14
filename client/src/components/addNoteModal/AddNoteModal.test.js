import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import AddNoteModal from "./AddNoteModal";

// Mocking the functions passed as props
const onAddNote = jest.fn();
const onClose = jest.fn();

afterEach(cleanup);

describe("AddNoteModal", () => {
  // Test if the modal renders when isOpen is true
  it("renders the modal when isOpen is true", () => {
    render(
      <AddNoteModal isOpen={true} onClose={onClose} onAddNote={onAddNote} />
    );
    
    expect(screen.getByText("Add Note")).toBeInTheDocument();
  });

  // Test if the modal does not render when isOpen is false
  it("does not render the modal when isOpen is false", () => {
    render(
      <AddNoteModal isOpen={false} onClose={onClose} onAddNote={onAddNote} />
    );

    expect(screen.queryByText("Add Note")).not.toBeInTheDocument();
  });

  // Test if onAddNote is called with correct values when the Add button is clicked
  it("calls onAddNote with the correct values when Add button is clicked", () => {
    render(
      <AddNoteModal isOpen={true} onClose={onClose} onAddNote={onAddNote} />
    );

    const dateInput = screen.getByLabelText(/Date:/i);
    const noteInput = screen.getByLabelText(/Note:/i);
    const addButton = screen.getByText("Add");

    // Simulate entering values in the form fields
    fireEvent.change(dateInput, { target: { value: "2024-11-15" } });
    fireEvent.change(noteInput, { target: { value: "This is a test note." } });

    // Simulate clicking the Add button
    fireEvent.click(addButton);

    // Check if onAddNote was called with the correct values
    expect(onAddNote).toHaveBeenCalledWith({
      date: "2024-11-15",
      note: "This is a test note.",
    });

    // Check if onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);

    // Check if the form was reset
    expect(dateInput.value).toBe("");
    expect(noteInput.value).toBe("");
  });

  // Test if onClose is called when the Cancel button is clicked
  it("calls onClose when Cancel button is clicked", () => {
    render(
      <AddNoteModal isOpen={true} onClose={onClose} onAddNote={onAddNote} />
    );

    const cancelButton = screen.getByText("Cancel");

    // Simulate clicking the Cancel button
    fireEvent.click(cancelButton);

    // Check if onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
