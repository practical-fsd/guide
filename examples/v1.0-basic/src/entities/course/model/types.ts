// Course entity types
// ✅ Business domain model

export type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  price: number;
  enrolled: number;
};

export type CourseListParams = {
  category?: string;
  level?: string;
  limit?: number;
};
