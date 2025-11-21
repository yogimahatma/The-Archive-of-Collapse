export interface CaseFormData {
  location: string;
  era: string;
  language: 'English' | 'Indonesian';
  catalyst: string;
}

export interface StoryResponse {
  text: string;
}