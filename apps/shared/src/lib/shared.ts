export function shared(): string {
  return 'shared';
}

export type Task = {
  id: number;
  content: string;
  sectionId: string;
  due: {
    date: string;
    isRecurring: boolean;
    string: string;
  };
  isCompleted: boolean;
};

export type User = {
  id: string;
  name: string;
  isParent: boolean;
}