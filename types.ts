export interface Person {
  id: string;
  name: string;
}

export interface Group {
  id: number;
  members: Person[];
}

export enum AppMode {
  INPUT = 'INPUT',
  DRAW = 'DRAW',
  GROUP = 'GROUP'
}

export interface WinnerRecord {
  timestamp: number;
  winners: string[];
}