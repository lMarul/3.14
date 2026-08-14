export interface SlideRemindItem {
  label: string;
  symbol: string;
  color?: string;
  tag?: string;
}

export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  quote?: string;
  image?: string;
  iconName?: 'heart' | 'coffee' | 'sparkles' | 'smile' | 'star' | 'book';
  revealText?: string;
  videoPlaceholderLabel?: string;
  videoUrl?: string;
  customEmoji?: string;
  beholdGrid?: SlideRemindItem[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  correctComment: string;
  wrongComment?: string;
  optionComments?: string[]; // Custom reaction comment for each specific option index
}

export interface CoffeeLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  googleMapsUrl?: string;
  note?: string;
  photoUrl?: string;
}

export interface AppConfig {
  recipientName: string;
  senderName: string;
  questionText: string;
  quizTitle?: string;
  quizQuestions: QuizQuestion[];
  coffeeLocation: CoffeeLocation;
  coffeeSpots?: CoffeeLocation[];
  slides: Slide[];
  evasiveNoButton: boolean;
  adminPasscode: string;
}

export interface ResponseData {
  id: string;
  choice: 'YES' | 'NO';
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  selectedLocation?: CoffeeLocation;
  selectedLocationName?: string;
  createdAt: string;
  userAgent?: string;
}

export type AppScreen = 'INTRO' | 'QUIZ' | 'CONGRATS' | 'SLIDES' | 'QUESTION' | 'YES_MAP' | 'NO_FORM' | 'SUBMITTED_YES' | 'SUBMITTED_NO';
