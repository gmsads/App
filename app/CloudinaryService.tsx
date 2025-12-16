// Line 1: Import axios for making HTTP requests
import axios from 'axios';

// Line 3-5: Replace these with YOUR actual Cloudinary credentials
const CLOUD_NAME = 'YOUR_CLOUD_NAME'; // From Cloudinary dashboard
const UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET'; // Your unsigned preset name from Cloudinary
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// Line 7-14: Type definition for Cloudinary response
export interface CloudinaryUploadResponse {
  secure_url: string; // The secure URL of the uploaded image
  public_id: string; // Unique identifier for the image in Cloudinary
  width: number; // Width of the uploaded image
  height: number; // Height of the uploaded image
  format: string; // Image format (jpg, png, etc.)
  created_at: string; // Timestamp when image was uploaded
}

// Line 16-20: Type definition for upload parameters
export interface UploadImageParams {
  uri: string; // Local URI of the image file
  name: string; // File name
  type: string; // MIME type (image/jpeg, image/png, etc.)
}

// Line 23-61: Main function to upload image to Cloudinary
export const uploadImageToCloudinary = async ({
  uri,
  name,
  type,
}: UploadImageParams): Promise<CloudinaryUploadResponse> => {
  // Line 25: Create new FormData object for multipart form upload
  const formData = new FormData();
  
  // Line 28-32: Append the image file to form data
  // Note: 'as any' is a TypeScript workaround for React Native FormData
  formData.append('file', {
    uri, // Local file URI
    name, // File name
    type, // MIME type
  } as any);
  
  // Line 34: Append the upload preset (from Cloudinary settings)
  formData.append('upload_preset', UPLOAD_PRESET);
  
  // Line 37: Optional - organize images in a folder in Cloudinary
  formData.append('folder', 'react_native_uploads');
  
  // Line 38: Optional - resize image to max 1024px width while maintaining aspect ratio
  formData.append('transformation', 'c_limit,w_1024');

  // Line 41-58: Make the POST request to Cloudinary API
  try {
    // Line 43-52: Send POST request with form data
    const response = await axios.post<CloudinaryUploadResponse>(
      UPLOAD_URL, // Cloudinary API endpoint
      formData, // Form data containing the image
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for file upload
        },
        timeout: 30000, // Set timeout to 30 seconds
      }
    );

    // Line 54: Return the response data if successful
    return response.data;
  } catch (error: any) {
    // Line 57-65: Log detailed error information
    console.error('❌ Cloudinary upload error:', {
      message: error.message, // Error message
      response: error.response?.data, // Cloudinary error response
      status: error.response?.status, // HTTP status code
    });
    
    // Line 67-70: Throw user-friendly error message
    if (error.response?.data?.error?.message) {
      throw new Error(`Cloudinary: ${error.response.data.error.message}`);
    }
    // Line 71: Generic error if no specific message
    throw new Error('Failed to upload image. Please try again.');
  }
};

// Line 75-100: Function to send image URL to your backend server
export const sendToBackend = async (
  imageUrl: string, // URL from Cloudinary
  backendUrl: string, // Your backend API endpoint
  additionalData?: Record<string, any> // Optional extra data
) => {
  try {
    // Line 79-83: Create payload object with image data
    const payload = {
      imageUrl, // Cloudinary image URL
      uploadedAt: new Date().toISOString(), // Current timestamp
      ...additionalData, // Spread any additional data
    };

    // Line 86-94: Send POST request to backend
    const response = await axios.post(backendUrl, payload, {
      headers: {
        'Content-Type': 'application/json', // JSON content type
      },
    });

    // Line 96: Return backend response
    return response.data;
  } catch (error: any) {
    // Line 98-100: Handle backend errors
    console.error('Backend error:', error.message);
    throw new Error('Failed to save image data to server.');
  }
};

// Line 104-109: Function to delete image from Cloudinary (requires server-side implementation)
export const deleteFromCloudinary = async (publicId: string) => {
  // Note: Deletion requires API key and secret, so should be done server-side
  console.warn('Delete functionality requires server-side implementation for security.');
  return { success: false, message: 'Implement server-side deletion' };
};

// Line 112-128: Test function to verify Cloudinary credentials
export const testCloudinaryConnection = async () => {
  try {
    // Line 115-117: Create form data with a tiny 1x1 transparent GIF for testing
    const formData = new FormData();
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('file', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
    
    // Line 120: Try to upload test image
    const response = await axios.post(UPLOAD_URL, formData);
    
    // Line 122: Return success if upload works
    return { success: true, message: 'Cloudinary connected successfully' };
  } catch (error) {
    // Line 125-128: Return failure with instructions
    return { 
      success: false, 
      message: 'Check your CLOUD_NAME and UPLOAD_PRESET in CloudinaryService.tsx' 
    };
  }
};

// Line 131-140: Default export object containing all functions
const CloudinaryService = {
  uploadImageToCloudinary, // Main upload function
  sendToBackend, // Backend integration function
  deleteFromCloudinary, // Delete function (server-side needed)
  testCloudinaryConnection, // Test connection function
};

// Line 142: Export as default
export default CloudinaryService;