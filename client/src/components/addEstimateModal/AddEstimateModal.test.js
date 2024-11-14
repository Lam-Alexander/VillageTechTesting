import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddEstimateModal from './AddEstimateModal'; // Adjust the import path as needed
import '@testing-library/jest-dom/extend-expect'; // For the `toBeInTheDocument` matcher

// Mock functions for the props passed to the modal
const mockOnClose = jest.fn();
const mockOnAddEstimate = jest.fn();

describe('AddEstimateModal', () => {
  it('should show error when invoice total is invalid', async () => {
    render(
      <AddEstimateModal
        selectedPatientId={1}
        isOpen={true}
        onClose={mockOnClose}
        onAddEstimate={mockOnAddEstimate}
      />
    );

    // Change the invoice total field to an invalid value
    fireEvent.change(screen.getByLabelText(/Invoice Total*/), { target: { value: 'invalid' } });
    
    // Click the Add Estimate button to submit the form
    fireEvent.click(screen.getByText('Add Estimate'));

    // Use findByText to wait for the error message to appear in the document
    const errorMessage = await screen.findByText('Invoice total must be a valid number.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should call onAddEstimate when form is valid', async () => {
    render(
      <AddEstimateModal
        selectedPatientId={1}
        isOpen={true}
        onClose={mockOnClose}
        onAddEstimate={mockOnAddEstimate}
      />
    );

    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/Invoice Name*/), { target: { value: 'Test Invoice' } });
    fireEvent.change(screen.getByLabelText(/Invoice Total*/), { target: { value: '100.00' } });
    fireEvent.change(screen.getByLabelText(/Date*/), { target: { value: '2024-11-12' } });

    // Submit the form
    fireEvent.click(screen.getByText('Add Estimate'));

    // Check that the onAddEstimate mock function was called
    expect(mockOnAddEstimate).toHaveBeenCalledWith({
      invoice_name: 'Test Invoice',
      patient_id: 1,
      invoice_total: 100,
      invoice_paid: 0,
      invoice_date: '2024-11-12',
      invoice_status: 'Estimate',
      last_update: expect.any(String), // Check that last_update is a string
    });
  });

  it('should reset form fields when closed', async () => {
    render(
      <AddEstimateModal
        selectedPatientId={1}
        isOpen={true}
        onClose={mockOnClose}
        onAddEstimate={mockOnAddEstimate}
      />
    );

    // Change some form fields
    fireEvent.change(screen.getByLabelText(/Invoice Name*/), { target: { value: 'Test Invoice' } });
    fireEvent.change(screen.getByLabelText(/Invoice Total*/), { target: { value: '200.00' } });

    // Close the modal
    fireEvent.click(screen.getByText('Cancel'));

    // Check that form fields are reset
    expect(screen.getByLabelText(/Invoice Name*/).value).toBe('');
    expect(screen.getByLabelText(/Invoice Total*/).value).toBe('');
  });

  it('should show invoice data when editing an estimate', () => {
    const estimateToEdit = {
      invoice_id: '12345',
      invoice_name: 'Existing Estimate',
      invoice_total: '50.00',
      invoice_paid: '20.00',
      invoice_date: '2024-11-10',
      invoice_status: 'Estimate',
      patient_id: 1,
    };

    render(
      <AddEstimateModal
        selectedPatientId={1}
        isOpen={true}
        onClose={mockOnClose}
        onAddEstimate={mockOnAddEstimate}
        estimateToEdit={estimateToEdit}
      />
    );

    // Check that the form fields are populated with the existing estimate data
    expect(screen.getByLabelText(/Invoice Name*/).value).toBe('Existing Estimate');
    expect(screen.getByLabelText(/Invoice Total*/).value).toBe('50.00');
    expect(screen.getByLabelText(/Invoice Status*/).value).toBe('Estimate');
    expect(screen.getByLabelText(/Date*/).value).toBe('2024-11-10');
  });
});
