import type { Bursary, StudentProfile } from '@/types';

export const mockStudentProfile: StudentProfile = {
  id: 'student123',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  fieldOfStudy: 'Computer Science',
  academicRecordSummary: 'GPA: 3.8/4.0. Dean\'s List for 2 semesters. Proficient in Python, Java, and JavaScript.',
  financialSituation: 'Family income below national average. Seeking aid to cover tuition and living expenses.',
  extracurricularActivities: 'Member of Coding Club, Volunteer at local animal shelter.',
  goalsAndAspirations: 'Aspires to become a software engineer and develop innovative solutions for social good.',
};

export const mockBursaries: Bursary[] = [
  {
    id: 'bursary001',
    name: 'Tech Innovators Scholarship',
    provider: 'FutureTech Corp',
    description: 'Supports outstanding students in STEM fields with a passion for innovation.',
    eligibilityCriteria: 'Must be enrolled in a full-time undergraduate STEM program. Minimum GPA of 3.5. Demonstrated leadership potential.',
    amount: 5000,
    deadline: new Date(new Date().getFullYear() + 1, 2, 15).toISOString(), // March 15th next year
    applicationLink: '#',
    fieldsOfStudy: ['Computer Science', 'Engineering', 'Mathematics'],
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'bursary002',
    name: 'Community Leaders Grant',
    provider: 'Unity Foundation',
    description: 'Awarded to students who have shown significant commitment to community service.',
    eligibilityCriteria: 'Open to all fields of study. Minimum 100 hours of volunteer work in the past year. Two letters of recommendation required.',
    amount: 3000,
    deadline: new Date(new Date().getFullYear() + 1, 3, 30).toISOString(), // April 30th next year
    applicationLink: '#',
    fieldsOfStudy: ['Social Work', 'Education', 'Public Administration', 'Any'],
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'bursary003',
    name: 'Aspiring Artists Fund',
    provider: 'Creative Arts Council',
    description: 'Encourages talented students pursuing careers in the visual and performing arts.',
    eligibilityCriteria: 'Must submit a portfolio of work. Enrolled in a recognized arts program. Open to undergraduate and graduate students.',
    amount: 4000,
    deadline: new Date(new Date().getFullYear() + 1, 1, 28).toISOString(), // February 28th next year
    applicationLink: '#',
    fieldsOfStudy: ['Fine Arts', 'Music', 'Theatre', 'Design'],
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'bursary004',
    name: 'Future Entrepreneurs Award',
    provider: 'Innovate Hub Ventures',
    description: 'For students with a strong entrepreneurial spirit and a viable business idea.',
    eligibilityCriteria: 'Must submit a business plan. Open to students from any discipline. Preference for innovative tech-based ideas.',
    amount: 7500,
    deadline: new Date(new Date().getFullYear() + 1, 4, 20).toISOString(), // May 20th next year
    applicationLink: '#',
    fieldsOfStudy: ['Business', 'Entrepreneurship', 'Any'],
    imageUrl: 'https://placehold.co/600x400.png',
  },
];

export const STUDENT_PROFILE_KEY = 'bursaryBuddyStudentProfile';
export const APPLIED_BURSARIES_KEY = 'bursaryBuddyAppliedBursaries';
export const ALL_BURSARIES_KEY = 'bursaryBuddyAllBursaries'; // Key to store all bursaries if needed for AI
