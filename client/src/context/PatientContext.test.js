import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PatientProvider, usePatient } from "./PatientContext";

// Test to check if the usePatient hook works correctly
describe("PatientContext", () => {
  it("provides the correct context values", () => {
    // Custom component to consume context
    const TestComponent = () => {
      const { selectedPatient, setSelectedPatient } = usePatient();

      return (
        <div>
          <p data-testid="selected-patient">
            {selectedPatient ? selectedPatient.name : "No patient selected"}
          </p>
          <button
            data-testid="set-patient-button"
            onClick={() => setSelectedPatient({ name: "John Doe", id: 1 })}
          >
            Set Patient
          </button>
        </div>
      );
    };

    // Rendering the component wrapped inside PatientProvider
    render(
      <PatientProvider>
        <TestComponent />
      </PatientProvider>
    );

    // Check the initial state of selectedPatient
    expect(screen.getByTestId("selected-patient")).toHaveTextContent(
      "No patient selected"
    );

    // Simulate setting a patient
    fireEvent.click(screen.getByTestId("set-patient-button"));

    // Check if the context state updates correctly
    expect(screen.getByTestId("selected-patient")).toHaveTextContent(
      "John Doe"
    );
  });

  it("throws an error when usePatient is used outside of a PatientProvider", () => {
    // Custom component to consume context outside of PatientProvider
    const TestComponent = () => {
      usePatient(); // Call the hook to trigger the error
      return null;
    };

    // Expecting that rendering the component outside the PatientProvider will throw the error
    const renderComponent = () => render(<TestComponent />);

    // Check if the error is thrown with the correct message
    expect(renderComponent).toThrow(
      "usePatient must be used within a PatientProvider"
    );
  });
});
