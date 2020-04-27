import { Connection } from "@/types/connection";
import { Metadata } from "./metadata";

export interface Item {
  id: number;
  name: string;
  body?: string;
  workspaceId: number;
  createdAt: string;
  connection?: Connection;
  metadata?: Metadata;
}

export type ItemCreate = Partial<Item> & { url: string };
