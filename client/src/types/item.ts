import { Connection } from "@/types/connection";

export interface Item {
  id: number;
  name: string;
  url?: string;
  body?: string;
  workspaceId: number;
  createdAt: string;
  connection?: Connection
}