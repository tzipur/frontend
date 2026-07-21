export interface Chapter {
  id: string;
  order: number;
  title: string;
  content: string;
  illustrationUrl: string;
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  coverImageUrl: string;
  childProfileId: string;
  createdAt: string;
  inputMethod: 'speak' | 'write';
  parentInput: string;
  chapters: Chapter[];
  coachingTip?: string;
}

export interface ChildProfile {
  id: string;
  nickname: string;
  age?: number;
  hobby?: string;
  favoriteAnimal?: string;
}

export interface ParentProfile {
  id: string;
  nickname: string;
  children: ChildProfile[];
}
