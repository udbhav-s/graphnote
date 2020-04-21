import { Item } from '@/types/item';
import { Tag } from '@/types/tag';

export interface Connection {
  name: string;
  url?: string;
  item1Id: number;
  item2Id: number;
  item1: Item;
  item2: Item;
  tags: Tag[];
}