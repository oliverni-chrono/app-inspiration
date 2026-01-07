
export interface Affirmation {
  text: string;
  category: string;
}

export interface Reminder {
  id: string;
  affirmation: string;
  time: string; // HH:mm format
  isActive: boolean;
}

export interface ManifestationJournal {
  id: string;
  date: string;
  content: string;
  intention: string;
  mood: string;
}

export interface VisionItem {
  id: string;
  description: string;
  imageUrl: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  VISION_BOARD = 'vision',
  JOURNAL = 'journal',
  AUDIO = 'audio',
  REMINDERS = 'reminders'
}
