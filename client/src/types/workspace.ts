import { User } from "@/types/user";

export interface Workspace {
  name: string;
  id: number;
  userId: number;
  sharedUsers?: User[];
  createdAt: string;
  public: boolean;
}

export interface WorkspaceAddUser {
  workspaceId: number;
  username: string;
}

export interface WorkspaceUser {
  workspaceId: number;
  userId: number;
}

export type WorkspaceCreate = Partial<Workspace>;
