export interface AppProps {
  itemsCount: number;
  npcsCount: number;
  spellsCount: number;
  usersCount: number;
  user?: User;
}

export interface User {
  created_at: string;
  deleted_at?: string;
  email: string;
  id: number;
  info?: string;
  location?: string;
  name: string;
  role: string;
  slug: string;
  updated_at?: string;
  username: string;
}

export interface DndClass {

}

export interface DndClasses {
  dndClasses: [DndClass];
  currentDndClass: DndClass;
}

export interface DndClassesResponse {
  count: number;
  results: [DndClasses];
}