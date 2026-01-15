import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/api";
import type {
  Blog,
  BlogFormData,
  BlogsApiResponse,
  BlogApiResponse,
} from "../types/blogType";

// GET all blogs
export const useBlogs = (limit?: number) => {
  return useQuery({
    queryKey: ["blogs", limit],
    queryFn: async (): Promise<Blog[]> => {
      const params = limit ? { limit: limit.toString() } : {};
      const response = await api.get<BlogsApiResponse>("/blogs", { params });
      return response.data.data; // Extract data from response wrapper
    },
  });
};

// GET single blog by MongoDB _id
export const useBlog = (id: string) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: async (): Promise<Blog> => {
      const response = await api.get<BlogApiResponse>(`/blogs/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// GET user's blogs
export const useMyBlogs = () => {
  return useQuery({
    queryKey: ["myBlogs"],
    queryFn: async (): Promise<Blog[]> => {
      const response = await api.get<BlogsApiResponse>("/blogs/user/my-blogs");
      return response.data.data;
    },
  });
};

// CREATE blog (requires authentication)
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogData: BlogFormData): Promise<Blog> => {
      const response = await api.post<BlogApiResponse>("/blogs", blogData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["myBlogs"] });
    },
  });
};

// UPDATE blog (requires authentication)
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<BlogFormData>;
    }): Promise<Blog> => {
      const response = await api.put<BlogApiResponse>(`/blogs/${id}`, data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", data._id] });
      queryClient.invalidateQueries({ queryKey: ["myBlogs"] });
    },
  });
};

// DELETE blog (requires authentication)
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["myBlogs"] });
    },
  });
};
