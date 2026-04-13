export type ResourceType = 'pdf' | 'youtube' | 'link';

export interface Resource {
  _id: string;
  subjectId: string;
  unitId: string;
  title: string;
  type: ResourceType;
  url: string;
  createdAt: string;
}

export interface CreateResourceDTO {
  subjectId: string;
  unitId: string;
  title: string;
  type: ResourceType;
  file?: File;
  url?: string;
}
