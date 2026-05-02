export type ResourceType = 'pdf' | 'youtube' | 'link';
export type ResourceCategory = 'notes' | 'pyq';
export type ResourceDifficulty = 'beginner' | 'intermediate' | 'exam';

export interface ResourceSubject {
  _id: string;
  name: string;
  code?: string;
  semester?: number;
}

export interface ResourceUnit {
  _id: string;
  unitNumber: number;
  title: string;
}

export interface Resource {
  _id: string;
  subjectId: ResourceSubject | string;
  unitId?: ResourceUnit | string | null;
  title: string;
  category: ResourceCategory;
  type: ResourceType;
  url: string;
  description?: string;
  tags?: string[];
  difficulty?: ResourceDifficulty;
  year?: string;
  source?: string;
  estimatedMinutes?: number;
  qualityStatus?: 'draft' | 'review' | 'published' | 'archived';
  createdAt: string;
}

export interface CreateResourceDTO {
  subjectId: string;
  unitId?: string;
  category: ResourceCategory;
  title: string;
  type: ResourceType;
  file?: File;
  url?: string;
  description?: string;
  tags?: string[];
  difficulty?: ResourceDifficulty;
  year?: string;
  source?: string;
  estimatedMinutes?: number;
}

export interface ResourceStats {
  totalResources: number;
  notesCount: number;
  pyqsCount: number;
  byType: { _id: string; count: number }[];
  byCategory?: { _id: string; count: number }[];
  byDifficulty?: { _id: string; count: number }[];
  recentResources?: Resource[];
  pendingSubjectsCount: number;
  pendingUnitNotesCount?: number;
}
