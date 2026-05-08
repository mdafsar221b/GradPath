import axios from 'axios';
import { API_BASE_URL } from '@/shared/lib/api-base';

export interface StudyPlanItem {
  type: 'assignment' | 'pyq-gap' | 'study';
  title: string;
  detail: string;
  effortMinutes: number;
  subjectId?: string;
  unitId?: string;
}

export interface StudySubjectSummary {
  _id: string;
  code?: string;
  name: string;
  semester: number;
  completedUnits: number;
  totalUnits: number;
  progressPercentage: number;
  pendingAssignments: number;
  notesCount: number;
  pyqCount: number;
  resourceGap: number;
  priorityScore: number;
  nextUnit: {
    _id: string;
    unitNumber: number;
    title: string;
    topics: string[];
  } | null;
}

export interface PyqInsight {
  subjectId: string;
  code?: string;
  name: string;
  pyqCount: number;
  readiness: 'strong' | 'building' | 'needs-pyqs';
}

export interface StudyPlan {
  semester: number;
  generatedAt: string;
  focusSubject: StudySubjectSummary | null;
  dailyPlan: StudyPlanItem[];
  urgentAssignments: {
    _id: string;
    title: string;
    dueDate: string;
    daysLeft: number;
    subject?: { _id: string; name: string; code?: string };
    unit?: { _id: string; unitNumber: number; title: string };
  }[];
  subjectSummaries: StudySubjectSummary[];
  pyqInsights: PyqInsight[];
  revisionQueue: StudySubjectSummary[];
}

export const studyApi = {
  getStudyPlan: async (token: string): Promise<StudyPlan> => {
    const { data } = await axios.get(`${API_BASE_URL}/study/plan`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
