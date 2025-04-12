
export type ActivityCategory = 
  | 'work' 
  | 'meeting' 
  | 'learning' 
  | 'break' 
  | 'personal' 
  | 'other';

export interface Activity {
  id: string;
  timestamp: string;
  description: string;
  category: ActivityCategory;
}
