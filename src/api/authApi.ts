import axiosInstance from "./axiosInstance";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "SUPER_ADMIN" | "USER";
    phone?: string;
    department?: string;
    team?: string;
    profilePicture?: string;
  };
}

export interface CreatePasswordData {
  token: string;
  password: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createPassword: async (
    data: CreatePasswordData
  ): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.post("/auth/create-password", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgetPassword: async (email: string): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.post("/auth/forget-password", {
        email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (
    token: string,
    password: string
  ): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        token,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },
};
