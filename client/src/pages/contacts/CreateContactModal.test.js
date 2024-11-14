import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateContactModal from "./CreateContactModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

jest.mock("@supabase/auth-helpers-react", () => ({
  useSupabaseClient: jest.fn(),
}));

describe("CreateContactModal", () => {
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = {
      storage: {
        from: jest.fn().mockReturnThis(),
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      },
    };
    useSupabaseClient.mockReturnValue(mockSupabase);
  });

  test("displays error message when profile picture upload fails", async () => {
    // Mock the upload and getPublicUrl methods to simulate an error
    mockSupabase.storage
      .from()
      .upload.mockRejectedValueOnce(new Error("Upload failed"));
    mockSupabase.storage
      .from()
      .getPublicUrl.mockRejectedValueOnce(new Error("URL fetch failed"));

    render(
      <CreateContactModal
        isOpen={true}
        onClose={jest.fn()}
        onCreateContact={jest.fn()}
      />
    );

    // Simulate file input change
    fireEvent.change(screen.getByLabelText("Upload Photo"), {
      target: { files: [new File([""], "image.jpg")] },
    });

    // Check if the error message is shown
    const errorMessage = await screen.findByText(
      "Failed to upload profile picture. Please try again."
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("handles successful profile picture upload", async () => {
    // Mock the successful upload response
    mockSupabase.storage
      .from()
      .upload.mockResolvedValueOnce({
        data: { path: "profile_pictures/1.jpg" },
      });
    mockSupabase.storage.from().getPublicUrl.mockResolvedValueOnce({
      data: { publicUrl: "https://example.com/profile_pictures/1.jpg" },
    });

    render(
      <CreateContactModal
        isOpen={true}
        onClose={jest.fn()}
        onCreateContact={jest.fn()}
      />
    );

    // Simulate file input change
    fireEvent.change(screen.getByLabelText("Upload Photo"), {
      target: { files: [new File([""], "image.jpg")] },
    });

    // Check if the profile picture preview is shown
    const profilePreview = await screen.findByAltText("Profile preview");
    expect(profilePreview).toHaveAttribute(
      "src",
      "https://example.com/profile_pictures/1.jpg"
    );
  });
});
