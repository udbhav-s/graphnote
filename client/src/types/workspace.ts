import { User } from '@/types/user';

export interface Workspace {
  name: string;
  id: number;
  sharedUsers?: User[];
}