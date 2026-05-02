import { Resource, ResourceSubject, ResourceUnit } from '../model/resource.types';

export const getResourceSubject = (resource: Resource): ResourceSubject | null => (
  typeof resource.subjectId === 'object' && resource.subjectId !== null ? resource.subjectId : null
);

export const getResourceUnit = (resource: Resource): ResourceUnit | null => (
  typeof resource.unitId === 'object' && resource.unitId !== null ? resource.unitId : null
);

export const getResourceOpenUrl = (resource: Pick<Resource, 'type' | 'url'>) => {
  if (resource.type !== 'pdf') {
    return resource.url;
  }

  return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(resource.url)}`;
};
