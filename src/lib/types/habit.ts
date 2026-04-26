export type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
  createdAt: string;
  completions: string[];
};
