// import React from "react";
// import { render, screen, waitFor } from "@testing-library/react";
// import PatientSidebar from "./PatientSidebar"; // Adjust path as needed
// import { usePatient } from "../../context/PatientContext";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";

// // Mocking the usePatient context and useSupabaseClient hook
// jest.mock("../../context/PatientContext");
// jest.mock("@supabase/auth-helpers-react");

// describe("PatientSidebar", () => {
//   const mockPatient = {
//     id: "123",
//     name: "Buddy",
//     date_of_birth: "2020-01-01",
//     breed: "Golden Retriever",
//     weight: "30",
//     demeanor: "Friendly",
//     image_url: "/image.jpg",
//     preferred_doctor: "Dr. Smith",
//   };

//   const mockAppointments = [
//     {
//       title: "Vaccination",
//       start_time: "2024-12-01T09:00:00Z",
//       end_time: "2024-12-01T10:00:00Z",
//       status: "Scheduled",
//       staff_id: "1",
//     },
//   ];

//   const mockStaff = [
//     { id: "1", name: "Dr. Smith" },
//   ];

//   const mockSocEvents = [
//     { event: "Vaccination", nextDue: "2024-12-10" },
//   ];

//   const mockOwner = {
//     name: "John Doe",
//     email: "john.doe@example.com",
//     phone: "123-456-7890",
//   };

//   beforeEach(() => {
//     // Mock the hooks and data
//     usePatient.mockReturnValue({ selectedPatient: mockPatient });
//     useSupabaseClient.mockReturnValue({
//       from: () => ({
//         select: () => ({
//           eq: () => ({
//             single: () => ({ data: mockOwner, error: null }),
//           }),
//         }),
//       }),
//     });
//   });

//   it("renders the PatientSidebar component", async () => {
//     render(<PatientSidebar />);

//     // Check if patient name is displayed
//     expect(screen.getByText(mockPatient.name)).toBeInTheDocument();
//     expect(screen.getByText(mockPatient.breed)).toBeInTheDocument();
//     expect(screen.getByText(mockPatient.demeanor)).toBeInTheDocument();

//     // Check if appointments are displayed
//     expect(screen.getByText("Appointments")).toBeInTheDocument();
//     expect(screen.getByText(mockAppointments[0].title)).toBeInTheDocument();

//     // Check if SOC events are displayed
//     expect(screen.getByText("SOC Event")).toBeInTheDocument();
//     expect(screen.getByText(mockSocEvents[0].event)).toBeInTheDocument();

//     // Check if owner info is displayed
//     expect(screen.getByText(mockOwner.name)).toBeInTheDocument();
//     expect(screen.getByText(mockOwner.email)).toBeInTheDocument();
//   });

//   it("displays 'No patient selected' when no patient is selected", () => {
//     // Mock usePatient to return no patient
//     usePatient.mockReturnValue({ selectedPatient: null });
    
//     render(<PatientSidebar />);
//     expect(screen.getByText("No patient selected")).toBeInTheDocument();
//   });

//   it("handles error when fetching data", async () => {
//     // Simulate an error from the fetch methods
//     useSupabaseClient.mockReturnValueOnce({
//       from: () => ({
//         select: () => ({
//           eq: () => ({
//             single: () => ({ data: null, error: { message: "Error" } }),
//           }),
//         }),
//       }),
//     });

//     render(<PatientSidebar />);
//     // Ensure an error message is logged to console (optional test case)
//     await waitFor(() => expect(console.error).toHaveBeenCalledWith("Error fetching patient or owner data:", "Error"));
//   });
// });
