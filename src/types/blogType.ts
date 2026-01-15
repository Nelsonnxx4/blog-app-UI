import { type User } from "./authType";

export interface Blog {
  _id: string;
  title: string;
  author: string;
  content: string;
  category: string;
  userId: User | string;
  createdAt: string;
  updatedAt: string;
}

// Form data for creating/updating blogs
export interface BlogFormData {
  title: string;
  author: string;
  content: string;
  category: string;
}

// API Response wrapper
export interface BlogApiResponse {
  success: boolean;
  data: Blog;
  message?: string;
}

export interface BlogsApiResponse {
  success: boolean;
  count: number;
  data: Blog[];
}
