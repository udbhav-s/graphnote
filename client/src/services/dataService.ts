import api from "@/services/apiService";
import { Credentials } from '@/types/credentials';
import { User } from '@/types/user';
import { ApiResponse } from '@/types/api';
import { Connection } from '@/types/connection';
import { QueryOptions } from '@/types/queryOptions';
import { Workspace } from '@/types/workspace';
import { Metadata } from '@/types/metadata';
import { Item } from '@/types/item';

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

export const workspaceService = {
  getById(id: number) {
    return api.get<ApiResponse<Workspace>>(`/workspace/${id}`);
  },
  getByUser() {
    return api.get<ApiResponse<Workspace[]>>('/workspace/user');
  },
  getSharedWith() {
    return api.get<ApiResponse<Workspace[]>>('/workspace/shared');
  }
}

export const linkService = {
  scrape(url: string) {
    return api.get<ApiResponse<Metadata>>('/link', {
      params: {
        url
      }
    });
  }
}

export const connectionService = {
  getByWorkspace(workspaceId: number, options?: QueryOptions) {
    return api.get<ApiResponse<Connection[]>>(
      `/connection/workspace/${workspaceId}`,
      { params: options }
    )
  }
}

export const itemService = {
  getById(id: number) {
    return api.get<ApiResponse<Item>>(`/item/${id}`);
  },
  getByWorkspace(workspaceId: number, options?: QueryOptions) {
    return api.get<ApiResponse<Item[]>>(
      `/item/workspace/${workspaceId}`,
      { params: options }
    )
  },
  getConnectedWith(id: number, options?: QueryOptions) {
    return api.get<ApiResponse<Item[]>>(
      `/item/connected/${id}`,
      { params: options }
    )
  }
}
