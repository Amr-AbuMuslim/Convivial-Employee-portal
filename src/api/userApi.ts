import axiosInstance from "./axiosInstance";

export interface User {
  id: string;
  email: string;
  name: string;
  americanName?: string;
  role: "SUPER_ADMIN" | "USER";
  phone?: string;
  profilePicture?: string;
  address?: string;
  department?: string;
  teamName?: string;
  dateOfBirth?: string;
  startDate?: string;
  instaPay?: string;
  teamLeaderId?: string;
  status?: string;
  idPhotocopy?: string;
  educationalCertificate?: string;
  militaryService?: string;
  isActivated?: boolean;
  createdAt?: string;
}

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InviteUserData {
  name: string;
  email: string;
  role?: "SUPER_ADMIN" | "USER";
  department?: string;
  teamName?: string;
}

export interface InviteUserResponse {
  data: User;
  token?: string;
  message?: string;
  statusCode?: number;
}

export interface UpdateUserData {
  name?: string;
  americanName?: string;
  email?: string;
  role?: "SUPER_ADMIN" | "USER";
  phone?: string;
  address?: string;
  department?: string;
  teamName?: string;
  dateOfBirth?: string;
  startDate?: string;
  instaPay?: string;
  teamLeaderId?: string;
  status?: string;
  isActivated?: boolean;
}

export const userApi = {
  getUsers: async (
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedUsers> => {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;

      const response = await axiosInstance.get<{ data: PaginatedUsers }>(
        "/users",
        {
          params,
        }
      );
      console.log("getUsers response:", response.data.data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await axiosInstance.get<{ data: User }>(`/users/${id}`);
      console.log("getUserById response:", response.data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  inviteUser: async (data: InviteUserData): Promise<InviteUserResponse> => {
    try {
      const response = await axiosInstance.post<InviteUserResponse>(
        "/users",
        data
      );
      console.log("inviteUser full response:", response.data);

      // Return the entire response object (includes data, token, message)
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (
    id: string,
    data: UpdateUserData | FormData
  ): Promise<User> => {
    try {
      const isFormData = data instanceof FormData;
      const response = await axiosInstance.patch<{ data: User }>(
        `/users/${id}`,
        data,
        {
          headers: isFormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
        }
      );
      console.log("updateUser response:", response.data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  },
};
