// Course list feature
// ✅ User scenario: browsing courses
'use client';

import { useEffect, useState } from 'react';
import { getCourses, CourseCard } from '@/entities/course';
import type { Course } from '@/entities/course';

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      setIsLoading(true);
      const data = await getCourses({ limit: 6 });
      setCourses(data);
      setIsLoading(false);
    }

    loadCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="aspect-video bg-gray-200 rounded mb-3" />
            <div className="h-6 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          onClick={() => console.log('Navigate to:', course.id)}
        />
      ))}
    </div>
  );
}
