export type AssignmentStatus = 'pending' | 'completed';

export interface Assignment {
  _id: string;
  userId: string;
  subjectId: {
    _id: string;
    name: string;
    code: string;
  };
  unitId: {
    _id: string;
    unitNumber: number;
    title: string;
  };
  title: string;
  dueDate: string;
  status: AssignmentStatus;
  createdAt: string;
}

export interface CreateAssignmentDTO {
  subjectId: string;
  unitId: string;
  title: string;
  dueDate: string;
}
