import api from "@/services/apiService";
import { Credentials } from '@/types/credentials';
import { User } from '@/types/user';
import { ApiResponse } from '@/types/api';

api.interceptors.response.use(
  res => res.data
);

export const userService = {
  getCurrent() {
    return api.get<ApiResponse<User>>("/user/current")
  },
  register(credentials: Credentials) {
    return api.post<ApiResponse<number>>("/user/register", credentials);
  },
  login(credentials: Credentials) {
    return api.post<ApiResponse<number>>("/user/login", credentials)
  },
  logout() {
    return api.get("/user/logout")
  }
};
