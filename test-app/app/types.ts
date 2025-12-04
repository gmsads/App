// Define types for our form data
export interface LoginForm {
  email: string;
  password: string;
}

// Define product type
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  unit: string;
}

// Default export (required by Expo Router)
export default function Types() {
  return null; // This is just to satisfy Expo Router's requirement
}