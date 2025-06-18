export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  fieldOfStudy: string;
  academicRecordSummary: string;
  financialSituation: string;
  extracurricularActivities: string;
  goalsAndAspirations: string;
}

export interface Bursary {
  id: string;
  name: string;
  provider: string;
  description: string;
  eligibilityCriteria: string;
  amount: number;
  deadline: string; // ISO date string
  applicationLink: string;
  fieldsOfStudy: string[];
  imageUrl?: string; 
}

export interface Application {
  id: string;
  studentId: string;
  bursaryId: string;
  bursaryName: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Applied';
  submittedAt: string; // ISO date string
}
