import api from "@/services/apiService";
import { Credentials } from "@/types/credentials";
import { User } from "@/types/user";
import { ApiResponse } from "@/types/api";
import { Connection, ConnectionCreate } from "@/types/connection";
import { QueryOptions } from "@/types/queryOptions";
import { Workspace, WorkspaceCreate, WorkspaceAddUser, WorkspaceUser } from "@/types/workspace";
import { Metadata } from "@/types/metadata";
import { Item, ItemCreate } from "@/types/item";
import { Tag } from "@/types/tag";

api.interceptors.response.use(
  res => res.data,
  // error
  res => {
    console.log({ ...res });
    if (res.response.data?.message instanceof Array) {
      res.response.data.message = res.response.data.message.join(", ");
    }
    return res.response.data;
  }
);

export const userService = {
  getCurrent() {
    return api.get<ApiResponse<User>>("/user/current");
  },
  register(credentials: Credentials) {
    return api.post<ApiResponse<number>>("/user/register", credentials);
  },
  login(credentials: Credentials) {
    return api.post<ApiResponse<number>>("/user/login", credentials);
  },
  logout() {
    return api.post("/user/logout");
  }
};

export const workspaceService = {
  getById(id: number) {
    return api.get<ApiResponse<Workspace>>(`/workspace/${id}`);
  },
  getByUser() {
    return api.get<ApiResponse<Workspace[]>>("/workspace/user");
  },
  getSharedWith() {
    return api.get<ApiResponse<Workspace[]>>("/workspace/shared");
  },
  create(body: WorkspaceCreate) {
    return api.post<ApiResponse<Workspace>>("/workspace/create", body);
  },
  update(id: number, body: WorkspaceCreate) {
    return api.put<ApiResponse<Workspace>>(`/workspace/update/${id}`, body);
  },
  addUser(body: WorkspaceAddUser) {
    return api.post<ApiResponse<WorkspaceUser>>("/workspace/user/add", body);
  },
  removeUser(body: WorkspaceAddUser) {
    return api.post<ApiResponse<WorkspaceUser>>("/workspace/user/remove", body);
  },
  del(id: number) {
    return api.delete<ApiResponse<number>>(`/workspace/${id}`);
  }
};

export const metadataService = {
  scrape(url: string) {
    return api.get<ApiResponse<Metadata>>("/metadata", {
      params: {
        url
      }
    });
  }
};

export const connectionService = {
  getByWorkspace(workspaceId: number, options?: QueryOptions) {
    return api.get<ApiResponse<Connection[]>>(
      `/connection/workspace/${workspaceId}`,
      { params: options }
    );
  },
  getById(id: number) {
    return api.get<ApiResponse<Connection>>(`/connection/${id}`);
  },
  getWithItem(itemId: number, options?: QueryOptions) {
    return api.get<ApiResponse<Connection[]>>(
      `/connection/item/${itemId}`,
      { params: options }
    );
  },
  create(body: ConnectionCreate) {
    return api.post<ApiResponse<Connection>>(`/connection/create`, body);
  },
  update(id: number, body: ConnectionCreate) {
    return api.put<ApiResponse<Connection>>(`/connection/update/${id}`, body);
  },
  del(id: number) {
    return api.delete<ApiResponse<number>>(`/connection/${id}`);
  }
};

export const itemService = {
  getById(id: number) {
    return api.get<ApiResponse<Item>>(`/item/${id}`);
  },
  getByWorkspace(workspaceId: number, options?: QueryOptions) {
    return api.get<ApiResponse<Item[]>>(`/item/workspace/${workspaceId}`, {
      params: options
    });
  },
  getConnectedWith(id: number, options?: QueryOptions) {
    return api.get<ApiResponse<Item[]>>(`/item/connected/${id}`, {
      params: options
    });
  },
  create(body: ItemCreate) {
    return api.post<ApiResponse<Item>>("/item/create", body);
  },
  update(id: number, body: ItemCreate) {
    return api.put<ApiResponse<Item>>(`item/update/${id}`, body);
  },
  del(id: number) {
    return api.delete<ApiResponse<number>>(`/item/${id}`);
  }
};

export const tagService = {
  getByWorkspace(workspaceId: number) {
    return api.get<ApiResponse<Tag[]>>(`/tag/workspace/${workspaceId}`);
  }
};
