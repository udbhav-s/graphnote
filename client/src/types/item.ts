import { Connection } from "@/types/connection";

export interface Item {
  id: number;
  url?: string;
  body?: string;
  workspaceId: number;
  createdAt: string;
  connection?: Connection
}