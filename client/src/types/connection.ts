import { Item } from "@/types/item";
import { Tag } from "@/types/tag";
import { Metadata } from "./metadata";

export interface Connection {
  id: number;
  name: string;
  item1Id: number;
  item2Id: number;
  item1: Item;
  item2: Item;
  tags: Tag[];
  metadata?: Metadata;
}

export type ConnectionCreate = Omit<Partial<Connection>, "tags"> & {
  url?: string;
  tags?: string[];
};
