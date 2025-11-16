// Course API - Data fetching
// ✅ Handles all course-related API calls
import type { Course, CourseListParams } from '../model/types';

// Mock API - Replace with real API calls
export async function getCourses(params?: CourseListParams): Promise<Course[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data
  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'React Fundamentals',
      description: 'Learn the basics of React from scratch',
      instructor: 'John Doe',
      duration: 120,
      level: 'beginner',
      thumbnail: '/images/react-fundamentals.jpg',
      price: 49000,
      enrolled: 1234,
    },
    {
      id: '2',
      title: 'Advanced TypeScript',
      description: 'Master TypeScript type system',
      instructor: 'Jane Smith',
      duration: 180,
      level: 'advanced',
      thumbnail: '/images/typescript-advanced.jpg',
      price: 79000,
      enrolled: 567,
    },
    {
      id: '3',
      title: 'Next.js Full Course',
      description: 'Build production-ready apps with Next.js',
      instructor: 'Mike Johnson',
      duration: 240,
      level: 'intermediate',
      thumbnail: '/images/nextjs-course.jpg',
      price: 89000,
      enrolled: 890,
    },
  ];

  // Apply filters
  let filtered = mockCourses;

  if (params?.level) {
    filtered = filtered.filter(course => course.level === params.level);
  }

  if (params?.limit) {
    filtered = filtered.slice(0, params.limit);
  }

  return filtered;
}

export async function getCourse(id: string): Promise<Course | null> {
  const courses = await getCourses();
  return courses.find(course => course.id === id) || null;
}
