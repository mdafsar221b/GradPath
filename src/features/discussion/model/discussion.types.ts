export type DiscussionContextType =
  | 'global'
  | 'subject'
  | 'unit'
  | 'pyq-resource'
  | 'model-paper-subject';

export interface DiscussionAuthor {
  _id: string;
  name: string;
  role: 'student' | 'admin';
  semester?: number | null;
}

export interface DiscussionAuthorSnapshot {
  clientUserId: string;
  name: string;
  role: 'student' | 'admin';
  semester?: number | null;
}

export interface DiscussionReply {
  _id: string;
  body: string;
  parentId: string | null;
  createdAt: string;
  editedAt?: string | null;
  isDeleted: boolean;
  author: DiscussionAuthor;
  canEdit: boolean;
  canDelete: boolean;
}

export interface DiscussionPost extends DiscussionReply {
  replies: DiscussionReply[];
}

export interface DiscussionThreadView {
  _id: string | null;
  contextType: DiscussionContextType;
  contextKey: string;
  subjectId: string | null;
  unitId: string | null;
  resourceId: string | null;
  postCount: number;
  lastActivityAt?: string | null;
}

export interface DiscussionContextResponse {
  thread: DiscussionThreadView;
  posts: DiscussionPost[];
}

export interface DiscussionContextRequest {
  contextType: DiscussionContextType;
  subjectId?: string;
  unitId?: string;
  resourceId?: string;
}
