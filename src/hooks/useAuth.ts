import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, authHelpers } from "../utils/api";
import type {
  AuthResponse,
  LoginFormData,
  SignupFormData,
} from "../types/authType";

// LOGIN
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginFormData): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      authHelpers.setToken(data.data.token);
      authHelpers.setUser(data.data.user);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

// SIGNUP
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: SignupFormData): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>("/auth/signup", userData);
      return response.data;
    },
    onSuccess: (data) => {
      authHelpers.setToken(data.data.token);
      authHelpers.setUser(data.data.user);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

// LOGOUT
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.post("/auth/signout");
    },
    onSuccess: () => {
      authHelpers.removeToken();
      authHelpers.removeUser();
      queryClient.clear();
    },
  });
};

// GET CURRENT USER
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data.data.user;
    },
    enabled: authHelpers.isAuthenticated(),
    retry: false,
  });
};
